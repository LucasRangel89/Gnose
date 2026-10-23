import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

const ITEM_TYPES = new Set(["PROMPT", "NEXT_PROMPT", "ROUTE"]);
const STATUSES = new Set(["NOT_STARTED", "IN_PROGRESS", "DONE"]);

/** GET /api/progress — lista todo o progresso de estudo. */
export async function GET() {
  try {
    const rows = await db.studyProgress.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[api/progress][GET]", error);
    return NextResponse.json(
      { error: "Não foi possível carregar o progresso." },
      { status: 500 },
    );
  }
}

/** POST /api/progress — cria/atualiza o status de um item (upsert). */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as {
      itemType?: unknown;
      itemId?: unknown;
      status?: unknown;
    } | null;

    const itemType = typeof body?.itemType === "string" ? body.itemType : "";
    const itemId = typeof body?.itemId === "string" ? body.itemId.trim() : "";
    const status = typeof body?.status === "string" ? body.status : "";

    if (!ITEM_TYPES.has(itemType) || !itemId || !STATUSES.has(status)) {
      return NextResponse.json(
        { error: "Payload inválido: itemType, itemId e status são obrigatórios." },
        { status: 400 },
      );
    }

    const row = await db.studyProgress.upsert({
      where: { itemType_itemId: { itemType, itemId } },
      update: { status },
      create: { itemType, itemId, status },
    });

    return NextResponse.json(row);
  } catch (error) {
    console.error("[api/progress][POST]", error);
    return NextResponse.json(
      { error: "Não foi possível salvar o progresso." },
      { status: 500 },
    );
  }
}
