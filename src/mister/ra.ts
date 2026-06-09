import type { RaGameProgress, RaStats } from "../core/types.js";

const API_BASE = "https://retroachievements.org/API/";

interface RankScoreJson { Score?: number; Rank?: number; TotalRanked?: number }
interface RecentGameJson {
  Title?: string;
  ConsoleName?: string;
  NumAchieved?: number;
  NumPossibleAchievements?: number;
}

/** Parse API_GetUserRankAndScore.php. */
export function parseRankScore(json: RankScoreJson): Pick<RaStats, "hardcorePoints" | "rank" | "totalRanked"> {
  return {
    hardcorePoints: json.Score ?? 0,
    rank: json.Rank ?? null,
    totalRanked: json.TotalRanked ?? null,
  };
}

/** Parse the first entry of API_GetUserRecentlyPlayedGames.php into progress. */
export function parseRecentGame(games: RecentGameJson[]): RaGameProgress | null {
  const g = games[0];
  if (!g) return null;
  const numAchieved = g.NumAchieved ?? 0;
  const numPossible = g.NumPossibleAchievements ?? 0;
  const percent = numPossible > 0 ? Math.round((numAchieved / numPossible) * 100) : 0;
  return {
    title: g.Title ?? "—",
    console: g.ConsoleName ?? "",
    numAchieved,
    numPossible,
    percent,
  };
}

function query(username: string, apiKey: string, extra: Record<string, string> = {}): string {
  const p = new URLSearchParams({ z: username, y: apiKey, u: username, ...extra });
  return p.toString();
}

/** Fetch aggregated RA stats. Throws on network/credential failure. */
export async function fetchRaStats(username: string, apiKey: string, timeoutMs = 8000): Promise<RaStats> {
  const get = async (endpoint: string, extra: Record<string, string> = {}): Promise<unknown> => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(`${API_BASE}${endpoint}?${query(username, apiKey, extra)}`, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`RA ${endpoint} failed (${res.status})`);
      const data = await res.json();
      if (data && typeof data === "object" && "Error" in data) {
        throw new Error(`RA ${endpoint} error: ${(data as { Error: string }).Error}`);
      }
      return data;
    } finally {
      clearTimeout(t);
    }
  };

  const [rank, recent] = await Promise.all([
    get("API_GetUserRankAndScore.php"),
    get("API_GetUserRecentlyPlayedGames.php", { c: "1" }),
  ]);

  return {
    ...parseRankScore((rank ?? {}) as RankScoreJson),
    currentGame: parseRecentGame((Array.isArray(recent) ? recent : []) as RecentGameJson[]),
  };
}
