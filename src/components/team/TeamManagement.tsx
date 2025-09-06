'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Settings,
  MoreVertical,
  Search,
  Filter,
  Crown,
  Star,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'developer' | 'viewer'
  avatar?: string
  status: 'active' | 'inactive' | 'pending'
  joinedAt: Date
  lastActive: Date
  projects: number
  contributions: number
}

export function TeamManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'owner',
      status: 'active',
      joinedAt: new Date('2024-01-15'),
      lastActive: new Date(),
      projects: 12,
      contributions: 847
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'admin',
      status: 'active',
      joinedAt: new Date('2024-02-01'),
      lastActive: new Date(Date.now() - 1000 * 60 * 30),
      projects: 8,
      contributions: 623
    },
    {
      id: '3',
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      role: 'developer',
      status: 'active',
      joinedAt: new Date('2024-02-15'),
      lastActive: new Date(Date.now() - 1000 * 60 * 60),
      projects: 6,
      contributions: 456
    },
    {
      id: '4',
      name: 'Diana Prince',
      email: 'diana@example.com',
      role: 'developer',
      status: 'inactive',
      joinedAt: new Date('2024-03-01'),
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      projects: 4,
      contributions: 234
    },
    {
      id: '5',
      name: 'Eve Wilson',
      email: 'eve@example.com',
      role: 'viewer',
      status: 'pending',
      joinedAt: new Date(),
      lastActive: new Date(),
      projects: 0,
      contributions: 0
    }
  ]

  const pendingInvites = [
    {
      id: 'inv1',
      email: 'frank@example.com',
      role: 'developer',
      invitedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    },
    {
      id: 'inv2',
      email: 'grace@example.com',
      role: 'viewer',
      invitedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6)
    }
  ]

  const getRoleColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-red-100 text-red-800'
      case 'developer': return 'bg-blue-100 text-blue-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'inactive': return 'text-gray-600'
      case 'pending': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'inactive': return <XCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4" />
      case 'admin': return <Shield className="h-4 w-4" />
      case 'developer': return <Star className="h-4 w-4" />
      case 'viewer': return <Users className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === 'all' || member.role === selectedRole
    return matchesSearch && matchesRole
  })

  const activeMembers = teamMembers.filter(m => m.status === 'active').length
  const totalMembers = teamMembers.length
  const pendingMembers = teamMembers.filter(m => m.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Team Management</h2>
          <p className="text-muted-foreground">
            Manage team members, roles, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {activeMembers}/{totalMembers} Active
          </Badge>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalMembers}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{activeMembers}</p>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{pendingMembers + pendingInvites.length}</p>
                <p className="text-sm text-muted-foreground">Pending Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="developer">Developer</option>
              <option value="viewer">Viewer</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage team members and their access permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{member.name}</h3>
                      <Badge className={getRoleColor(member.role)}>
                        {getRoleIcon(member.role)}
                        <span className="ml-1 capitalize">{member.role}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      <span>Joined {member.joinedAt.toLocaleDateString()}</span>
                      <span>Last active {member.lastActive.toLocaleDateString()}</span>
                      <span>{member.projects} projects</span>
                      <span>{member.contributions} contributions</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 ${getStatusColor(member.status)}`}>
                    {getStatusIcon(member.status)}
                    <span className="text-sm capitalize">{member.status}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invites</CardTitle>
            <CardDescription>
              Invitations waiting for acceptance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingInvites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        Invited as {invite.role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Invited {invite.invitedAt.toLocaleDateString()} • Expires {invite.expiresAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Resend Invite
                    </Button>
                    <Button variant="destructive" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Understanding what each role can do in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Crown className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium">Owner</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Full system access</li>
                <li>• Manage billing & subscriptions</li>
                <li>• Delete projects</li>
                <li>• Manage all team members</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="h-5 w-5 text-red-600" />
                <h4 className="font-medium">Admin</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Manage team members</li>
                <li>• Configure integrations</li>
                <li>• Access all projects</li>
                <li>• View analytics</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Star className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">Developer</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create & edit projects</li>
                <li>• Use AI tools</li>
                <li>• Access assigned projects</li>
                <li>• Code generation</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="h-5 w-5 text-gray-600" />
                <h4 className="font-medium">Viewer</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View assigned projects</li>
                <li>• Read-only access</li>
                <li>• View team activity</li>
                <li>• Access documentation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Commands */}
      <Card>
        <CardHeader>
          <CardTitle>Team Management Tools</CardTitle>
          <CardDescription>
            Commands used for team and user management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            <div className="bg-muted p-2 rounded">
              jq '.users[] | select(.role == "admin")' team.json
            </div>
            <div className="bg-muted p-2 rounded">
              yq '.team.members | length' config.yaml
            </div>
            <div className="bg-muted p-2 rounded">
              rg "role.*admin" --glob "*.ts" --count
            </div>
            <div className="bg-muted p-2 rounded">
              rg "role.*admin" --glob "*.tsx" --count
            </div>
            <div className="bg-muted p-2 rounded">
              ast-grep --lang typescript --pattern 'UserPermissions'
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
