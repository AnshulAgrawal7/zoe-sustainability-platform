# Night Run B — 2026-06-12 — `feat/rewards-and-polish`

Autonomer Lauf. Branch `feat/rewards-and-polish` von HEAD `3f19697`.
Modus: vollautonom, keine Rückfragen. Pro Aufgabe ein Commit (Conventional, kein
Co-Author-Trailer). Gating: `tsc` (FE) · `eslint` · `vite build` · FE-Tests (Vitest)
· `backend tsc`. **Kein lokaler Postgres/Docker** → BE-Tests + lokale Migrationen
NICHT lauffähig; Befehle unter „BE-Tests offen" / „PENDING".

Baseline: FE `tsc` clean · Vitest 22/22 grün.

---

## Statustabelle

| Aufgabe | Status | Commit | Notiz |
|---|---|---|---|
| (Setup) Branch + Log | DONE | — | s. Entscheidung Branch-Basis |

Legende: DONE · PARTIAL · BLOCKED · SKIPPED

---

## Entscheidungen

- **Branch-Basis = `main`/`3f19697` (statt feat/landing-overhaul/`4457ecb`):**
  `feat/landing-overhaul` wurde bereits per FF in `main` gemerged; `main` enthält
  zusätzlich 4 Polish-Commits (Favicon weiß-Rundeck + dunkleres Grün, Scrub-Fix,
  PENDING-Status). Ein Branch von `feat/landing-overhaul` würde diese verlieren.
  `main` ist striktes Superset → davon gebrancht. „NICHT von main" galt für das
  alte, prä-Overhaul main; main ist jetzt der gemergte Overhaul.
- **Kein lokaler Postgres/Docker** → Schema-Änderungen (A6, F2) werden in
  `schema.prisma` ergänzt + `prisma generate`, Migrations-SQL via `migrate diff`
  generiert und in PENDING gelegt. KEINE lokale Anwendung/kein Test möglich →
  „BE-Tests offen".

---

## EL-REVIEW offen

(Keys mit unsicherem EL — bitte gegenlesen.)

---

## ZAHLEN-AUDIT

(G — Tabelle: Wert | Ort | DB vs. Dummy | Herkunft.)

---

## DB-VOLLSTÄNDIGKEIT

(DB — Befund pro Entität.)

---

## BE-Tests offen

(Befehle zum Nachlaufen, sobald lokale Postgres/Docker verfügbar.)

---

## PENDING — MANUELLER PROD-DEPLOY

(Exakte Befehle/SQL: Community-Milestone-Schema, NewsletterSignup-Tabelle, etc.)
