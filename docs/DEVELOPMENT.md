# Development

## Layout

- `src/core` — types, formatting, SVG rendering (pure, unit-tested).
- `src/mister` — REST / SSH / RetroAchievements clients (parsers unit-tested).
- `src/actions` — Stream Deck SDK glue (thin).
- `assets` + `scripts/render-icons.mjs` — icon design and PNG generation.

## Commands

```bash
npm test          # vitest run
npm run build     # rollup → com.hudsonbrendon.mister.sdPlugin/bin/plugin.js
npm run watch     # rebuild on change
npm run icons     # regenerate icons
npm run pack      # produce a .streamDeckPlugin in dist/
```

## Debugging

`npx streamdeck restart com.hudsonbrendon.mister` after a build. Logs at
`com.hudsonbrendon.mister.sdPlugin/logs/*.log`. If a rebuild isn't picked up, fully relaunch the
plugin process.
