# Features & data sources

All data comes from your own Mr. FPGA / accounts — no third-party service.

## Now Playing (REST)

`GET http://<host>:8182/api/sysinfo` + `/games/playing` → current core, game, and hostname.
A green dot means the Mr. FPGA answered; `OFFLINE` means it didn't.

## System (SSH)

A single SSH probe reads `/tmp/CORENAME`, `/proc/uptime`, `/proc/loadavg`, and
`/proc/meminfo`, yielding **CPU load (1m)**, **RAM used %**, and **uptime**. Requires the SSH
user/password (stock Mr. FPGA: `root` / `1`). Mr. FPGA exposes no temperature sensor, so none is shown.

## RetroAchievements (Web API)

`API_GetUserRankAndScore.php` + `API_GetUserRecentlyPlayedGames.php` from
[retroachievements.org](https://retroachievements.org) → **hardcore points**, **global rank**, and
the **completion %** of your most recently played game. Requires your RA username and a Web API key
from [retroachievements.org/settings](https://retroachievements.org/settings).

## Control (REST)

One key, configurable per instance:

| Action | Endpoint |
|--------|----------|
| Reboot | `POST /settings/system/reboot` |
| Menu | `POST /launch/menu` |
| Screenshot | `POST /screenshots` |
| Volume + / − | `POST /controls/keyboard/volume_up` / `volume_down` |
| Launch | `POST /games/launch` with `{ "path": "…" }` |

## Security

The mrext Remote API has no authentication — anyone on your LAN can call it. SSH and RA credentials
are stored in the plugin's Stream Deck settings on this machine. Keep the Mr. FPGA on a trusted
network.
