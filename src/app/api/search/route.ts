import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { contentFileFor } from "@/data/content-index";
import { nextPrompts } from "@/data/nextPrompts";
import { prompts } from "@/data/prompts";
import { rankSearchSection, splitMarkdownSections } from "@/lib/content-search";
import type { ItemType } from "@/data/types";

export const runtime = "nodejs";

interface IndexedStudy {
  itemType: ItemType;
  itemId: string;
  title: string;
  sections: ReturnType<typeof splitMarkdownSections>;
}

let indexPromise: Promise<IndexedStudy[]> | undefined;

async function loadIndex(): Promise<IndexedStudy[]> {
  const items: { itemType: ItemType; itemId: string; title: string }[] = [
    ...prompts.map((study) => ({ itemType: "PROMPT" as const, itemId: study.id, title: `P${study.number} · ${study.title}` })),
    ...nextPrompts.map((study) => ({ itemType: "NEXT_PROMPT" as const, itemId: study.id, title: `${study.id} · ${study.title}` })),
  ];
  const index = await Promise.all(items.map(async (item) => {
    const publicPath = contentFileFor(item.itemType, item.itemId);
    if (!publicPath) return null;
    try {
      const markdown = await readFile(join(process.cwd(), "public", publicPath.replace(/^\//, "")), "utf8");
      return { ...item, sections: splitMarkdownSections(markdown) };
    } catch {
      return null;
    }
  }));
  return index.filter((item): item is IndexedStudy => item !== null);
}

/** Full-text, concept-expanded search returning a heading anchor for deep links. */
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 120) {
    return NextResponse.json({ results: [], error: "A busca deve ter entre 2 e 120 caracteres." }, { status: 400 });
  }

  try {
    indexPromise ??= loadIndex();
    const index = await indexPromise;
    const results = index.flatMap((study) => {
      const ranked = study.sections
        .map((section) => rankSearchSection(query, section, study.title))
        .filter((section) => section !== null)
        .sort((a, b) => b.score - a.score);
      const best = ranked[0];
      if (!best) return [];
      return [{
        itemType: study.itemType,
        itemId: study.itemId,
        studyTitle: study.title,
        sectionTitle: best.heading,
        anchor: best.anchor,
        excerpt: best.excerpt,
        score: best.score,
      }];
    }).sort((a, b) => b.score - a.score).slice(0, 8);

    return NextResponse.json(
      { query, results },
      { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } },
    );
  } catch (error) {
    console.error("[api/search][GET]", error);
    return NextResponse.json({ error: "Não foi possível pesquisar o acervo." }, { status: 500 });
  }
}
