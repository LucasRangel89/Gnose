import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contentFileFor, publishedStudyCount } from "./content-index";
import { nextPrompts } from "./nextPrompts";
import { prompts } from "./prompts";
import { studySourceFor } from "./study-sources";
import { readingRoutes } from "./routes";

const targets = [
  ...prompts.map((study) => ({ itemType: "PROMPT" as const, itemId: study.id })),
  ...nextPrompts.map((study) => ({ itemType: "NEXT_PROMPT" as const, itemId: study.id })),
];

describe("study content catalogue", () => {
  it("publishes the ten core studies and all eleven expansions", () => {
    expect(prompts).toHaveLength(10);
    expect(nextPrompts).toHaveLength(11);
    expect(publishedStudyCount).toBe(21);
  });

  it("maps every catalogue item to an existing readable Markdown file and source DOCX", async () => {
    for (const target of targets) {
      const markdownPath = contentFileFor(target.itemType, target.itemId);
      const source = studySourceFor(target.itemType, target.itemId);
      expect(markdownPath, `${target.itemType}:${target.itemId} Markdown`).toBeTruthy();
      expect(source, `${target.itemType}:${target.itemId} source`).toBeTruthy();
      const markdown = await readFile(join(process.cwd(), "public", markdownPath!.slice(1)), "utf8");
      expect(markdown.length).toBeGreaterThan(500);
      await readFile(join(process.cwd(), source!.sourceFile));
    }
  });

  it("retains the conversion provenance and editorial note in each converted DOCX study", async () => {
    for (const itemId of ["5.5", "5.6", "5.7", "5.8", "5.9", "5.11"]) {
      const markdown = await readFile(join(process.cwd(), "public", contentFileFor("NEXT_PROMPT", itemId)!.slice(1)), "utf8");
      expect(markdown).toContain("## Registro editorial");
      expect(markdown).toContain("Documento-fonte");
      expect(markdown).toContain("revisão acadêmica independente");
      expect(markdown).toContain("<table>");
    }
  });

  it("keeps every route step linked to a published study", () => {
    const ids = new Set(targets.map((target) => target.itemId));
    for (const route of readingRoutes) {
      for (const step of route.steps) expect(ids.has(step), `${route.id}:${step}`).toBe(true);
    }
  });
});
