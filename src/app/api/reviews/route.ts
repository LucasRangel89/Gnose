import { NextResponse, type NextRequest } from "next/server";
import { glossary } from "@/data/glossary";
import { getApiUserId } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { reviewPayloadSchema } from "@/lib/study-validation";
import { scheduleReview } from "@/lib/spaced-repetition";

export async function GET() {
  try {
    const userId = await getApiUserId();
    if (!userId) return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
    const rows = await getDb().flashcardReview.findMany({ where: { userId } });
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[api/reviews][GET]", error);
    return NextResponse.json({ error: "Não foi possível carregar as revisões." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getApiUserId();
    if (!userId) return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
    const payload = reviewPayloadSchema.safeParse(await req.json().catch(() => null));
    if (!payload.success || !glossary.some((term) => term.id === payload.data.cardId)) {
      return NextResponse.json({ error: "Cartão de revisão inválido." }, { status: 400 });
    }
    const { cardId, rating } = payload.data;
    const db = getDb();
    const previous = await db.flashcardReview.findUnique({
      where: { userId_cardId: { userId, cardId } },
    });
    const schedule = scheduleReview(previous, rating);
    const row = await db.flashcardReview.upsert({
      where: { userId_cardId: { userId, cardId } },
      update: schedule,
      create: { userId, cardId, ...schedule },
    });
    return NextResponse.json(row);
  } catch (error) {
    console.error("[api/reviews][POST]", error);
    return NextResponse.json({ error: "Não foi possível registrar a revisão." }, { status: 500 });
  }
}
