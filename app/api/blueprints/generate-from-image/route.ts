import { NextRequest, NextResponse } from 'next/server'

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

// Simple image analysis mock - in production, use Claude Vision, GPT-4V, or similar
async function analyzeImage(fileName: string, fileBuffer: Buffer): Promise<{
  description: string
  rooms: number
  style: string
}> {
  // Mock analysis - in production, send to vision AI
  const description = `Modern floor plan design with open-concept layout, multiple rooms, and natural light.`
  const rooms = Math.floor(Math.random() * 4) + 3 // 3-6 rooms
  const styles = ['Modern', 'Contemporary', 'Traditional', 'Minimalist']
  const style = styles[Math.floor(Math.random() * styles.length)]

  return {
    description,
    rooms,
    style,
  }
}

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

      svg += `<rect x="${x}" y="${y}" width="${roomWidth}" height="${roomHeight}" fill="#e8f4f8" stroke="#2c5aa0" stroke-width="2" />`
      svg += `<text x="${x + roomWidth / 2}" y="${y + roomHeight / 2}" text-anchor="middle" dy="0.3em" font-size="12" font-family="Arial" fill="#333">${roomName}</text>`

      roomIndex++
    }
  }

  svg += '</svg>'
  return svg
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const name = formData.get('name') as string

    if (!file || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer()

    // Analyze the image using mock function
    const analysis = await analyzeImage(file.name, Buffer.from(buffer))

    const squareFeet = Math.max(800, analysis.rooms * 400)
    const svgData = generateFloorPlan(analysis.rooms)

    const blueprint: GeneratedBlueprint = {
      id: `bp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description: analysis.description,
      rooms: analysis.rooms,
      squareFeet,
      style: analysis.style,
      createdAt: new Date(),
      svgData,
    }

    return NextResponse.json(blueprint)
  } catch (error) {
    console.error('Image analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}
