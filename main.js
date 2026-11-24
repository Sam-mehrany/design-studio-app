'use strict';
/**
 * Design Studio — Electron shell around the local studio server.
 *
 * The server is the same code the vault runs (server/ is copied from design/tools by
 * sync-server.js). It is forked as a child process with ELECTRON_RUN_AS_NODE so it uses
 * Electron's bundled Node, binds to 127.0.0.1 on a free port, and is killed with the app.
 */

const { app, BrowserWindow, dialog, shell, Menu } = require('electron');
const { fork } = require('child_process');
const net = require('net');
const path = require('path');
const fs = require('fs');

const DEFAULT_VAULT = 'D:\\Memory\\design';
const SETTINGS = () => path.join(app.getPath('userData'), 'settings.json');

let child = null;
let win = null;
let serverUrl = null;
let quitConfirmed = false;

/** Ask the server whether an ingest is in flight, so quitting can warn instead of killing it. */
const ingestRunning = () => new Promise((resolve) => {
  if (!serverUrl) return resolve(false);
  const req = require('http').get(`${serverUrl}api/ingest/status`, { headers: { 'X-Studio': '1' } }, (res) => {
    let body = '';
    res.on('data', (d) => { body += d; });
    res.on('end', () => {
      try { resolve(!!JSON.parse(body).running); } catch { resolve(false); }
    });
  });
  req.setTimeout(2000, () => { req.destroy(); resolve(false); });
  req.on('error', () => resolve(false));
});

/* ---------- vault location ---------- */

function readSettings() {
  try { return JSON.parse(fs.readFileSync(SETTINGS(), 'utf8')); } catch { return {}; }
}
function writeSettings(s) {
  try { fs.mkdirSync(path.dirname(SETTINGS()), { recursive: true }); } catch { /* ignore */ }
  fs.writeFileSync(SETTINGS(), JSON.stringify(s, null, 2), 'utf8');
}
const looksLikeVault = (p) => !!p && fs.existsSync(path.join(p, 'facets')) && fs.existsSync(path.join(p, 'references'));

/** Find the design folder: remembered -> default -> ask. */
async function resolveVault() {
  const saved = readSettings().vault;
  if (looksLikeVault(saved)) return saved;
  if (looksLikeVault(DEFAULT_VAULT)) { writeSettings({ ...readSettings(), vault: DEFAULT_VAULT }); return DEFAULT_VAULT; }

  const { response } = await dialog.showMessageBox({
    type: 'question',
    title: 'Where is your design library?',
    message: 'Design Studio could not find the design folder.',
    detail: `It expected a folder containing "facets" and "references" — normally ${DEFAULT_VAULT}.`,
    buttons: ['Choose folder…', 'Quit'],
    defaultId: 0, cancelId: 1,
  });
  if (response === 1) return null;

  const picked = await dialog.showOpenDialog({ properties: ['openDirectory'], title: 'Select the design folder' });
  if (picked.canceled || !picked.filePaths.length) return null;
  const dir = picked.filePaths[0];
  if (!looksLikeVault(dir)) {
    await dialog.showMessageBox({ type: 'error', message: 'That folder is not a design library.', detail: 'It needs a "facets" and a "references" folder inside it.' });
    return resolveVault();
  }
  writeSettings({ ...readSettings(), vault: dir });
  return dir;
}

/* ---------- server ---------- */

const freePort = (start) => new Promise((resolve) => {
  const probe = net.createServer();
  probe.once('error', () => resolve(freePort(start + 1)));
  probe.once('listening', () => probe.close(() => resolve(start)));
  probe.listen(start, '127.0.0.1');
});

const waitFor = (url, tries = 60) => new Promise((resolve, reject) => {
  const attempt = (n) => {
    const req = require('http').get(url, { headers: { 'X-Studio': '1' } }, (res) => {
      res.resume();
      resolve();
    });
    req.on('error', () => (n <= 0 ? reject(new Error('server did not start')) : setTimeout(() => attempt(n - 1), 150)));
  };
  attempt(tries);
});

/**
 * Prefer the vault's own server over the bundled copy.
 *
 * The bundle lives inside the asar, so without this every server fix — not just a CSS
 * tweak — needs a rebuild and a reinstall. The vault is already the source of truth
 * (sync-server.js copies out of it), and studio.js resolves lib.js and ui/ relative to
 * itself, so pointing at the vault makes the whole server live. The bundled copy stays as
 * the fallback for a vault that has no tools folder.
 */
function serverEntry(vault) {
  const live = path.join(vault, 'tools', 'studio.js');
  try {
    if (fs.existsSync(live) && fs.existsSync(path.join(vault, 'tools', 'lib.js'))) {
      console.log(`[app] server: ${live} (live from the vault)`);
      return live;
    }
  } catch { /* fall through to the bundle */ }
  const bundled = path.join(__dirname, 'server', 'studio.js');
  console.log(`[app] server: ${bundled} (bundled)`);
  return bundled;
}

async function startServer(vault) {
  const port = await freePort(7391);
  const entry = serverEntry(vault);
  child = fork(entry, ['--port', String(port)], {
    env: { ...process.env, DESIGN_VAULT: vault, ELECTRON_RUN_AS_NODE: '1' },
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
  });
  child.stdout.on('data', (b) => process.stdout.write(`[server] ${b}`));
  child.stderr.on('data', (b) => process.stderr.write(`[server] ${b}`));
  child.on('exit', (code) => {
    child = null;
    if (!app.isQuitting && code !== 0) {
      dialog.showErrorBox('Design Studio', `The library server stopped unexpectedly (code ${code}).`);
      app.quit();
    }
  });
  serverUrl = `http://127.0.0.1:${port}/`;
  await waitFor(serverUrl + 'api/overview');
  return serverUrl;
}

/* ---------- window ---------- */

function createWindow(url) {
  win = new BrowserWindow({
    width: 1440, height: 920, minWidth: 820, minHeight: 600,
    backgroundColor: '#0b0d10',          // no white flash before the page paints
    title: 'Design Studio',
    autoHideMenuBar: true,
    webPreferences: { nodeIntegration: false, contextIsolation: true, spellcheck: false },
  });
  win.loadURL(url);
  win.on('closed', () => { win = null; });

  // An ingest takes minutes and dies with the app, so closing mid-run silently loses the
  // work and leaves the images sitting in the inbox. Ask first.
  win.on('close', (e) => {
    if (quitConfirmed) return;
    e.preventDefault();
    ingestRunning().then(async (busy) => {
      if (!busy) { quitConfirmed = true; win.close(); return; }
      const { response } = await dialog.showMessageBox(win, {
        type: 'warning',
        title: 'Analysis in progress',
        message: 'An analysis is still running.',
        detail: 'Closing now cancels it. The images stay in the inbox, unanalysed.',
        buttons: ['Keep it running', 'Close anyway'],
        defaultId: 0,
        cancelId: 0,
      });
      if (response === 1) { quitConfirmed = true; win.close(); }
    }).catch(() => { quitConfirmed = true; win.close(); });
  });

  win.webContents.on('did-finish-load', () => console.log(`[app] window loaded ${url}`));
  win.webContents.on('did-fail-load', (_e, code, desc) => console.error(`[app] load failed ${code} ${desc}`));

  // Anything that is not the local studio opens in the real browser.
  win.webContents.setWindowOpenHandler(({ url: target }) => {
    if (!target.startsWith(url)) { shell.openExternal(target); return { action: 'deny' }; }
    return { action: 'allow' };
  });
}

function buildMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Open library folder',
          click: () => shell.openPath(readSettings().vault || DEFAULT_VAULT),
        },
        {
          label: 'Change library folder…',
          click: async () => {
            const picked = await dialog.showOpenDialog({ properties: ['openDirectory'] });
            if (picked.canceled || !picked.filePaths.length) return;
            if (!looksLikeVault(picked.filePaths[0])) {
              dialog.showErrorBox('Not a design library', 'That folder needs "facets" and "references" inside it.');
              return;
            }
            writeSettings({ ...readSettings(), vault: picked.filePaths[0] });
            app.relaunch(); app.isQuitting = true; app.quit();
          },
        },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    { label: 'View', submenu: [{ role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' }, { type: 'separator' }, { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { type: 'separator' }, { role: 'togglefullscreen' }] },
    { label: 'Edit', submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }] },
  ]));
}

/* ---------- lifecycle ---------- */

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });

  app.whenReady().then(async () => {
    const vault = await resolveVault();
    if (!vault) { app.quit(); return; }
    buildMenu();
    try {
      const url = await startServer(vault);
      createWindow(url);
    } catch (e) {
      dialog.showErrorBox('Design Studio', `Could not start the library server.\n\n${e.message}`);
      app.quit();
    }
  });

  app.on('window-all-closed', () => app.quit());
  app.on('before-quit', () => { app.isQuitting = true; if (child) child.kill(); });
  app.on('activate', () => { if (!win && serverUrl) createWindow(serverUrl); });
}
