# Claude Code UI - Modern Web Interface

A modern, production-ready web interface for **Claude Code** and **Cursor CLI**, built with Next.js 15, React 19, and Vercel best practices. Inspired by [siteboon/claudecodeui](https://github.com/siteboon/claudecodeui).

## ✨ Features

### 🤖 AI-Powered Development
- **Claude Integration**: Direct API integration with Anthropic Claude (Sonnet 4, Opus 4.1)
- **Real-time Chat**: Interactive conversations with Claude AI
- **Code Analysis**: AI-powered code review and suggestions
- **Smart Sessions**: Persistent conversation history

### 💻 Terminal & Execution
- **Real-time Terminal**: Full xterm.js terminal with WebSocket support
- **Live Shell Sessions**: Interactive bash/zsh sessions via Socket.io
- **Script Runner**: Execute bash, Python, Node.js, TypeScript scripts
- **Output Streaming**: Real-time command output with ANSI colors
- **Auto-Reconnect**: Automatic reconnection on disconnect

### 📂 Project Management
- **Auto-Discovery**: Finds projects from `~/.claude/projects/` and local directories
- **Project Browser**: Visual interface for managing multiple projects
- **Quick Actions**: One-click project operations

### 🔀 Git Integration
- **Visual Git Status**: See changes, branches, commits
- **Stage/Unstage Files**: Interactive git operations
- **Commit History**: Beautiful commit timeline
- **Branch Management**: Switch and create branches

### 📊 Analytics & Monitoring
- **Performance Metrics**: Track usage and performance
- **Usage Statistics**: Monitor API calls and tokens
- **System Health**: Real-time system monitoring

### 🔒 Security Features
- **Rate Limiting**: Intelligent rate limiting on all API endpoints
- **API Key Authentication**: Optional API key protection for sensitive operations
- **CORS Protection**: Configurable CORS with origin whitelisting
- **Input Sanitization**: Command whitelist and input validation
- **Security Headers**: XSS, frame options, CSP protection

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17.0+
- npm 9.0.0+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vercel-claude-code-ui.git
cd vercel-claude-code-ui

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Environment Variables

Create a `.env.local` file with:

```env
# Anthropic Claude API (Required)
ANTHROPIC_API_KEY=your_anthropic_key_here

# Security & Authentication (Optional but recommended)
API_KEY=""                                    # API key for securing endpoints
REQUIRE_AUTH="false"                          # Require API key for WebSocket
REQUIRE_SCRIPT_AUTH="false"                   # Require API key for script execution
ALLOWED_ORIGINS="http://localhost:3000"       # CORS origins (production)

# Server Configuration
PORT=3000
NODE_ENV=development
```

See `.env.example` for full configuration options.

## 📖 Usage

### Terminal

Navigate to `/terminal` to access the real-time interactive terminal:

The terminal uses WebSocket for live shell sessions. You can run any command in your default shell (bash/zsh):

```bash
# Full shell access (no whitelist restrictions)
ls -la
git status
npm run build
python script.py
vercel deploy --prod
cd ~/projects && pwd
```

Connection status is displayed in the top-left corner.

### Claude Chat

Navigate to `/claude` to start chatting with Claude AI:

1. Select or create a session
2. Choose your Claude model (Sonnet 4, Opus 4.1)
3. Start asking questions or getting code help

### Project Discovery

Navigate to `/projects` to see all discovered projects:

- Auto-scans `~/.claude/projects/`
- Finds local projects with `package.json` or `.git`
- Search and filter projects
- Quick open functionality

### Git Operations

Navigate to `/git` for visual git management:

- View current branch and status
- Stage/unstage files
- View commit history
- See ahead/behind status

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Radix UI Components
- Framer Motion

**Terminal:**
- @xterm/xterm
- @xterm/addon-fit
- @xterm/addon-web-links

**State Management:**
- React Hooks
- Context API
- LocalStorage

**API:**
- Next.js API Routes
- Server Actions
- Streaming Responses

### Project Structure

```text
vercel-claude-code-ui/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Auth routes
│   │   ├── api/               # API routes
│   │   │   ├── claude/        # Claude AI endpoints
│   │   │   ├── git/           # Git operations
│   │   │   ├── terminal/      # Terminal execution
│   │   │   ├── projects/      # Project discovery
│   │   │   └── scripts/       # Script execution
│   │   ├── claude/            # Claude chat pages
│   │   ├── terminal/          # Terminal page
│   │   ├── projects/          # Projects page
│   │   ├── git/               # Git page
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── terminal/          # Terminal component
│   │   ├── git/               # Git explorer
│   │   ├── claude/            # Claude chat
│   │   ├── layout/            # Layout components
│   │   └── ui/                # Radix UI components
│   ├── lib/                   # Utilities
│   │   ├── websocket.ts       # WebSocket client
│   │   ├── utils.ts           # Helper functions
│   │   └── v0-config.ts       # Configuration
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
├── vercel.json               # Vercel configuration
├── next.config.js            # Next.js configuration
└── package.json
```

## 🔧 Configuration

### Next.js Config

The project uses optimized Next.js configuration:

- **Output**: Standalone (optimized for Vercel)
- **Image Optimization**: AVIF/WebP support
- **Security Headers**: XSS, frame options, CSP
- **Bundle Analyzer**: Available with `ANALYZE=true`

### Vercel Deployment

Configured for optimal Vercel deployment:

- Region: `iad1` (US East)
- Function Timeout: 30s
- Environment: Production-ready
- Analytics: Integrated

## 🧪 Testing

### Unit & Integration Tests

```bash
npm test                 # Run Jest tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### E2E Tests with Playwright

```bash
npm run test:e2e         # Run all E2E tests
npm run test:e2e:ui      # Interactive UI mode
npm run test:e2e:headed  # Headed browser mode
```

E2E tests cover:
- Homepage navigation
- Terminal functionality
- API endpoint behavior
- Rate limiting
- Responsive design

## 📚 API Reference

### Claude Chat API

```typescript
POST /api/claude/chat
{
  "message": "Your question here",
  "sessionId": "session-id",
  "model": "claude-sonnet-4"
}

Response:
{
  "response": "Claude's response",
  "model": "claude-sonnet-4",
  "usage": { "input_tokens": 10, "output_tokens": 50 }
}
```

### Terminal Execute API

```typescript
POST /api/terminal/execute
{
  "command": "ls -la"
}

Response:
{
  "stdout": "...",
  "stderr": "",
  "exitCode": 0
}
```

### Git Status API

```typescript
GET /api/git/status

Response:
{
  "status": {
    "branch": "main",
    "ahead": 0,
    "behind": 0,
    "changes": [
      {
        "path": "src/app/page.tsx",
        "status": "modified",
        "staged": false
      }
    ]
  }
}
```

### Projects Discovery API

```typescript
GET /api/projects/discover

Response:
{
  "projects": [
    {
      "id": "project-1",
      "name": "my-project",
      "path": "/path/to/project",
      "lastModified": "2025-01-01T00:00:00.000Z",
      "type": "claude"
    }
  ],
  "count": 1
}
```

## 🔒 Security

### Rate Limiting

All API endpoints have intelligent rate limiting:

- **Claude Chat**: 20 requests/minute per IP
- **Terminal Execute**: 30 requests/minute per IP
- **Script Execution**: 10 requests/minute per IP (stricter due to security)
- **WebSocket**: 100 connections/minute per IP

Rate limits include proper HTTP headers (`X-RateLimit-*`) and return `429 Too Many Requests` when exceeded.

### API Key Authentication

Optional API key authentication for enhanced security:

```bash
# Set in .env.local
API_KEY=your-secret-key-here
REQUIRE_AUTH=true                    # Require for WebSocket connections
REQUIRE_SCRIPT_AUTH=true             # Require for script execution
```

Clients must provide the key via `X-API-Key` header:

```bash
curl -H "X-API-Key: your-secret-key" http://localhost:3000/api/scripts/run
```

### Security Headers

Automatic security headers on all routes:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Input Validation

- Command whitelist for `/api/terminal/execute` endpoint
- Script language validation
- Environment variable protection
- Path traversal prevention

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Docker

```bash
# Build Docker image
docker build -t claude-code-ui .

# Run container
docker run -p 3000:3000 claude-code-ui
```

### Manual

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [siteboon/claudecodeui](https://github.com/siteboon/claudecodeui)
- Built with [Next.js](https://nextjs.org/)
- Powered by [Anthropic Claude](https://www.anthropic.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Terminal by [xterm.js](https://xtermjs.org/)

## 📞 Support

- GitHub Issues: [Report a bug](https://github.com/yourusername/vercel-claude-code-ui/issues)
- Email: your.email@example.com
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

## 🗺️ Roadmap

- [ ] WebSocket server for real-time terminal
- [ ] Multi-user support with authentication
- [ ] Plugin system for extensions
- [ ] Mobile app (React Native)
- [ ] VS Code extension
- [ ] Cursor CLI integration
- [ ] Claude Code CLI integration
- [ ] Docker compose setup
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline examples

---

**Made with ❤️ by [Your Name](https://github.com/yourusername)**

**⭐ Star this repository if you find it helpful!**
