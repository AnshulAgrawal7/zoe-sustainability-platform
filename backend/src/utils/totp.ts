import crypto from 'crypto';

// RFC 6238 TOTP (time-based one-time passwords) implemented with Node's crypto —
// NO external service and NO third-party dependency (Future_Work §2.5). Works
// with any standard authenticator app (Google Authenticator, Aegis, 1Password…).
//
// Defaults match the de-facto standard those apps expect: SHA-1, 6 digits,
// 30-second step. The secret is a base32 string (RFC 4648, no padding).

const STEP_SECONDS = 30;
const DIGITS = 6;
const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/** Generate a random base32 TOTP secret (default 20 bytes → 32 chars). */
export function generateSecret(bytes = 20): string {
  const buf = crypto.randomBytes(bytes);
  let bits = '';
  for (const b of buf) bits += b.toString(2).padStart(8, '0');
  let out = '';
  for (let i = 0; i + 5 <= bits.length; i += 5) {
    out += B32_ALPHABET[parseInt(bits.slice(i, i + 5), 2)];
  }
  return out;
}

function base32Decode(input: string): Buffer {
  const clean = input.toUpperCase().replace(/=+$/, '').replace(/\s/g, '');
  let bits = '';
  for (const ch of clean) {
    const idx = B32_ALPHABET.indexOf(ch);
    if (idx === -1) continue;
    bits += idx.toString(2).padStart(5, '0');
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

/** Compute the TOTP code for a given secret + Unix time (ms). */
export function generateToken(secret: string, atMs: number = Date.now()): string {
  const counter = Math.floor(atMs / 1000 / STEP_SECONDS);
  const buf = Buffer.alloc(8);
  // 64-bit big-endian counter (high 32 bits are 0 well past year 2200).
  buf.writeUInt32BE(Math.floor(counter / 2 ** 32), 0);
  buf.writeUInt32BE(counter >>> 0, 4);
  const hmac = crypto.createHmac('sha1', base32Decode(secret)).update(buf).digest();
  const offset = hmac[hmac.length - 1]! & 0x0f;
  const code =
    ((hmac[offset]! & 0x7f) << 24) |
    ((hmac[offset + 1]! & 0xff) << 16) |
    ((hmac[offset + 2]! & 0xff) << 8) |
    (hmac[offset + 3]! & 0xff);
  return (code % 10 ** DIGITS).toString().padStart(DIGITS, '0');
}

/**
 * Verify a user-supplied token against the secret. A ±`window` step tolerance
 * (default 1 = ±30s) absorbs clock drift. Constant-ish comparison per candidate.
 */
export function verifyToken(secret: string, token: string, window = 1): boolean {
  const cleaned = (token || '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(cleaned)) return false;
  const now = Date.now();
  for (let w = -window; w <= window; w++) {
    const candidate = generateToken(secret, now + w * STEP_SECONDS * 1000);
    if (crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(cleaned))) {
      return true;
    }
  }
  return false;
}

/** Build the otpauth:// URI an authenticator app encodes as a QR code. */
export function otpauthURL(secret: string, account: string, issuer = 'ZOE Nord-Korfu'): string {
  const label = encodeURIComponent(`${issuer}:${account}`);
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: 'SHA1',
    digits: String(DIGITS),
    period: String(STEP_SECONDS),
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}
