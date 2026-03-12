import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const googleClient = new OAuth2Client();

function getJwtSecret(): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  return jwtSecret;
}

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
  return jwt.sign({ userId, displayName }, getJwtSecret(), { expiresIn: '1h' });
}

export function verifyJwt(token: string): { userId: string; displayName: string } | null {
  const jwtSecret = getJwtSecret();

  try {
    return jwt.verify(token, jwtSecret) as { userId: string; displayName: string };
  } catch {
    return null;
  }
}
