/** Plugin-wide connection config, persisted via Stream Deck global settings. */
export interface GlobalSettings {
  host?: string;          // MiSTer IP or hostname
  port: number;           // mrext Remote REST port
  sshUser: string;
  sshPassword: string;
  sshPort: number;
  raUsername?: string;
  raApiKey?: string;
  refreshSeconds: number; // poll interval
}

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  port: 8182,
  sshUser: "root",
  sshPassword: "1", // MiSTer stock default credential
  sshPort: 22,
  refreshSeconds: 15,
};

/** Now-playing snapshot from the REST API. */
export interface NowPlaying {
  online: boolean;
  core: string | null;
  systemName: string | null;
  game: string | null;
  gameName: string | null;
  hostname: string | null;
}

/** System telemetry from the SSH probe. */
export interface SystemTelemetry {
  activeCore: string | null;
  uptimeSeconds: number | null;
  cpuLoad1m: number | null;
  memoryUsedPercent: number | null;
}

/** Per-game RetroAchievements progress. */
export interface RaGameProgress {
  title: string;
  console: string;
  numAchieved: number;
  numPossible: number;
  percent: number; // 0–100
}

/** Aggregated RetroAchievements stats. */
export interface RaStats {
  hardcorePoints: number;
  rank: number | null;
  totalRanked: number | null;
  currentGame: RaGameProgress | null;
}

/** What a Control key does when pressed. */
export type ControlKind = "reboot" | "menu" | "screenshot" | "volume_up" | "volume_down" | "launch";

/** Per-key (per-action-instance) settings for the Control action. */
export interface ControlSettings {
  kind?: ControlKind;
  launchPath?: string; // used when kind === "launch"
}
