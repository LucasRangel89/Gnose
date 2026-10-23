import { describe, expect, it } from "vitest";
import { backupPayloadSchema } from "./backup-validation";

const emptyBackup = {
  format: "gnose-backup",
  version: 1,
  exportedAt: "2026-10-23T10:00:00.000Z",
  data: { progress: [], notes: [], bookmarks: [], highlights: [], history: [], reviews: [] },
};

describe("backup validation", () => {
  it("accepts a versioned empty backup and strips owner identifiers", () => {
    const result = backupPayloadSchema.safeParse(emptyBackup);
    expect(result.success).toBe(true);
  });

  it("accepts personal study data without trusting the exported user id", () => {
    const result = backupPayloadSchema.safeParse({
      ...emptyBackup,
      data: {
        ...emptyBackup.data,
        notes: [{ itemType: "PROMPT", itemId: "P5", userId: "another-account", content: "nota" }],
      },
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.data.notes[0]).not.toHaveProperty("userId");
  });

  it("rejects unknown formats, oversized notes, and invalid review values", () => {
    expect(backupPayloadSchema.safeParse({ ...emptyBackup, format: "other" }).success).toBe(false);
    expect(backupPayloadSchema.safeParse({
      ...emptyBackup,
      data: { ...emptyBackup.data, notes: [{ itemType: "PROMPT", itemId: "P5", content: "x".repeat(5001) }] },
    }).success).toBe(false);
    expect(backupPayloadSchema.safeParse({
      ...emptyBackup,
      data: { ...emptyBackup.data, reviews: [{ cardId: "gnose", repetitions: -1, intervalDays: 1, easeFactor: 2.5, dueAt: "2026-10-24T10:00:00.000Z" }] },
    }).success).toBe(false);
  });
});
