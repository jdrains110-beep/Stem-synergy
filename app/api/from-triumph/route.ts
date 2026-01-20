import { NextRequest, NextResponse } from 'next/server'
import { verifySharedSecret } from '@/lib/auth'

export async function POST(request: NextRequest) {
  // Verify the request is from Triumph
  if (!verifySharedSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { message, data } = body

    // Process the data from Triumph
    console.log('Received from Triumph:', message, data)

    // Example: Generate a blueprint response using Claude
    const response = {
      success: true,
      received: data,
      stemResponse: `Stem Synergy processed: ${message}`,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error processing Triumph request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}