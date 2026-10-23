import { NextResponse, type NextRequest } from "next/server";
import { getApiUserId } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { highlightPayloadSchema, isKnownStudyTarget } from "@/lib/study-validation";

export async function GET(req: NextRequest) {
  try {
    const userId = await getApiUserId();
    if (!userId) return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
    const itemType = req.nextUrl.searchParams.get("itemType");
    const itemId = req.nextUrl.searchParams.get("itemId")?.trim();
    if ((itemType && !itemId) || (!itemType && itemId)) {
      return NextResponse.json({ error: "Informe itemType e itemId juntos." }, { status: 400 });
    }
    if (itemType && itemId && !isKnownStudyTarget(itemType, itemId)) {
      return NextResponse.json({ error: "Estudo não encontrado." }, { status: 400 });
    }
    const rows = await getDb().highlight.findMany({
      where: { userId, ...(itemType && itemId ? { itemType, itemId } : {}) },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[api/highlights][GET]", error);
    return NextResponse.json({ error: "Não foi possível carregar os destaques." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getApiUserId();
    if (!userId) return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
    const payload = highlightPayloadSchema.safeParse(await req.json().catch(() => null));
    if (!payload.success) {
      return NextResponse.json({ error: "Destaque inválido: trecho obrigatório (até 3000 caracteres)." }, { status: 400 });
    }
    if (!isKnownStudyTarget(payload.data.itemType, payload.data.itemId)) {
      return NextResponse.json({ error: "Estudo não encontrado." }, { status: 400 });
    }
    const row = await getDb().highlight.create({
      data: {
        userId,
        itemType: payload.data.itemType,
        itemId: payload.data.itemId,
        quote: payload.data.quote,
        anchor: payload.data.anchor || null,
        note: payload.data.note || null,
      },
    });
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error("[api/highlights][POST]", error);
    return NextResponse.json({ error: "Não foi possível salvar o destaque." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getApiUserId();
    if (!userId) return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Informe o id do destaque." }, { status: 400 });
    const result = await getDb().highlight.deleteMany({ where: { id, userId } });
    if (result.count === 0) return NextResponse.json({ error: "Destaque não encontrado." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/highlights][DELETE]", error);
    return NextResponse.json({ error: "Não foi possível remover o destaque." }, { status: 500 });
  }
}
