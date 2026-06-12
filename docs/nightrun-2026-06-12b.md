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
| (Setup) Branch + Log | DONE | f840fa0 | s. Entscheidung Branch-Basis |
| A1 Projekte vergeben keine Punkte | DONE | 5910610 | s. A1-Liste unten |
| A2 Statischen „Current Tier"-Block entfernen | DONE | (this) | Demo-Progress-Tracker (DEMO_POINTS=130) komplett raus |
| A3 Tier nur für eingeloggte User | DONE | (this) | currentTier nur bei isAuthenticated, aus user.points |
| A4 Ausgeloggt: 2 CTAs (Register/Login) | DONE | c7a20df | rewards.guest.* trilingual; Links /register + /login |
| A5 Punkte ×10 (Faktor 10) | DONE | (this) | Config+Seed+EVENT_POINTS ×10; Prod-Rows → PENDING; s. A5-Tabelle |

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

## A1 — Entfernte/deaktivierte projektgebundene Punktepfade

- **Backend `projectController.participate`**: User-Punkte-Increment + Badge-on-
  Points-Logik entfernt → `pointsAwarded: 0`, User-`points` werden nicht mehr
  angefasst. Join-Record (Teilnehmer-Tracking) bleibt.
- **Backend `withdrawParticipation`**: Punkte-Decrement entfernt.
- **`backend/__tests__/projects.test.ts`**: Assertion `pointsAwarded` 30 → 0.
- **`src/services/projectService.ts`**: tote `participate`/`withdraw` (keine
  Caller — Join-CTA war bereits via Decision A deaktiviert) entfernt.
- **`ProjectsPage`**: projektgebundene Punkte-Anzeige (`<Star> {rewardPoints}`)
  + ungenutzter `Star`-Import entfernt.
- **Admin `NewProjectPage` + `EditProjectPage`**: `rewardPoints`-Input entfernt.
- **Behalten (bewusst):** Spalte `Project.rewardPoints` (DB, vestigial, nicht
  angezeigt/genutzt) + Form-Default (sendet 50, backend-seitig ignoriert) — kein
  destruktiver Schema-Change nötig. Nur Events/Aktionen vergeben Punkte.

## A5 — Punkte ×10 (Faktor 10, einheitlich)

| Bereich | Datei | alt → neu |
|---|---|---|
| Tier pointsMin | `data/rewards.ts` | 0/25/100/250/500 → 0/250/1000/2500/5000 |
| Tier pointsMax | `data/rewards.ts` | 24/99/249/499/null → 249/999/2499/4999/null (kontiguierlich = next_min−1) |
| Earning-Beispiele | `data/rewards.ts` | submit-idea 1→10, attend-event 2→20 |
| Event-Default | `eventController.ts EVENT_POINTS` | 20 → 200 |
| Event-Default (FE) | `EventRegister.tsx` | 20 → 200 |
| Seed Event-rewardPoints | `seed.ts` (9 Events) | 25/25/20/20/20/30/25/20/30 → 250/250/200/200/200/300/250/200/300 |
| Seed Badge-thresholds | `seed.ts` (5 Badges) | 0/100/300/500/1000 → 0/1000/3000/5000/10000 |
| Seed Demo-User points | `seed.ts` | admin 0, citizen1 320, citizen2 150, tourist 50 → 0/3200/1500/500 |

**Nicht geändert (bewusst):** `Project.rewardPoints` (50/60/65…, nach A1 unbenutzt),
Test-Fixtures (`events.test.ts` rewardPoints 35 — self-consistent), Schema-`@default(20)`
auf Event (Controller setzt den Wert immer explizit → DB-Default nie genutzt).

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

### A5 — bestehende Prod-Punktwerte ×10
`makeEvent`/Badge-Upserts nutzen `update: {}` → Reseed ändert bestehende Zeilen
nicht. Für Prod (idempotent NUR einmal ausführen — kein Re-Run, sonst ×100!):
```sql
UPDATE "Event"  SET "rewardPoints" = "rewardPoints" * 10;
UPDATE "Badge"  SET "threshold"    = "threshold"    * 10;
UPDATE "User"   SET "points"       = "points"       * 10;  -- bestehende Salden konsistent zu neuen Tiers
```
⚠️ NICHT idempotent — genau einmal ausführen.
