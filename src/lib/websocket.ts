// WebSocket client for real-time communication
export class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private reconnectDelay = 1000
  private maxReconnectDelay = 30000
  private listeners: Map<string, Set<Function>> = new Map()

  constructor(private url: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.reconnectDelay = 1000
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.emit(data.type, data.payload)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('WebSocket disconnected')
          this.scheduleReconnect()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return

    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect WebSocket...')
      this.reconnectTimer = null
      this.connect().catch(() => {
        this.reconnectDelay = Math.min(
          this.reconnectDelay * 2,
          this.maxReconnectDelay
        )
      })
    }, this.reconnectDelay)
  }

  send(type: string, payload?: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)?.add(callback)
  }

  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback)
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach((callback) => {
      try {
        callback(data)
      } catch (error) {
        console.error('Error in WebSocket event handler:', error)
      }
    })
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}

// Singleton instance
let wsClient: WebSocketClient | null = null

export function getWebSocketClient(url?: string): WebSocketClient {
  if (!wsClient && url) {
    wsClient = new WebSocketClient(url)
  }
  return wsClient as WebSocketClient
}
