export const dynamic = 'force-dynamic';

export async function GET() {
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    validationKeyExists: true,
    environment: {
      hasApiKey: !!process.env.PI_API_KEY,
      nodeEnv: process.env.NODE_ENV || 'development',
    },
    endpoints: {
      login: '/api/login',
      health: '/api/health',
      validationKey: '/api/validation-key',
    }
  };

  console.log('[Health] Status check:', healthData);

  return new Response(JSON.stringify(healthData), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
