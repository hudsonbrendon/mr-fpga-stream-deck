import { describe, expect, it } from "vitest";
import { renderNowPlaying, renderSystem, renderRa, renderControl } from "../src/core/render.js";
import type { NowPlaying, SystemTelemetry, RaStats } from "../src/core/types.js";

describe("renderNowPlaying", () => {
  it("shows core and game when online", () => {
    const np: NowPlaying = { online: true, core: "SNES", systemName: "Super Nintendo", game: "/x/Chrono.sfc", gameName: "Chrono Trigger", hostname: "MiSTer" };
    const svg = renderNowPlaying(np);
    expect(svg).toContain("<svg");
    expect(svg).toContain('width="144"');
    expect(svg).toContain("SNES");
    expect(svg).toContain("Chrono Trigger");
  });
  it("shows OFFLINE when offline", () => {
    const np: NowPlaying = { online: false, core: null, systemName: null, game: null, gameName: null, hostname: null };
    expect(renderNowPlaying(np)).toContain("OFFLINE");
  });
  it("escapes XML-special characters in names", () => {
    const np: NowPlaying = { online: true, core: "PSX", systemName: null, game: null, gameName: "Marvel & Capcom", hostname: "MiSTer" };
    const svg = renderNowPlaying(np);
    expect(svg).toContain("Marvel &amp; Capcom");
    expect(svg).not.toContain("Marvel & Capcom");
  });
});

describe("renderSystem", () => {
  it("shows load, ram, and uptime", () => {
    const t: SystemTelemetry = { activeCore: "SNES", uptimeSeconds: 3 * 86400 + 4 * 3600, cpuLoad1m: 0.42, memoryUsedPercent: 38 };
    const svg = renderSystem(t);
    expect(svg).toContain("0.42");
    expect(svg).toContain("38%");
    expect(svg).toContain("3d4h");
  });
});

describe("renderRa", () => {
  it("shows points and current game percent", () => {
    const ra: RaStats = { hardcorePoints: 12345, rank: 678, totalRanked: 90000, currentGame: { title: "Chrono Trigger", console: "SNES", numAchieved: 15, numPossible: 60, percent: 25 } };
    const svg = renderRa(ra);
    expect(svg).toContain("12345");
    expect(svg).toContain("25%");
    expect(svg).toContain("#"); // a bar fill color
  });
});

describe("renderControl", () => {
  it("labels the control by kind", () => {
    expect(renderControl("reboot")).toContain("REBOOT");
    expect(renderControl("menu")).toContain("MENU");
    expect(renderControl("volume_up")).toContain("VOL +");
    expect(renderControl("volume_down")).toContain("VOL −");
    expect(renderControl("screenshot")).toContain("SHOT");
    expect(renderControl("launch")).toContain("LAUNCH");
  });
});
