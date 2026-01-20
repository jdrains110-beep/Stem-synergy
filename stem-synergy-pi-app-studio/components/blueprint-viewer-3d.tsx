'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface Room {
  name: string
  width: number
  height: number
  depth: number
  position: [number, number, number]
  color: string
}

interface BlueprintViewer3DProps {
  rooms: number
  squareFeet: number
  style: string
  svgData?: string
}

export function BlueprintViewer3D({ rooms, squareFeet, style, svgData }: BlueprintViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'top' | 'perspective'>('perspective')

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(10, 8, 10)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      roughness: 0.5,
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Generate rooms based on square feet and count
    const roomSize = Math.sqrt(squareFeet / rooms) / 2
    const gridSize = Math.ceil(Math.sqrt(rooms))
    const roomGap = 0.5

    const colors = [
      0xff6b6b, // Red
      0x4ecdc4, // Teal
      0xffe66d, // Yellow
      0x95e1d3, // Mint
      0xf38181, // Pink
      0xaa96da, // Purple
      0xfcbad3, // Light pink
      0xa8d8ea, // Light blue
    ]

    for (let i = 0; i < rooms; i++) {
      const row = Math.floor(i / gridSize)
      const col = i % gridSize

      const x = (col - gridSize / 2) * (roomSize * 2 + roomGap)
      const z = (row - gridSize / 2) * (roomSize * 2 + roomGap)

      const roomGeometry = new THREE.BoxGeometry(roomSize * 2, 3, roomSize * 2)
      const roomMaterial = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        roughness: 0.7,
        metalness: 0.1,
      })
      const room = new THREE.Mesh(roomGeometry, roomMaterial)
      room.position.set(x, 1.5, z)
      room.castShadow = true
      room.receiveShadow = true
      scene.add(room)

      // Add door
      const doorGeometry = new THREE.BoxGeometry(0.8, 2, 0.1)
      const doorMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.4,
      })
      const door = new THREE.Mesh(doorGeometry, doorMaterial)
      door.position.set(x + roomSize * 2 - 0.5, 1, z)
      door.castShadow = true
      scene.add(door)
    }

    // Add walls outline
    const wallGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(20, 3, 20))
    const wallLine = new THREE.LineSegments(
      wallGeometry,
      new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 2 })
    )
    wallLine.position.y = 1.5
    scene.add(wallLine)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Auto-rotate for perspective mode
      if (viewMode === 'perspective') {
        camera.position.x = 15 * Math.cos(Date.now() * 0.0001)
        camera.position.z = 15 * Math.sin(Date.now() * 0.0001)
        camera.lookAt(0, 3, 0)
      }

      renderer.render(scene, camera)
    }

    animate()
    setIsLoading(false)

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [squareFeet, rooms, viewMode])

  const switchViewMode = () => {
    if (!cameraRef.current) return
    if (viewMode === 'perspective') {
      setViewMode('top')
      cameraRef.current.position.set(0, 30, 0)
      cameraRef.current.lookAt(0, 0, 0)
    } else {
      setViewMode('perspective')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>3D Floor Plan Visualization</CardTitle>
          <Button variant="outline" size="sm" onClick={switchViewMode}>
            {viewMode === 'perspective' ? 'Top View' : 'Perspective'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center h-96">
            <Spinner className="h-8 w-8" />
          </div>
        )}
        <div
          ref={containerRef}
          className="w-full h-96 rounded-lg border border-border bg-gray-100"
        />
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Style</p>
            <p className="font-semibold">{style}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Rooms</p>
            <p className="font-semibold">{rooms}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Square Feet</p>
            <p className="font-semibold">{squareFeet.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
