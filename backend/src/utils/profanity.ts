// Lightweight profanity filter for anonymous citizen content (Future_Work §3.5).
//
// Intentionally CONSERVATIVE: a small, curated list of unambiguous slurs/insults
// across the platform's three languages (EN/EL/DE), matched on word boundaries
// to avoid the "Scunthorpe problem" (false positives inside innocent words).
// This is a first-line spam/abuse guard for content posted WITHOUT an account —
// not a content-moderation system. Admins still review submissions.
//
// Kept here as a single source of truth so it can be unit-tested independently
// of the request layer. To extend, add lower-case base forms below.

const BANNED = [
  // English
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'cunt',
  'bastard',
  'dickhead',
  'motherfucker',
  'whore',
  'slut',
  'retard',
  // German
  'arschloch',
  'fotze',
  'hurensohn',
  'wichser',
  'schlampe',
  'fick',
  // Greek (transliteration-tolerant base forms)
  'μαλάκα',
  'μαλακας',
  'πούστη',
  'πουστη',
  'γαμώ',
  'γαμω',
  'σκατά',
  'σκατα',
  'καριόλη',
  'καριολη',
];

// Build a single word-boundary regex. \b is ASCII-oriented; for the Greek terms
// we additionally allow boundaries via lookarounds on non-letter characters so
// inflected/adjacent punctuation still matches without flagging substrings.
const PATTERN = new RegExp(
  `(^|[^\\p{L}])(${BANNED.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?=$|[^\\p{L}])`,
  'iu'
);

/** True if the text contains a banned word as a standalone token. */
export function containsProfanity(text: string | null | undefined): boolean {
  if (!text) return false;
  return PATTERN.test(text);
}

/** Returns the first matched banned token (for logging/tests), or null. */
export function findProfanity(text: string | null | undefined): string | null {
  if (!text) return null;
  const m = PATTERN.exec(text);
  return m ? m[2]!.toLowerCase() : null;
}
