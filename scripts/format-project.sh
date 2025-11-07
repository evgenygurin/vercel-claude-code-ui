#!/bin/bash

# Script to automatically format all files in the project
# Supports TypeScript, JavaScript, JSON, CSS, and other file types

set -e  # Exit on any error

echo "🚀 Starting project formatting..."

# Check if required tools are installed
check_tools() {
    local missing_tools=()

    if ! command -v prettier &> /dev/null; then
        missing_tools+=("prettier")
    fi

    if ! command -v eslint &> /dev/null; then
        missing_tools+=("eslint")
    fi

    if [[ ${#missing_tools[@]} -ne 0 ]]; then
        echo "⚠️  Missing required tools: ${missing_tools[*]}"
        echo "Please install them with: npm install -g prettier eslint"
        exit 1
    fi
}

# Format TypeScript/JavaScript files
format_js_ts() {
    echo "📄 Formatting TypeScript/JavaScript files..."

    if [[ -f "package.json" ]]; then
        # Use project's prettier config if available
        if command -v npx &> /dev/null; then
            npx prettier --write "src/**/*.{ts,tsx,js,jsx}" || true
            npx eslint --fix "src/**/*.{ts,tsx,js,jsx}" || true
        else
            prettier --write "src/**/*.{ts,tsx,js,jsx}" || true
            eslint --fix "src/**/*.{ts,tsx,js,jsx}" || true
        fi
    else
        # Fallback formatting
        find src -name "*.{ts,tsx,js,jsx}" -exec prettier --write {} \; 2>/dev/null || true
    fi
}

# Format JSON files
format_json() {
    echo "📋 Formatting JSON files..."

    if command -v jq &> /dev/null; then
        find . -name "*.json" -not -path "./node_modules/*" -exec jq . {} \; > /dev/null 2>&1 || true
    fi

    if [[ -f "package.json" ]]; then
        npx prettier --write "**/*.json" 2>/dev/null || true
    fi
}

# Format CSS and styling files
format_css() {
    echo "🎨 Formatting CSS files..."

    if [[ -f "package.json" ]]; then
        npx prettier --write "src/**/*.{css,scss,sass}" 2>/dev/null || true
    fi
}

# Format Markdown files
format_markdown() {
    echo "📝 Formatting Markdown files..."

    if [[ -f "package.json" ]]; then
        npx prettier --write "**/*.md" 2>/dev/null || true
    fi
}

# Format YAML files
format_yaml() {
    echo "📄 Formatting YAML files..."

    if command -v prettier &> /dev/null; then
        find . -name "*.{yml,yaml}" -not -path "./node_modules/*" -exec prettier --write {} \; 2>/dev/null || true
    fi
}

# Format shell scripts
format_shell() {
    echo "🐚 Formatting shell scripts..."

    if command -v shfmt &> /dev/null; then
        find . -name "*.sh" -not -path "./node_modules/*" -exec shfmt -w {} \; 2>/dev/null || true
    fi
}

# Main execution
main() {
    check_tools

    format_js_ts
    format_json
    format_css
    format_markdown
    format_yaml
    format_shell

    echo "✅ Project formatting complete!"

    # Show git status if in a git repository
    if [[ -d ".git" ]]; then
        echo ""
        echo "📊 Git status:"
        git status --porcelain | head -10
    fi
}

# Run main function
main "$@"
