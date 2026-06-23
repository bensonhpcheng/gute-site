#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
#  GUTE — One-time Git + GitHub + GitHub Pages setup
#  Run this from inside your project folder:
#    cd ~/Projects/gute-site
#    bash setup.sh
# ─────────────────────────────────────────────────────────
set -e

REPO_NAME="gute-site"
BRANCH="main"

echo ""
echo "══════════════════════════════════════"
echo "  GUTE — GitHub Setup Script"
echo "══════════════════════════════════════"
echo ""

# ── 1. Check for gh CLI ───────────────────────────────────
if ! command -v gh &> /dev/null; then
  echo "❌  GitHub CLI (gh) not found."
  echo "    Install it first:"
  echo ""
  echo "      sudo apt update && sudo apt install -y gh"
  echo "      gh auth login"
  echo ""
  exit 1
fi

# ── 2. Check gh auth ──────────────────────────────────────
if ! gh auth status &> /dev/null; then
  echo "🔐  Not logged in to GitHub. Running gh auth login..."
  gh auth login
fi

# ── 3. Git init ───────────────────────────────────────────
if [ ! -d ".git" ]; then
  echo "📁  Initializing git repository..."
  git init
  git checkout -b $BRANCH
else
  echo "✅  Git already initialized."
fi

# ── 4. .gitignore ─────────────────────────────────────────
if [ ! -f ".gitignore" ]; then
  echo "📝  Creating .gitignore..."
  cat > .gitignore << 'EOF'
# OS
.DS_Store
Thumbs.db
*.Zone.Identifier

# Editor
.vscode/
.idea/

# Logs
*.log
EOF
fi

# ── 5. Initial commit ─────────────────────────────────────
echo "📦  Staging all files..."
git add -A

if git diff --cached --quiet; then
  echo "✅  Nothing new to commit."
else
  git commit -m "Initial commit — GUTE site launch"
fi

# ── 6. Create GitHub repo ─────────────────────────────────
GITHUB_USER=$(gh api user --jq '.login')
REMOTE_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

if git remote | grep -q origin; then
  echo "✅  Remote 'origin' already set: $(git remote get-url origin)"
else
  echo "🌐  Creating GitHub repo '$REPO_NAME'..."
  gh repo create "$REPO_NAME" \
    --public \
    --source=. \
    --remote=origin \
    --push \
    --description "GUTE Food Co. — Good food. No filler."
  echo "✅  Repo created and code pushed."
fi

# ── 7. Push ───────────────────────────────────────────────
echo "🚀  Pushing to origin/$BRANCH..."
git push -u origin $BRANCH 2>/dev/null || echo "✅  Already up to date."

# ── 8. Enable GitHub Pages (via GitHub Actions) ───────────
echo "🌍  Enabling GitHub Pages (source: GitHub Actions)..."
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  "/repos/$GITHUB_USER/$REPO_NAME/pages" \
  -f "build_type=workflow" \
  2>/dev/null && echo "✅  GitHub Pages enabled." \
  || echo "ℹ️   Pages may already be enabled — the Actions workflow will handle deployment."

echo ""
echo "══════════════════════════════════════"
echo "  ✅  All done!"
echo ""
echo "  Repo:    https://github.com/$GITHUB_USER/$REPO_NAME"
echo "  Actions: https://github.com/$GITHUB_USER/$REPO_NAME/actions"
echo "  Site:    https://$GITHUB_USER.github.io/$REPO_NAME"
echo "  (GitHub Actions builds 11ty and deploys — ~90s on first push)"
echo ""
echo "  NEXT STEP: Wire up Google Sheets form backend"
echo "  → See google-apps-script/Code.gs for instructions"
echo "══════════════════════════════════════"
echo ""
