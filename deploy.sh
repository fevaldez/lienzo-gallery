#!/bin/bash
# Lienzo Gallery → GitHub Pages Deploy
set -e

echo "🎨 Preparing Lienzo for deployment..."

# Check if git repo exists
if [ ! -d .git ]; then
  echo "Initializing git repo..."
  git init
  git config user.email "pipexz@gmail.com"
  git config user.name "fevaldez"
fi

# Add everything
git add -A

# Status check
echo ""
echo "Files staged for commit:"
git status --short

# Commit with timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
git commit -m "Deploy: Lienzo Gallery - $TIMESTAMP" --allow-empty

# Check if remote exists
if ! git remote &> /dev/null | grep -q origin; then
  echo ""
  echo "⚠️  No remote 'origin' configured yet."
  echo "Run this manually after creating your GitHub repo:"
  echo ""
  echo "  git remote add origin https://github.com/fevaldez/lienzo-gallery.git"
  echo "  git push -u origin main"
  echo ""
  echo "Then enable GitHub Pages in the repo Settings → Pages → Branch: main"
else
  echo "Pushing to GitHub..."
  git push origin main
  echo "✅ Deployed! Check your GitHub Pages URL."
fi
