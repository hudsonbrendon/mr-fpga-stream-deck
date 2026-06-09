<p align="center">
  <img src="assets/banner.png" alt="MiSTer Companion — Stream Deck Plugin" width="640">
</p>

<h1 align="center">MiSTer Companion — Stream Deck Plugin</h1>

<p align="center">Live MiSTer FPGA status, system health, RetroAchievements, and one-press controls on your Stream Deck.</p>

<p align="center">
  <a href="https://github.com/hudsonbrendon/mister-companion-streamdeck/actions/workflows/tests.yml"><img src="https://github.com/hudsonbrendon/mister-companion-streamdeck/actions/workflows/tests.yml/badge.svg" alt="Tests"></a>
  <a href="https://hudsonbrendon.github.io/mister-companion-streamdeck/"><img src="https://img.shields.io/badge/docs-mkdocs--material-blue" alt="Docs"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/Stream%20Deck-SDK%20v2-101010" alt="Stream Deck SDK v2">
</p>

Four keys for your [MiSTer FPGA](https://misterfpga.org/), powered by the
[mrext Remote API](https://github.com/wizzomafizzo/mrext) — a companion to
[`mister-companion`](https://github.com/hudsonbrendon/mister-companion) and
[`python-mister-fpga`](https://github.com/hudsonbrendon/python-mister-fpga).

## ✨ Features

- ▶️ **Now Playing** — current core and game, with an online/offline indicator (REST).
- 🩺 **System** — CPU load, RAM usage, and uptime over SSH.
- 🏆 **RetroAchievements** — hardcore points, rank, and current-game completion %.
- 🎛️ **Control** — one key, your choice of **Reboot**, **Menu**, **Screenshot**, **Volume ±**, or **Launch** a specific game.

## 🚀 Install

**Recommended — download the release:** grab the latest
**`com.hudsonbrendon.mister.streamDeckPlugin`** from the
[Releases](https://github.com/hudsonbrendon/mister-companion-streamdeck/releases) page and
**double-click** it. No Node.js required.

**From source (development):**

```bash
git clone https://github.com/hudsonbrendon/mister-companion-streamdeck
cd mister-companion-streamdeck
npm install && npm run icons && npm run build
npx streamdeck link com.hudsonbrendon.mister.sdPlugin
```

Then add the actions from the "MiSTer Companion" category and set your MiSTer's IP in the Property
Inspector. Full guide: [docs/INSTALL.md](docs/INSTALL.md).

## 📚 Docs

Full docs at <https://hudsonbrendon.github.io/mister-companion-streamdeck/> — see
[features & data sources](docs/FEATURES.md), [usage](docs/USAGE.md), and
[troubleshooting](docs/TROUBLESHOOTING.md).

## License

MIT — see [LICENSE](LICENSE).
