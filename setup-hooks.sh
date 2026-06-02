#!/usr/bin/env bash
# setup-hooks.sh — Install git hooks for StsDev-Wiki
# Run once after cloning: bash setup-hooks.sh

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

HOOK_DIR=".git/hooks"
PRE_PUSH="$HOOK_DIR/pre-push"

# Create pre-push hook content
cat > "$PRE_PUSH" << 'HOOKEOF'
#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

echo ""
echo "Verifying documentation consistency..."
echo ""

if command -v bun &>/dev/null; then
    bun run tools/verify-docs/src/cli.ts
else
    echo "[warn] bun not found — skipping verify-docs"
    exit 0
fi

if [ $? -ne 0 ]; then
    echo ""
    echo "PUSH BLOCKED: Documentation has inconsistencies."
    echo "Fix the issues above or use: git push --no-verify"
    echo ""
    exit 1
fi
HOOKEOF

chmod +x "$PRE_PUSH"
echo "[ok] Installed pre-push hook. Verification will run automatically on every git push."
echo "     Bypass with: git push --no-verify"
