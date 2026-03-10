import { google } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && isProduction) {
  throw new Error('JWT_SECRET environment variable must be set in production');
}

const jwtSecret = JWT_SECRET ?? 'dev-secret-change-in-production';

const googleClient = new google.auth.OAuth2();

export async function verifyGoogleToken(
  idToken: string
): Promise<{ sub: string; name?: string; email?: string }> {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID || undefined,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.sub) {
    throw new Error('Invalid Google ID token');
  }
  return { sub: payload.sub, name: payload.name, email: payload.email };
}

export function createJwt(userId: string, displayName: string): string {
  return jwt.sign({ userId, displayName }, jwtSecret, { expiresIn: '1h' });
}

export function verifyJwt(token: string): { userId: string; displayName: string } | null {
  try {
    return jwt.verify(token, jwtSecret) as { userId: string; displayName: string };
  } catch {
    return null;
  }
}
