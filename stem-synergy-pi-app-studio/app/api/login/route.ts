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

    console.log('[Login] Received authentication request');

    if (!pi_auth_token) {
      console.error('[Login] Missing pi_auth_token');
      return NextResponse.json(
        { error: 'Missing pi_auth_token' },
        { status: 400 }
      );
    }

    // Verify the token with Pi Network
    const piApiKey = process.env.PI_API_KEY;
    if (!piApiKey) {
      console.error('[Login] PI_API_KEY not configured in environment');
      return NextResponse.json(
        { error: 'Server configuration error - PI_API_KEY not set' },
        { status: 500 }
      );
    }

    console.log('[Login] Verifying token with Pi Network API...');

    // Call Pi Network API to verify and get user info
    const piResponse = await fetch('https://api.minepi.com/v2/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${pi_auth_token}`,
      },
    });

    if (!piResponse.ok) {
      const errorText = await piResponse.text();
      console.error('[Login] Pi API verification failed:', piResponse.status, errorText);
      return NextResponse.json(
        { error: 'Invalid Pi authentication token', details: piResponse.status },
        { status: 401 }
      );
    }

    const piUser = await piResponse.json();
    console.log('[Login] Pi user verified:', piUser.username);
    
    // For now, return a user object with default values
    // TODO: Implement database to store user credits and terms acceptance
    const userData = {
      id: piUser.uid,
      username: piUser.username,
      credits_balance: 10, // Default starting credits
      terms_accepted: true, // Auto-accept for now
    };

    console.log('[Login] Login successful for user:', userData.username);
    return NextResponse.json(userData, { status: 200 });

  } catch (error) {
    console.error('[Login] Exception:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMsg },
      { status: 500 }
    );
  }
}
