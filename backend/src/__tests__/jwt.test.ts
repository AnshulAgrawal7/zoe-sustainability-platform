import { describe, it, expect } from 'vitest';
import { signAccessToken, signRefreshToken, verifyToken, getRefreshExpiresAt } from '../utils/jwt';

describe('JWT utilities', () => {
  const payload = { userId: 'user-123', role: 'USER' };

  it('signs and verifies an access token', () => {
    const token = signAccessToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
  });

  it('signs and verifies a refresh token', () => {
    const token = signRefreshToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(payload.userId);
  });

  it('throws on an invalid token', () => {
    expect(() => verifyToken('invalid.token.here')).toThrow();
  });

  it('throws on a tampered token', () => {
    const token = signAccessToken(payload);
    const tampered = token.slice(0, -5) + 'XXXXX';
    expect(() => verifyToken(tampered)).toThrow();
  });

  it('getRefreshExpiresAt returns a future date 7 days out', () => {
    const exp = getRefreshExpiresAt();
    const diff = exp.getTime() - Date.now();
    expect(diff).toBeGreaterThan(6 * 24 * 60 * 60 * 1000); // > 6 days
    expect(diff).toBeLessThan(8 * 24 * 60 * 60 * 1000);    // < 8 days
  });
});
