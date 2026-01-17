export async function GET() {
  return new Response(
    '18753f1ee789c85d80b288876d8504a8d61335b46f3c44e402bf088180554eb1df10f229114d37c131556d91f94b0b180f92e392dc9d242fa85f30920175fcf1',
    {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  )
}
