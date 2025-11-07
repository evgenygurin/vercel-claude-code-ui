import { useState, useCallback } from 'react'

interface ExecuteResult {
  stdout: string
  stderr: string
  exitCode: number
}

export function useTerminalExecute() {
  const [executing, setExecuting] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const execute = useCallback(async (command: string): Promise<ExecuteResult> => {
    setExecuting(true)
    setHistory((prev) => [...prev, command])

    try {
      const response = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute command')
      }

      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        stdout: '',
        stderr: errorMessage,
        exitCode: 1,
      }
    } finally {
      setExecuting(false)
    }
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return {
    execute,
    executing,
    history,
    clearHistory,
  }
}
