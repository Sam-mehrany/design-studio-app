# Connect Claude to the library — the Design Studio MCP service

Design Studio speaks the [Model Context Protocol](https://modelcontextprotocol.io), so
Claude can read the library, look at the images, and record Sam's reactions and reasons
while you talk to it. There is one set of tools (`design/tools/mcp-tools.js`) served two
ways:

| Transport | For | Endpoint |
|---|---|---|
| **stdio** | Claude Code or Claude Desktop **on the machine that holds the vault** | `node design/tools/design-mcp.js` |
| **HTTP** (Streamable HTTP) | anything that can reach the **running studio**: another machine, a Claude Code cloud session, claude.ai, the phone | `http://<studio>/mcp` |

Both read through the same parser (`lib.js`) and write through the same validated writer
(`vault-write.js`) as the studio UI, so a reaction recorded by Claude and one clicked in
the gallery are the same edit, with the same git commit. No dependencies, nothing to
install.

## The tools

**Orientation**
- `design_overview` — start here: facets, preferences, decisions, briefs, library size
- `design_stats` — the dashboard in numbers: review progress, reactions, breakdowns by concept, archetype, verdict, RTL, imagery, cost, confidence; inbox and queue counts

**The library**
- `design_refs` — query by concept, archetype, verdict, kind, imagery, RTL, cost, status, reaction, facet term or free text; `compact` and paging
- `design_ref` — one reference in full: classification, Sam's reaction and words, terms with definitions and stances grouped by family, the measured Read, the verdict reasoning, notes, nearest neighbours with scores and shared terms, and a link to its studio page
- `design_image` — **the image itself**, so Claude can look (library reference by id, or an inbox file by name). Files over 3.5 MB come back as a link; change the cap with `MCP_IMAGE_MAX_BYTES`
- `design_record` — the raw Markdown of any REF / PREF / DDR / BRIEF
- `design_inbox` — images waiting for analysis, and the last analysis run

**Vocabulary and taste**
- `design_facet`, `design_terms`, `design_validate`, `design_rubric`
- `design_prefs`, `design_candidates`, `design_brief`

**Writes — Sam's words only**
- `design_react` — like / dislike / none, and his reason. Marks the reference reviewed
- `design_review` — Mode 2: `agree` marks it reviewed; `correct` writes the corrected classification (terms validated) and marks it corrected
- `design_queue_reason` — queue a reason he stated against a facet term, as evidence for a PREF record

There is deliberately **no tool that writes a facet stance or a PREF record.** Those
change only from something Sam said, through Mode 3 of the ingest skill, in the vault. The
server's `instructions` tell every client the two rules: taste is evidence or unknown, and
write tools record only what Sam actually said.

## Set it up

### 1. Claude Code on the vault's machine (stdio)

```bash
claude mcp add -s user design-db -- node /path/to/design/tools/design-mcp.js
```

On Sam's Windows machine:

```powershell
claude mcp add -s user design-db -- node D:\Memory\design\tools\design-mcp.js
```

Start a new Claude Code session; `claude mcp list` should show `design-db … ✓ Connected`.
Add `-e DESIGN_STUDIO_URL=http://127.0.0.1:7391` to get studio page links in the output.

### 2. Claude Desktop (stdio)

In `claude_desktop_config.json` (Settings → Developer → Edit Config):

```json
{
  "mcpServers": {
    "design-db": {
      "command": "node",
      "args": ["D:\\Memory\\design\\tools\\design-mcp.js"]
    }
  }
}
```

Restart Claude Desktop.

### 3. Claude Code over HTTP, same machine

With the studio running (`npm run serve`, or the desktop app), and no token set:

```bash
claude mcp add -s user --transport http design-studio http://127.0.0.1:7391/mcp
```

Tokenless HTTP answers **direct loopback connections only**. Anything that arrives through
a tunnel or proxy is refused until a token is set.

### 4. From anywhere else: claude.ai, a cloud session, the phone

The studio has to be reachable over HTTPS: hosted (Render, Railway and Fly hostnames are
trusted automatically), or the local studio behind a tunnel. Then:

**a. Make a token** and start the studio with it:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

```bash
STUDIO_MCP_TOKEN=<token> npm run serve
```

On Windows PowerShell, `$env:STUDIO_MCP_TOKEN="<token>"` before starting it. The startup
banner says `mcp: … (token required)`.

**b. Trust the public hostname** if your tunnel or host passes its own `Host` header:
`STUDIO_EXTRA_HOSTS=studio.example.com`. Without it every request gets
`unexpected Host header`, which is the DNS-rebinding guard doing its job.

**c. Connect the client.**

- **claude.ai** (Settings → Connectors → Add custom connector) cannot send headers, so put
  the token in the path: `https://studio.example.com/mcp/<token>`. Treat that URL as a
  password.
- **Claude Code** (local or cloud) sends it as a header:

  ```bash
  claude mcp add --transport http design-studio https://studio.example.com/mcp --header "Authorization: Bearer <token>"
  ```

A hosted or password-protected studio **refuses MCP entirely** until `STUDIO_MCP_TOKEN` is
set. The UI password is not reused for MCP.

## Security model

- **Token**: compared in constant time; five wrong tokens lock that address out for
  15 minutes (the same brake as the login page). Rotate it by restarting with a new value.
- **Host and Origin pinned** on `/mcp`, as on the rest of the API: DNS rebinding and
  browser pages cannot reach it.
- **Writes are whitelisted**: reactions, notes, review status and classification fields
  only, with enums and facet terms validated, the record re-parsed after writing and rolled
  back if anything but frontmatter changed, and each write committed to git as `mcp: …`.
- **Stateless**: no sessions, no SSE stream (`GET /mcp` answers 405), JSON responses only.
  Protocol versions 2025-06-18, 2025-03-26 and 2024-11-05.

## Troubleshooting

| Symptom | Cause |
|---|---|
| `MCP token required` / `Wrong MCP token` | The client is not sending the token, or it differs from `STUDIO_MCP_TOKEN` |
| `Too many failed attempts` | Five misses from that address; wait 15 minutes |
| `MCP is off on a hosted or password-protected studio` | Set `STUDIO_MCP_TOKEN` |
| `came through a proxy or tunnel` | You are tunnelling a tokenless local studio; set `STUDIO_MCP_TOKEN` |
| `unexpected Host header` | Add the public hostname to `STUDIO_EXTRA_HOSTS` |
| A new tool does not appear | MCP servers are read at session start; open a new session |
