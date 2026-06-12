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
| A5 Punkte ×10 (Faktor 10) | DONE | 0481ae1 | Config+Seed+EVENT_POINTS ×10; Prod-Rows → PENDING; s. A5-Tabelle |
| A6 Community-Milestones als Punktquelle | DONE | 244502a | Config (3 Demo-Milestones + points), auf Rewards-Seite; DB-Modell-Pfad → PENDING; s. Entscheidung |
| B1 „Was sind die SDGs?"-Abschnitt | DONE | (this) | Erklärbox oben auf SDG-Seite, trilingual |

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
- **A6 = Config statt DB-Modell:** Das gesamte Rewards-Subsystem (Tiers,
  Activities, Milestones) ist aktuell statische Config (`data/rewards.ts`) + i18n —
  es gibt KEIN Rewards-DB-Modell. Ein einzelnes Milestone-DB-Modell in Isolation
  wäre inkonsistent (bräuchte Route/Controller/Service/Fallback) UND ohne lokale
  Postgres nicht anwend-/testbar. „Das Einfachste" = Config (konsistent). Für die
  geforderte Admin-Editierbarkeit ist das `CommunityMilestone`-Prisma-Modell +
  Migrations-SQL in PENDING skizziert (Pfad, wenn Rewards→DB migriert wird).
  Milestones klar als Demo-Daten markiert (`rewards.milestonesNote`).

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

### A6 — (optional) Community-Milestone als admin-editierbares DB-Modell
Aktuell Config. Für Admin-Editierbarkeit später dieses Prisma-Modell + Migration
(Werte aus `data/rewards.ts` als Seed):
```prisma
model CommunityMilestone {
  id        String   @id @default(cuid())
  target    Int
  points    Int
  current   Int      @default(0)
  unlocked  Boolean  @default(false)
  labelEn   String
  labelEl   String
  labelDe   String
  descEn    String
  descEl    String
  descDe    String
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
Migration-SQL (Postgres):
```sql
CREATE TABLE "CommunityMilestone" (
  "id" TEXT PRIMARY KEY, "target" INTEGER NOT NULL, "points" INTEGER NOT NULL,
  "current" INTEGER NOT NULL DEFAULT 0, "unlocked" BOOLEAN NOT NULL DEFAULT false,
  "labelEn" TEXT NOT NULL, "labelEl" TEXT NOT NULL, "labelDe" TEXT NOT NULL,
  "descEn" TEXT NOT NULL, "descEl" TEXT NOT NULL, "descDe" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
Danach: Backend-Route `GET /api/rewards/milestones` + Admin-CRUD + Frontend liest
DB (Fallback auf Config). Erst sinnvoll, wenn das ganze Rewards-System auf DB zieht.
