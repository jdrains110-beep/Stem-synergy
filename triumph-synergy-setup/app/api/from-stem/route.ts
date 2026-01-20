import { NextRequest, NextResponse } from 'next/server'
import { verifySharedSecret } from '@/lib/auth'

export async function POST(request: NextRequest) {
  // Verify the request is from Stem
  if (!verifySharedSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { message, data } = body

    // Process the data from Stem
    console.log('Received from Stem:', message, data)

    // Example: Triumph synergy processing
    const response = {
      success: true,
      received: data,
      triumphResponse: `Triumph Synergy processed: ${message}`,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error processing Stem request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}