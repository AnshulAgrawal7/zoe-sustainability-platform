/**
 * Securely create or promote a ZOE admin (Future Work 4.3).
 *
 * For the municipality to bootstrap a *real* admin account on a production
 * database (and then delete the demo admin via the admin UI). The password is
 * never hard-coded: pass it as a flag or environment variable, and prefer
 * deleting the shell history afterwards.
 *
 * Usage:
 *   npm run create:admin -- --email you@gemeinde.gr --password 'StrongP@ss1' --name "Real Name"
 *   ADMIN_EMAIL=… ADMIN_PASSWORD=… ADMIN_NAME=… npm run create:admin
 *
 * Optional: --username handle  (default: derived from the email, made unique)
 *
 * Behaviour:
 *   - If a user with the email exists → promote to ADMIN (and reset the password
 *     when one is supplied).
 *   - Otherwise → create a new active ADMIN with a bcrypt(12) password hash.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1];
  const eq = process.argv.find((a) => a.startsWith(`--${name}=`));
  return eq ? eq.split('=').slice(1).join('=') : undefined;
}

// Mirrors the registration policy (≥8 chars, lower + upper + digit + symbol).
function isStrongPassword(pw: string): boolean {
  return (
    pw.length >= 8 &&
    /[a-z]/.test(pw) &&
    /[A-Z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw)
  );
}

async function uniqueUsername(base: string): Promise<string> {
  const root =
    base
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 16) || 'admin';
  let candidate = root;
  let n = 1;
  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    candidate = `${root}_${n++}`;
  }
  return candidate;
}

async function main(): Promise<void> {
  const email = (arg('email') ?? process.env['ADMIN_EMAIL'] ?? '')
    .trim()
    .toLowerCase();
  const password = arg('password') ?? process.env['ADMIN_PASSWORD'] ?? '';
  const name = (arg('name') ?? process.env['ADMIN_NAME'] ?? '').trim();
  const usernameArg = (arg('username') ?? process.env['ADMIN_USERNAME'] ?? '')
    .trim()
    .toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('A valid --email (or ADMIN_EMAIL) is required.');
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    const data: { role: string; password?: string } = { role: 'ADMIN' };
    if (password) {
      if (!isStrongPassword(password)) throw new Error('Password too weak.');
      data.password = await bcrypt.hash(password, 12);
    }
    await prisma.user.update({ where: { email }, data });
    console.log(
      `✓ Promoted existing user ${email} to ADMIN${data.password ? ' (password reset)' : ''}.`
    );
    return;
  }

  // New account → password + name are required.
  if (!isStrongPassword(password)) {
    throw new Error(
      'A strong --password (or ADMIN_PASSWORD) is required for a new account: ' +
        '≥8 chars with lower-, upper-case, a digit and a symbol.'
    );
  }
  if (name.length < 2) throw new Error('A --name (or ADMIN_NAME) is required.');

  const username = usernameArg || (await uniqueUsername(email.split('@')[0]!));
  const created = await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 12),
      name,
      username,
      role: 'ADMIN',
      active: true,
      acceptedTermsAt: new Date(),
    },
  });
  console.log(`✓ Created ADMIN ${created.email} (username: ${created.username}).`);
}

main()
  .catch((err) => {
    console.error(`✗ ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
