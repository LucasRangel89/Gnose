import { describe, expect, it } from "vitest";
import {
  expandSearchTerms,
  markdownToPlainText,
  normalizeSearchText,
  rankSearchSection,
  splitMarkdownSections,
} from "./content-search";

describe("content search helpers", () => {
  it("normalizes accents and case for Portuguese text", () => {
    expect(normalizeSearchText("GNOSE e Sophia")).toBe("gnose e sophia");
    expect(normalizeSearchText("Ação e coração")).toBe("acao e coracao");
  });

  it("expands related concepts without requiring an exact query", () => {
    expect(expandSearchTerms("demiurgo")).toEqual(expect.arrayContaining(["yaldabaoth", "arcontes", "criador"]));
  });

  it("splits Markdown into stable deep-link sections", () => {
    const sections = splitMarkdownSections("# Abertura\nTexto inicial.\n\n## Sophia — a Sabedoria\nO conceito aparece aqui.");
    expect(sections.map((section) => section.anchor)).toEqual(["abertura", "sophia-a-sabedoria"]);
  });

  it("ranks a semantically related passage and creates a short excerpt", () => {
    const [section] = splitMarkdownSections("## Yaldabaoth\nO demiurgo cria o cosmos material.");
    const result = rankSearchSection("demiurgo", section, "Gnosticismo");
    expect(result?.score).toBeGreaterThan(0);
    expect(result?.excerpt).toContain("demiurgo");
  });

  it("strips raw HTML and Markdown decoration before indexing", () => {
    expect(markdownToPlainText("<table><tr><td>**Gnose**</td></tr></table>")).toBe("Gnose");
  });
});
