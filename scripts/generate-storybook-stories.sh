#!/bin/bash

# Script to automatically generate Storybook stories for React components
# Uses ast-grep to analyze components and generate appropriate stories

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
COMPONENTS_DIR="$SRC_DIR/components"
STORIES_DIR=".storybook/stories"
REPORT_FILE="storybook-generation-report.md"

# Function to check dependencies
check_dependencies() {
    if ! command -v ast-grep &> /dev/null; then
        log_error "ast-grep not found. Please install it first:"
        echo "  npm install -g @ast-grep/cli"
        exit 1
    fi

    if ! command -v rg &> /dev/null; then
        log_error "ripgrep (rg) not found. Please install ripgrep first."
        exit 1
    fi
}

# Function to setup Storybook directory structure
setup_storybook_dirs() {
    log_info "Setting up Storybook directories..."

    mkdir -p "$STORIES_DIR"

    # Create subdirectories for different component categories
    mkdir -p "$STORIES_DIR/ui"
    mkdir -p "$STORIES_DIR/layout"
    mkdir -p "$STORIES_DIR/features"

    log_success "Storybook directories created"
}

# Function to extract component props using ast-grep
extract_component_props() {
    local file="$1"
    local component_name="$2"

    # Use ast-grep to find interface/type definitions
    local props_interface=""

    if command -v ast-grep &> /dev/null; then
        # Look for interface definitions that might be props
        props_interface=$(ast-grep --pattern "interface ${component_name}Props" --lang typescript "$file" 2>/dev/null || echo "")

        if [[ -z "$props_interface" ]]; then
            # Try alternative patterns
            props_interface=$(ast-grep --pattern "interface Props" --lang typescript "$file" 2>/dev/null || echo "")
        fi

        if [[ -z "$props_interface" ]]; then
            # Try type alias patterns
            props_interface=$(ast-grep --pattern "type ${component_name}Props" --lang typescript "$file" 2>/dev/null || echo "")
        fi
    fi

    echo "$props_interface"
}

# Function to determine component category
get_component_category() {
    local file_path="$1"

    if [[ "$file_path" == *"/ui/"* ]]; then
        echo "ui"
    elif [[ "$file_path" == *"/layout/"* ]]; then
        echo "layout"
    else
        echo "features"
    fi
}

# Function to generate Storybook story
generate_story() {
    local file="$1"
    local component_name="$2"
    local category=$(get_component_category "$file")
    local category_capitalized="$(tr '[:lower:]' '[:upper:]' <<< ${category:0:1})${category:1}"

    local story_file="$STORIES_DIR/$category/${component_name}.stories.tsx"
    local relative_component_path="${file#src/}"
    relative_component_path="${relative_component_path%.*}"  # Remove extension

    log_info "Generating story for $component_name..."

    # Extract props information
    local props_info=$(extract_component_props "$file" "$component_name")

    # Create story content using printf for proper variable substitution
    printf "import type { Meta, StoryObj } from '@storybook/react'
import { %s } from '@/%s'

const meta: Meta<typeof %s> = {
  title: '%s/%s',
  component: %s,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Auto-generated story for %s component.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    // Add argTypes based on props analysis
    // This would be enhanced with more sophisticated prop analysis
  }
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  args: {
    // Default props would be added here based on component analysis
  }
}

// Additional story variants
export const Primary: Story = {
  args: {
    // Primary variant props
  }
}

export const Secondary: Story = {
  args: {
    // Secondary variant props
  }
}

// Loading state (if applicable)
export const Loading: Story = {
  args: {
    // Loading state props
  }
}

// Error state (if applicable)
export const Error: Story = {
  args: {
    // Error state props
  }
}
" "$component_name" "$relative_component_path" "$component_name" "$category_capitalized" "$component_name" "$component_name" "$component_name" > "$story_file"

    log_success "Generated story: $story_file"
}

# Function to analyze and generate stories for all components
generate_all_stories() {
    log_info "Analyzing components and generating stories..."

    local generated_count=0

    while IFS= read -r file; do
        if [[ ! -f "$file" ]]; then
            continue
        fi

        local component_name=$(basename "$file" .tsx)
        component_name=$(basename "$component_name" .ts)

        # Skip non-component files
        if [[ "$component_name" == "index" ]] || [[ "$component_name" == *".d" ]]; then
            continue
        fi

        # Check if this looks like a component file (simplified check)
        if rg -q "export" "$file" && ! rg -q "describe\|it\|test" "$file"; then
            generate_story "$file" "$component_name"
            ((generated_count++))
        fi

    done < <(find "$COMPONENTS_DIR" -name "*.tsx" -o -name "*.ts")

    log_success "Generated $generated_count stories"
}

# Function to generate main stories file
generate_main_stories_file() {
    log_info "Generating main stories configuration..."

    cat > ".storybook/main.stories.ts" << EOF
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../.storybook/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
    }
  }
}

export default config
EOF

    log_success "Main stories configuration generated"
}

# Function to generate Storybook preview configuration
generate_preview_config() {
    log_info "Generating Storybook preview configuration..."

    cat > ".storybook/preview.ts" << EOF
import type { Preview } from '@storybook/react'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    docs: {
      toc: true
    }
  },
  tags: ['autodocs']
}

export default preview
EOF

    log_success "Preview configuration generated"
}

# Function to generate report
generate_report() {
    local total_stories=$(find "$STORIES_DIR" -name "*.stories.tsx" 2>/dev/null | wc -l)
    local total_components=$(find "$COMPONENTS_DIR" -name "*.{tsx,ts}" -type f | wc -l)

    # Calculate coverage percentage safely
    local coverage=0
    if [[ $total_components -gt 0 ]]; then
        coverage=$(($total_stories * 100 / $total_components))
    fi

    cat > "$REPORT_FILE" << EOF
# Storybook Stories Generation Report

**Generated on:** $(date)
**Components directory:** $COMPONENTS_DIR
**Stories directory:** $STORIES_DIR

## Summary

- **Total components found:** $total_components
- **Stories generated:** $total_stories
- **Coverage:** ${coverage}%

## Generated Stories

EOF

    if [[ -d "$STORIES_DIR" ]]; then
        find "$STORIES_DIR" -name "*.stories.tsx" | while read -r story_file; do
            local story_name=$(basename "$story_file" .stories.tsx)
            echo "- \`$story_name\`" >> "$REPORT_FILE"
        done
    fi

    cat >> "$REPORT_FILE" << EOF

## Setup Instructions

### 1. Install Storybook

If Storybook is not already installed:

\`\`\`bash
npx storybook@latest init
\`\`\`

### 2. Configure Storybook

The following files have been generated:
- \`.storybook/main.stories.ts\` - Main configuration
- \`.storybook/preview.ts\` - Preview configuration
- \`.storybook/stories/\` - Generated stories

### 3. Run Storybook

\`\`\`bash
npm run storybook
\`\`\`

### 4. Access Storybook

Open [http://localhost:6006](http://localhost:6006) in your browser.

## Story Structure

Each generated story includes:

- **Default story**: Basic component usage
- **Primary/Secondary variants**: Different visual states
- **Loading/Error states**: Common component states
- **Auto-generated documentation**: Using Storybook's autodocs

## Customization

### Enhancing Stories

You can enhance the generated stories by:

1. **Adding more variants** based on your component's props
2. **Adding interactions** using Storybook's play function
3. **Adding visual tests** with Chromatic
4. **Customizing argTypes** for better controls

### Example Enhanced Story

\`\`\`typescript
export const WithCustomProps: Story = {
  args: {
    title: 'Custom Title',
    variant: 'primary',
    size: 'large'
  },
  play: async ({ canvasElement }) => {
    // Add interaction tests here
  }
}
\`\`\`

## Methodology

This script used:
- **ast-grep**: Component analysis and prop extraction
- **ripgrep**: Fast text search for component detection
- **Template generation**: Automated story file creation

### Limitations

- Basic prop analysis (can be enhanced)
- Generic story templates (customize as needed)
- No automatic mock data generation
- Manual review recommended for complex components

---

*Report generated by generate-storybook-stories.sh*
EOF
}

# Main execution
main() {
    local start_time=$(date +%s)

    echo "📚 Generating Storybook Stories..."
    echo "=================================="

    check_dependencies
    setup_storybook_dirs
    generate_all_stories
    generate_main_stories_file
    generate_preview_config
    generate_report

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    echo ""
    echo "=================================="
    log_success "Storybook stories generation complete! 📚"
    log_info "Total time: ${duration}s"
    log_info "Stories generated in: $STORIES_DIR"
    log_info "Report saved to: $REPORT_FILE"

    local total_stories=$(find "$STORIES_DIR" -name "*.stories.tsx" 2>/dev/null | wc -l)
    if [[ $total_stories -gt 0 ]]; then
        log_success "Generated $total_stories stories! 🎉"
        echo ""
        echo "Next steps:"
        echo "1. Run 'npm run storybook' to start Storybook"
        echo "2. Review and customize generated stories"
        echo "3. Add more variants and interactions as needed"
    else
        log_warning "No stories were generated. Check component structure."
    fi
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [options]"
        echo ""
        echo "Generate Storybook stories for React components"
        echo ""
        echo "Options:"
        echo "  --help, -h          Show this help message"
        echo "  --components DIR    Components directory (default: src/components)"
        echo "  --stories DIR       Stories output directory (default: .storybook/stories)"
        echo ""
        exit 0
        ;;
    --components=*)
        COMPONENTS_DIR="${1#*=}"
        ;;
    --stories=*)
        STORIES_DIR="${1#*=}"
        ;;
esac

# Run main function
main "$@"
