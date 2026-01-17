import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/login
 * Handles Pi Network authentication login
 * 
 * Expected body:
 * {
 *   "pi_auth_token": "user_access_token_from_pi_authenticate"
 * }
 * 
 * Returns user data with credits balance
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pi_auth_token } = body;

    if (!pi_auth_token) {
      return NextResponse.json(
        { error: 'Missing pi_auth_token' },
        { status: 400 }
      );
    }

    // Verify the token with Pi Network
    const piApiKey = process.env.PI_API_KEY;
    if (!piApiKey) {
      console.error('PI_API_KEY not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Call Pi Network API to verify and get user info
    const piResponse = await fetch('https://api.minepi.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${pi_auth_token}`,
      },
    });

    if (!piResponse.ok) {
      console.error('Pi API verification failed:', piResponse.status);
      return NextResponse.json(
        { error: 'Invalid Pi authentication token' },
        { status: 401 }
      );
    }

    const piUser = await piResponse.json();
    
    // For now, return a user object with default values
    // TODO: Implement database to store user credits and terms acceptance
    const userData = {
      id: piUser.uid,
      username: piUser.username,
      credits_balance: 10, // Default starting credits
      terms_accepted: true, // Auto-accept for now
    };

    return NextResponse.json(userData, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
