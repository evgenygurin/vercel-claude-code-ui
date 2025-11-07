const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')
const { spawn } = require('child_process')
const os = require('os')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  const io = new Server(server, {
    cors: {
      origin: dev ? '*' : process.env.ALLOWED_ORIGINS?.split(',') || [],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
  })

  // Terminal namespace
  const terminalNamespace = io.of('/terminal')

  // Store active terminal sessions
  const terminals = new Map()

  terminalNamespace.on('connection', (socket) => {
    console.log('Terminal client connected:', socket.id)

    let terminal = null
    let terminalId = null

    // Create new terminal session
    socket.on('create-terminal', (data) => {
      const { shell = process.env.SHELL || '/bin/bash', cwd = process.cwd() } = data || {}

      terminalId = `term-${socket.id}-${Date.now()}`

      try {
        terminal = spawn(shell, [], {
          cwd,
          env: {
            ...process.env,
            TERM: 'xterm-256color',
            COLORTERM: 'truecolor',
            FORCE_COLOR: '3',
          },
          stdio: ['pipe', 'pipe', 'pipe'],
          detached: false,
        })

        terminals.set(terminalId, terminal)

        terminal.stdout.on('data', (data) => {
          socket.emit('terminal-output', data.toString('utf-8'))
        })

        terminal.stderr.on('data', (data) => {
          socket.emit('terminal-output', data.toString('utf-8'))
        })

        terminal.on('exit', (code) => {
          socket.emit('terminal-exit', { code })
          terminals.delete(terminalId)
          terminal = null
        })

        socket.emit('terminal-created', {
          terminalId,
          shell,
          cwd,
          platform: os.platform(),
          arch: os.arch(),
        })
      } catch (error) {
        console.error('Failed to create terminal:', error)
        socket.emit('terminal-error', { message: error.message })
      }
    })

    // Handle terminal input
    socket.on('terminal-input', (data) => {
      if (terminal && !terminal.killed) {
        terminal.stdin.write(data)
      }
    })

    // Handle terminal resize
    socket.on('terminal-resize', ({ cols, rows }) => {
      // Note: resize not supported without PTY, but we acknowledge the event
      if (terminal && !terminal.killed) {
        socket.emit('terminal-resized', { cols, rows })
      }
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Terminal client disconnected:', socket.id)
      if (terminal && !terminal.killed) {
        terminal.kill()
      }
      if (terminalId) {
        terminals.delete(terminalId)
      }
    })

    // Handle terminal kill request
    socket.on('kill-terminal', () => {
      if (terminal && !terminal.killed) {
        terminal.kill()
        terminals.delete(terminalId)
        socket.emit('terminal-killed', { terminalId })
      }
    })
  })

  // Rate limiting middleware
  const rateLimit = new Map()
  const RATE_LIMIT_WINDOW = 60000 // 1 minute
  const RATE_LIMIT_MAX = 100 // 100 requests per minute

  io.use((socket, next) => {
    const ip = socket.handshake.address
    const now = Date.now()
    const clientData = rateLimit.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW }

    if (now > clientData.resetTime) {
      clientData.count = 0
      clientData.resetTime = now + RATE_LIMIT_WINDOW
    }

    clientData.count++
    rateLimit.set(ip, clientData)

    if (clientData.count > RATE_LIMIT_MAX) {
      return next(new Error('Rate limit exceeded'))
    }

    next()
  })

  // Authentication middleware (if API key is required)
  if (process.env.REQUIRE_AUTH === 'true') {
    io.use((socket, next) => {
      const token = socket.handshake.auth.token
      const apiKey = process.env.API_KEY

      if (!apiKey) {
        console.warn('REQUIRE_AUTH is true but API_KEY is not set')
        return next()
      }

      if (token === apiKey) {
        return next()
      }

      return next(new Error('Authentication failed'))
    })
  }

  server
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
      console.log(`> WebSocket server running on ws://${hostname}:${port}`)
    })

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server')
    server.close(() => {
      console.log('HTTP server closed')
      terminals.forEach((term) => {
        if (!term.killed) {
          term.kill()
        }
      })
      process.exit(0)
    })
  })
})
