'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, FileUp, Zap } from 'lucide-react'
import { BlueprintGallery, BlueprintGalleryItem } from '@/components/blueprint-gallery'

export interface BlueprintDraft {
  id: string
  name: string
  description: string
  rooms: number
  squareFeet: number
  style: string
  createdAt: Date
  svgData?: string
}

interface BlueprintGeneratorProps {
  onBlueprintGenerated?: (blueprint: BlueprintDraft) => void
}

export function BlueprintGenerator({ onBlueprintGenerated }: BlueprintGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'image'>('description')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [blueprintName, setBlueprintName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [generatedBlueprint, setGeneratedBlueprint] = useState<BlueprintDraft | null>(null)
  const [savedBlueprints, setSavedBlueprints] = useState<BlueprintGalleryItem[]>([])

  const handleGenerateFromDescription = async () => {
    setError('')
    if (!description.trim() || !blueprintName.trim()) {
      setError('Please provide both a name and description')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/blueprints/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'description',
          name: blueprintName,
          description: description,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate blueprint')
      }

      const blueprint: BlueprintDraft = await response.json()
      setGeneratedBlueprint(blueprint)
      onBlueprintGenerated?.(blueprint)
      setDescription('')
      setBlueprintName('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateFromImage = async () => {
    setError('')
    if (!imageFile || !blueprintName.trim()) {
      setError('Please provide both a name and an image')
      return
    }

    setIsGenerating(true)
    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('name', blueprintName)

      const response = await fetch('/api/blueprints/generate-from-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate blueprint from image')
      }

      const blueprint: BlueprintDraft = await response.json()
      setGeneratedBlueprint(blueprint)
      onBlueprintGenerated?.(blueprint)
      setImageFile(null)
      setBlueprintName('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Section */}
        <Card className="border-primary/20 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              AI Blueprint Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Blueprint Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Project Name</label>
              <Input
                placeholder="e.g., Modern Family Home"
                value={blueprintName}
                onChange={(e) => setBlueprintName(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-2 px-3 text-sm font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                From Description
              </button>
              <button
                onClick={() => setActiveTab('image')}
                className={`pb-2 px-3 text-sm font-medium transition-colors ${
                  activeTab === 'image'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                From Image
              </button>
            </div>

            {/* Description Tab */}
            {activeTab === 'description' && (
              <div>
                <label className="block text-sm font-medium mb-2">Design Description</label>
                <Textarea
                  placeholder="Describe your ideal home layout. E.g., 'A 4-bedroom, 2.5-bath modern home with open-concept kitchen and living area, master suite on main floor, 3-car garage, front porch'"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isGenerating}
                  rows={6}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Be specific about rooms, layout preferences, and architectural style
                </p>
                <Button
                  onClick={handleGenerateFromDescription}
                  disabled={isGenerating || !description.trim()}
                  className="mt-4 w-full"
                >
                  {isGenerating ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Generating...
                    </>
                  ) : (
                    'Generate Blueprint'
                  )}
                </Button>
              </div>
            )}

            {/* Image Tab */}
            {activeTab === 'image' && (
              <div>
                <label className="block text-sm font-medium mb-2">Upload Image</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    disabled={isGenerating}
                    className="hidden"
                    id="blueprint-image-input"
                  />
                  <label htmlFor="blueprint-image-input" className="cursor-pointer">
                    <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {imageFile ? imageFile.name : 'Click to upload or drag image'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, or GIF (max 10MB)
                    </p>
                  </label>
                </div>
                <Button
                  onClick={handleGenerateFromImage}
                  disabled={isGenerating || !imageFile}
                  className="mt-4 w-full"
                >
                  {isGenerating ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Analyzing...
                    </>
                  ) : (
                    'Generate from Image'
                  )}
                </Button>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Info Panel */}
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-base">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Description Method</h4>
              <p className="text-muted-foreground">
                Write a detailed description of your ideal home layout
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Image Method</h4>
              <p className="text-muted-foreground">
                Upload a sketch, photo, or inspiration image
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">AI Processing</h4>
              <p className="text-muted-foreground">
                Our AI analyzes your input and generates professional blueprints
              </p>
            </div>
            <div className="pt-2">
              <Badge variant="outline" className="text-xs">
                ⚡ Powered by Stem Synergy AI
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Blueprint Preview */}
      {generatedBlueprint && (
        <Card className="border-green-500/20 bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-400">
              Blueprint Generated: {generatedBlueprint.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Rooms</p>
                <p className="text-lg font-bold">{generatedBlueprint.rooms}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Square Feet</p>
                <p className="text-lg font-bold">{generatedBlueprint.squareFeet.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Style</p>
                <p className="text-lg font-bold">{generatedBlueprint.style}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-semibold">
                  {new Date(generatedBlueprint.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {generatedBlueprint.svgData && (
              <div className="border border-border rounded-lg p-4 bg-background overflow-auto max-h-96">
                <div dangerouslySetInnerHTML={{ __html: generatedBlueprint.svgData }} />
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={() => {
                  setSavedBlueprints([...savedBlueprints, generatedBlueprint as BlueprintGalleryItem])
                  setGeneratedBlueprint(null)
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Save to Gallery
              </Button>
              <Button variant="outline">Download SVG</Button>
              <Button variant="outline">Download PNG</Button>
              <Button variant="outline">Share</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blueprint Gallery */}
      {savedBlueprints.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold">Saved Blueprints</h3>
            <p className="text-muted-foreground text-sm">Your collection of generated housing designs</p>
          </div>
          <BlueprintGallery 
            blueprints={savedBlueprints}
            onDelete={(id) => {
              setSavedBlueprints(savedBlueprints.filter(b => b.id !== id))
            }}
          />
        </div>
      )}
    </div>
  )
}
