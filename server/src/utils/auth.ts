import jwt, { type SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!JWT_SECRET || JWT_SECRET === 'change-this-to-a-random-secret-in-production') {
  console.warn('WARNING: JWT_SECRET is using default/example value. Set JWT_SECRET in .env for production.');
}
if (!JWT_REFRESH_SECRET || JWT_REFRESH_SECRET === 'change-this-to-another-random-secret-in-production') {
  console.warn('WARNING: JWT_REFRESH_SECRET is using default/example value.');
}

export interface TokenPayload {
  adminId: string;
  username: string;
  type: 'access' | 'refresh';
  jti: string;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(adminId: string, username: string): string {
  return jwt.sign(
    { adminId, username, type: 'access', jti: crypto.randomUUID() },
    JWT_SECRET!,
    { expiresIn: JWT_ACCESS_EXPIRY } as jwt.SignOptions
  );
}

export function generateRefreshToken(adminId: string, username: string): string {
  return jwt.sign(
    { adminId, username, type: 'refresh', jti: crypto.randomUUID() },
    JWT_REFRESH_SECRET!,
    { expiresIn: JWT_REFRESH_EXPIRY } as jwt.SignOptions
  );
}

export function verifyAccessToken(token: string): TokenPayload {
  const payload = jwt.verify(token, JWT_SECRET!) as TokenPayload;
  if (payload.type !== 'access') throw new Error('Invalid token type');
  return payload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  const payload = jwt.verify(token, JWT_REFRESH_SECRET!) as TokenPayload;
  if (payload.type !== 'refresh') throw new Error('Invalid token type');
  return payload;
}