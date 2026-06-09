# Usage

Add any of the four keys from the **MiSTer Companion** category.

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ ●            │ │    SYSTEM    │ │    RETRO     │ │    MiSTer    │
│    SNES      │ │ LOAD    0.42 │ │    12345     │ │              │
│ Chrono Tr…   │ │ RAM      38% │ │  pts · #678  │ │    REBOOT    │
│   MiSTer     │ │ ▓▓▓▓░░░░░░░  │ │     25%      │ │              │
│              │ │ UP     3d4h  │ │ ▓▓▓░░░░░░░░  │ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
  Now Playing       System          RetroAch.        Control
```

- **Now Playing** — current core + game; green dot = online, `OFFLINE` = unreachable.
- **System** — CPU load (1m), RAM used %, uptime (needs SSH).
- **RetroAchievements** — hardcore points, rank, and current-game completion % (needs RA creds).
- **Control** — press to run its action. Pick the action (and a launch path) in the Property Inspector.

Display keys auto-refresh on the interval (default 15s); **tap** to refresh now.

## Settings

- **MiSTer IP / host**, **REST port** *(global)* — the mrext Remote endpoint.
- **Refresh (sec)** *(global)* — poll interval (default 15, min 5).
- **SSH user / password / port** *(global)* — for the System key.
- **RA username / Web API key** *(global)* — for the RetroAchievements key.
- **Action** + **Launch path** *(per Control key)* — what that key does.
