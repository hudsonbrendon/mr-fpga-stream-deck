# Install

## Prerequisites

- [Stream Deck app](https://www.elgato.com/stream-deck) 6.5+
- A Mr. FPGA running the **mrext Remote** service (`:8182`) on your LAN
- Node.js 20+ — only if you build from source

## Option A — Install from a release (recommended)

1. Open the [Releases](https://github.com/hudsonbrendon/mr-fpga-stream-deck/releases) page.
2. Download the latest **`com.hudsonbrendon.mrfpga.streamDeckPlugin`**.
3. **Double-click** it — the Stream Deck app installs it.

```bash
# or via the GitHub CLI
gh release download --repo hudsonbrendon/mr-fpga-stream-deck --pattern "*.streamDeckPlugin"
open com.hudsonbrendon.mrfpga.streamDeckPlugin
```

## Option B — From source

```bash
git clone https://github.com/hudsonbrendon/mr-fpga-stream-deck
cd mr-fpga-stream-deck
npm install && npm run icons && npm run build
npx streamdeck link com.hudsonbrendon.mrfpga.sdPlugin
npx streamdeck restart com.hudsonbrendon.mrfpga
```

## Configure

Add the keys, then in any key's Property Inspector set the **Mr. FPGA IP / host**. For the System key
add SSH credentials (stock: `root` / `1`); for RetroAchievements add your RA username + Web API key.
See [Usage](USAGE.md).
