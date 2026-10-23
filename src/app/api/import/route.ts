import { NextResponse, type NextRequest } from "next/server";
import { glossary } from "@/data/glossary";
import { getApiUserId } from "@/lib/auth";
import { backupPayloadSchema } from "@/lib/backup-validation";
import { getDb } from "@/lib/db";
import { isKnownStudyTarget } from "@/lib/study-validation";

const MAX_BACKUP_BYTES = 10 * 1024 * 1024;
const asDate = (value: string | undefined, fallback = new Date()) => value ? new Date(value) : fallback;

async function readBackupBody(req: NextRequest): Promise<{ tooLarge: boolean; value: unknown }> {
  const reader = req.body?.getReader();
  if (!reader) return { tooLarge: false, value: null };
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BACKUP_BYTES) {
      await reader.cancel();
      return { tooLarge: true, value: null };
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return { tooLarge: false, value: JSON.parse(new TextDecoder().decode(bytes)) as unknown };
  } catch {
    return { tooLarge: false, value: null };
  }
}

/** Restore an exported backup, replacing only the current user's personal data. */
export async function POST(req: NextRequest) {
  try {
    const userId = await getApiUserId();
    if (!userId) return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BACKUP_BYTES) {
      return NextResponse.json({ error: "O backup excede o limite de 10 MB." }, { status: 413 });
    }

    const body = await readBackupBody(req);
    if (body.tooLarge) {
      return NextResponse.json({ error: "O backup excede o limite de 10 MB." }, { status: 413 });
    }
    const payload = backupPayloadSchema.safeParse(body.value);
    if (!payload.success) {
      return NextResponse.json({ error: "Arquivo de backup inválido ou incompatível." }, { status: 400 });
    }
    const { data } = payload.data;
    const studyTargets = [
      ...data.progress,
      ...data.notes,
      ...data.bookmarks,
      ...data.highlights,
      ...data.history,
    ];
    if (studyTargets.some((target) => !isKnownStudyTarget(target.itemType, target.itemId))) {
      return NextResponse.json({ error: "O backup contém um estudo que não existe neste catálogo." }, { status: 400 });
    }
    const knownCards = new Set(glossary.map((term) => term.id));
    if (data.reviews.some((review) => !knownCards.has(review.cardId))) {
      return NextResponse.json({ error: "O backup contém um cartão de glossário desconhecido." }, { status: 400 });
    }

    const db = getDb();
    await db.$transaction(async (tx) => {
      await Promise.all([
        tx.studyProgress.deleteMany({ where: { userId } }),
        tx.note.deleteMany({ where: { userId } }),
        tx.bookmark.deleteMany({ where: { userId } }),
        tx.highlight.deleteMany({ where: { userId } }),
        tx.readingHistory.deleteMany({ where: { userId } }),
        tx.flashcardReview.deleteMany({ where: { userId } }),
      ]);

      if (data.progress.length) await tx.studyProgress.createMany({ data: data.progress.map((row) => ({
        userId, itemType: row.itemType, itemId: row.itemId, status: row.status,
        createdAt: asDate(row.createdAt), updatedAt: asDate(row.updatedAt),
      })) });
      if (data.notes.length) await tx.note.createMany({ data: data.notes.map((row) => ({
        userId, itemType: row.itemType, itemId: row.itemId, content: row.content,
        createdAt: asDate(row.createdAt), updatedAt: asDate(row.updatedAt),
      })) });
      if (data.bookmarks.length) await tx.bookmark.createMany({ data: data.bookmarks.map((row) => ({
        userId, itemType: row.itemType, itemId: row.itemId, createdAt: asDate(row.createdAt),
      })) });
      if (data.highlights.length) await tx.highlight.createMany({ data: data.highlights.map((row) => ({
        userId, itemType: row.itemType, itemId: row.itemId, quote: row.quote,
        anchor: row.anchor ?? null, note: row.note ?? null,
        createdAt: asDate(row.createdAt), updatedAt: asDate(row.updatedAt),
      })) });
      if (data.history.length) await tx.readingHistory.createMany({ data: data.history.map((row) => ({
        userId, itemType: row.itemType, itemId: row.itemId, lastOpenedAt: asDate(row.lastOpenedAt),
      })) });
      if (data.reviews.length) await tx.flashcardReview.createMany({ data: data.reviews.map((row) => ({
        userId, cardId: row.cardId, repetitions: row.repetitions,
        intervalDays: row.intervalDays, easeFactor: row.easeFactor,
        dueAt: new Date(row.dueAt), lastReviewedAt: row.lastReviewedAt ? new Date(row.lastReviewedAt) : null,
      })) });
    }, { maxWait: 5_000, timeout: 30_000 });

    return NextResponse.json({
      ok: true,
      counts: {
        progress: data.progress.length,
        notes: data.notes.length,
        bookmarks: data.bookmarks.length,
        highlights: data.highlights.length,
        history: data.history.length,
        reviews: data.reviews.length,
      },
    });
  } catch (error) {
    console.error("[api/import][POST]", error);
    return NextResponse.json({ error: "Não foi possível restaurar o backup; os dados atuais foram mantidos." }, { status: 500 });
  }
}
