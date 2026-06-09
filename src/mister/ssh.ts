import { Client } from "ssh2";
import type { SystemTelemetry } from "../core/types.js";

const SEP = "|||";

export const SSH_PROBE_CMD =
  "cat /tmp/CORENAME 2>/dev/null; echo '|||'; " +
  "cat /proc/uptime 2>/dev/null; echo '|||'; " +
  "cat /proc/loadavg 2>/dev/null; echo '|||'; " +
  "awk '/MemTotal|MemAvailable/{print $2}' /proc/meminfo 2>/dev/null; echo '|||'; " +
  "stat -c %Y /media/fat/MiSTer 2>/dev/null";

const toInt = (s: string): number | null => {
  const n = Number.parseInt(s.trim(), 10);
  return Number.isFinite(n) ? n : null;
};

/** Parse the batched SSH probe stdout into telemetry. Missing fields → null. */
export function parseSshProbe(raw: string): SystemTelemetry {
  const parts = raw.split(SEP).map((p) => p.trim());
  while (parts.length < 5) parts.push("");
  const [core, uptimeS, loadS, memS] = parts;

  const uptimeSeconds = uptimeS ? toInt(uptimeS.split(/\s+/)[0]) : null;

  let cpuLoad1m: number | null = null;
  if (loadS) {
    const v = Number.parseFloat(loadS.split(/\s+/)[0]);
    cpuLoad1m = Number.isFinite(v) ? v : null;
  }

  let memoryUsedPercent: number | null = null;
  const memLines = memS.split(/\s+/).filter(Boolean);
  if (memLines.length >= 2) {
    const total = toInt(memLines[0]);
    const avail = toInt(memLines[1]);
    if (total && avail !== null) {
      memoryUsedPercent = Math.round(((total - avail) / total) * 1000) / 10;
    }
  }

  return {
    activeCore: core || null,
    uptimeSeconds,
    cpuLoad1m,
    memoryUsedPercent,
  };
}

/** Open a one-shot SSH connection, run the probe, parse, and close. Best-effort. */
export function probeTelemetry(
  host: string,
  port: number,
  username: string,
  password: string,
  timeoutMs = 6000,
): Promise<SystemTelemetry> {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    const fail = (e: Error) => { try { conn.end(); } catch { /* noop */ } reject(e); };
    const timer = setTimeout(() => fail(new Error("SSH timeout")), timeoutMs);

    conn.on("ready", () => {
      conn.exec(SSH_PROBE_CMD, (err, stream) => {
        if (err) { clearTimeout(timer); return fail(err); }
        let out = "";
        stream.on("data", (d: Buffer) => { out += d.toString("utf-8"); });
        stream.stderr.on("data", () => { /* ignore */ });
        stream.on("close", () => {
          clearTimeout(timer);
          conn.end();
          resolve(parseSshProbe(out));
        });
      });
    });
    conn.on("error", (e) => { clearTimeout(timer); fail(e); });
    conn.connect({ host, port, username, password, readyTimeout: timeoutMs });
  });
}
