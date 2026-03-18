import { describe, it, expect } from "vitest";
import { PROFESSIONALS, AUTO_REPLIES } from "../lib/data";

describe("Professionals Data", () => {
  it("should have at least 3 personal trainers", () => {
    const personals = PROFESSIONALS.filter((p) => p.type === "personal");
    expect(personals.length).toBeGreaterThanOrEqual(3);
  });

  it("should have at least 3 nutritionists", () => {
    const nutritionists = PROFESSIONALS.filter((p) => p.type === "nutritionist");
    expect(nutritionists.length).toBeGreaterThanOrEqual(3);
  });

  it("each professional should have required fields", () => {
    PROFESSIONALS.forEach((p) => {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.avatar).toBeTruthy();
      expect(p.rating).toBeGreaterThan(0);
      expect(p.rating).toBeLessThanOrEqual(5);
      expect(p.specialties.length).toBeGreaterThan(0);
    });
  });

  it("auto replies should have default responses", () => {
    expect(AUTO_REPLIES.default.length).toBeGreaterThan(0);
    expect(AUTO_REPLIES.treino.length).toBeGreaterThan(0);
    expect(AUTO_REPLIES.dieta.length).toBeGreaterThan(0);
    expect(AUTO_REPLIES.dor.length).toBeGreaterThan(0);
  });

  it("professionals should have valid availability status", () => {
    PROFESSIONALS.forEach((p) => {
      expect(typeof p.available).toBe("boolean");
    });
  });
});
