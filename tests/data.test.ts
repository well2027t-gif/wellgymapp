import { describe, it, expect } from "vitest";
import { WORKOUTS, MEALS, DEFAULT_GOAL, STATS, WEEK_DAYS, PROGRESS_DATA } from "../lib/data";

describe("WellGymApp Data", () => {
  it("should have at least 4 workouts", () => {
    expect(WORKOUTS.length).toBeGreaterThanOrEqual(4);
  });

  it("each workout should have exercises", () => {
    WORKOUTS.forEach((w) => {
      expect(w.exercises.length).toBeGreaterThan(0);
    });
  });

  it("each workout should have warmup and main exercises", () => {
    WORKOUTS.forEach((w) => {
      const warmup = w.exercises.filter((e) => e.section === "warmup");
      const main = w.exercises.filter((e) => e.section === "main");
      expect(warmup.length).toBeGreaterThan(0);
      expect(main.length).toBeGreaterThan(0);
    });
  });

  it("should have 6 meals", () => {
    expect(MEALS.length).toBe(6);
  });

  it("meals should have valid calorie values", () => {
    MEALS.forEach((m) => {
      expect(m.calories).toBeGreaterThan(0);
      expect(m.protein).toBeGreaterThan(0);
    });
  });

  it("goal should have valid weight targets", () => {
    expect(DEFAULT_GOAL.currentWeight).toBeGreaterThan(DEFAULT_GOAL.goalWeight);
    expect(DEFAULT_GOAL.startWeight).toBeGreaterThanOrEqual(DEFAULT_GOAL.currentWeight);
  });

  it("stats should have valid values", () => {
    expect(STATS.caloriesToday).toBeGreaterThan(0);
    expect(STATS.betterThanPercent).toBeGreaterThan(0);
    expect(STATS.betterThanPercent).toBeLessThanOrEqual(100);
  });

  it("should have 7 week days", () => {
    expect(WEEK_DAYS.length).toBe(7);
  });

  it("progress data arrays should have equal length", () => {
    expect(PROGRESS_DATA.weightHistory.length).toBe(PROGRESS_DATA.labels.length);
    expect(PROGRESS_DATA.workoutsPerWeek.length).toBe(PROGRESS_DATA.labels.length);
    expect(PROGRESS_DATA.caloriesPerWeek.length).toBe(PROGRESS_DATA.labels.length);
  });

  it("weight progress calculation should be between 0 and 1", () => {
    const progress =
      (DEFAULT_GOAL.startWeight - DEFAULT_GOAL.currentWeight) /
      (DEFAULT_GOAL.startWeight - DEFAULT_GOAL.goalWeight);
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(1);
  });
});
