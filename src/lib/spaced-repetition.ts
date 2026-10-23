export type ReviewRating = "again" | "hard" | "good" | "easy";

export interface ReviewState {
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
}

export interface ReviewSchedule extends ReviewState {
  dueAt: Date;
  lastReviewedAt: Date;
}

const QUALITY: Record<ReviewRating, number> = {
  again: 1,
  hard: 3,
  good: 4,
  easy: 5,
};

/** A small SM-2-inspired scheduler, kept deterministic for tests and exports. */
export function scheduleReview(
  previous: ReviewState | null | undefined,
  rating: ReviewRating,
  now = new Date(),
): ReviewSchedule {
  const quality = QUALITY[rating];
  const oldRepetitions = previous?.repetitions ?? 0;
  const oldInterval = previous?.intervalDays ?? 0;
  const oldEase = previous?.easeFactor ?? 2.5;

  let repetitions: number;
  let intervalDays: number;
  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions = oldRepetitions + 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.max(1, Math.round(oldInterval * oldEase));
  }

  const easeFactor = Math.max(
    1.3,
    oldEase + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02),
  );
  const dueAt = new Date(now);
  dueAt.setDate(dueAt.getDate() + intervalDays);

  return { repetitions, intervalDays, easeFactor, dueAt, lastReviewedAt: new Date(now) };
}
