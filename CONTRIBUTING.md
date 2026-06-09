# Contributing

All non-I/O logic lives in pure, unit-tested modules under `src/core` and `src/mrfpga`.

## Setup

```bash
npm install
npm test          # vitest
npm run build     # compile the plugin
npm run icons     # regenerate PNG icons from assets/*.svg
```

## Rules

- **TDD.** Add a failing test under `tests/` before implementing logic. Keep the SDK/network/SSH
  glue (`src/actions`, the `fetch`/`ssh2` calls) thin — push parsing into testable functions.
- **Adding a control:** extend `ControlKind`, `MrFpgaRest.runControl`, `renderControl`, and the
  `ui/control.html` picker.
- **Commits:** conventional commits (`feat:`, `fix:`, `docs:`, `chore:`).
