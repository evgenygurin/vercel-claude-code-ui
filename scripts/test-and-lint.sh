#!/bin/bash

# Script to automatically run all tests and linters
# Comprehensive testing and code quality pipeline

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

# Check if required tools are installed
check_dependencies() {
    log_info "Checking dependencies..."

    local missing_deps=()

    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi

    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi

    if [[ ${#missing_deps[@]} -ne 0 ]]; then
        log_error "Missing required dependencies: ${missing_deps[*]}"
        exit 1
    fi

    if [[ ! -f "package.json" ]]; then
        log_error "No package.json found. Are you in the right directory?"
        exit 1
    fi

    log_success "Dependencies check passed"
}

# Run TypeScript type checking
run_type_check() {
    log_info "Running TypeScript type checking..."

    if npx tsc --noEmit --skipLibCheck; then
        log_success "TypeScript type check passed"
    else
        log_error "TypeScript type check failed"
        return 1
    fi
}

# Run ESLint
run_linting() {
    log_info "Running ESLint..."

    if npx eslint "src/**/*.{ts,tsx,js,jsx}" --max-warnings 0; then
        log_success "ESLint check passed"
    else
        log_error "ESLint check failed"
        return 1
    fi
}

# Run tests
run_tests() {
    log_info "Running tests..."

    if npx jest --passWithNoTests --coverage --watchAll=false; then
        log_success "Tests passed"
    else
        log_error "Tests failed"
        return 1
    fi
}

# Run build
run_build() {
    log_info "Running build..."

    if npm run build; then
        log_success "Build succeeded"
    else
        log_error "Build failed"
        return 1
    fi
}

# Generate coverage report
generate_coverage_report() {
    if [[ -d "coverage" ]]; then
        log_info "Generating coverage report..."
        npx istanbul report html || true
        log_success "Coverage report generated in coverage/lcov-report/index.html"
    fi
}

# Main execution
main() {
    local start_time=$(date +%s)
    local exit_code=0

    echo "🧪 Starting comprehensive test and lint pipeline..."
    echo "=================================================="

    check_dependencies

    # Run checks in order
    run_type_check || exit_code=1
    run_linting || exit_code=1
    run_tests || exit_code=1
    run_build || exit_code=1

    # Generate reports
    generate_coverage_report

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    echo ""
    echo "=================================================="

    if [[ $exit_code -eq 0 ]]; then
        log_success "All checks passed! 🎉"
        log_info "Total time: ${duration}s"
        echo ""
        echo "📊 Test Summary:"
        if [[ -f "coverage/coverage-summary.json" ]]; then
            npx istanbul report text-summary || true
        fi
    else
        log_error "Some checks failed. Please fix the issues above."
        log_info "Total time: ${duration}s"
    fi

    return $exit_code
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h    Show this help message"
        echo "  --no-build    Skip build step"
        echo "  --no-tests    Skip test step"
        echo ""
        exit 0
        ;;
    --no-build)
        log_warning "Skipping build step as requested"
        unset run_build
        ;;
    --no-tests)
        log_warning "Skipping test step as requested"
        unset run_tests
        ;;
esac

# Run main function and exit with its code
main
exit_code=$?

if [[ $exit_code -eq 0 ]]; then
    echo ""
    echo "✅ Pipeline completed successfully!"
else
    echo ""
    echo "❌ Pipeline failed with exit code $exit_code"
fi

exit $exit_code
