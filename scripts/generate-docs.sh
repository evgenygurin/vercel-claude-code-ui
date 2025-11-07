#!/bin/bash

# Script to automatically generate comprehensive documentation for the project
# Generates API docs, component docs, and project overview

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCS_DIR="docs"
API_DOCS_DIR="$DOCS_DIR/api"
COMPONENT_DOCS_DIR="$DOCS_DIR/components"

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

# Create documentation directories
setup_directories() {
    log_info "Setting up documentation directories..."

    mkdir -p "$DOCS_DIR"
    mkdir -p "$API_DOCS_DIR"
    mkdir -p "$COMPONENT_DOCS_DIR"
    mkdir -p "$DOCS_DIR/images"

    log_success "Directories created"
}

# Generate project overview
generate_project_overview() {
    log_info "Generating project overview..."

    local package_info=""
    if [[ -f "package.json" ]]; then
        package_info=$(cat package.json | jq -r '.name, .version, .description' 2>/dev/null || echo "N/A")
    fi

    cat > "$DOCS_DIR/README.md" << EOF
# $(echo "$package_info" | head -1 || echo "Gemini Code UI") Documentation

**Version:** $(echo "$package_info" | sed -n '2p' || echo "1.0.0")
**Description:** $(echo "$package_info" | tail -1 || echo "Next.js application with AI-powered features")

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Components](#components)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Contributing](#contributing)

## 🎯 Project Overview

This is a modern web application built with Next.js 14, TypeScript, and Tailwind CSS.
It provides an AI-powered code interface with advanced file management capabilities.

### Key Features

- 🤖 AI Chat Interface
- 📁 File Manager with Drag & Drop
- 📝 Code Editor with Syntax Highlighting
- 📊 Analytics Dashboard
- 👥 Team Management
- ⚙️ Settings Panel

## 🏗️ Architecture

### Technology Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui, Radix UI
- **State Management:** React Hooks
- **Build Tool:** Next.js (Webpack)
- **Deployment:** Vercel

### Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── [feature]/        # Feature routes
├── components/           # Reusable components
│   ├── ui/              # shadcn/ui components
│   ├── [feature]/       # Feature components
│   └── layout/          # Layout components
├── lib/                 # Utilities and configurations
└── styles/              # Global styles
\`\`\`

## 🚀 Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd claude-code-ui
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open [http://localhost:3000](http://localhost:3000)**

## 📚 Documentation Sections

- [Components](./components/README.md) - Component documentation
- [API Reference](./api/README.md) - API documentation
- [Contributing](../CONTRIBUTING.md) - Contribution guidelines

---

*Generated on $(date)*
EOF

    log_success "Project overview generated"
}

# Generate component documentation
generate_component_docs() {
    log_info "Generating component documentation..."

    cat > "$COMPONENT_DOCS_DIR/README.md" << EOF
# Components Documentation

This section contains documentation for all React components in the project.

## 📁 Component Categories

### UI Components (src/components/ui/)
Basic reusable UI components built with Radix UI and styled with Tailwind CSS.

#### Available Components
EOF

    # List UI components
    if [[ -d "src/components/ui" ]]; then
        find src/components/ui -name "*.tsx" -o -name "*.ts" | while read -r file; do
            local component_name=$(basename "$file" .tsx)
            component_name=$(basename "$component_name" .ts)
            echo "- [\`$component_name\`](./$component_name.md)" >> "$COMPONENT_DOCS_DIR/README.md"
        done
    fi

    cat >> "$COMPONENT_DOCS_DIR/README.md" << EOF

### Feature Components
Higher-level components that implement specific features.

#### Available Features
- [AI Chat Interface](../components/chat/AIChatInterface.md)
- [File Manager](../components/files/FileManager.md)
- [Code Editor](../components/editor/CodeEditor.md)
- [Analytics Dashboard](../components/analytics/AnalyticsDashboard.md)
- [Team Management](../components/team/TeamManagement.md)
- [Settings Panel](../components/settings/SettingsPanel.md)

### Layout Components
Components that handle application layout and navigation.

- [Main Layout](../components/layout/MainLayout.md)
- [Sidebar](../components/layout/Sidebar.md)
- [Header](../components/layout/Header.md)

## 🎨 Styling Guidelines

All components follow these styling principles:

- **Tailwind CSS** for utility classes
- **CSS Variables** for theming
- **Responsive Design** with mobile-first approach
- **Accessibility** with proper ARIA labels
- **Dark Mode** support

## 📝 Component API

Each component includes:
- TypeScript interfaces for props
- JSDoc comments for documentation
- Usage examples
- Accessibility information

---

*Generated on $(date)*
EOF

    log_success "Component documentation generated"
}

# Generate API documentation
generate_api_docs() {
    log_info "Generating API documentation..."

    cat > "$API_DOCS_DIR/README.md" << EOF
# API Reference

This section documents all API endpoints and external integrations.

## 🌐 Next.js API Routes

### Available Endpoints

#### Health Check
- **URL:** \`/api/health\`
- **Method:** GET
- **Description:** Health check endpoint
- **Response:**
  \`\`\`json
  {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0",
    "tools": ["fd", "ripgrep", "ast-grep", "jq", "yq"]
  }
  \`\`\`

## 🔌 External Integrations

### Supported Tools
- **fd** - File discovery and operations
- **ripgrep** - Code searching and analysis
- **ast-grep** - AST-based code transformations
- **jq** - JSON processing
- **yq** - YAML configuration management

## 📊 Data Flow

### Component Data Flow
1. User interactions trigger state updates
2. Components re-render based on state changes
3. Data flows from parent to child components via props
4. Child components communicate via callbacks

### State Management
- Local component state with \`useState\`
- Context API for global state (when needed)
- Server state with React Query (future)

---

*Generated on $(date)*
EOF

    log_success "API documentation generated"
}

# Generate dependency analysis
generate_dependency_analysis() {
    log_info "Generating dependency analysis..."

    if [[ -f "package.json" ]]; then
        cat > "$DOCS_DIR/dependencies.md" << EOF
# Dependencies Analysis

## 📦 Package Dependencies

### Production Dependencies
\`\`\`json
$(jq '.dependencies // {}' package.json)
\`\`\`

### Development Dependencies
\`\`\`json
$(jq '.devDependencies // {}' package.json)
\`\`\`

### Scripts
\`\`\`json
$(jq '.scripts // {}' package.json)
\`\`\`

## 🔍 Dependency Insights

### Total Dependencies
- Production: $(jq '.dependencies // {} | length' package.json)
- Development: $(jq '.devDependencies // {} | length' package.json)

### Major Libraries
- **Next.js:** React framework for production
- **TypeScript:** Type-safe JavaScript
- **Tailwind CSS:** Utility-first CSS framework
- **Radix UI:** Accessible UI primitives
- **Lucide React:** Icon library

---

*Generated on $(date)*
EOF

        log_success "Dependency analysis generated"
    else
        log_warning "No package.json found, skipping dependency analysis"
    fi
}

# Generate project metrics
generate_project_metrics() {
    log_info "Generating project metrics..."

    cat > "$DOCS_DIR/metrics.md" << EOF
# Project Metrics

## 📊 Code Statistics

### Lines of Code
\`\`\`bash
find src -name "*.{ts,tsx,js,jsx}" -exec wc -l {} + | tail -1
\`\`\`

### File Count by Type
\`\`\`bash
find src -name "*.{ts,tsx,js,jsx}" | wc -l
\`\`\`

### Component Count
- UI Components: $(find src/components/ui -name "*.tsx" 2>/dev/null | wc -l)
- Feature Components: $(find src/components -mindepth 1 -maxdepth 1 -type d | grep -v ui | wc -l)
- Total Components: $(find src/components -name "*.tsx" | wc -l)

### Test Coverage
*Test coverage information will be added when tests are implemented*

## 🏗️ Architecture Metrics

### Import/Export Analysis
- Total exports: $(grep -r "export" src --include="*.{ts,tsx}" | wc -l)
- Total imports: $(grep -r "import" src --include="*.{ts,tsx}" | wc -l)

### Component Complexity
*Component complexity analysis will be added*

---

*Generated on $(date)*
EOF

    log_success "Project metrics generated"
}

# Generate README for docs directory
generate_docs_readme() {
    cat > "$DOCS_DIR/README.md" << EOF
# 📚 Documentation

Welcome to the Gemini Code UI documentation! This comprehensive documentation
covers all aspects of the project from setup to deployment.

## 📖 Documentation Sections

### 🏠 [Project Overview](./README.md)
- Project description and features
- Technology stack and architecture
- Getting started guide

### 🧩 [Components](./components/README.md)
- UI component library
- Feature components
- Layout components
- Styling guidelines

### 🌐 [API Reference](./api/README.md)
- API endpoints documentation
- External integrations
- Data flow patterns

### 📦 [Dependencies](./dependencies.md)
- Package dependency analysis
- Development tools
- Build scripts

### 📊 [Project Metrics](./metrics.md)
- Code statistics
- Component analysis
- Performance metrics

## 🚀 Quick Start

1. **Read the [Project Overview](./README.md)** to understand the architecture
2. **Follow the [Getting Started](./README.md#getting-started)** guide
3. **Explore [Components](./components/README.md)** for implementation details
4. **Check [API Reference](./api/README.md)** for integrations

## 📝 Contributing to Documentation

When adding new features:
1. Update component documentation
2. Add API endpoint documentation
3. Update dependency information
4. Regenerate metrics

## 🔄 Auto-generated Content

Some documentation sections are automatically generated by running:
\`\`\`bash
./scripts/generate-docs.sh
\`\`\`

This ensures documentation stays current with code changes.

---

*Documentation generated on $(date)*
EOF
}

# Main execution
main() {
    local start_time=$(date +%s)

    echo "📝 Generating project documentation..."
    echo "======================================"

    setup_directories
    generate_project_overview
    generate_component_docs
    generate_api_docs
    generate_dependency_analysis
    generate_project_metrics
    generate_docs_readme

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    echo ""
    echo "======================================"
    log_success "Documentation generated successfully! 📚"
    log_info "Total time: ${duration}s"
    log_info "Documentation available in: $DOCS_DIR/"

    # Show file structure
    echo ""
    echo "📁 Generated files:"
    find "$DOCS_DIR" -type f -name "*.md" | sort
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h    Show this help message"
        echo "  --output=DIR  Output directory (default: docs)"
        echo ""
        exit 0
        ;;
    --output=*)
        DOCS_DIR="${1#*=}"
        ;;
esac

# Run main function
main "$@"
