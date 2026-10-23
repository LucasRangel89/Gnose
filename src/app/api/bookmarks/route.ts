import { NextResponse, type NextRequest } from "next/server";
import { getApiUserId } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { isKnownStudyTarget, studyTargetSchema } from "@/lib/study-validation";

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
    const rows = await getDb().bookmark.findMany({
      where: { userId, ...(itemType && itemId ? { itemType, itemId } : {}) },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[api/bookmarks][GET]", error);
    return NextResponse.json({ error: "Não foi possível carregar os favoritos." }, { status: 500 });
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
    const row = await getDb().bookmark.upsert({
      where: { userId_itemType_itemId: { userId, itemType, itemId } },
      update: {},
      create: { userId, itemType, itemId },
    });
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error("[api/bookmarks][POST]", error);
    return NextResponse.json({ error: "Não foi possível salvar o favorito." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getApiUserId();
    if (!userId) return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
    const itemType = req.nextUrl.searchParams.get("itemType") ?? "";
    const itemId = req.nextUrl.searchParams.get("itemId")?.trim() ?? "";
    if (!isKnownStudyTarget(itemType, itemId)) {
      return NextResponse.json({ error: "Estudo inválido." }, { status: 400 });
    }
    const result = await getDb().bookmark.deleteMany({ where: { userId, itemType, itemId } });
    if (result.count === 0) return NextResponse.json({ error: "Favorito não encontrado." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/bookmarks][DELETE]", error);
    return NextResponse.json({ error: "Não foi possível remover o favorito." }, { status: 500 });
  }
}
