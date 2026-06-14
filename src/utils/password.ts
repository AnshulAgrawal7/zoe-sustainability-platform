// Client-side password policy — mirrors the backend `isStrongPassword` rule in
// backend/src/routes/auth.ts so the UI checklist and the server agree.

export const PASSWORD_MIN_LENGTH = 8;

export type PasswordRule =
  | 'length'
  | 'uppercase'
  | 'lowercase'
  | 'number'
  | 'special';

export const PASSWORD_RULES: PasswordRule[] = [
  'length',
  'uppercase',
  'lowercase',
  'number',
  'special',
];

export type PasswordChecks = Record<PasswordRule, boolean>;

export function passwordChecks(pw: string): PasswordChecks {
  return {
    length: pw.length >= PASSWORD_MIN_LENGTH,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    // Any non-alphanumeric, non-whitespace character counts as a symbol.
    special: /[^A-Za-z0-9\s]/.test(pw),
  };
}

export function isStrongPassword(pw: string): boolean {
  return Object.values(passwordChecks(pw)).every(Boolean);
}
