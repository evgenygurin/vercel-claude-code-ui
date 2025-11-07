'use client'

import { useEffect, useRef, useState } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { io, Socket } from 'socket.io-client'
import '@xterm/xterm/css/xterm.css'

interface TerminalProps {
  onData?: (data: string) => void
  className?: string
}

export function Terminal({ onData, className = '' }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return

    // Initialize terminal
    const xterm = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#d4d4d4',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5',
      },
      allowProposedApi: true,
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    xterm.loadAddon(fitAddon)
    xterm.loadAddon(webLinksAddon)

    xterm.open(terminalRef.current)
    fitAddon.fit()

    xtermRef.current = xterm
    fitAddonRef.current = fitAddon

    xterm.writeln('\x1b[1;34mClaude Code UI Terminal\x1b[0m')
    xterm.writeln('Connecting to terminal server...')
    xterm.writeln('')

    // Connect to WebSocket server
    const socket = io('/terminal', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 10000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
      setError(null)
      xterm.writeln('\x1b[32m✓ Connected to terminal server\x1b[0m')

      // Create terminal session
      socket.emit('create-terminal', {
        cols: xterm.cols,
        rows: xterm.rows,
        shell: process.env.SHELL || '/bin/bash',
        cwd: process.cwd?.() || process.env.HOME || '/tmp',
      })
    })

    socket.on('disconnect', (reason) => {
      setIsConnected(false)
      xterm.writeln(`\r\n\x1b[31m✗ Disconnected: ${reason}\x1b[0m`)
      xterm.writeln('\x1b[33m⟳ Reconnecting...\x1b[0m')
    })

    socket.on('connect_error', (err) => {
      setError(err.message)
      xterm.writeln(`\r\n\x1b[31m✗ Connection error: ${err.message}\x1b[0m`)
    })

    socket.on('terminal-created', (data) => {
      xterm.writeln(`\x1b[36mShell:\x1b[0m ${data.shell}`)
      xterm.writeln(`\x1b[36mCWD:\x1b[0m ${data.cwd}`)
      xterm.writeln(`\x1b[36mPlatform:\x1b[0m ${data.platform} (${data.arch})`)
      xterm.writeln('')
    })

    socket.on('terminal-output', (data) => {
      xterm.write(data)
    })

    socket.on('terminal-exit', ({ code }) => {
      xterm.writeln(`\r\n\x1b[33m⚠ Terminal exited with code ${code}\x1b[0m`)
      xterm.writeln('\x1b[33mReconnect to start a new session\x1b[0m')
    })

    socket.on('terminal-error', ({ message }) => {
      xterm.writeln(`\r\n\x1b[31m✗ Error: ${message}\x1b[0m`)
      setError(message)
    })

    socket.on('terminal-resized', ({ cols, rows }) => {
      // Acknowledge resize (actual resize not supported without PTY)
      console.log(`Terminal resized: ${cols}x${rows}`)
    })

    // Send input to server
    xterm.onData((data) => {
      if (socket.connected) {
        socket.emit('terminal-input', data)
      }
      if (onData) {
        onData(data)
      }
    })

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit()
      if (socket.connected) {
        socket.emit('terminal-resize', {
          cols: xterm.cols,
          rows: xterm.rows,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    // Expose terminal API
    ;(window as any).__terminal = {
      write: (data: string) => xterm.write(data),
      writeln: (data: string) => xterm.writeln(data),
      clear: () => xterm.clear(),
      fit: () => fitAddon.fit(),
      connected: () => socket.connected,
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      if (socket.connected) {
        socket.emit('kill-terminal')
        socket.disconnect()
      }
      xterm.dispose()
      xtermRef.current = null
      fitAddonRef.current = null
      socketRef.current = null
    }
  }, [onData])

  return (
    <div className={`terminal-container relative h-full w-full ${className}`}>
      <div className="absolute left-4 top-2 z-10 flex items-center gap-2 rounded-md bg-gray-800/80 px-3 py-1.5 text-xs backdrop-blur-sm">
        <div
          className={`h-2 w-2 rounded-full transition-colors ${
            isConnected ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'
          } shadow-lg`}
        />
        <span className="text-gray-300">
          {isConnected ? 'Connected' : error ? `Error: ${error}` : 'Connecting...'}
        </span>
      </div>
      <div ref={terminalRef} className="h-full w-full pt-10" />
    </div>
  )
}

// Hook for using terminal
export function useTerminal() {
  const api = (window as any).__terminal

  return {
    write: (data: string) => api?.write(data),
    writeln: (data: string) => api?.writeln(data),
    clear: () => api?.clear(),
    fit: () => api?.fit(),
    connected: () => api?.connected() ?? false,
  }
}
