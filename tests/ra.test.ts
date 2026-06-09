import { describe, expect, it } from "vitest";
import { parseRankScore, parseRecentGame } from "../src/mrfpga/ra.js";

describe("parseRankScore", () => {
  it("extracts hardcore points, rank, total ranked", () => {
    const r = parseRankScore({ Score: 12345, Rank: 678, TotalRanked: 90000 });
    expect(r.hardcorePoints).toBe(12345);
    expect(r.rank).toBe(678);
    expect(r.totalRanked).toBe(90000);
  });
  it("defaults missing fields", () => {
    const r = parseRankScore({});
    expect(r.hardcorePoints).toBe(0);
    expect(r.rank).toBeNull();
    expect(r.totalRanked).toBeNull();
  });
});

describe("parseRecentGame", () => {
  it("computes completion percent from the first recent game", () => {
    const g = parseRecentGame([
      { Title: "Chrono Trigger", ConsoleName: "SNES", NumAchieved: 15, NumPossibleAchievements: 60 },
    ]);
    expect(g?.title).toBe("Chrono Trigger");
    expect(g?.console).toBe("SNES");
    expect(g?.numAchieved).toBe(15);
    expect(g?.numPossible).toBe(60);
    expect(g?.percent).toBe(25);
  });
  it("returns null for an empty list", () => {
    expect(parseRecentGame([])).toBeNull();
  });
  it("treats zero-achievement sets as 0%", () => {
    const g = parseRecentGame([{ Title: "X", ConsoleName: "NES", NumAchieved: 0, NumPossibleAchievements: 0 }]);
    expect(g?.percent).toBe(0);
  });
});
