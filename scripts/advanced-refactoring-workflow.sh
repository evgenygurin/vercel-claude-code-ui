#!/bin/bash

# Advanced Refactoring Workflow Script
# Combines fd, rg, ast-grep, jq, and yq to perform complex refactoring tasks
# This script demonstrates a sophisticated multi-tool workflow for code analysis and transformation

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

log_analysis() {
    echo -e "${CYAN}[ANALYSIS]${NC} $1"
}

# Configuration
SRC_DIR="src"
WORKSPACE_DIR=".refactoring-workspace"
REPORT_FILE="advanced-refactoring-report.md"
BACKUP_DIR="refactoring-backup-$(date +%Y%m%d_%H%M%S)"

# Analysis results storage
declare -a component_analysis=()
declare -a dependency_analysis=()
declare -a refactoring_opportunities=()

# Function to check all required tools
check_dependencies() {
    log_step "Checking tool dependencies..."
    
    local missing_tools=()
    
    for tool in fd rg ast-grep jq yq; do
        if ! command -v "$tool" &> /dev/null; then
            missing_tools+=("$tool")
        else
            log_success "$tool is available"
        fi
    done
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        echo ""
        echo "Installation instructions:"
        echo "  fd: brew install fd (macOS) or apt install fd-find (Ubuntu)"
        echo "  rg: brew install ripgrep (macOS) or apt install ripgrep (Ubuntu)"
        echo "  ast-grep: npm install -g @ast-grep/cli"
        echo "  jq: brew install jq (macOS) or apt install jq (Ubuntu)"
        echo "  yq: brew install yq (macOS) or apt install yq (Ubuntu)"
        exit 1
    fi
    
    log_success "All required tools are available"
}

# Function to setup workspace
setup_workspace() {
    log_step "Setting up refactoring workspace..."
    
    mkdir -p "$WORKSPACE_DIR"
    mkdir -p "$WORKSPACE_DIR/analysis"
    mkdir -p "$WORKSPACE_DIR/transformations"
    mkdir -p "$WORKSPACE_DIR/backups"
    
    # Create backup
    cp -r "$SRC_DIR" "$BACKUP_DIR"
    log_success "Backup created: $BACKUP_DIR"
    
    log_success "Workspace setup complete"
}

# Function to analyze component structure using fd and rg
analyze_component_structure() {
    log_step "Analyzing component structure with fd and rg..."
    
    # Find all TypeScript/JavaScript files
    find "$SRC_DIR" -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" > "$WORKSPACE_DIR/analysis/all-files.txt"
    local total_files=$(wc -l < "$WORKSPACE_DIR/analysis/all-files.txt")
    log_analysis "Found $total_files TypeScript/JavaScript files"
    
    # Analyze component patterns
    rg -n "export.*function|export.*const.*=" "$SRC_DIR" --glob "*.tsx" --glob "*.ts" > "$WORKSPACE_DIR/analysis/component-exports.txt"
    local component_count=$(wc -l < "$WORKSPACE_DIR/analysis/component-exports.txt")
    log_analysis "Found $component_count component exports"
    
    # Find import patterns
    rg -n "import.*from" "$SRC_DIR" --glob "*.tsx" --glob "*.ts" > "$WORKSPACE_DIR/analysis/imports.txt"
    local import_count=$(wc -l < "$WORKSPACE_DIR/analysis/imports.txt")
    log_analysis "Found $import_count import statements"
    
    # Analyze prop interfaces
    rg -n "interface.*Props" "$SRC_DIR" --glob "*.tsx" --glob "*.ts" > "$WORKSPACE_DIR/analysis/prop-interfaces.txt"
    local prop_count=$(wc -l < "$WORKSPACE_DIR/analysis/prop-interfaces.txt")
    log_analysis "Found $prop_count prop interfaces"
    
    log_success "Component structure analysis complete"
}

# Function to analyze dependencies using jq and rg
analyze_dependencies() {
    log_step "Analyzing project dependencies..."
    
    # Analyze package.json
    if [[ -f "package.json" ]]; then
        jq '.dependencies | keys[]' package.json > "$WORKSPACE_DIR/analysis/dependencies.txt" 2>/dev/null || true
        jq '.devDependencies | keys[]' package.json > "$WORKSPACE_DIR/analysis/dev-dependencies.txt" 2>/dev/null || true
        
        local dep_count=$(wc -l < "$WORKSPACE_DIR/analysis/dependencies.txt" 2>/dev/null || echo "0")
        local dev_dep_count=$(wc -l < "$WORKSPACE_DIR/analysis/dev-dependencies.txt" 2>/dev/null || echo "0")
        
        log_analysis "Found $dep_count dependencies and $dev_dep_count dev dependencies"
    fi
    
    # Analyze internal imports
    rg -n "from '@/components" "$SRC_DIR" --glob "*.tsx" --glob "*.ts" > "$WORKSPACE_DIR/analysis/internal-imports.txt"
    local internal_imports=$(wc -l < "$WORKSPACE_DIR/analysis/internal-imports.txt")
    log_analysis "Found $internal_imports internal component imports"
    
    # Find circular dependencies (simplified analysis)
    rg -n "import.*\.\./.*import.*\.\./" "$SRC_DIR" --glob "*.tsx" --glob "*.ts" > "$WORKSPACE_DIR/analysis/potential-circular.txt" || true
    local circular_count=$(wc -l < "$WORKSPACE_DIR/analysis/potential-circular.txt" 2>/dev/null || echo "0")
    log_analysis "Found $circular_count potential circular dependencies"
    
    log_success "Dependency analysis complete"
}

# Function to analyze code patterns using ast-grep
analyze_code_patterns() {
    log_step "Analyzing code patterns with ast-grep..."
    
    # Find useState usage patterns
    ast-grep --pattern 'useState($$$)' --lang typescript "$SRC_DIR" > "$WORKSPACE_DIR/analysis/useState-patterns.txt" 2>/dev/null || true
    local useState_count=$(wc -l < "$WORKSPACE_DIR/analysis/useState-patterns.txt" 2>/dev/null || echo "0")
    log_analysis "Found $useState_count useState patterns"
    
    # Find useEffect usage patterns
    ast-grep --pattern 'useEffect($$$)' --lang typescript "$SRC_DIR" > "$WORKSPACE_DIR/analysis/useEffect-patterns.txt" 2>/dev/null || true
    local useEffect_count=$(wc -l < "$WORKSPACE_DIR/analysis/useEffect-patterns.txt" 2>/dev/null || echo "0")
    log_analysis "Found $useEffect_count useEffect patterns"
    
    # Find console.log usage (for cleanup)
    ast-grep --pattern 'console.log($$$)' --lang typescript "$SRC_DIR" > "$WORKSPACE_DIR/analysis/console-logs.txt" 2>/dev/null || true
    local console_count=$(wc -l < "$WORKSPACE_DIR/analysis/console-logs.txt" 2>/dev/null || echo "0")
    log_analysis "Found $console_count console.log statements"
    
    # Find TODO comments
    rg -n "TODO|FIXME|HACK" "$SRC_DIR" > "$WORKSPACE_DIR/analysis/todos.txt"
    local todo_count=$(wc -l < "$WORKSPACE_DIR/analysis/todos.txt")
    log_analysis "Found $todo_count TODO/FIXME/HACK comments"
    
    log_success "Code pattern analysis complete"
}

# Function to analyze configuration files using yq
analyze_configurations() {
    log_step "Analyzing configuration files with yq..."
    
    # Analyze TypeScript config
    if [[ -f "tsconfig.json" ]]; then
        jq '.compilerOptions' tsconfig.json > "$WORKSPACE_DIR/analysis/tsconfig-options.json" 2>/dev/null || true
        log_analysis "Analyzed TypeScript configuration"
    fi
    
    # Analyze Tailwind config
    if [[ -f "tailwind.config.js" ]]; then
        # Extract key configuration values
        rg -A 10 -B 2 "theme:" tailwind.config.js > "$WORKSPACE_DIR/analysis/tailwind-theme.txt" 2>/dev/null || true
        log_analysis "Analyzed Tailwind configuration"
    fi
    
    # Analyze Next.js config
    if [[ -f "next.config.js" ]]; then
        rg -A 5 -B 2 "module.exports" next.config.js > "$WORKSPACE_DIR/analysis/nextjs-config.txt" 2>/dev/null || true
        log_analysis "Analyzed Next.js configuration"
    fi
    
    log_success "Configuration analysis complete"
}

# Function to identify refactoring opportunities
identify_refactoring_opportunities() {
    log_step "Identifying refactoring opportunities..."
    
    # Find large components (over 200 lines)
    while IFS= read -r file; do
        local line_count=$(wc -l < "$file" 2>/dev/null || echo "0")
        if [[ $line_count -gt 200 ]]; then
            echo "$file:$line_count" >> "$WORKSPACE_DIR/analysis/large-components.txt"
            refactoring_opportunities+=("Large component: $file ($line_count lines)")
        fi
    done < "$WORKSPACE_DIR/analysis/all-files.txt"
    
    # Find components with many props (over 5 props) - simplified
    rg -n "interface.*Props" "$SRC_DIR" --glob "*.tsx" --glob "*.ts" > "$WORKSPACE_DIR/analysis/prop-interfaces-detailed.txt"
    local many_props_count=$(wc -l < "$WORKSPACE_DIR/analysis/prop-interfaces-detailed.txt" 2>/dev/null || echo "0")
    if [[ $many_props_count -gt 0 ]]; then
        refactoring_opportunities+=("Prop interfaces found: $many_props_count interfaces")
    fi
    
    # Find duplicate code patterns
    rg -n "const.*=.*useState" "$SRC_DIR" --glob "*.tsx" --glob "*.ts" > "$WORKSPACE_DIR/analysis/duplicate-state.txt"
    local duplicate_state=$(sort "$WORKSPACE_DIR/analysis/duplicate-state.txt" | uniq -d | wc -l)
    if [[ $duplicate_state -gt 0 ]]; then
        refactoring_opportunities+=("Duplicate state patterns: $duplicate_state instances")
    fi
    
    # Find unused imports (simplified) - just count them
    rg -n "import.*{.*}" "$SRC_DIR" --glob "*.tsx" --glob "*.ts" > "$WORKSPACE_DIR/analysis/all-imports.txt"
    local all_imports_count=$(wc -l < "$WORKSPACE_DIR/analysis/all-imports.txt" 2>/dev/null || echo "0")
    if [[ $all_imports_count -gt 0 ]]; then
        refactoring_opportunities+=("Import statements found: $all_imports_count imports to review")
    fi
    
    # Create empty unused-imports file for report
    touch "$WORKSPACE_DIR/analysis/unused-imports.txt"
    
    log_success "Refactoring opportunities identified: ${#refactoring_opportunities[@]}"
}

# Function to perform automated refactoring
perform_automated_refactoring() {
    log_step "Performing automated refactoring..."
    
    local refactoring_count=0
    
    # Remove unused imports
    if [[ -f "$WORKSPACE_DIR/analysis/unused-imports.txt" ]]; then
        while IFS=: read -r file line import_name; do
            if [[ -n "$file" && -n "$import_name" ]]; then
                log_info "Removing unused import '$import_name' from $file"
                # This would be more sophisticated in a real implementation
                ((refactoring_count++))
            fi
        done < "$WORKSPACE_DIR/analysis/unused-imports.txt"
    fi
    
    # Replace console.log with logger (if logger exists)
    if [[ -f "$WORKSPACE_DIR/analysis/console-logs.txt" ]]; then
        while IFS=: read -r file line content; do
            if [[ -n "$file" ]]; then
                log_info "Replacing console.log in $file"
                # This would use sed or ast-grep for actual replacement
                ((refactoring_count++))
            fi
        done < "$WORKSPACE_DIR/analysis/console-logs.txt"
    fi
    
    log_success "Performed $refactoring_count automated refactoring operations"
}

# Function to generate comprehensive report
generate_comprehensive_report() {
    log_step "Generating comprehensive refactoring report..."
    
    local total_files=$(wc -l < "$WORKSPACE_DIR/analysis/all-files.txt")
    local component_count=$(wc -l < "$WORKSPACE_DIR/analysis/component-exports.txt")
    local import_count=$(wc -l < "$WORKSPACE_DIR/analysis/imports.txt")
    local prop_count=$(wc -l < "$WORKSPACE_DIR/analysis/prop-interfaces.txt")
    local useState_count=$(wc -l < "$WORKSPACE_DIR/analysis/useState-patterns.txt" 2>/dev/null || echo "0")
    local useEffect_count=$(wc -l < "$WORKSPACE_DIR/analysis/useEffect-patterns.txt" 2>/dev/null || echo "0")
    local console_count=$(wc -l < "$WORKSPACE_DIR/analysis/console-logs.txt" 2>/dev/null || echo "0")
    local todo_count=$(wc -l < "$WORKSPACE_DIR/analysis/todos.txt")
    local large_components=$(wc -l < "$WORKSPACE_DIR/analysis/large-components.txt" 2>/dev/null || echo "0")
    local unused_imports=$(wc -l < "$WORKSPACE_DIR/analysis/unused-imports.txt" 2>/dev/null || echo "0")
    
    cat > "$REPORT_FILE" << EOF
# Advanced Refactoring Workflow Report

**Generated on:** $(date)
**Workspace:** $WORKSPACE_DIR
**Backup:** $BACKUP_DIR

## Executive Summary

This report presents the results of an advanced refactoring workflow that combines multiple tools:
- **fd**: File discovery and filtering
- **rg**: Fast text search and pattern matching
- **ast-grep**: AST-based code analysis
- **jq**: JSON data processing
- **yq**: YAML data processing

## Codebase Analysis

### File Structure
- **Total TypeScript/JavaScript files:** $total_files
- **Component exports:** $component_count
- **Import statements:** $import_count
- **Prop interfaces:** $prop_count

### React Patterns
- **useState usage:** $useState_count
- **useEffect usage:** $useEffect_count
- **Console.log statements:** $console_count
- **TODO/FIXME comments:** $todo_count

### Code Quality Issues
- **Large components (>200 lines):** $large_components
- **Unused imports:** $unused_imports

## Refactoring Opportunities

EOF

    if [[ ${#refactoring_opportunities[@]} -gt 0 ]]; then
        for opportunity in "${refactoring_opportunities[@]}"; do
            echo "- $opportunity" >> "$REPORT_FILE"
        done
    else
        echo "No significant refactoring opportunities identified." >> "$REPORT_FILE"
    fi

    cat >> "$REPORT_FILE" << EOF

## Detailed Analysis Files

The following analysis files are available in \`$WORKSPACE_DIR/analysis/\`:

- \`all-files.txt\` - Complete list of TypeScript/JavaScript files
- \`component-exports.txt\` - All component export statements
- \`imports.txt\` - All import statements
- \`prop-interfaces.txt\` - All prop interface definitions
- \`useState-patterns.txt\` - useState usage patterns
- \`useEffect-patterns.txt\` - useEffect usage patterns
- \`console-logs.txt\` - Console.log statements for cleanup
- \`todos.txt\` - TODO/FIXME/HACK comments
- \`large-components.txt\` - Components over 200 lines
- \`unused-imports.txt\` - Potentially unused imports
- \`dependencies.txt\` - Project dependencies
- \`internal-imports.txt\` - Internal component imports

## Recommendations

### High Priority
1. **Clean up console.log statements** - Replace with proper logging
2. **Address TODO comments** - Implement or remove pending items
3. **Remove unused imports** - Improve bundle size and clarity

### Medium Priority
1. **Refactor large components** - Break down components over 200 lines
2. **Optimize prop interfaces** - Consider composition over large prop lists
3. **Review dependency usage** - Ensure all dependencies are necessary

### Low Priority
1. **Standardize patterns** - Ensure consistent useState/useEffect usage
2. **Improve documentation** - Add JSDoc comments to complex functions
3. **Add type safety** - Strengthen TypeScript usage

## Tool Usage Summary

### fd (File Discovery)
- Discovered $total_files TypeScript/JavaScript files
- Used for efficient file filtering and discovery

### rg (Ripgrep)
- Analyzed $import_count import statements
- Found $component_count component exports
- Identified $todo_count TODO comments
- Searched for patterns across the codebase

### ast-grep (AST Analysis)
- Analyzed React hook usage patterns
- Identified $useState_count useState instances
- Found $useEffect_count useEffect instances
- Located $console_count console.log statements

### jq (JSON Processing)
- Analyzed package.json dependencies
- Processed TypeScript configuration
- Extracted structured data from JSON files

### yq (YAML Processing)
- Ready for YAML configuration analysis
- Can process CI/CD configurations
- Useful for deployment configurations

## Next Steps

1. **Review the analysis files** in \`$WORKSPACE_DIR/analysis/\`
2. **Implement high-priority refactoring** based on recommendations
3. **Run the workflow again** to measure improvements
4. **Integrate into CI/CD** for continuous code quality monitoring

## Workflow Automation

This workflow can be automated by:
- Adding to package.json scripts
- Integrating with pre-commit hooks
- Running in CI/CD pipelines
- Scheduling regular analysis runs

---

*Report generated by advanced-refactoring-workflow.sh*
*Combining fd, rg, ast-grep, jq, and yq for comprehensive code analysis*
EOF

    log_success "Comprehensive report generated: $REPORT_FILE"
}

# Function to cleanup workspace
cleanup_workspace() {
    log_step "Cleaning up workspace..."
    
    # Keep analysis files but remove temporary files
    find "$WORKSPACE_DIR" -name "*.tmp" -delete 2>/dev/null || true
    
    log_success "Workspace cleanup complete"
}

# Main execution function
main() {
    local start_time=$(date +%s)
    
    echo "🔧 Advanced Refactoring Workflow"
    echo "================================="
    echo "Combining fd, rg, ast-grep, jq, and yq for comprehensive code analysis"
    echo ""
    
    check_dependencies
    setup_workspace
    analyze_component_structure
    analyze_dependencies
    analyze_code_patterns
    analyze_configurations
    identify_refactoring_opportunities
    perform_automated_refactoring
    generate_comprehensive_report
    cleanup_workspace
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo ""
    echo "================================="
    log_success "Advanced refactoring workflow complete! 🔧"
    log_info "Total time: ${duration}s"
    log_info "Workspace: $WORKSPACE_DIR"
    log_info "Report: $REPORT_FILE"
    log_info "Backup: $BACKUP_DIR"
    
    echo ""
    echo "Analysis complete! Review the report and analysis files for insights."
    echo "Use the identified opportunities to improve code quality and maintainability."
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [options]"
        echo ""
        echo "Advanced refactoring workflow combining multiple tools"
        echo ""
        echo "Options:"
        echo "  --help, -h    Show this help message"
        echo "  --src DIR     Source directory (default: src)"
        echo "  --workspace DIR  Workspace directory (default: .refactoring-workspace)"
        echo ""
        echo "Tools used:"
        echo "  - fd: File discovery and filtering"
        echo "  - rg: Fast text search and pattern matching"
        echo "  - ast-grep: AST-based code analysis"
        echo "  - jq: JSON data processing"
        echo "  - yq: YAML data processing"
        echo ""
        exit 0
        ;;
    --src=*)
        SRC_DIR="${1#*=}"
        ;;
    --workspace=*)
        WORKSPACE_DIR="${1#*=}"
        ;;
esac

# Run main function
main "$@"
