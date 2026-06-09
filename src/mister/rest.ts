import type { ControlKind, NowPlaying } from "../core/types.js";

interface SysInfo {
  hostname?: string;
  version?: string;
  ips?: string[];
  disks?: Array<{ total?: number; used?: number; free?: number }>;
}
interface Playing {
  core?: string;
  system?: string;
  systemName?: string;
  game?: string;
  gameName?: string;
}

/** Merge /sysinfo + /games/playing into a NowPlaying snapshot. A successful fetch ⇒ online. */
export function parseStatus(sysinfo: SysInfo, playing: Playing): NowPlaying {
  return {
    online: true,
    core: playing.core || null,
    systemName: playing.systemName || null,
    game: playing.game || null,
    gameName: playing.gameName || null,
    hostname: sysinfo.hostname || null,
  };
}

const OFFLINE: NowPlaying = {
  online: false, core: null, systemName: null, game: null, gameName: null, hostname: null,
};

/** Thin REST client for the mrext Remote API. */
export class MisterRest {
  private readonly base: string;
  constructor(host: string, port = 8182, private readonly timeoutMs = 6000) {
    this.base = `http://${host}:${port}/api`;
  }

  private async req(method: string, path: string, body?: unknown): Promise<Response> {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      return await fetch(`${this.base}${path}`, {
        method,
        headers: body ? { "content-type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        signal: ctrl.signal,
      });
    } finally {
      clearTimeout(t);
    }
  }

  /** GET /sysinfo + /games/playing → NowPlaying. Returns an offline snapshot if unreachable. */
  async getStatus(): Promise<NowPlaying> {
    try {
      const [siRes, plRes] = await Promise.all([this.req("GET", "/sysinfo"), this.req("GET", "/games/playing")]);
      if (!siRes.ok) return OFFLINE;
      const sysinfo = (await siRes.json()) as SysInfo;
      const playing = plRes.ok ? ((await plRes.json()) as Playing) : {};
      return parseStatus(sysinfo, playing);
    } catch {
      return OFFLINE;
    }
  }

  async launchGame(path: string): Promise<void> { await this.req("POST", "/games/launch", { path }); }
  async launchMenu(): Promise<void> { await this.req("POST", "/launch/menu"); }
  async reboot(): Promise<void> { await this.req("POST", "/settings/system/reboot"); }
  async screenshot(): Promise<void> { await this.req("POST", "/screenshots"); }
  async pressKey(name: string): Promise<void> { await this.req("POST", `/controls/keyboard/${name}`); }

  /** Run a Control action by kind. */
  async runControl(kind: ControlKind, launchPath?: string): Promise<void> {
    switch (kind) {
      case "reboot": return this.reboot();
      case "menu": return this.launchMenu();
      case "screenshot": return this.screenshot();
      case "volume_up": return this.pressKey("volume_up");
      case "volume_down": return this.pressKey("volume_down");
      case "launch":
        if (!launchPath) throw new Error("launch control has no path configured");
        return this.launchGame(launchPath);
    }
  }
}
