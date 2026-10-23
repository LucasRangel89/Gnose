import { z } from "zod";
import { nextPrompts } from "@/data/nextPrompts";
import { prompts } from "@/data/prompts";

export const itemTypeSchema = z.enum(["PROMPT", "NEXT_PROMPT"]);
export const studyTargetSchema = z.object({
  itemType: itemTypeSchema,
  itemId: z.string().trim().min(1).max(32),
});

export function isKnownStudyTarget(itemType: string, itemId: string): boolean {
  return itemType === "PROMPT"
    ? prompts.some((prompt) => prompt.id === itemId)
    : itemType === "NEXT_PROMPT"
      ? nextPrompts.some((prompt) => prompt.id === itemId)
      : false;
}

export const progressPayloadSchema = studyTargetSchema.extend({
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "DONE"]),
});

export const notePayloadSchema = studyTargetSchema.extend({
  content: z.string().trim().min(1).max(5000),
});

export const highlightPayloadSchema = studyTargetSchema.extend({
  quote: z.string().trim().min(1).max(3000),
  anchor: z.string().trim().max(100).optional(),
  note: z.string().trim().max(2000).optional().default(""),
});

export const reviewPayloadSchema = z.object({
  cardId: z.string().trim().min(1).max(100),
  rating: z.enum(["again", "hard", "good", "easy"]),
});
