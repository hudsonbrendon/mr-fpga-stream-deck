import { describe, expect, it } from "vitest";
import { parseSshProbe } from "../src/mister/ssh.js";

describe("parseSshProbe", () => {
  it("parses the batched probe output", () => {
    const raw = [
      "SNES",                 // /tmp/CORENAME
      "123456.78 100000.00",  // /proc/uptime
      "0.42 0.30 0.25 1/200 1234", // /proc/loadavg
      "1000000\n620000",      // MemTotal / MemAvailable (kB)
      "1700000000",           // stat -c %Y
    ].join("\n|||\n");
    const t = parseSshProbe(raw);
    expect(t.activeCore).toBe("SNES");
    expect(t.uptimeSeconds).toBe(123456);
    expect(t.cpuLoad1m).toBeCloseTo(0.42);
    expect(t.memoryUsedPercent).toBeCloseTo(38, 0); // (1000000-620000)/1000000 = 38%
  });

  it("coerces missing fields to null", () => {
    const t = parseSshProbe("|||\n|||\n|||\n|||\n");
    expect(t.activeCore).toBeNull();
    expect(t.uptimeSeconds).toBeNull();
    expect(t.cpuLoad1m).toBeNull();
    expect(t.memoryUsedPercent).toBeNull();
  });
});
