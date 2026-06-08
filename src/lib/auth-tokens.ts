import crypto from 'node:crypto';
import { hash } from '@/lib/crypto';

export function createOpaqueToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url');
}

export function hashAuthToken(token: string) {
  return hash('cosmolytics-auth-token:', token);
}

export function normalizeLoginIdentifier(value: string) {
  return String(value || '').trim().toLowerCase();
}
