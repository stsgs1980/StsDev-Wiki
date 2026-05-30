# Z.ai Sandbox -- Unified Workflow Guide

**Version:** 3.0 | **Date:** 2026-05-30 | **Status:** Universal (not project-specific)
**Supersedes:** ZAI_SANDBOX_INSTRUCTIONS.md, sandbox-rules.md
**Russian version:** sandbox-workflow.md

---

## 1. Core Concept

Sandbox = **ephemeral container**. All chat sessions share the same filesystem but have separate shell processes.

```
Sandbox lifecycle:

  Session Start              Session End
       |                         |
  Files from previous session   Shell process dies
  still on disk                  All child processes die
       |                         (dev server, watchers)
       v                         |
  Clone / verify project        v
  Install deps              Files survive on disk
  Dev server starts         (git state preserved)
  Work...                  Processes must be restarted
       |                     in new session
       v
  Push to GitHub  <----- ONLY way to persist work permanently
```

### Hard Rules

- Working directory = **ONLY** `/home/z/my-project/`
- `.zscripts/` = sandbox infrastructure. **NEVER delete, NEVER overwrite** (see Landmine #1 below)
- `upload/` = sandbox mount point. **Cannot be deleted** (Device or resource busy)
- `download/` = regular directory (NOT a mount point). Survives between sessions but not
  between container resets. Will be deleted during project reload.
- Git push = **ONLY** reliable way to persist work between container resets
- SSH = **NOT available** (no `ssh` binary, no `ssh-keygen`, no `~/.ssh/`)
- gh CLI = **NOT available**
- Only auth method = **PAT token embedded in HTTPS URL**

### Landmines (things that will break your session)

| # | Landmine | What happens | How to avoid |
|---|----------|-------------|-------------|
| 1 | `cp -r repo/. /home/z/my-project/` when repo has `.zscripts/` | Sandbox `dev.sh` replaced with repo version. Dev server won't start or starts incorrectly. | Use `rsync --exclude='.zscripts/'` (see Strategy A Step 3) |
| 2 | `git config --global safe.directory` missing for new repos | Git refuses to run: "fatal: detected dubious ownership" | Always run: `git config --global --add safe.directory /home/z/my-project` after `git init` |
| 3 | Root-owned directories from sandbox auto-creation | `rm -rf` fails with Permission denied | Fix before cleaning: `sudo chown -R z:z <dir>` |
| 4 | Cloning into `/home/z/my-project/` directly | `fatal: destination already exists` | Always clone to `/tmp/` first |
| 5 | Forgetting PAT for private repos | `Permission denied` on push/pull | Set URL once per session: `git remote set-url origin https://<TOKEN>@...` |

---

## 2. Sandbox Infrastructure (.zscripts/)

The sandbox manages the dev server through scripts in `.zscripts/`:

| Script/File | Purpose | When Called |
|-------------|---------|-------------|
| `dev.sh` | Start dev environment (install + db + server + mini-services) | After project load |
| `build.sh` | Production build (Next.js + mini-services) | Before deploy |
| `start.sh` | Production startup (Caddy + built app) | Production mode |
| `mini-services-*.sh` | Install/start/watchdog for mini-services | Auto from dev.sh |
| `dev.log` | Dev server logs | Written by dev.sh |
| `dev.pid` | Dev server process ID | Written by dev.sh |

### What dev.sh does (in order)

```
1. bun install                        -- install all dependencies
2. bun run db:push                    -- sync Prisma schema to database (if prisma/ exists)
3. bun run dev &                      -- start Next.js dev server on port 3000
4. wait_for_service localhost:3000    -- poll until server responds 200
5. Health check (curl)               -- confirm server alive
6. start_mini_services               -- start ws-service + watchdog
```

### Watchdog

After dev.sh starts, a **mini-service watchdog** monitors the dev server. If the
server process dies (crash, timeout, OOM), the watchdog can restart it.
Watchdog log: `.zscripts/mini-service-watchdog.log`.

This is NOT guaranteed to work in all cases. If the server is dead and doesn't
auto-restart within 30 seconds, run dev.sh manually: `bash .zscripts/dev.sh`.

### What dev.sh expects

- `package.json` with `"dev": "next dev -p 3000"` script
- `prisma/schema.prisma` (optional -- step 2 skipped if no prisma/)
- `.env` with `DATABASE_URL` if using PostgreSQL (optional -- SQLite works without it)

### CRITICAL: Never start dev server manually

```bash
# All of these are WRONG in sandbox:
npm run dev          # WRONG - process will die
bun run dev          # WRONG - process will die
npx next dev         # WRONG - Turbopack crash
next dev             # WRONG - no sandbox integration

# ONLY correct way:
bash /home/z/my-project/.zscripts/dev.sh
```

Manual start bypasses sandbox process management. The dev server will either crash
(Turbopack conflict) or die silently after a few minutes (no watchdog). Always use dev.sh.

---

## 3. Decision Tree: What Are You Doing?

```
                    WHAT do you need?
                         |
            +------------+------------+
            |            |            |
     LOAD EXISTING   CREATE NEW   READ ONLY
     PROJECT        PROJECT      (docs/wiki)
            |            |            |
     Strategy A     Strategy B    Strategy C
```

---

## Strategy A: Load Existing Project (most common)

**Use when:** cloning your repo from GitHub to work on it with dev server + preview.

### Step 1: Clone to /tmp/

```bash
# Public repo:
git clone --depth 1 https://github.com/<ORG>/<REPO>.git /tmp/<repo-name>

# Private repo (PAT in URL):
git clone --depth 1 https://<TOKEN>@github.com/<ORG>/<REPO>.git /tmp/<repo-name>
```

Always use `--depth 1`. Full history wastes time and disk.

**If clone hangs** (large repo, slow network), use `--no-checkout` trick:

```bash
git clone --depth 1 --no-checkout <URL> /tmp/<repo-name>
cd /tmp/<repo-name> && git checkout HEAD -- .
```

### Step 2: Clean /home/z/my-project/

**CRITICAL: preserve `.zscripts/` and `upload/`**

```bash
cd /home/z/my-project
ls -A | grep -v '^.zscripts$' | grep -v '^upload$' | xargs rm -rf
```

Some directories may be owned by root (sandbox auto-creates empty skill dirs).
Fix before deleting:

```bash
sudo chown -R z:z /home/z/my-project/skills 2>/dev/null
rm -rf /home/z/my-project/skills 2>/dev/null
```

### Step 3: Copy project files (protecting .zscripts/)

**DANGER:** If the repo contains a `.zscripts/` directory (even empty), plain `cp -r`
will overwrite the sandbox's `.zscripts/dev.sh` with the repo's version. This breaks
dev server startup. Verified in live sandbox.

**Use rsync with exclude:**

```bash
rsync -a --exclude='.zscripts/' --exclude='upload/' /tmp/<repo-name>/ /home/z/my-project/
```

This copies everything (`.git/`, `.gitignore`, `.env`, `src/`, etc.) while preserving
the sandbox's original `.zscripts/` and `upload/`.

**If rsync is unavailable** (unlikely but possible):

```bash
# Backup .zscripts/ first
cp -r /home/z/my-project/.zscripts/ /tmp/zscripts-backup/
# Copy everything (will overwrite .zscripts/)
cp -r /tmp/<repo-name>/. /home/z/my-project/
# Restore sandbox .zscripts/
rm -rf /home/z/my-project/.zscripts/
cp -r /tmp/zscripts-backup/ /home/z/my-project/.zscripts/
```

### Step 4: Fix git ownership (if needed)

If the project was freshly initialized (Strategy B) or ownership changed:

```bash
git config --global --add safe.directory /home/z/my-project
```

This prevents `fatal: detected dubious ownership` errors. The sandbox sets this
globally at container start, but it can be lost if the global config is reset.

### Step 5: Start dev environment

```bash
bash /home/z/my-project/.zscripts/dev.sh
```

### Step 6: Verify

```bash
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/
# Expected: 200
```

Both `localhost` and `127.0.0.1` work in this sandbox. Use whichever responds.
If neither works, the server is dead -- check logs:

```bash
cat /home/z/my-project/.zscripts/dev.log | tail -30
```

---

## Strategy B: Create New Project

**Use when:** building from scratch (no existing repo).

### Option 1: Init script (simple projects)

```bash
curl https://z-cdn.chatglm.cn/fullstack/init-fullstack_1775040338514.sh | bash
```

Creates a blank Next.js 16 project with shadcn/ui. Dev server starts automatically.

**Limitation:** This creates a minimal single-page project. Not suitable for complex
apps with multiple routes, Prisma, or custom project structure.

### Option 2: Manual setup (complex projects)

Work directly in `/home/z/my-project/`. The sandbox infrastructure already provides
`.zscripts/` and basic project scaffolding.

When ready to save to GitHub:

```bash
cd /home/z/my-project
git init
git config --global --add safe.directory /home/z/my-project  # prevent ownership error
git remote add origin https://<TOKEN>@github.com/<ORG>/<REPO>.git
git add -A
git commit -m "init: project setup"
git push -u origin main
```

---

## Strategy C: Read Only (docs, wiki, reference)

**Use when:** reading context files, not running a dev server.

```bash
git clone --depth 1 <URL> /tmp/<name>
```

Read from `/tmp/`. Never clone into `/home/z/my-project/` unless you intend
to run it as the active project.

---

## 4. Authentication

Sandbox has **NO** gh CLI, **NO** SSH keys, **NO** SSH binary, **NO** credential manager.

| Method | Available? | Notes |
|--------|-----------|-------|
| PAT via HTTPS URL | YES | Only method for private repos |
| SSH key clone | NO | `ssh` binary not installed |
| gh CLI auth | NO | `gh` not installed |
| Credential manager | NO | No persistent storage |

### PAT usage

```bash
# One-time setup per session:
git remote set-url origin https://<TOKEN>@github.com/<ORG>/<REPO>.git

# After that, normal git commands work:
git push
git pull
```

**Security:** PAT lives only in this session. Container is ephemeral -- when session
ends, everything is wiped. Never commit `.git/config` with embedded token to the repo.

---

## 5. Shared Filesystem and Shell Lifecycle

### Shared filesystem

- All chat sessions share the same disk (`/home/z/my-project/`)
- Files created in one session are visible in all other sessions
- There is NO filesystem isolation between sessions
- **Implication:** Files survive shell death. Check existing files before recreating.

### Shell process lifecycle

- Each chat session has its own shell process
- When the chat session ends, the shell dies
- All child processes die with the shell (dev server, watchers, cron jobs)
- Files on disk survive -- only processes are killed
- A new chat gets a new shell but the same filesystem
- **Implication:** Dev server started in one chat will NOT survive into a new chat.
  Always check server status at session start.

### Startup checklist (new session / session restart)

```
1. Check filesystem state:
   cd /home/z/my-project && ls src/app/page.tsx
   git status && git log --oneline -3

2. If files are intact:
   Skip to step 4

3. If files are missing or corrupted:
   Strategy A (clone from GitHub) or Strategy B (create new)

4. Check dev server:
   curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/
   - 200 = alive, proceed to work
   - 000 = dead, restart:

   bash /home/z/my-project/.zscripts/dev.sh

5. Verify: 200 OK -> ready to work
```

---

## 6. Git Lockup Recovery

If a previous chat left git in a blocked state (`needs merge`, `rebase in progress`,
`you need to resolve your current index first`):

**From a NEW chat session** (old session is blocked):

```bash
rm -rf .git/rebase-merge .git/rebase-apply
rm -f .git/MERGE_HEAD .git/MERGE_MSG .git/index.lock
git reset --hard HEAD
```

**Warnings:**
- Do NOT attempt `git rebase --continue` or `git merge --continue` when blocked.
  These commands require resolving conflicts, which is impossible when all tools
  are locked by git hooks.
- Must be done from a NEW chat session. The old session's shell process may hold
  a git lock that prevents any command from executing.

---

## 7. Preview

### Web interface (chatglm.site)

Preview is shown in the Preview Panel (right side of chat interface).
Updates automatically when code changes (hot reload).

### IM users (Telegram, etc.)

```
https://preview-<container-id>.space-z.ai/
```

Get container ID:

```bash
echo $FC_CONTAINER_ID
# or
hostname
```

**DO NOT** use `http://localhost:3000` or `http://127.0.0.1:3000` -- these are
internal container addresses, not accessible from outside.

---

## 8. Database

### SQLite (default, zero config)

Works out of the box. `prisma db push` (called by dev.sh) creates the DB file
automatically. Location depends on `schema.prisma` datasource config
(typically `db/custom.db` or `prisma/dev.db`).

### PostgreSQL (Neon, Supabase, etc.)

Requires `.env` with `DATABASE_URL`:

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
```

Rules for `.env`:
- NOT committed to git (in .gitignore)
- MUST exist in repo for Vercel deploys (use `.env.example` as reference)
- IS copied to `/home/z/my-project/` when cloning the project
- If missing, `dev.sh` step 2 (`db:push`) will fail

---

## 9. Session Lifecycle

### Start of session

```
1. git clone wiki/context (if needed)    -> /tmp/wiki
2. Read project context
3. git clone working repo                 -> /tmp/repo
4. Clean /home/z/my-project/              (preserve .zscripts/ and upload/)
5. Copy repo files                        -> /home/z/my-project/
6. bash .zscripts/dev.sh                  (auto: install + db + server + mini-services)
7. Verify: curl localhost:3000            -> 200 OK
8. Report to user: ready
```

### During session

- Commit and push after every significant change
- Do NOT start dev server manually (use dev.sh)
- If server dies: `bash .zscripts/dev.sh` to restart
- If build fails: check `.zscripts/dev.log`

### End of session

```
1. git add -A && git commit -m "description" && git push
2. If wiki was modified: cd /tmp/wiki && git add -A && git commit && git push
3. Report: where you stopped, what was done, what is next
```

### If session breaks

| Scenario | Recovery |
|----------|----------|
| Code was pushed | `git clone` from GitHub, continue |
| Code was NOT pushed | Code is lost. Recreate from wiki context + chat history |
| Push failed | Report immediately. No push = no save = data lost |

---

## 10. Common Problems

| Problem | Cause | Solution |
|---------|-------|----------|
| `fatal: destination already exists` | Cloning into non-empty dir | Clone to `/tmp/`, then copy |
| `Permission denied` on push | No PAT in URL | `git remote set-url origin https://<TOKEN>@...` |
| Dev server not responding (000) | Server crashed or not started | `bash .zscripts/dev.sh` |
| Clone hangs / timeout | Large repo, slow network | `git clone --depth 1 --no-checkout`, then `git checkout HEAD -- .` |
| `upload/` cannot be deleted | Sandbox mount point | Normal. Ignore it. Cannot be removed. |
| `skills/` permission denied | Root-owned empty dirs from sandbox | `sudo chown -R z:z skills && rm -rf skills` before copying |
| `.zscripts/dev.sh` fails immediately | `dev.sh` was overwritten by repo copy | Restore: `git checkout -- .zscripts/` then re-run |
| Turbopack crash on manual start | Manual start conflicts with sandbox | Use `.zscripts/dev.sh`, NOT manual `npx next dev` |
| `fatal: detected dubious ownership` | Git safe.directory not set | `git config --global --add safe.directory /home/z/my-project` |
| `EADDRINUSE :3000` | Port already in use | `pkill -f 'next dev'; sleep 1; bash .zscripts/dev.sh` |
| Vercel deploy fails | Missing env vars | Add in Vercel Dashboard > Settings > Environment Variables |
| dev.sh fails on db:push | Prisma needs PostgreSQL but no .env | Add `.env` with DATABASE_URL |
| All git commands blocked | Previous session left rebase/merge | Recovery from new session (Section 6) |
| Server dies after session switch | Shell process died with old chat | `bash .zscripts/dev.sh` |
| `localhost` fails in curl | Rare IPv6 resolution issue | Try `127.0.0.1` instead (both usually work) |
| `bun run dev` dies fast | Bun wrapper instability | Use `.zscripts/dev.sh` instead |
| Server dies after ~5 min | Sandbox process timeout | Dev.sh watchdog handles this. If not, restart manually |

---

## 11. Quick Reference

```bash
# === Load existing project (full sequence) ===
git clone --depth 1 <URL> /tmp/repo
cd /home/z/my-project && ls -A | grep -v '^.zscripts$' | grep -v '^upload$' | xargs rm -rf
rsync -a --exclude='.zscripts/' --exclude='upload/' /tmp/repo/ /home/z/my-project/
bash .zscripts/dev.sh

# === Verify dev server ===
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/

# === Check dev server logs ===
cat .zscripts/dev.log | tail -30

# === Check watchdog log ===
cat .zscripts/mini-service-watchdog.log | tail -10

# === Restart dev server ===
pkill -f 'next dev'; sleep 1; bash .zscripts/dev.sh

# === Push to GitHub ===
git remote set-url origin https://<TOKEN>@github.com/org/repo.git
git add -A && git commit -m "msg" && git push

# === Container ID for preview URL ===
echo $FC_CONTAINER_ID
# or
hostname

# === Git lockup recovery (from new session) ===
rm -rf .git/rebase-merge .git/rebase-apply
rm -f .git/MERGE_HEAD .git/MERGE_MSG .git/index.lock
git reset --hard HEAD

# === Fix git ownership error ===
git config --global --add safe.directory /home/z/my-project

# === Restore .zscripts/ if accidentally overwritten ===
git checkout -- .zscripts/

# === Install additional packages ===
cd /home/z/my-project && bun add <package>

# === Lint check ===
bun run lint

# === Database sync (Prisma) ===
bun run db:push
```

---

## 12. What NOT to Do

| Action | Why Not |
|--------|---------|
| `npm run dev` / `bun run dev` / `npx next dev` | Manual start conflicts with sandbox, process dies |
| `git clone <URL>` directly into `/home/z/my-project/` | Fails on non-empty dir; breaks `.zscripts/` |
| `cp -r repo/. /home/z/my-project/` (when repo has `.zscripts/`) | Overwrites sandbox `dev.sh`, breaks dev server. Use rsync instead |
| `rm -rf .zscripts/` | Destroys sandbox infrastructure, no recovery |
| `ssh git@github.com` | SSH binary not installed in sandbox |
| `npx create-next-app` | Unnecessary; sandbox provides project scaffolding |
| Trust that files persist between sessions | Container can be fully reset; always git push |
| Start work without checking git status | Previous session may have left git blocked |
| Start work without checking dev server | Server process died with old session |

---

## Changelog

### v2.1 (2026-05-29) -- Bug audit

Found and fixed 5 issues via live sandbox verification:

1. **CRITICAL: `cp -r` overwrites `.zscripts/`** -- If the cloned repo contains a `.zscripts/`
   directory, `cp -r repo/. /home/z/my-project/` silently replaces the sandbox's `dev.sh`
   with the repo's version. **Verified by creating a fake `.zscripts/dev.sh` and confirming
   overwrite.** Fix: use `rsync --exclude='.zscripts/'` or backup/restore pattern.

2. **`localhost` vs `127.0.0.1` contradiction** -- Document used both interchangeably. Both work
   in current sandbox (verified: both return 200). Clarified: use either, try the other if one fails.

3. **Missing `git safe.directory`** -- Not documented, but required after `git init` in Strategy B.
   Without it, git refuses with "fatal: detected dubious ownership". Added to Strategy B and Quick Reference.

4. **Watchdog not explained** -- Document mentioned "dev.sh watchdog" without explaining what it is.
   Added explanation of mini-service watchdog and its log file location.

5. **`download/` directory not mentioned** -- It's a regular directory (not a mount point like
   `upload/`). Gets deleted during project reload. Added to Hard Rules.

### v2.0 (2026-05-29) -- Initial unified document

Merged 3 sources: ZAI_SANDBOX_INSTRUCTIONS.md, sandbox-workflow.md, sandbox-rules.md.
Corrected errors from all three sources. Added verified real-world fixes.
