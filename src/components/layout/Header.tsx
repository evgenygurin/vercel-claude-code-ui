'use client'

import { Menu, Search, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">
            Claude Code UI
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 w-64"
            />
          </div>

          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
