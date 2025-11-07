'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Terminal as TerminalIcon, Play, Trash2, Download } from 'lucide-react'

// Dynamic import to avoid SSR issues with xterm
const Terminal = dynamic(
  () => import('@/components/terminal/Terminal').then((mod) => mod.Terminal),
  { ssr: false, loading: () => <div className="h-full w-full flex items-center justify-center">Loading terminal...</div> }
)

export default function TerminalPage() {
  const [output, setOutput] = useState<string[]>([])

  const handleData = useCallback((data: string) => {
    // Handle terminal input
    console.log('Terminal input:', data)
    setOutput((prev) => [...prev, data])
  }, [])

  const clearTerminal = () => {
    ;(window as any).__terminal?.clear()
    setOutput([])
  }

  const downloadLog = () => {
    const log = output.join('\n')
    const blob = new Blob([log], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `terminal-log-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TerminalIcon className="h-8 w-8" />
              Terminal
            </h1>
            <p className="text-muted-foreground mt-1">
              Interactive terminal for running commands and scripts
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearTerminal}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button variant="outline" size="sm" onClick={downloadLog}>
              <Download className="h-4 w-4 mr-2" />
              Download Log
            </Button>
          </div>
        </div>

        {/* Terminal Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Claude Code Terminal</CardTitle>
            <CardDescription>
              Run commands directly in your project environment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] rounded-lg overflow-hidden border border-border bg-black">
              <Terminal onData={handleData} />
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center gap-2">
                  <Play className="h-3 w-3" />
                  <code>npm run dev</code>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="h-3 w-3" />
                  <code>npm run build</code>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="h-3 w-3" />
                  <code>git status</code>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="h-3 w-3" />
                  <code>vercel deploy</code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Keyboard Shortcuts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Clear terminal</span>
                  <kbd className="px-2 py-1 bg-muted rounded">Ctrl+L</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interrupt</span>
                  <kbd className="px-2 py-1 bg-muted rounded">Ctrl+C</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Search history</span>
                  <kbd className="px-2 py-1 bg-muted rounded">Ctrl+R</kbd>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
