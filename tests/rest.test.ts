import { describe, expect, it } from "vitest";
import { parseStatus } from "../src/mrfpga/rest.js";

describe("parseStatus", () => {
  it("combines sysinfo + playing into a NowPlaying snapshot", () => {
    const sysinfo = {
      hostname: "MiSTer",
      version: "240101",
      ips: ["192.168.1.50"],
      disks: [{ total: 100, used: 60, free: 40 }],
    };
    const playing = {
      core: "SNES",
      system: "SNES",
      systemName: "Super Nintendo",
      game: "/media/fat/games/SNES/Chrono.sfc",
      gameName: "Chrono Trigger",
    };
    const np = parseStatus(sysinfo, playing);
    expect(np.online).toBe(true);
    expect(np.core).toBe("SNES");
    expect(np.systemName).toBe("Super Nintendo");
    expect(np.gameName).toBe("Chrono Trigger");
    expect(np.hostname).toBe("MiSTer");
  });

  it("coerces empty/absent fields to null but stays online", () => {
    const np = parseStatus({ hostname: "MiSTer" }, {});
    expect(np.online).toBe(true);
    expect(np.core).toBeNull();
    expect(np.systemName).toBeNull();
    expect(np.game).toBeNull();
    expect(np.gameName).toBeNull();
    expect(np.hostname).toBe("MiSTer");
  });
});
