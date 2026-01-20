'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Copy, Share2, Trash2, Users } from 'lucide-react'

export interface Collaborator {
  id: string
  email: string
  name: string
  role: 'owner' | 'editor' | 'viewer'
  joinedAt: Date
  avatar?: string
}

interface BlueprintCollaborationProps {
  blueprintId: string
  blueprintName: string
  owner: Collaborator
  collaborators: Collaborator[]
  onAddCollaborator?: (email: string, role: Collaborator['role']) => Promise<void>
  onRemoveCollaborator?: (collaboratorId: string) => Promise<void>
  onChangeRole?: (collaboratorId: string, role: Collaborator['role']) => Promise<void>
}

export function BlueprintCollaboration({
  blueprintId,
  blueprintName,
  owner,
  collaborators,
  onAddCollaborator,
  onRemoveCollaborator,
  onChangeRole,
}: BlueprintCollaborationProps) {
  const [inviteEmail, setInviteEmail] = useState('')
  const [selectedRole, setSelectedRole] = useState<Collaborator['role']>('viewer')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [showShareLink, setShowShareLink] = useState(false)

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/blueprints/${blueprintId}/shared`

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    try {
      await onAddCollaborator?.(inviteEmail, selectedRole)
      setSuccessMessage(`Invited ${inviteEmail} as ${selectedRole}`)
      setInviteEmail('')
      setSelectedRole('viewer')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add collaborator')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    if (!window.confirm('Are you sure you want to remove this collaborator?')) return

    try {
      await onRemoveCollaborator?.(collaboratorId)
      setSuccessMessage('Collaborator removed')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove collaborator')
    }
  }

  const handleChangeRole = async (collaboratorId: string, newRole: Collaborator['role']) => {
    try {
      await onChangeRole?.(collaboratorId, newRole)
      setSuccessMessage('Role updated')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role')
    }
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setSuccessMessage('Share link copied to clipboard')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Share Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Blueprint
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate a shareable link to let others view this blueprint
          </p>

          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="text-sm"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button onClick={copyShareLink} size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              const text = `Check out my blueprint for "${blueprintName}" - ${shareUrl}`
              const encodedText = encodeURIComponent(text)
              window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank')
            }}
            className="w-full"
          >
            Share on Twitter
          </Button>
        </CardContent>
      </Card>

      {/* Collaborators List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Collaborators ({collaborators.length + 1})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Owner */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex-1">
              <p className="font-medium">{owner.name}</p>
              <p className="text-xs text-muted-foreground">{owner.email}</p>
            </div>
            <Badge className="bg-blue-600">Owner</Badge>
          </div>

          {/* Other Collaborators */}
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{collaborator.name}</p>
                <p className="text-xs text-muted-foreground">{collaborator.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={collaborator.role}
                  onChange={(e) =>
                    handleChangeRole(collaborator.id, e.target.value as Collaborator['role'])
                  }
                  className="text-xs border border-border rounded px-2 py-1"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCollaborator(collaborator.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Invite Section */}
      <Card>
        <CardHeader>
          <CardTitle>Invite Collaborators</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCollaborator} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="collaborator@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Collaborator['role'])}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              >
                <option value="viewer">Viewer - Can only view the blueprint</option>
                <option value="editor">Editor - Can edit and modify the blueprint</option>
              </select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Inviting...' : 'Send Invite'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Role Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-muted-foreground">
          <div>
            <strong className="text-foreground">Owner:</strong> Full control, can share and manage collaborators
          </div>
          <div>
            <strong className="text-foreground">Editor:</strong> Can modify the blueprint and save changes
          </div>
          <div>
            <strong className="text-foreground">Viewer:</strong> Can only view and comment on the blueprint
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
