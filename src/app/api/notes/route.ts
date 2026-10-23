import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

const ITEM_TYPES = new Set(["PROMPT", "NEXT_PROMPT", "ROUTE"]);

/** GET /api/notes?itemType=PROMPT&itemId=P5 — notas de um item (ou todas). */
export async function GET(req: NextRequest) {
  try {
    const itemType = req.nextUrl.searchParams.get("itemType");
    const itemId = req.nextUrl.searchParams.get("itemId");

    const where =
      itemType && itemId && ITEM_TYPES.has(itemType)
        ? { itemType, itemId }
        : undefined;

    const notes = await db.note.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("[api/notes][GET]", error);
    return NextResponse.json(
      { error: "Não foi possível carregar as notas." },
      { status: 500 },
    );
  }
}

/** POST /api/notes — cria uma nota. */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as {
      itemType?: unknown;
      itemId?: unknown;
      content?: unknown;
    } | null;

    const itemType = typeof body?.itemType === "string" ? body.itemType : "";
    const itemId = typeof body?.itemId === "string" ? body.itemId.trim() : "";
    const content =
      typeof body?.content === "string" ? body.content.trim() : "";

    if (!ITEM_TYPES.has(itemType) || !itemId || !content || content.length > 5000) {
      return NextResponse.json(
        {
          error:
            "Payload inválido: informe itemType, itemId e content (1–5000 caracteres).",
        },
        { status: 400 },
      );
    }

    const note = await db.note.create({
      data: { itemType, itemId, content },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("[api/notes][POST]", error);
    return NextResponse.json(
      { error: "Não foi possível salvar a nota." },
      { status: 500 },
    );
  }
}

/** DELETE /api/notes?id=... — remove uma nota. */
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Parâmetro 'id' é obrigatório." },
        { status: 400 },
      );
    }

    await db.note.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/notes][DELETE]", error);
    return NextResponse.json(
      { error: "Não foi possível remover a nota." },
      { status: 500 },
    );
  }
}
