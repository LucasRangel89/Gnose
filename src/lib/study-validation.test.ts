import { describe, expect, it } from "vitest";
import {
  highlightPayloadSchema,
  isKnownStudyTarget,
  notePayloadSchema,
  progressPayloadSchema,
  reviewPayloadSchema,
} from "./study-validation";

describe("API payload validation", () => {
  it("accepts known study targets and rejects unknown ids", () => {
    expect(isKnownStudyTarget("PROMPT", "P1")).toBe(true);
    expect(isKnownStudyTarget("NEXT_PROMPT", "5.11")).toBe(true);
    expect(isKnownStudyTarget("PROMPT", "P999")).toBe(false);
    expect(isKnownStudyTarget("USER", "P1")).toBe(false);
  });

  it("accepts only supported progress states", () => {
    expect(progressPayloadSchema.safeParse({ itemType: "PROMPT", itemId: "P5", status: "DONE" }).success).toBe(true);
    expect(progressPayloadSchema.safeParse({ itemType: "PROMPT", itemId: "P5", status: "COMPLETE" }).success).toBe(false);
  });

  it("trims notes and enforces the content limit", () => {
    const valid = notePayloadSchema.safeParse({ itemType: "PROMPT", itemId: "P5", content: "  Minha nota  " });
    expect(valid.success).toBe(true);
    if (valid.success) expect(valid.data.content).toBe("Minha nota");
    expect(notePayloadSchema.safeParse({ itemType: "PROMPT", itemId: "P5", content: " " }).success).toBe(false);
    expect(notePayloadSchema.safeParse({ itemType: "PROMPT", itemId: "P5", content: "x".repeat(5001) }).success).toBe(false);
  });

  it("limits highlights and validates flashcard ratings", () => {
    expect(highlightPayloadSchema.safeParse({ itemType: "NEXT_PROMPT", itemId: "5.5", quote: "trecho" }).success).toBe(true);
    expect(highlightPayloadSchema.safeParse({ itemType: "NEXT_PROMPT", itemId: "5.5", quote: "" }).success).toBe(false);
    expect(reviewPayloadSchema.safeParse({ cardId: "gnose", rating: "good" }).success).toBe(true);
    expect(reviewPayloadSchema.safeParse({ cardId: "gnose", rating: "perfect" }).success).toBe(false);
  });
});
