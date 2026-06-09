# Usage

Add any of the four keys from the **Mr. FPGA Stream Deck** category.

```
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│ ●          │ │   SYSTEM   │ │   RETRO    │ │  Mr. FPGA  │
│    SNES    │ │ LOAD  0.42 │ │   12345    │ │            │
│ Chrono Tr… │ │ RAM    38% │ │ pts · #678 │ │   REBOOT   │
│  Mr. FPGA  │ │ ▓▓▓▓░░░░░  │ │    25%     │ │            │
│            │ │ UP    3d4h │ │ ▓▓▓░░░░░░  │ │            │
└────────────┘ └────────────┘ └────────────┘ └────────────┘
  Now Playing      System        RetroAch.       Control
```

- **Now Playing** — current core + game; green dot = online, `OFFLINE` = unreachable.
- **System** — CPU load (1m), RAM used %, and uptime (needs SSH). Show all three on one key, or split each onto its own key via the **Metric** setting (one big number per key).
- **RetroAchievements** — hardcore points, rank, and current-game completion % (needs RA creds).
- **Control** — press to run its action. Pick the action (and a launch path) in the Property Inspector.

Split the System key into three big, readable tiles:

```
┌────────────┐ ┌────────────┐ ┌────────────┐
│    LOAD    │ │    RAM     │ │   UPTIME   │
│            │ │            │ │            │
│    0.42    │ │    38%     │ │    3d4h    │
│            │ │ ▓▓▓▓░░░░░  │ │            │
└────────────┘ └────────────┘ └────────────┘
  Metric: Load   Metric: RAM   Metric: Uptime
```

Display keys auto-refresh on the interval (default 15s); **tap** to refresh now.

## Settings

- **Metric** *(per System key)* — **All** (load + RAM + uptime, default), **Load**, **RAM**, or **Uptime** (one large value).
- **Mr. FPGA IP / host**, **REST port** *(global)* — the mrext Remote endpoint.
- **Refresh (sec)** *(global)* — poll interval (default 15, min 5).
- **SSH user / password / port** *(global)* — for the System key.
- **RA username / Web API key** *(global)* — for the RetroAchievements key.
- **Action** + **Launch path** *(per Control key)* — what that key does.
