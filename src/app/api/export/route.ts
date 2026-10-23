import { NextResponse } from "next/server";
import { getApiUserId } from "@/lib/auth";
import { getDb } from "@/lib/db";

/** Download all personal study data as a portable JSON backup. */
export async function GET() {
  try {
    const userId = await getApiUserId();
    if (!userId) return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
    const db = getDb();
    const [progress, notes, bookmarks, highlights, history, reviews] = await Promise.all([
      db.studyProgress.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } }),
      db.note.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.bookmark.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.highlight.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.readingHistory.findMany({ where: { userId }, orderBy: { lastOpenedAt: "desc" } }),
      db.flashcardReview.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } }),
    ]);
    const backup = {
      format: "gnose-backup",
      version: 1,
      exportedAt: new Date().toISOString(),
      data: { progress, notes, bookmarks, highlights, history, reviews },
    };
    const date = new Date().toISOString().slice(0, 10);
    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="gnose-backup-${date}.json"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[api/export][GET]", error);
    return NextResponse.json({ error: "Não foi possível exportar os dados." }, { status: 500 });
  }
}
