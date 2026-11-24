# Design Studio — desktop app

An installable Windows app around the design reference library, so it opens like software
rather than a page in a browser. The library itself stays in the vault at
`D:\Memory\design`; this is only the shell.

**This project lives on `E:`** — `node_modules` is ~557 MB and `dist/` adds a few hundred
more, which `D:` cannot spare: on 24 Nov 2026 it had 9.3 GB free against 55.6 GB on `E:`.
Electron's own caches still go to `%LOCALAPPDATA%` on `C:`, which had 41.8 GB.

## Build

```bash
npm install          # once
npm run dist         # -> dist/Design Studio Setup <version>.exe
```

`npm start` runs it unpackaged for development.

Both scripts run `sync-server.js` first, which copies `lib.js`, `studio.js` and `ui/` out of
`D:/Memory/design/tools` into `server/`. **The vault is the single source of truth** — edit
the server there, not here, then rebuild. Override the source with `DESIGN_TOOLS` if the
vault moves.

`make-icon.js` draws `build/icon.png` from source using only Node's zlib — the facet grid
with one accent cell on a tonal surface, matching the studio's own language rather than a
stock icon. Run it if the icon changes; `server/` and `build/` are generated and gitignored.

## How it runs

The Electron main process:

1. finds the library — a remembered path, else `D:\Memory\design`, else it asks, and
   validates that the folder really holds `facets/` and `references/`;
2. forks `server/studio.js` with `ELECTRON_RUN_AS_NODE`, so the server runs on Electron's
   bundled Node with no separate install, bound to **127.0.0.1** on the first free port
   from 7391;
3. waits for `/api/overview` to answer, then opens the window on it.

The server is killed when the app quits, a single-instance lock stops a second copy, and any
link that is not the local studio opens in the real browser. **File → Change library folder**
repoints it and relaunches.

Because the server keeps its `X-Studio` header requirement and its Host/Origin checks, the
app is no more exposed than the command-line version — a page in another browser still
cannot write to the library.

## Why Electron

WebView2 158 is present on this machine, so Tauri was an option and would ship a far smaller
binary — but it needs a Rust toolchain, which is a large install for one app. Electron costs
about 200 MB installed and needs nothing else. Its caches go to `%LOCALAPPDATA%` on `C:`,
which matters here: as of 24 Nov 2026 `D:` had only 9.3 GB free against 41.8 GB on `C:`.
