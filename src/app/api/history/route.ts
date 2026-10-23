import { NextResponse, type NextRequest } from "next/server";
import { getApiUserId } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { isKnownStudyTarget, studyTargetSchema } from "@/lib/study-validation";

export async function GET() {
  try {
    const userId = await getApiUserId();
    if (!userId) return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
    const rows = await getDb().readingHistory.findMany({
      where: { userId },
      orderBy: { lastOpenedAt: "desc" },
      take: 100,
    });
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[api/history][GET]", error);
    return NextResponse.json({ error: "Não foi possível carregar o histórico." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getApiUserId();
    if (!userId) return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
    const payload = studyTargetSchema.safeParse(await req.json().catch(() => null));
    if (!payload.success || !isKnownStudyTarget(payload.data.itemType, payload.data.itemId)) {
      return NextResponse.json({ error: "Estudo inválido." }, { status: 400 });
    }
    const { itemType, itemId } = payload.data;
    const row = await getDb().readingHistory.upsert({
      where: { userId_itemType_itemId: { userId, itemType, itemId } },
      update: { lastOpenedAt: new Date() },
      create: { userId, itemType, itemId },
    });
    return NextResponse.json(row, { status: 200 });
  } catch (error) {
    console.error("[api/history][POST]", error);
    return NextResponse.json({ error: "Não foi possível atualizar o histórico." }, { status: 500 });
  }
}
