import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, blueprintId } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Return mock analysis if no API key is configured
      return NextResponse.json({
        analysis: {
          dimensions: {
            length: '15.5m',
            width: '12.3m',
            height: '3.2m',
            area: '190.65 m²',
          },
          rooms: [
            'Master Bedroom (18 m²)',
            'Bedroom 2 (14 m²)',
            'Bedroom 3 (12 m²)',
            'Living Room (35 m²)',
            'Kitchen (20 m²)',
            'Dining Room (18 m²)',
            'Bathroom 1 (8 m²)',
            'Bathroom 2 (6 m²)',
            'Garage (40 m²)',
          ],
          features: [
            'Open concept living and dining area',
            'Large windows for natural light',
            'Master bedroom with en-suite bathroom',
            'Modern kitchen with island',
            'Two-car garage',
            'Outdoor patio area',
          ],
          recommendations: [
            'Consider adding solar panels on the roof',
            'Energy-efficient windows recommended',
            'Smart home integration opportunities',
            'Sustainable building materials suggested',
          ],
        },
        message: 'Mock analysis (ANTHROPIC_API_KEY not configured)',
      });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Use Claude Vision to analyze the blueprint
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `Analyze this housing blueprint image and provide detailed information in JSON format with the following structure:
              {
                "dimensions": {
                  "length": "estimated length with unit",
                  "width": "estimated width with unit",
                  "height": "estimated height with unit",
                  "area": "calculated area with unit"
                },
                "rooms": ["list of rooms with sizes"],
                "features": ["list of notable features"],
                "recommendations": ["list of recommendations for improvements"]
              }
              
              Provide accurate estimations based on the blueprint. Be specific and detailed.`,
            },
          ],
        },
      ],
    });

    // Extract the analysis from Claude's response
    const content = message.content[0];
    let analysisText = '';
    
    if (content.type === 'text') {
      analysisText = content.text;
    }

    // Try to parse JSON from the response
    let analysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || 
                       analysisText.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : analysisText;
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError);
      // Return a structured error with the raw response
      return NextResponse.json({
        error: 'Failed to parse analysis',
        rawResponse: analysisText,
      }, { status: 500 });
    }

    return NextResponse.json({
      analysis,
      blueprintId,
      message: 'Analysis completed successfully',
    });

  } catch (error) {
    console.error('Claude API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze blueprint with Claude Vision' },
      { status: 500 }
    );
  }
}
