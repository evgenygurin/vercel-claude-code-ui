#!/bin/bash

# Script to automatically build and deploy the project
# Supports Vercel, Netlify, and other deployment platforms

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_PLATFORM="${DEPLOY_PLATFORM:-vercel}"
BRANCH="${BRANCH:-main}"
ENVIRONMENT="${ENVIRONMENT:-production}"

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

# Check deployment prerequisites
check_prerequisites() {
    log_info "Checking deployment prerequisites..."

    if [[ ! -f "package.json" ]]; then
        log_error "No package.json found"
        exit 1
    fi

    if [[ ! -f "vercel.json" ]] && [[ "$DEPLOY_PLATFORM" == "vercel" ]]; then
        log_warning "No vercel.json found. Using default configuration."
    fi

    log_success "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."

    if [[ -f "yarn.lock" ]]; then
        yarn install --frozen-lockfile
    elif [[ -f "pnpm-lock.yaml" ]]; then
        pnpm install --frozen-lockfile
    else
        npm ci
    fi

    log_success "Dependencies installed"
}

# Run pre-deployment checks
run_pre_checks() {
    log_info "Running pre-deployment checks..."

    # Run linting
    if npm run lint > /dev/null 2>&1; then
        log_success "Linting passed"
    else
        log_warning "Linting failed, but continuing..."
    fi

    # Run type checking
    if npx tsc --noEmit > /dev/null 2>&1; then
        log_success "Type checking passed"
    else
        log_error "Type checking failed"
        exit 1
    fi

    # Run tests
    if npm test > /dev/null 2>&1; then
        log_success "Tests passed"
    else
        log_warning "Tests failed, but continuing..."
    fi
}

# Build the project
build_project() {
    log_info "Building project..."

    if [[ "$ENVIRONMENT" == "production" ]]; then
        export NODE_ENV=production
    fi

    if npm run build; then
        log_success "Build completed successfully"
    else
        log_error "Build failed"
        exit 1
    fi
}

# Deploy to Vercel
deploy_vercel() {
    log_info "Deploying to Vercel..."

    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI not found. Install with: npm i -g vercel"
        exit 1
    fi

    # Check if project is linked to Vercel
    if [[ ! -f ".vercel/project.json" ]]; then
        log_info "Linking project to Vercel..."
        vercel link --yes
    fi

    # Deploy
    if [[ "$ENVIRONMENT" == "production" ]]; then
        DEPLOY_URL=$(vercel --prod --yes 2>/dev/null | grep -o 'https://[^ ]*')
    else
        DEPLOY_URL=$(vercel --yes 2>/dev/null | grep -o 'https://[^ ]*')
    fi

    if [[ -n "$DEPLOY_URL" ]]; then
        log_success "Deployed to: $DEPLOY_URL"
        echo "$DEPLOY_URL" > .deploy-url
    else
        log_error "Failed to get deployment URL"
        exit 1
    fi
}

# Deploy to Netlify
deploy_netlify() {
    log_info "Deploying to Netlify..."

    if ! command -v netlify &> /dev/null; then
        log_error "Netlify CLI not found. Install with: npm i -g netlify-cli"
        exit 1
    fi

    if [[ ! -f "netlify.toml" ]]; then
        log_warning "No netlify.toml found. Using default configuration."
    fi

    if netlify deploy --prod --dir=.next; then
        log_success "Deployed to Netlify"
    else
        log_error "Netlify deployment failed"
        exit 1
    fi
}

# Deploy to GitHub Pages
deploy_github_pages() {
    log_info "Deploying to GitHub Pages..."

    if [[ ! -d ".git" ]]; then
        log_error "Not a git repository"
        exit 1
    fi

    # Get repository information
    local repo_url=$(git config --get remote.origin.url)
    if [[ -z "$repo_url" ]]; then
        log_error "No git remote found"
        exit 1
    fi

    # Build static export
    export NEXT_PUBLIC_BASE_PATH="/$(basename "$repo_url" .git)"
    npm run export

    # Deploy using gh-pages
    if command -v gh-pages &> /dev/null; then
        npx gh-pages -d out
        log_success "Deployed to GitHub Pages"
    else
        log_error "gh-pages not found. Install with: npm i -g gh-pages"
        exit 1
    fi
}

# Main deployment function
deploy() {
    case "$DEPLOY_PLATFORM" in
        vercel)
            deploy_vercel
            ;;
        netlify)
            deploy_netlify
            ;;
        github-pages|gh-pages)
            deploy_github_pages
            ;;
        *)
            log_error "Unsupported deployment platform: $DEPLOY_PLATFORM"
            log_info "Supported platforms: vercel, netlify, github-pages"
            exit 1
            ;;
    esac
}

# Generate deployment report
generate_report() {
    local deploy_url=""
    if [[ -f ".deploy-url" ]]; then
        deploy_url=$(cat .deploy-url)
    fi

    cat > deployment-report.md << EOF
# Deployment Report

**Timestamp:** $(date)
**Branch:** $BRANCH
**Environment:** $ENVIRONMENT
**Platform:** $DEPLOY_PLATFORM

## Build Information
- **Node Version:** $(node --version)
- **NPM Version:** $(npm --version)
- **Build Directory:** $(pwd)

## Deployment Details
EOF

    if [[ -n "$deploy_url" ]]; then
        echo "- **URL:** $deploy_url" >> deployment-report.md
    fi

    echo "" >> deployment-report.md
    echo "## Git Information" >> deployment-report.md
    echo "- **Commit:** $(git rev-parse HEAD)" >> deployment-report.md
    echo "- **Author:** $(git log -1 --format='%an <%ae>')" >> deployment-report.md
    echo "- **Message:** $(git log -1 --format='%s')" >> deployment-report.md

    log_success "Deployment report generated: deployment-report.md"
}

# Cleanup function
cleanup() {
    if [[ -f ".deploy-url" ]]; then
        rm .deploy-url
    fi
}

# Main execution
main() {
    local start_time=$(date +%s)

    echo "🚀 Starting build and deployment pipeline..."
    echo "=============================================="
    log_info "Platform: $DEPLOY_PLATFORM"
    log_info "Environment: $ENVIRONMENT"
    log_info "Branch: $BRANCH"

    trap cleanup EXIT

    check_prerequisites
    install_dependencies
    run_pre_checks
    build_project
    deploy
    generate_report

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    echo ""
    echo "=============================================="
    log_success "Deployment completed successfully! 🎉"
    log_info "Total time: ${duration}s"

    if [[ -f "deployment-report.md" ]]; then
        cat deployment-report.md
    fi
}

# Handle script arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --platform=*)
            DEPLOY_PLATFORM="${1#*=}"
            shift
            ;;
        --environment=*)
            ENVIRONMENT="${1#*=}"
            shift
            ;;
        --branch=*)
            BRANCH="${1#*=}"
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --platform=PLATFORM    Deployment platform (vercel, netlify, github-pages)"
            echo "  --environment=ENV      Environment (production, staging, development)"
            echo "  --branch=BRANCH        Git branch to deploy"
            echo "  --help, -h            Show this help message"
            echo ""
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Run main function
main
