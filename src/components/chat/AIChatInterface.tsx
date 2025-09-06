'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Send,
  Bot,
  User,
  Code,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Zap,
  RefreshCw,
  Search,
  FileText,
  File
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'code' | 'text'
  language?: string
}

export function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Claude, your AI coding assistant. I\'ve been integrated with advanced development tools including fd, ripgrep, ast-grep, jq, and yq. How can I help you with your project today?',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Simulate Claude API response with tool integration
      await new Promise(resolve => setTimeout(resolve, 2000))

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        type: 'text'
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes('file') || input.includes('fd')) {
      return `I can help you with file operations! Here's what I can do with the fd tool:

\`\`\`bash
# Find all TypeScript files
fd --type f --extension ts --extension tsx

# Find files by pattern
fd "component" src/components

# Get file count
fd . src --type f | wc -l
\`\`\`

The fd tool is incredibly fast for file discovery and pattern matching. Would you like me to show you more advanced fd commands?`
    }

    if (input.includes('search') || input.includes('grep') || input.includes('ripgrep')) {
      return `Excellent choice! ripgrep is perfect for code searching. Here are some powerful commands:

\`\`\`bash
# Search for React imports
rg "import.*React" --glob "*.{ts,tsx}"

# Find function definitions
rg "function|const.*=" --glob "*.{ts,tsx}"

# Search with context
rg "useState" --glob "*.{ts,tsx}" -A 2 -B 2
\`\`\`

ripgrep uses advanced regex patterns and is much faster than traditional grep for codebases.`
    }

    if (input.includes('ast') || input.includes('ast-grep')) {
      return `AST analysis is powerful for structural code understanding! Here's how ast-grep works:

\`\`\`bash
# Find all function declarations
ast-grep --lang typescript --pattern 'function $NAME($$$ARGS) { $$$BODY }'

# Search for React components
ast-grep --lang typescript --pattern 'const $NAME = () =>'

# Find specific patterns
ast-grep --lang typescript --pattern 'useEffect($$$)'
\`\`\`

This tool understands code structure, not just text patterns. Perfect for refactoring and analysis!`
    }

    if (input.includes('json') || input.includes('jq')) {
      return `jq is excellent for JSON processing! Here are some useful commands:

\`\`\`bash
# Extract dependencies count
jq '.dependencies | length' package.json

# Get all dependency names
jq '.dependencies | keys[]' package.json

# Complex transformations
jq '{name: .name, version: .version, deps: (.dependencies | length)}' package.json
\`\`\`

jq supports streaming, complex queries, and is perfect for API data processing.`
    }

    if (input.includes('yaml') || input.includes('yq')) {
      return `yq handles YAML files beautifully! Check these commands:

\`\`\`bash
# Extract features
yq '.features[]' config.yaml

# Get integrations
yq '.integrations | to_entries[] | select(.value == true) | .key' config.yaml

# Convert YAML to JSON
yq -o=json . config.yaml
\`\`\`

yq is perfect for configuration management and YAML processing in CI/CD pipelines.`
    }

    return `I see you're interested in development tools! I have extensive knowledge of:

🔧 **File Operations**: fd for fast file discovery
🔍 **Code Search**: ripgrep for advanced text search  
🌳 **AST Analysis**: ast-grep for structural code understanding
📄 **JSON Processing**: jq for data manipulation
📋 **YAML Management**: yq for configuration files

What specific task would you like help with? I can:
- Analyze your codebase
- Generate code snippets
- Explain tool usage
- Help with integrations
- Provide best practices

Just let me know what you'd like to work on! 🚀`
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Chat</h2>
          <p className="text-muted-foreground">
            Powered by Claude with advanced development tools integration
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>Claude Integration</span>
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>Claude Assistant</span>
          </CardTitle>
          <CardDescription>
            Advanced AI with fd, ripgrep, ast-grep, jq, yq integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 pr-4">
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
                    className={`max-w-lg p-3 rounded-lg ${
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
                            <pre key={index} className="bg-background p-2 rounded text-sm overflow-x-auto">
                              <code>{code.join('\n')}</code>
                            </pre>
                          )
                        }
                        return <p key={index} className="whitespace-pre-wrap">{part}</p>
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleTimeString()}
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
                  <div className="bg-muted p-3 rounded-lg">
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
        <CardContent className="pt-6">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Ask me anything about development tools, code analysis, or get help with your project..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="min-h-[44px]"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="lg"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Try asking about: fd, ripgrep, ast-grep, jq, yq, or code analysis</span>
            <span>Press Enter to send</span>
          </div>
        </CardContent>
      </Card>

      {/* Tool Integration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Integrated Development Tools</CardTitle>
          <CardDescription>
            Claude has access to powerful development tools for code analysis and project management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <Code className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium">fd</div>
                <div className="text-sm text-muted-foreground">File discovery</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <Search className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">ripgrep</div>
                <div className="text-sm text-muted-foreground">Code search</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <Bot className="h-5 w-5 text-purple-500" />
              <div>
                <div className="font-medium">ast-grep</div>
                <div className="text-sm text-muted-foreground">AST analysis</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <Code className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="font-medium">jq</div>
                <div className="text-sm text-muted-foreground">JSON processing</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <FileText className="h-5 w-5 text-red-500" />
              <div>
                <div className="font-medium">yq</div>
                <div className="text-sm text-muted-foreground">YAML management</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <Zap className="h-5 w-5 text-orange-500" />
              <div>
                <div className="font-medium">Multi-tool</div>
                <div className="text-sm text-muted-foreground">Orchestration</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
