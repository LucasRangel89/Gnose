import { z } from "zod";
import { itemTypeSchema } from "@/lib/study-validation";

const dateString = z.string().datetime({ offset: true });
const baseTarget = z.object({ itemType: itemTypeSchema, itemId: z.string().trim().min(1).max(32) });

export const backupPayloadSchema = z.object({
  format: z.literal("gnose-backup"),
  version: z.literal(1),
  data: z.object({
    progress: z.array(baseTarget.extend({
      status: z.enum(["NOT_STARTED", "IN_PROGRESS", "DONE"]),
      createdAt: dateString.optional(),
      updatedAt: dateString.optional(),
    })).max(100),
    notes: z.array(baseTarget.extend({
      content: z.string().trim().min(1).max(5000),
      createdAt: dateString.optional(),
      updatedAt: dateString.optional(),
    })).max(5000),
    bookmarks: z.array(baseTarget.extend({ createdAt: dateString.optional() })).max(100),
    highlights: z.array(baseTarget.extend({
      quote: z.string().trim().min(1).max(3000),
      anchor: z.string().max(100).nullable().optional(),
      note: z.string().max(2000).nullable().optional(),
      createdAt: dateString.optional(),
      updatedAt: dateString.optional(),
    })).max(5000),
    history: z.array(baseTarget.extend({ lastOpenedAt: dateString.optional() })).max(100),
    reviews: z.array(z.object({
      cardId: z.string().trim().min(1).max(100),
      repetitions: z.number().int().min(0).max(10000),
      intervalDays: z.number().int().min(0).max(36500),
      easeFactor: z.number().min(1.3).max(5),
      dueAt: dateString,
      lastReviewedAt: dateString.nullable().optional(),
    })).max(500),
  }),
});
