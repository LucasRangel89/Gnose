import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getApiUserId } from "@/lib/auth";
import { isKnownStudyTarget, notePayloadSchema } from "@/lib/study-validation";

/** GET /api/notes — lista as notas do usuário, opcionalmente filtradas por estudo. */
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

    const notes = await getDb().note.findMany({
      where: { userId, ...(itemType && itemId ? { itemType, itemId } : {}) },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notes);
  } catch (error) {
    console.error("[api/notes][GET]", error);
    return NextResponse.json({ error: "Não foi possível carregar as notas." }, { status: 500 });
  }
}

/** POST /api/notes — cria uma anotação de estudo. */
export async function POST(req: NextRequest) {
  try {
    const userId = await getApiUserId();
    if (!userId) return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });

    const payload = notePayloadSchema.safeParse(await req.json().catch(() => null));
    if (!payload.success) {
      return NextResponse.json({ error: "Payload inválido: conteúdo deve ter entre 1 e 5000 caracteres." }, { status: 400 });
    }
    if (!isKnownStudyTarget(payload.data.itemType, payload.data.itemId)) {
      return NextResponse.json({ error: "Estudo não encontrado." }, { status: 400 });
    }

    const note = await getDb().note.create({ data: { ...payload.data, userId } });
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("[api/notes][POST]", error);
    return NextResponse.json({ error: "Não foi possível salvar a nota." }, { status: 500 });
  }
}

/** DELETE /api/notes?id=... — remove somente uma nota pertencente ao usuário atual. */
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getApiUserId();
    if (!userId) return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });

    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Parâmetro 'id' é obrigatório." }, { status: 400 });

    const result = await getDb().note.deleteMany({ where: { id, userId } });
    if (result.count === 0) return NextResponse.json({ error: "Nota não encontrada." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/notes][DELETE]", error);
    return NextResponse.json({ error: "Não foi possível remover a nota." }, { status: 500 });
  }
}
