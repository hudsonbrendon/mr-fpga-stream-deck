import { formatLoad, formatPercent, formatUptime } from "./format.js";
import type { ControlKind, NowPlaying, RaStats, SystemMetric, SystemTelemetry } from "./types.js";

const BG = "#1a1a1a";
const ACCENT = "#5a9bd4";   // MiSTer blue
const GOLD = "#e6b800";     // RetroAchievements
const GREEN = "#3fb950";
const GREY = "#888";
const TRACK_PX = 110;
const BAR_X = 17;

function svg(body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
  <rect width="144" height="144" fill="${BG}"/>${body}
</svg>`;
}

function bar(pct: number, y: number, color: string): string {
  const w = Math.round((Math.max(0, Math.min(100, pct)) / 100) * TRACK_PX);
  return `<rect x="${BAR_X}" y="${y}" width="${TRACK_PX}" height="10" rx="3" fill="#333"/>
    <rect x="${BAR_X}" y="${y}" width="${w}" height="10" rx="3" fill="${color}"/>`;
}

/** Escape XML/SVG special characters in network-sourced text (e.g. "Marvel & Capcom"). */
function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Truncate a label to fit the key width, then escape it for safe SVG insertion. */
function clip(text: string, max: number): string {
  const truncated = text.length > max ? `${text.slice(0, max - 1)}…` : text;
  return esc(truncated);
}

export function renderNowPlaying(np: NowPlaying): string {
  if (!np.online) {
    return svg(`<text x="72" y="78" fill="#ff4d4f" font-size="20" font-weight="bold" font-family="sans-serif" text-anchor="middle">OFFLINE</text>`);
  }
  const core = clip(np.core ?? np.systemName ?? "MENU", 12);
  const game = clip(np.gameName ?? "—", 16);
  return svg(`
  <circle cx="20" cy="20" r="6" fill="${GREEN}"/>
  <text x="72" y="60" fill="${ACCENT}" font-size="24" font-weight="bold" font-family="sans-serif" text-anchor="middle">${core}</text>
  <text x="72" y="92" fill="#fff" font-size="14" font-family="sans-serif" text-anchor="middle">${game}</text>
  <text x="72" y="120" fill="${GREY}" font-size="11" font-family="sans-serif" text-anchor="middle">${clip(np.hostname ?? "", 18)}</text>`);
}

/** All three metrics on one key (the "all" layout). */
function renderSystemAll(t: SystemTelemetry): string {
  return svg(`
  <text x="72" y="22" fill="${ACCENT}" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">SYSTEM</text>
  <text x="${BAR_X}" y="52" fill="${GREY}" font-size="13" font-family="sans-serif">LOAD</text>
  <text x="127" y="52" fill="#fff" font-size="13" font-family="sans-serif" text-anchor="end">${formatLoad(t.cpuLoad1m)}</text>
  <text x="${BAR_X}" y="80" fill="${GREY}" font-size="13" font-family="sans-serif">RAM</text>
  <text x="127" y="80" fill="#fff" font-size="13" font-family="sans-serif" text-anchor="end">${formatPercent(t.memoryUsedPercent)}</text>
  ${bar(t.memoryUsedPercent ?? 0, 88, ACCENT)}
  <text x="${BAR_X}" y="124" fill="${GREY}" font-size="13" font-family="sans-serif">UP</text>
  <text x="127" y="124" fill="#fff" font-size="13" font-family="sans-serif" text-anchor="end">${formatUptime(t.uptimeSeconds)}</text>`);
}

/** One metric, large and centered. */
function renderSystemSingle(t: SystemTelemetry, metric: Exclude<SystemMetric, "all">): string {
  const view = {
    load: { title: "LOAD", value: formatLoad(t.cpuLoad1m), pct: null as number | null },
    ram: { title: "RAM", value: formatPercent(t.memoryUsedPercent), pct: t.memoryUsedPercent ?? 0 },
    uptime: { title: "UPTIME", value: formatUptime(t.uptimeSeconds), pct: null as number | null },
  }[metric];
  return svg(`
  <text x="72" y="30" fill="${ACCENT}" font-size="16" font-weight="bold" font-family="sans-serif" text-anchor="middle">${view.title}</text>
  <text x="72" y="88" fill="#fff" font-size="40" font-weight="bold" font-family="sans-serif" text-anchor="middle">${view.value}</text>
  ${view.pct !== null ? bar(view.pct, 108, ACCENT) : ""}`);
}

export function renderSystem(t: SystemTelemetry, metric: SystemMetric = "all"): string {
  return metric === "all" ? renderSystemAll(t) : renderSystemSingle(t, metric);
}

export function renderRa(ra: RaStats): string {
  const g = ra.currentGame;
  const rank = ra.rank != null ? `#${ra.rank}` : "—";
  return svg(`
  <text x="72" y="22" fill="${GOLD}" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">RETRO</text>
  <text x="72" y="58" fill="#fff" font-size="30" font-weight="bold" font-family="sans-serif" text-anchor="middle">${ra.hardcorePoints}</text>
  <text x="72" y="76" fill="${GREY}" font-size="12" font-family="sans-serif" text-anchor="middle">pts · ${rank}</text>
  <text x="72" y="104" fill="#fff" font-size="12" font-family="sans-serif" text-anchor="middle">${g ? formatPercent(g.percent) : "—"}</text>
  ${bar(g?.percent ?? 0, 112, GOLD)}`);
}

const CONTROL_LABEL: Record<ControlKind, string> = {
  reboot: "REBOOT",
  menu: "MENU",
  screenshot: "SHOT",
  volume_up: "VOL +",
  volume_down: "VOL −",
  launch: "LAUNCH",
};

export function renderControl(kind: ControlKind): string {
  return svg(`
  <text x="72" y="62" fill="${ACCENT}" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">Mr. FPGA</text>
  <text x="72" y="92" fill="#fff" font-size="20" font-weight="bold" font-family="sans-serif" text-anchor="middle">${CONTROL_LABEL[kind]}</text>`);
}
