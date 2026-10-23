import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getApiUserId } from "@/lib/auth";
import { isKnownStudyTarget, progressPayloadSchema } from "@/lib/study-validation";

/** GET /api/progress — progresso apenas do usuário autenticado/local. */
export async function GET() {
  try {
    const userId = await getApiUserId();
    if (!userId) {
      return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
    }
    const rows = await getDb().studyProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[api/progress][GET]", error);
    return NextResponse.json({ error: "Não foi possível carregar o progresso." }, { status: 500 });
  }
}

/** POST /api/progress — cria/atualiza o status de um estudo. */
export async function POST(req: NextRequest) {
  try {
    const userId = await getApiUserId();
    if (!userId) {
      return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
    }
    const payload = progressPayloadSchema.safeParse(await req.json().catch(() => null));
    if (!payload.success) {
      return NextResponse.json({ error: "Payload inválido: estudo ou status não reconhecido." }, { status: 400 });
    }
    if (!isKnownStudyTarget(payload.data.itemType, payload.data.itemId)) {
      return NextResponse.json({ error: "Estudo não encontrado." }, { status: 400 });
    }

    const { itemType, itemId, status } = payload.data;
    const row = await getDb().studyProgress.upsert({
      where: { userId_itemType_itemId: { userId, itemType, itemId } },
      update: { status },
      create: { userId, itemType, itemId, status },
    });
    return NextResponse.json(row);
  } catch (error) {
    console.error("[api/progress][POST]", error);
    return NextResponse.json({ error: "Não foi possível salvar o progresso." }, { status: 500 });
  }
}
