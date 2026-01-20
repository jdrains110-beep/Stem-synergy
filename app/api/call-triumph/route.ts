import { NextRequest, NextResponse } from 'next/server'
import { signRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const triumphUrl = process.env.TRIUMPH_URL || 'https://triumph-synergy.vercel.app'
    const sharedSecret = process.env.SHARED_SECRET_KEY

    if (!sharedSecret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Sign the request
    const signature = signRequest(body)

    const response = await fetch(`${triumphUrl}/api/from-stem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shared-Secret': sharedSecret,
        'X-Signature': signature,
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error(`Triumph API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error calling Triumph:', error)
    return NextResponse.json({ error: 'Failed to communicate with Triumph' }, { status: 500 })
  }
}