import { NextRequest, NextResponse } from 'next/server'

interface BlueprintRequest {
  type: 'description'
  name: string
  description: string
}

interface GeneratedBlueprint {
  id: string
  name: string
  description: string
  rooms: number
  squareFeet: number
  style: string
  createdAt: Date
  svgData: string
}

// Mock function to extract rooms from description
function extractRooms(description: string): number {
  const roomMatch = description.match(/(\d+)\s*(-)?bedroom/i)
  return roomMatch ? parseInt(roomMatch[1], 10) : 4
}

// Mock function to estimate square feet
function estimateSquareFeet(rooms: number): number {
  return Math.max(800, rooms * 400)
}

// Mock function to detect style
function detectStyle(description: string): string {
  const styles = ['Modern', 'Traditional', 'Contemporary', 'Rustic', 'Minimalist']
  if (description.toLowerCase().includes('modern')) return 'Modern'
  if (description.toLowerCase().includes('rustic')) return 'Rustic'
  if (description.toLowerCase().includes('contemporary')) return 'Contemporary'
  return styles[Math.floor(Math.random() * styles.length)]
}

// Generate a simple SVG floor plan
function generateFloorPlan(rooms: number): string {
  const cols = Math.ceil(Math.sqrt(rooms))
  const rows = Math.ceil(rooms / cols)
  const roomWidth = 150
  const roomHeight = 150
  const spacing = 20

  let svg = `<svg viewBox="0 0 ${cols * (roomWidth + spacing)} ${rows * (roomHeight + spacing)}" xmlns="http://www.w3.org/2000/svg">`

  const roomNames = ['Bedroom 1', 'Bedroom 2', 'Bedroom 3', 'Kitchen', 'Living Room', 'Bathroom', 'Garage', 'Office']
  let roomIndex = 0

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (roomIndex >= rooms) break

      const x = col * (roomWidth + spacing) + 10
      const y = row * (roomHeight + spacing) + 10
      const roomName = roomNames[roomIndex] || `Room ${roomIndex + 1}`

      // Draw room rectangle
      svg += `<rect x="${x}" y="${y}" width="${roomWidth}" height="${roomHeight}" fill="#f0f0f0" stroke="#333" stroke-width="2" />`

      // Add room label
      svg += `<text x="${x + roomWidth / 2}" y="${y + roomHeight / 2}" text-anchor="middle" dy="0.3em" font-size="12" font-family="Arial">${roomName}</text>`

      roomIndex++
    }
  }

  svg += '</svg>'
  return svg
}

export async function POST(request: NextRequest) {
  try {
    const body: BlueprintRequest = await request.json()

    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Extract design parameters from description
    const rooms = extractRooms(body.description)
    const squareFeet = estimateSquareFeet(rooms)
    const style = detectStyle(body.description)
    const svgData = generateFloorPlan(rooms)

    const blueprint: GeneratedBlueprint = {
      id: `bp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: body.name,
      description: body.description,
      rooms,
      squareFeet,
      style,
      createdAt: new Date(),
      svgData,
    }

    return NextResponse.json(blueprint)
  } catch (error) {
    console.error('Blueprint generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate blueprint' },
      { status: 500 }
    )
  }
}
