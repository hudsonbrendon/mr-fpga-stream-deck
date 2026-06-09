import { describe, expect, it } from "vitest";
import { formatUptime, formatPercent, formatLoad } from "../src/core/format.js";

describe("formatUptime", () => {
  it("renders days+hours over a day", () => {
    expect(formatUptime(3 * 86400 + 4 * 3600)).toBe("3d4h");
  });
  it("renders hours+minutes under a day", () => {
    expect(formatUptime(5 * 3600 + 12 * 60)).toBe("5h12m");
  });
  it("renders minutes under an hour", () => {
    expect(formatUptime(42 * 60 + 30)).toBe("42m");
  });
  it("renders '—' for null", () => {
    expect(formatUptime(null)).toBe("—");
  });
  it("renders '—' for non-finite or negative values", () => {
    expect(formatUptime(NaN)).toBe("—");
    expect(formatUptime(Infinity)).toBe("—");
    expect(formatUptime(-5)).toBe("—");
  });
});

describe("formatPercent", () => {
  it("rounds to a whole-number percent", () => {
    expect(formatPercent(38.4)).toBe("38%");
  });
  it("renders '—' for null", () => {
    expect(formatPercent(null)).toBe("—");
  });
});

describe("formatLoad", () => {
  it("renders two decimals", () => {
    expect(formatLoad(0.4)).toBe("0.40");
  });
  it("renders '—' for null", () => {
    expect(formatLoad(null)).toBe("—");
  });
});
