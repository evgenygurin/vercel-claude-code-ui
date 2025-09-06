#!/bin/bash

echo "=== Claude Code UI Project Analysis ==="
echo

echo "📁 File Structure Analysis (using fd):"
echo "TypeScript files found:"
fd --type f --extension ts --extension tsx | wc -l
echo

echo "React components found:"
fd . src/components --type f | wc -l
echo

echo "📊 Code Analysis (using ripgrep):"
echo "Total imports found:"
rg "^import" --glob "*.{ts,tsx}" | wc -l

echo "Button component usage:"
rg "Button" --glob "*.{ts,tsx}" | wc -l
echo

echo "🔧 Dependencies Analysis (using jq):"
echo "Total dependencies:"
jq '.dependencies | length' package.json

echo "React-related dependencies:"
jq '.dependencies | keys[] | select(contains("react"))' package.json | wc -l
echo

echo "⚙️ Configuration Analysis (using yq):"
echo "Project features:"
yq '.features | length' config.yaml

echo "Enabled integrations:"
yq '.integrations | to_entries[] | select(.value == true) | .key' config.yaml
echo

echo "=== Analysis Complete ==="
