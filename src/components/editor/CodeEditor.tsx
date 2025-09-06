'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Play,
  Save,
  Copy,
  Download,
  Upload,
  Settings,
  Code,
  FileText,
  Terminal,
  Zap,
  RefreshCw
} from 'lucide-react'

interface CodeFile {
  name: string
  content: string
  language: string
  path: string
}

export function CodeEditor() {
  const [currentFile, setCurrentFile] = useState<CodeFile>({
    name: 'example.ts',
    content: `// Welcome to Claude Code UI Editor
// This editor supports syntax highlighting and AI-powered features

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

class UserService {
  private users: User[] = []

  async getUsers(): Promise<User[]> {
    // Simulate API call
    return this.users
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: Date.now()
    }
    this.users.push(newUser)
    return newUser
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(u => u.id === id)
    if (userIndex === -1) return null

    this.users[userIndex] = { ...this.users[userIndex], ...updates }
    return this.users[userIndex]
  }
}

// Example usage
const userService = new UserService()

// Async function with error handling
async function main() {
  try {
    const users = await userService.getUsers()
    console.log('Users:', users)

    const newUser = await userService.createUser({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    })
    console.log('Created user:', newUser)
  } catch (error) {
    console.error('Error:', error)
  }
}

main()`,
    language: 'typescript',
    path: '/src/example.ts'
  })

  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const languages = [
    { value: 'typescript', label: 'TypeScript', extension: 'ts' },
    { value: 'javascript', label: 'JavaScript', extension: 'js' },
    { value: 'python', label: 'Python', extension: 'py' },
    { value: 'java', label: 'Java', extension: 'java' },
    { value: 'cpp', label: 'C++', extension: 'cpp' },
    { value: 'go', label: 'Go', extension: 'go' },
    { value: 'rust', label: 'Rust', extension: 'rs' },
    { value: 'json', label: 'JSON', extension: 'json' },
    { value: 'yaml', label: 'YAML', extension: 'yaml' },
    { value: 'markdown', label: 'Markdown', extension: 'md' }
  ]

  const sampleFiles = [
    {
      name: 'utils.ts',
      content: `import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}`,
      language: 'typescript',
      path: '/src/lib/utils.ts'
    },
    {
      name: 'config.yaml',
      content: `project:
  name: "Claude Code UI"
  version: "1.0.0"
  description: "Modern Vercel-powered development platform"

features:
  - ai_integration: true
  - real_time_chat: true
  - file_management: true
  - code_generation: true

integrations:
  github: true
  slack: true
  vercel: true

components:
  ui_library: "shadcn/ui"
  icons: "lucide-react"
  animations: "framer-motion"`,
      language: 'yaml',
      path: '/config.yaml'
    },
    {
      name: 'package.json',
      content: `{
  "name": "vercel-claude-code-ui",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.50.0",
    "eslint-config-next": "14.0.4"
  }
}`,
      language: 'json',
      path: '/package.json'
    }
  ]

  const handleRunCode = async () => {
    setIsRunning(true)
    setOutput('')

    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 2000))

      let executionResult = ''

      switch (currentFile.language) {
        case 'typescript':
        case 'javascript':
          executionResult = `✅ Code compiled successfully!\n\nOutput:\n${currentFile.content.includes('console.log') ? 'Hello from TypeScript/JavaScript!' : 'No console output detected'}\n\nExecution time: 1.2s`
          break
        case 'python':
          executionResult = `✅ Python script executed!\n\nOutput:\nprint("Hello from Python!")\n\nExecution time: 0.8s`
          break
        case 'json':
          executionResult = `✅ JSON validated!\n\nValid JSON structure detected\nSize: ${currentFile.content.length} characters`
          break
        case 'yaml':
          executionResult = `✅ YAML validated!\n\nValid YAML structure detected\nParsed successfully`
          break
        default:
          executionResult = `✅ File processed!\n\nLanguage: ${currentFile.language}\nSize: ${currentFile.content.length} characters`
      }

      setOutput(executionResult)
    } catch (error) {
      setOutput(`❌ Execution failed:\n${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSaveFile = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = currentFile.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadSampleFile = (file: CodeFile) => {
    setCurrentFile(file)
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      typescript: 'bg-blue-500',
      javascript: 'bg-yellow-500',
      python: 'bg-green-500',
      json: 'bg-purple-500',
      yaml: 'bg-orange-500',
      markdown: 'bg-gray-500'
    }
    return colors[language] || 'bg-gray-400'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Code Editor</h2>
          <p className="text-muted-foreground">
            Advanced code editing with syntax highlighting and AI integration
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`${getLanguageColor(currentFile.language)} text-white`}>
            {currentFile.language.toUpperCase()}
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* File Explorer */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Files</CardTitle>
            <CardDescription>Sample files to explore</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {sampleFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded cursor-pointer hover:bg-accent transition-colors ${
                      currentFile.name === file.name ? 'bg-accent border border-primary' : ''
                    }`}
                    onClick={() => loadSampleFile(file)}
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Editor */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CardTitle className="text-lg">{currentFile.name}</CardTitle>
                <select
                  value={currentFile.language}
                  onChange={(e) => setCurrentFile(prev => ({ ...prev, language: e.target.value }))}
                  className="px-2 py-1 text-sm border rounded bg-background"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleSaveFile}>
                  <Download className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" onClick={handleRunCode} disabled={isRunning}>
                  {isRunning ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isRunning ? 'Running...' : 'Run'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={currentFile.content}
                onChange={(e) => setCurrentFile(prev => ({ ...prev, content: e.target.value }))}
                className="w-full h-96 p-4 font-mono text-sm bg-muted border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your code here..."
                spellCheck={false}
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(currentFile.content)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Output Terminal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Terminal className="h-5 w-5" />
            <span>Output</span>
          </CardTitle>
          <CardDescription>
            Code execution results and terminal output
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-32">
            <pre className="font-mono text-sm bg-muted p-4 rounded whitespace-pre-wrap">
              {output || 'Run your code to see output here...'}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* AI Integration Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>AI-Powered Features</span>
          </CardTitle>
          <CardDescription>
            Enhanced code editing with Claude integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Code Completion</h4>
              <p className="text-sm text-muted-foreground">
                AI-powered autocompletion for faster coding
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Error Detection</h4>
              <p className="text-sm text-muted-foreground">
                Real-time error detection and suggestions
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="text-sm text-muted-foreground">
                AST-based code analysis and optimization
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tool Commands */}
      <Card>
        <CardHeader>
          <CardTitle>Development Tools Integration</CardTitle>
          <CardDescription>
            Commands used for code analysis and processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            <div className="bg-muted p-2 rounded">
              ast-grep --lang typescript --pattern 'function $NAME'
            </div>
            <div className="bg-muted p-2 rounded">
              rg "console.log" --glob "*.ts"
            </div>
            <div className="bg-muted p-2 rounded">
              rg "console.log" --glob "*.tsx"
            </div>
            <div className="bg-muted p-2 rounded">
              jq '.dependencies | keys[]' package.json
            </div>
            <div className="bg-muted p-2 rounded">
              yq '.features[]' config.yaml
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
