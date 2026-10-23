import { describe, expect, it } from "vitest";
import { scheduleReview } from "./spaced-repetition";

const start = new Date("2026-10-23T10:00:00.000Z");

describe("scheduleReview", () => {
  it("starts an unseen card with a one-day interval", () => {
    const result = scheduleReview(null, "good", start);
    expect(result.repetitions).toBe(1);
    expect(result.intervalDays).toBe(1);
    expect(result.dueAt.toISOString()).toBe("2026-10-24T10:00:00.000Z");
    expect(result.lastReviewedAt).toEqual(start);
  });

  it("grows intervals as successful recall repeats", () => {
    const second = scheduleReview({ repetitions: 1, intervalDays: 1, easeFactor: 2.5 }, "good", start);
    expect(second.repetitions).toBe(2);
    expect(second.intervalDays).toBe(6);
    const third = scheduleReview(second, "good", start);
    expect(third.repetitions).toBe(3);
    expect(third.intervalDays).toBe(15);
  });

  it("resets the repetition streak after a forgotten card", () => {
    const result = scheduleReview({ repetitions: 5, intervalDays: 40, easeFactor: 2.2 }, "again", start);
    expect(result.repetitions).toBe(0);
    expect(result.intervalDays).toBe(1);
    expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it("does not let a hard answer reduce ease below the minimum", () => {
    const result = scheduleReview({ repetitions: 2, intervalDays: 6, easeFactor: 1.3 }, "hard", start);
    expect(result.easeFactor).toBe(1.3);
  });
});
