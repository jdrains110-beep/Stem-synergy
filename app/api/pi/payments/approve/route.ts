import { NextResponse } from 'next/server';

/**
 * POST /api/pi/payments/approve
 * Server-Side Approval for Pi Network payments
 * Called by frontend after Pi.createPayment receives paymentId
 */
export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
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

    // Approve the payment with Pi servers
    const approveResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!approveResponse.ok) {
      const errorData = await approveResponse.json().catch(() => ({}));
      console.error('❌ Pi payment approval failed:', errorData);
      return NextResponse.json(
        { error: 'Payment approval failed', details: errorData },
        { status: approveResponse.status }
      );
    }

    const approvalData = await approveResponse.json();
    console.log('✅ Payment approved:', paymentId);

    return NextResponse.json({
      success: true,
      paymentId,
      ...approvalData,
    });
  } catch (error) {
    console.error('❌ Payment approval error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
