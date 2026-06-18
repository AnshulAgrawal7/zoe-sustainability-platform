#!/usr/bin/env node
// i18n completeness checker (Future_Work §6.3 tooling).
//
// 1) KEY PARITY (deterministic, can fail CI): flattens en/el/de translation.json
//    and reports any key present in one locale but missing in another. English
//    is the reference (fallback language).
// 2) HARDCODED JSX TEXT (advisory): a heuristic scan of src/**/*.tsx for visible
//    text that is not wrapped in t()/<Trans>. Reported as warnings only — the
//    CLAUDE.md rule forbids hardcoded copy, but the heuristic has false
//    positives, so it never fails the build unless --strict is passed.
//
// Usage:
//   node scripts/check-i18n.mjs            # key parity (fails on mismatch) + advisory strings
//   node scripts/check-i18n.mjs --strict   # also fail on suspected hardcoded strings

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const localesDir = join(root, 'src', 'locales');
const LOCALES = ['en', 'el', 'de'];
const REFERENCE = 'en';
const strict = process.argv.includes('--strict');

function loadLocale(locale) {
  const path = join(localesDir, locale, 'translation.json');
  return JSON.parse(readFileSync(path, 'utf8'));
}

// Flatten a nested object into dot-paths. Arrays are treated as leaves.
function flatten(obj, prefix = '', out = new Set()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out.add(key);
  }
  return out;
}

function checkKeyParity() {
  const keys = Object.fromEntries(
    LOCALES.map((l) => [l, flatten(loadLocale(l))])
  );
  const ref = keys[REFERENCE];
  let problems = 0;

  for (const locale of LOCALES) {
    if (locale === REFERENCE) continue;
    const missing = [...ref].filter((k) => !keys[locale].has(k));
    const extra = [...keys[locale]].filter((k) => !ref.has(k));
    if (missing.length) {
      problems += missing.length;
      console.error(`\n✗ ${locale}: ${missing.length} key(s) missing vs ${REFERENCE}:`);
      missing.forEach((k) => console.error(`    - ${k}`));
    }
    if (extra.length) {
      problems += extra.length;
      console.error(`\n✗ ${locale}: ${extra.length} key(s) not in ${REFERENCE} (orphan):`);
      extra.forEach((k) => console.error(`    + ${k}`));
    }
  }

  if (problems === 0) {
    console.log(
      `✓ i18n key parity: all ${ref.size} keys present in ${LOCALES.join('/')}.`
    );
  }
  return problems;
}

// --- Advisory: suspected hardcoded JSX text ---------------------------------

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === '__tests__' || entry === 'node_modules') continue;
      walk(full, files);
    } else if (entry.endsWith('.tsx')) {
      files.push(full);
    }
  }
  return files;
}

// "Code" punctuation that never appears in plain JSX prose but is everywhere in
// TS/JSX expressions (generics <T>, calls, assignments). Excluding it keeps the
// heuristic from flagging code as copy.
const CODE = /[{}=;()]|=>|<\/|\/>/;
const HAS_WORDS = /[A-Za-z]{2,}(\s+[^\s]+){1,}/; // at least two whitespace-separated tokens
const ALLOW = /^(ZOE|SDG\d*|EN|EL|DE|OK|UTC|©|OpenStreetMap)\b/;
// Inline JSX text node: >Some words<  (single line, no nested tags/expressions).
const INLINE = />([^<>{}=;()]*[A-Za-z]{2,}[^<>{}=;()]*)</;

function scanHardcodedStrings() {
  const srcDir = join(root, 'src');
  const hits = [];
  for (const file of walk(srcDir)) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((raw, i) => {
      const line = raw.trim();
      if (!line || line.startsWith('//') || line.startsWith('*') || line.startsWith('/*'))
        return;
      if (/\bt\(|<Trans|i18nKey|import |from '|require\(/.test(line)) return;

      // High-precision: an inline JSX text node >Some words< on one line, with
      // no embedded code or quotes. (A line-based heuristic deliberately favours
      // precision over recall — it will not catch every multi-line case, but it
      // almost never flags code as copy.)
      const m = line.match(INLINE);
      if (!m) return;
      const phrase = m[1].replace(/\s+/g, ' ').trim();
      if (!HAS_WORDS.test(phrase) || /['"`]/.test(phrase) || CODE.test(phrase)) return;
      if (ALLOW.test(phrase) || !/[A-Za-z]/.test(phrase)) return;
      hits.push(`${relative(root, file)}:${i + 1}  "${phrase}"`);
    });
  }
  if (hits.length) {
    console.warn(`\n⚠ ${hits.length} suspected hardcoded JSX string(s) (advisory):`);
    hits.forEach((h) => console.warn(`    ${h}`));
  } else {
    console.log('✓ no obvious hardcoded JSX strings found.');
  }
  return hits.length;
}

const keyProblems = checkKeyParity();
const stringHits = scanHardcodedStrings();

if (keyProblems > 0 || (strict && stringHits > 0)) {
  process.exit(1);
}
