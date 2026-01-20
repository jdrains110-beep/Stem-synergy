import { NextResponse } from 'next/server';

/**
 * POST /api/pi/payments/complete
 * Server-Side Completion for Pi Network payments
 * Called by frontend after blockchain transaction is submitted
 */
export async function POST(request: Request) {
  try {
    const { paymentId, txid } = await request.json();

    if (!paymentId || !txid) {
      return NextResponse.json(
        { error: 'Payment ID and transaction ID are required' },
        { status: 400 }
      );
    }

    const PI_API_KEY = process.env.PI_API_KEY;
    if (!PI_API_KEY) {
      console.error('❌ PI_API_KEY not configured');
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    // Complete the payment with Pi servers
    const completeResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txid }),
      }
    );

    if (!completeResponse.ok) {
      const errorData = await completeResponse.json().catch(() => ({}));
      console.error('❌ Pi payment completion failed:', errorData);
      return NextResponse.json(
        { error: 'Payment completion failed', details: errorData },
        { status: completeResponse.status }
      );
    }

    const completionData = await completeResponse.json();
    console.log('✅ Payment completed:', paymentId, txid);

    // TODO: Grant user access to premium features, credits, etc.
    // Example: Update user credits in database
    // await updateUserCredits(userId, amount);

    return NextResponse.json({
      success: true,
      paymentId,
      txid,
      ...completionData,
    });
  } catch (error) {
    console.error('❌ Payment completion error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
