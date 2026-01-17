'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Share2, Trash2, Eye } from 'lucide-react'

export interface BlueprintGalleryItem {
  id: string
  name: string
  description: string
  rooms: number
  squareFeet: number
  style: string
  createdAt: Date
  svgData: string
}

interface BlueprintGalleryProps {
  blueprints: BlueprintGalleryItem[]
  onDelete?: (id: string) => void
  onExport?: (blueprint: BlueprintGalleryItem, format: 'pdf' | 'svg' | 'png') => void
}

export function BlueprintGallery({ blueprints, onDelete, onExport }: BlueprintGalleryProps) {
  const [selectedBlueprint, setSelectedBlueprint] = useState<BlueprintGalleryItem | null>(null)

  const exportSVG = (blueprint: BlueprintGalleryItem) => {
    const element = document.createElement('a')
    const file = new Blob([blueprint.svgData], { type: 'image/svg+xml' })
    element.href = URL.createObjectURL(file)
    element.download = `${blueprint.name.replace(/\s+/g, '-')}.svg`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    onExport?.(blueprint, 'svg')
  }

  const exportPNG = async (blueprint: BlueprintGalleryItem) => {
    try {
      // Create canvas from SVG
      const svg = blueprint.svgData
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 1200
      canvas.height = 800

      const img = new Image()
      img.onload = () => {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)

        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `${blueprint.name.replace(/\s+/g, '-')}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        onExport?.(blueprint, 'png')
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(svg)
    } catch (error) {
      console.error('PNG export failed:', error)
    }
  }

  if (blueprints.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No blueprints yet</p>
          <p className="text-sm text-muted-foreground">Generate your first blueprint to get started</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Blueprint List */}
      <div className="lg:col-span-2 space-y-3">
        {blueprints.map((blueprint) => (
          <Card
            key={blueprint.id}
            className={`cursor-pointer transition-all hover:border-primary/50 ${
              selectedBlueprint?.id === blueprint.id ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => setSelectedBlueprint(blueprint)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base">{blueprint.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(blueprint.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="secondary">{blueprint.style}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Rooms</span>
                  <p className="font-semibold">{blueprint.rooms}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sq Ft</span>
                  <p className="font-semibold">{blueprint.squareFeet.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">ID</span>
                  <p className="font-mono text-xs truncate">{blueprint.id.slice(0, 8)}...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview & Actions */}
      {selectedBlueprint && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* SVG Preview */}
            <div className="border border-border rounded-lg p-3 bg-background overflow-auto max-h-64">
              <div dangerouslySetInnerHTML={{ __html: selectedBlueprint.svgData }} />
            </div>

            {/* Info */}
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Description</p>
                <p className="text-xs line-clamp-3">{selectedBlueprint.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <p className="text-muted-foreground text-xs">Bedrooms</p>
                  <p className="font-semibold">{selectedBlueprint.rooms}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Square Feet</p>
                  <p className="font-semibold">{selectedBlueprint.squareFeet.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => exportSVG(selectedBlueprint)}
              >
                <Download className="h-4 w-4 mr-2" />
                SVG
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => exportPNG(selectedBlueprint)}
              >
                <Download className="h-4 w-4 mr-2" />
                PNG
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => {
                  onDelete?.(selectedBlueprint.id)
                  setSelectedBlueprint(null)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
