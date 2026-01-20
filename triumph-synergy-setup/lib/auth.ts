import crypto from 'crypto'

export function verifySharedSecret(req: any) {
  const providedSecret = req.headers['x-shared-secret']
  const actualSecret = process.env.SHARED_SECRET_KEY

  return providedSecret === actualSecret
}

export function signRequest(data: any) {
  const signature = crypto
    .createHmac('sha256', process.env.SHARED_SECRET_KEY!)
    .update(JSON.stringify(data))
    .digest('hex')

  return signature
}