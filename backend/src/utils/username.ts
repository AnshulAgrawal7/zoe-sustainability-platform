import { PrismaClient } from '@prisma/client';
import { USERNAME_MAX, USERNAME_MIN, USERNAME_REGEX } from '../constants';

// Normalize free input into the canonical username form (lowercase, strip
// anything but [a-z0-9_]). Used on register/profile-update before validation.
export function normalizeUsername(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, USERNAME_MAX);
}

export function isValidUsername(value: string): boolean {
  return (
    value.length >= USERNAME_MIN &&
    value.length <= USERNAME_MAX &&
    USERNAME_REGEX.test(value)
  );
}

// Derive a base username from a display name (or email local-part as fallback),
// then ensure it is globally unique by appending a numeric suffix if needed.
export async function generateUniqueUsername(
  prisma: PrismaClient,
  seed: string
): Promise<string> {
  let base = normalizeUsername(seed);
  if (base.length < USERNAME_MIN) base = `user${base}`;
  base = base.slice(0, USERNAME_MAX);

  // Try the bare base first, then base1, base2, … trimming to fit the max length.
  for (let i = 0; i < 1000; i++) {
    const suffix = i === 0 ? '' : String(i);
    const candidate = base.slice(0, USERNAME_MAX - suffix.length) + suffix;
    const taken = await prisma.user.findUnique({ where: { username: candidate } });
    if (!taken) return candidate;
  }
  // Extremely unlikely fallback — random tail.
  return `user_${Math.random().toString(36).slice(2, 8)}`;
}
