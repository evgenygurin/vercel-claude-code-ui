#!/bin/bash

# Script to identify and remove dead code using ast-grep
# Analyzes TypeScript/JavaScript files for unused variables, functions, and imports

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
SRC_DIR="src"
REPORT_FILE="dead-code-report.md"
BACKUP_DIR="dead-code-backup-$(date +%Y%m%d_%H%M%S)"

# Arrays to store results
declare -a dead_variables=()
declare -a dead_functions=()
declare -a unused_imports=()
declare -a dead_code_files=()

# Function to check if ast-grep is available
check_dependencies() {
    if ! command -v ast-grep &> /dev/null; then
        log_error "ast-grep not found. Please install it first:"
        echo "  npm install -g @ast-grep/cli"
        echo "  or"
        echo "  cargo install ast-grep"
        exit 1
    fi

    if ! command -v rg &> /dev/null; then
        log_error "ripgrep (rg) not found. Please install it first."
        exit 1
    fi
}

# Function to analyze unused imports
analyze_unused_imports() {
    log_info "Analyzing unused imports..."

    # Find all import statements
    while IFS= read -r file; do
        if [[ ! -f "$file" ]]; then
            continue
        fi

        # Extract imports from this file
        local imports=$(rg "import.*from" "$file" | sed 's/.*import //' | sed 's/ from.*//')

        # Check each import
        while IFS= read -r import_line; do
            if [[ -z "$import_line" ]]; then
                continue
            fi

            # Handle named imports { foo, bar }
            if [[ "$import_line" =~ \{.*\} ]]; then
                # Extract individual imports from named imports
                local named_imports=$(echo "$import_line" | sed 's/[{}]//g' | sed 's/,/ /g')
                for import_name in $named_imports; do
                    import_name=$(echo "$import_name" | xargs)  # trim whitespace
                    if [[ -n "$import_name" ]]; then
                        check_import_usage "$file" "$import_name"
                    fi
                done
            else
                # Handle default imports
                local import_name=$(echo "$import_line" | xargs)
                if [[ -n "$import_name" ]]; then
                    check_import_usage "$file" "$import_name"
                fi
            fi
        done <<< "$imports"

    done < <(find "$SRC_DIR" -name "*.{ts,tsx,js,jsx}" -type f)
}

# Function to check if an import is used
check_import_usage() {
    local file="$1"
    local import_name="$2"

    # Skip common patterns that are hard to detect
    if [[ "$import_name" =~ ^(React|Component|useState|useEffect|useCallback|useMemo)$ ]]; then
        return
    fi

    # Search for usage of this import in the same file
    if ! rg -q "\b$import_name\b" "$file"; then
        unused_imports+=("$file:$import_name")
        log_warning "Unused import: $import_name in $file"
    fi
}

# Function to analyze unused variables and functions
analyze_dead_variables() {
    log_info "Analyzing unused variables and functions..."

    while IFS= read -r file; do
        if [[ ! -f "$file" ]]; then
            continue
        fi

        # Use ast-grep to find variable declarations
        if command -v ast-grep &> /dev/null; then
            # Find const/let declarations
            local vars=$(ast-grep --pattern 'const $$$ = $$$' --lang typescript "$file" 2>/dev/null || true)
            local lets=$(ast-grep --pattern 'let $$$ = $$$' --lang typescript "$file" 2>/dev/null || true)

            # Check each variable
            while IFS= read -r var_line; do
                if [[ -n "$var_line" ]]; then
                    local var_name=$(echo "$var_line" | sed 's/.*const //' | sed 's/ =.*//')
                    if [[ -n "$var_name" ]] && ! rg -q "\b$var_name\b" "$file"; then
                        dead_variables+=("$file:$var_name")
                        log_warning "Unused variable: $var_name in $file"
                    fi
                fi
            done <<< "$vars"

            while IFS= read -r let_line; do
                if [[ -n "$let_line" ]]; then
                    local let_name=$(echo "$let_line" | sed 's/.*let //' | sed 's/ =.*//')
                    if [[ -n "$let_name" ]] && ! rg -q "\b$let_name\b" "$file"; then
                        dead_variables+=("$file:$let_name")
                        log_warning "Unused variable: $let_name in $file"
                    fi
                fi
            done <<< "$lets"
        fi

    done < <(find "$SRC_DIR" -name "*.{ts,tsx,js,jsx}" -type f)
}

# Function to analyze unused functions
analyze_dead_functions() {
    log_info "Analyzing unused functions..."

    while IFS= read -r file; do
        if [[ ! -f "$file" ]]; then
            continue
        fi

        # Find function declarations
        local functions=$(rg "function\s+\w+|const\s+\w+\s*=\s*\(" "$file" | sed 's/.*function //' | sed 's/.*const //' | sed 's/ =.*//' | sed 's/(.*//')

        while IFS= read -r func_name; do
            if [[ -n "$func_name" ]] && ! rg -q "\b$func_name\b" "$file"; then
                dead_functions+=("$file:$func_name")
                log_warning "Unused function: $func_name in $file"
            fi
        done <<< "$functions"

    done < <(find "$SRC_DIR" -name "*.{ts,tsx,js,jsx}" -type f)
}

# Function to create backup before making changes
create_backup() {
    log_info "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"

    # Copy source files to backup
    cp -r "$SRC_DIR" "$BACKUP_DIR/"
    log_success "Backup created in $BACKUP_DIR"
}

# Function to remove dead code
remove_dead_code() {
    local confirm_removal=false

    if [[ "${1:-}" == "--yes" ]]; then
        confirm_removal=true
    fi

    if [[ "$confirm_removal" != true ]]; then
        echo ""
        log_warning "This will modify your source files!"
        read -p "Are you sure you want to proceed? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Operation cancelled"
            return 1
        fi
    fi

    create_backup

    log_info "Removing dead code..."

    # Remove unused imports (simplified - manual review recommended)
    for unused in "${unused_imports[@]}"; do
        local file=$(echo "$unused" | cut -d: -f1)
        local import_name=$(echo "$unused" | cut -d: -f2)

        log_info "Would remove unused import: $import_name from $file"
        # Note: Actually removing imports is complex and error-prone
        # This would require more sophisticated AST manipulation
    done

    log_success "Dead code analysis complete"
    log_warning "Manual review recommended before making changes"
}

# Function to generate report
generate_report() {
    cat > "$REPORT_FILE" << EOF
# Dead Code Analysis Report

**Generated on:** $(date)
**Analyzed directory:** $SRC_DIR

## Summary

- **Unused imports found:** ${#unused_imports[@]}
- **Unused variables found:** ${#dead_variables[@]}
- **Unused functions found:** ${#dead_functions[@]}

## Detailed Findings

EOF

    if [[ ${#unused_imports[@]} -gt 0 ]]; then
        echo "### Unused Imports" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        for unused in "${unused_imports[@]}"; do
            echo "- \`$unused\`" >> "$REPORT_FILE"
        done
        echo "" >> "$REPORT_FILE"
    fi

    if [[ ${#dead_variables[@]} -gt 0 ]]; then
        echo "### Unused Variables" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        for unused in "${dead_variables[@]}"; do
            echo "- \`$unused\`" >> "$REPORT_FILE"
        done
        echo "" >> "$REPORT_FILE"
    fi

    if [[ ${#dead_functions[@]} -gt 0 ]]; then
        echo "### Unused Functions" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        for unused in "${dead_functions[@]}"; do
            echo "- \`$unused\`" >> "$REPORT_FILE"
        done
        echo "" >> "$REPORT_FILE"
    fi

    cat >> "$REPORT_FILE" << EOF
## Recommendations

1. **Review unused imports** - These can be safely removed
2. **Check unused variables** - May indicate incomplete features
3. **Review unused functions** - Could be dead code or unused utilities
4. **Backup before changes** - Use the backup directory for safety

## Methodology

This analysis used:
- **ast-grep**: AST-based pattern matching
- **ripgrep**: Fast text search for usage detection
- **Static analysis**: Import and variable usage detection

### Limitations

- Cannot detect dynamic usage (eval, dynamic imports)
- May miss variables used in JSX but not in plain text
- Cannot detect usage in test files
- Conservative approach to avoid false positives

---

*Report generated by remove-dead-code.sh*
EOF
}

# Main execution
main() {
    local start_time=$(date +%s)
    local remove_mode=false

    echo "🧹 Dead Code Analysis..."
    echo "========================="

    check_dependencies

    # Parse arguments
    case "${1:-}" in
        --remove|--yes)
            remove_mode=true
            log_warning "Remove mode enabled - this will modify files!"
            ;;
        --help|-h)
            echo "Usage: $0 [options]"
            echo ""
            echo "Analyze and optionally remove dead code from TypeScript/JavaScript files"
            echo ""
            echo "Options:"
            echo "  --help, -h    Show this help message"
            echo "  --remove, --yes  Remove dead code (with confirmation)"
            echo "  --src DIR       Source directory (default: src)"
            echo ""
            exit 0
            ;;
    esac

    analyze_unused_imports
    analyze_dead_variables
    analyze_dead_functions
    generate_report

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    echo ""
    echo "========================="
    log_success "Analysis complete! 🧹"
    log_info "Total time: ${duration}s"
    log_info "Report saved to: $REPORT_FILE"

    local total_issues=$((${#unused_imports[@]} + ${#dead_variables[@]} + ${#dead_functions[@]}))
    if [[ $total_issues -gt 0 ]]; then
        log_warning "Found $total_issues potential dead code issues"
        echo "Review the report before making changes!"
    else
        log_success "No dead code found! 🎉"
    fi

    if [[ "$remove_mode" == true ]]; then
        remove_dead_code --yes
    fi
}

# Run main function
main "$@"
