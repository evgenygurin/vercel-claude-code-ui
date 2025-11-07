'use client'

import { useEffect, useRef } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'

interface TerminalProps {
  onData?: (data: string) => void
  className?: string
}

export function Terminal({ onData, className = '' }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)

  useEffect(() => {
    if (!terminalRef.current) return

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

    // Add addons
    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    xterm.loadAddon(fitAddon)
    xterm.loadAddon(webLinksAddon)

    // Open terminal
    xterm.open(terminalRef.current)
    fitAddon.fit()

    // Store refs
    xtermRef.current = xterm
    fitAddonRef.current = fitAddon

    // Handle data input
    if (onData) {
      xterm.onData(onData)
    }

    // Handle resize
    const handleResize = () => {
      fitAddon.fit()
    }
    window.addEventListener('resize', handleResize)

    // Welcome message
    xterm.writeln('Welcome to Claude Code UI Terminal')
    xterm.writeln('Type your commands below...')
    xterm.writeln('')

    return () => {
      window.removeEventListener('resize', handleResize)
      xterm.dispose()
    }
  }, [onData])

  // Public methods
  useEffect(() => {
    if (xtermRef.current) {
      // Expose terminal instance for external use
      ;(window as any).__terminal = {
        write: (data: string) => xtermRef.current?.write(data),
        writeln: (data: string) => xtermRef.current?.writeln(data),
        clear: () => xtermRef.current?.clear(),
        fit: () => fitAddonRef.current?.fit(),
      }
    }
  }, [])

  return (
    <div className={`terminal-container h-full w-full ${className}`}>
      <div ref={terminalRef} className="h-full w-full" />
    </div>
  )
}

// Hook for using terminal
export function useTerminal() {
  const write = (data: string) => {
    ;(window as any).__terminal?.write(data)
  }

  const writeln = (data: string) => {
    ;(window as any).__terminal?.writeln(data)
  }

  const clear = () => {
    ;(window as any).__terminal?.clear()
  }

  const fit = () => {
    ;(window as any).__terminal?.fit()
  }

  return { write, writeln, clear, fit }
}
