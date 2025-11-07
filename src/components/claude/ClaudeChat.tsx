'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Send,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Settings,
  Code,
  Zap,
  Download,
  Upload,
  Play,
  Square,
  Loader2
} from 'lucide-react'
import { ClaudeSession, ClaudeMessage } from '@/lib/v0-config'

interface ClaudeChatProps {
  session: ClaudeSession
  onSessionUpdate?: (session: ClaudeSession) => void
}

export function ClaudeChat({ session, onSessionUpdate }: ClaudeChatProps) {
  const [messages, setMessages] = useState<ClaudeMessage[]>(session.messages || [])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(session.messages || [])
  }, [session])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ClaudeMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Add user message to session
      await fetch(`/api/sessions/${session.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'user',
          content: inputMessage,
        }),
      })

      // Simulate Claude API response with enhanced capabilities
      await new Promise(resolve => setTimeout(resolve, 2000))

      const assistantMessage: ClaudeMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateEnhancedResponse(inputMessage),
        timestamp: new Date(),
        metadata: {
          tokens: Math.floor(Math.random() * 1000) + 500,
          model: session.settings.model,
          tools: ['fd', 'ripgrep', 'ast-grep', 'jq', 'yq']
        }
      }

      setMessages(prev => [...prev, assistantMessage])

      // Add assistant message to session
      await fetch(`/api/sessions/${session.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'assistant',
          content: assistantMessage.content,
          metadata: assistantMessage.metadata,
        }),
      })

    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: ClaudeMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateEnhancedResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes('v0') || input.includes('generate') || input.includes('component')) {
      return `I can help you generate components using v0! Here's what I can do:

🚀 **v0 Integration Features:**
- Generate React components with Tailwind CSS
- Create full pages and layouts
- Deploy directly to Vercel
- Integrate with your existing codebase

\`\`\`typescript
// Example: Generate a modern card component
const request = {
  prompt: "Create a modern card component with hover effects",
  framework: "react",
  style: "tailwind"
}

// I can call v0 API to generate this for you
\`\`\`

Would you like me to:
1. Generate a specific component?
2. Create a full page layout?
3. Deploy your project to Vercel?
4. Integrate with your existing codebase?

Just describe what you need and I'll use v0 to create it!`
    }

    if (input.includes('file') || input.includes('fd')) {
      return `I can help you with advanced file operations using fd! Here's what I can do:

📁 **File Discovery with fd:**
\`\`\`bash
# Find all TypeScript files in your project
fd --type f --extension ts --extension tsx

# Find components by pattern
fd "component" src/components --type f

# Get file statistics
fd . src --type f | wc -l
\`\`\`

🔍 **Advanced fd Patterns:**
- Case-insensitive search: \`fd -i "component"\`
- Exclude directories: \`fd --exclude node_modules\`
- Find by modification time: \`fd --changed-within 1day\`

I can analyze your project structure and help you find exactly what you need!`
    }

    if (input.includes('search') || input.includes('grep') || input.includes('ripgrep')) {
      return `ripgrep is perfect for powerful code searching! Here are advanced patterns:

🔍 **Advanced ripgrep Commands:**
\`\`\`bash
# Search for React hooks with context
rg "use[A-Z][a-zA-Z]*" --glob "*.{ts,tsx}" -A 2 -B 2

# Find function definitions
rg "^(export )?function|^(export )?const.*=" --glob "*.{ts,tsx}"

# Search with file type filtering
rg "import.*from" --type ts --type tsx
\`\`\`

🎯 **Smart Search Patterns:**
- Multi-line patterns: \`rg -U "function.*\\{[\\s\\S]*?\\}"\`
- Exclude test files: \`rg "pattern" --glob "!*.test.*"\`
- Search in specific directories: \`rg "pattern" src/components\`

I can help you find complex patterns across your entire codebase!`
    }

    if (input.includes('ast') || input.includes('ast-grep')) {
      return `AST analysis is incredibly powerful for understanding code structure! Here's how I can help:

🌳 **AST-Grep for Code Analysis:**
\`\`\`bash
# Find all React components
ast-grep --lang typescript --pattern 'const $NAME = () => { $$$BODY }'

# Find useEffect hooks
ast-grep --lang typescript --pattern 'useEffect($$$ARGS, $$$DEPS)'

# Find function calls with specific patterns
ast-grep --lang typescript --pattern '$FUNC($$$ARGS)'
\`\`\`

🔧 **Advanced AST Patterns:**
- Find components with props: \`ast-grep --pattern 'const $NAME = ({ $$$PROPS }) =>'\`
- Find async functions: \`ast-grep --pattern 'async function $NAME'\`
- Find imports: \`ast-grep --pattern 'import $$$ from "$MODULE"'\`

I can analyze your code structure and help with refactoring!`
    }

    if (input.includes('json') || input.includes('jq')) {
      return `jq is excellent for JSON processing and API data! Here's what I can do:

📄 **JSON Processing with jq:**
\`\`\`bash
# Extract package.json dependencies
jq '.dependencies | keys[]' package.json

# Count dependencies
jq '.dependencies | length' package.json

# Transform API responses
jq '{name: .name, version: .version, deps: (.dependencies | length)}' package.json
\`\`\`

🔄 **Advanced jq Operations:**
- Filter arrays: \`jq '.items[] | select(.status == "active")'\`
- Group data: \`jq 'group_by(.category) | map({category: .[0].category, count: length})'\`
- Stream processing: \`jq --stream 'select(.[0][-1] == "name")'\`

I can help you process any JSON data efficiently!`
    }

    if (input.includes('yaml') || input.includes('yq')) {
      return `yq handles YAML files beautifully! Here's how I can help:

📋 **YAML Processing with yq:**
\`\`\`bash
# Extract configuration values
yq '.features[]' config.yaml

# Get enabled integrations
yq '.integrations | to_entries[] | select(.value == true) | .key' config.yaml

# Convert YAML to JSON
yq -o=json . config.yaml
\`\`\`

⚙️ **Configuration Management:**
- Update values: \`yq '.version = "2.0.0"' config.yaml\`
- Merge configurations: \`yq '. * load("override.yaml")' config.yaml\`
- Validate schemas: \`yq 'select(has("required_fields"))' config.yaml\`

I can help you manage complex YAML configurations!`
    }

    return `Hello! I'm Claude, your advanced AI coding assistant with powerful development tools integration! 🚀

**My Capabilities:**
🔧 **File Operations**: fd for lightning-fast file discovery
🔍 **Code Search**: ripgrep for advanced text search patterns  
🌳 **AST Analysis**: ast-grep for structural code understanding
📄 **JSON Processing**: jq for data manipulation and API responses
📋 **YAML Management**: yq for configuration files
🎨 **v0 Integration**: Generate and deploy components with Vercel

**What I can help you with:**
- Analyze your codebase structure
- Generate React components with v0
- Search and refactor code
- Process configuration files
- Deploy projects to Vercel
- Debug and optimize code
- Set up development workflows

**Try asking me:**
- "Generate a modern dashboard component with v0"
- "Find all React hooks in my codebase"
- "Analyze the structure of my components"
- "Process my package.json dependencies"
- "Deploy this project to Vercel"

What would you like to work on today? 🎯`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const clearChat = async () => {
    try {
      await fetch(`/api/sessions/${session.id}/messages`, {
        method: 'DELETE',
      })
      setMessages([])
    } catch (error) {
      console.error('Failed to clear chat:', error)
    }
  }

  const generateWithV0 = async () => {
    if (!inputMessage.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/v0/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputMessage,
          context: `Session: ${session.name}\nMessages: ${messages.length}`,
          framework: 'react',
          style: 'tailwind',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const v0Message: ClaudeMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `🎨 **Generated with v0!**\n\n\`\`\`tsx\n${data.result.code}\n\`\`\`\n\n**Components:** ${data.result.components.length}\n**Dependencies:** ${data.result.dependencies.join(', ')}`,
          timestamp: new Date(),
          metadata: {
            tokens: 0,
            model: 'v0-generator',
            tools: ['v0']
          }
        }
        setMessages(prev => [...prev, v0Message])
        setInputMessage('')
      }
    } catch (error) {
      console.error('Failed to generate with v0:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{session.name}</h2>
          <p className="text-muted-foreground">
            {session.description || 'Claude AI Coding Assistant'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>{session.settings.model}</span>
          </Badge>
          <Button variant="outline" size="sm" onClick={clearChat}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1">
        <CardContent className="p-0">
          <ScrollArea className="h-96 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-3xl p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                          {message.role === 'user' ? 'You' : 'Claude'}
                        </span>
                        {message.metadata?.tools && (
                          <Badge variant="outline" className="text-xs">
                            {message.metadata.tools.join(', ')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {message.role === 'assistant' && (
                          <>
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      {message.content.split('```').map((part, index) => {
                        if (index % 2 === 1) {
                          const [language, ...code] = part.split('\n')
                          return (
                            <pre key={index} className="bg-background p-3 rounded text-sm overflow-x-auto border">
                              <code className={`language-${language || 'bash'}`}>{code.join('\n')}</code>
                            </pre>
                          )
                        }
                        return <p key={index} className="whitespace-pre-wrap">{part}</p>
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.metadata?.tokens && (
                        <span>{message.metadata.tokens} tokens</span>
                      )}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground animate-pulse" />
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Claude is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Input Area */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-3">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Textarea
                  placeholder="Ask me anything about development, code generation, or use v0 to create components..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading || isGenerating}
                  className="min-h-[80px] resize-none"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading || isGenerating}
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={generateWithV0}
                  disabled={!inputMessage.trim() || isLoading || isGenerating}
                  variant="outline"
                  size="sm"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Try: "Generate a card component with v0" or "Find all React hooks"</span>
              <span>Enter to send • Shift+Enter for new line</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
