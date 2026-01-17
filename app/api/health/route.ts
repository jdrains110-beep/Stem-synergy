export async function GET() {
  return new Response(JSON.stringify({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    validationKeyExists: true
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
