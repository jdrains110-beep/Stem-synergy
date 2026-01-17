import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface ImageAnalysisResult {
  description: string
  rooms: number
  style: string
  features: string[]
  squareFeetEstimate: number
}

export async function analyzeHousingImage(
  imageBase64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg'
): Promise<ImageAnalysisResult> {
  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `Analyze this housing/floor plan image and provide detailed information in JSON format:
              {
                "description": "detailed description of the layout",
                "rooms": number of rooms visible,
                "style": architectural style (e.g., Modern, Traditional, Contemporary),
                "features": ["list of key features observed"],
                "squareFeetEstimate": estimated square footage based on the layout
              }
              
              If this is not a housing/floor plan image, analyze it as if it's an inspiration image for housing design.
              Return ONLY valid JSON, no other text.`,
            },
          ],
        },
      ],
    })

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse Claude response')
    }

    const result: ImageAnalysisResult = JSON.parse(jsonMatch[0])
    return result
  } catch (error) {
    console.error('Claude Vision analysis error:', error)
    throw error
  }
}

export async function generateBlueprintFromDescription(
  description: string
): Promise<{
  rooms: number
  style: string
  features: string[]
  squareFeetEstimate: number
  layoutSuggestion: string
}> {
  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Based on this housing description, generate layout specifications in JSON format:
          
          Description: ${description}
          
          Return JSON with:
          {
            "rooms": total number of rooms,
            "style": architectural style,
            "features": ["key features to include"],
            "squareFeetEstimate": estimated square footage,
            "layoutSuggestion": detailed layout suggestion for blueprint generation
          }
          
          Return ONLY valid JSON, no other text.`,
        },
      ],
    })

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse Claude response')
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Claude description analysis error:', error)
    throw error
  }
}
