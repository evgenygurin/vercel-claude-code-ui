#!/bin/bash

echo "=== Advanced Code Pattern Analysis ==="
echo

echo "🔍 AST-based Pattern Analysis (using ast-grep):"

echo "Functional components found:"
ast-grep --lang typescript --pattern 'function $NAME($$$ARGS) { $$$BODY }' --globs "*.{ts,tsx}" | wc -l

echo "React hooks usage:"
ast-grep --lang typescript --pattern 'useState' --globs "*.{ts,tsx}" | wc -l

echo "Arrow function components:"
ast-grep --lang typescript --pattern 'const $NAME = $$$' --globs "*.{ts,tsx}" | wc -l

echo
echo "📈 Parallel Processing (using fd + xargs):"

echo "Processing TypeScript files in parallel:"
fd --type f --extension ts --extension tsx | xargs -n 1 -P 4 wc -l | tail -1

echo
echo "🔄 Complex Data Processing (using jq):"

echo "Creating analysis JSON..."
cat > analysis.json << EOF
{
  "project": "vercel-claude-code-ui",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "metrics": {
    "typescript_files": $(fd --type f --extension ts --extension tsx | wc -l),
    "react_components": $(fd . src/components --type f | wc -l),
    "imports": $(rg "^import" --glob "*.{ts,tsx}" | wc -l),
    "dependencies": $(jq '.dependencies | length' package.json),
    "features": $(yq '.features | length' config.yaml)
  },
  "tools_used": ["fd", "ripgrep", "ast-grep", "jq", "yq"]
}
EOF

echo "Analysis results:"
jq '.' analysis.json

echo
echo "🎯 Pattern Matching Results:"
echo "Components with props interfaces:"
ast-grep --lang typescript --pattern 'interface $NAMEProps' --globs "*.{ts,tsx}" | wc -l

echo "Export statements:"
ast-grep --lang typescript --pattern 'export' --globs "*.{ts,tsx}" | wc -l

echo
echo "=== Advanced Analysis Complete ==="
