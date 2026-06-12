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
| B1 „Was sind die SDGs?"-Abschnitt | DONE | 67872ab | Erklärbox oben auf SDG-Seite, trilingual |
| C1 Passwort-Sichtbarkeits-Toggle | DONE | 6dee1fd | Reusable `PasswordInput` (Eye/EyeOff, aria-label/pressed) in Login + Register; kein Confirm-Feld vorhanden |
| D1 Favicon-Konsistenz | DONE | d132cab | Alle Favicon-Assets aus Logo_Icon_transparent.png; stale Alt-Blatt `favicon.svg` entfernt; apple-touch auf dunkles Grün angeglichen; s. Entscheidung |
| D2 ZOE-Schreibweise vereinheitlichen | DONE | c0bc171 | Audit: bereits durchgängig „ZOE"; 0 Änderungen nötig; s. D2-Befund |
| F1 Newsletter-Feld im Footer (global) | DONE | (this) | `FooterNewsletter`-Widget (E-Mail+Button), trilingual |
| F2 NewsletterSignup-Tabelle | PARTIAL | (this) | Prisma-Modell + Endpoint `POST /api/newsletter` (idempotent, upsert by email); Migration → PENDING (kein lokaler DB); Endpoint demo-tolerant |
| F3 Demo-Microcopy | DONE | (this) | „Demo — es werden keine E-Mails versendet." trilingual am Feld |
| F4 Nur erfassen + Bestätigungs-Toast | DONE | e491e0c | Kein Double-Opt-In/Versand/Unsubscribe; Erfolgs-Toast |
| E1 i18n-Vollständigkeit | DONE | 975b9ab | Audit: EN/DE/EL je 924 Keys, 0 fehlend, kein echtes Englisch-in-DE; neue A/B/C/F-Keys trilingual; s. E1-Befund |
| G Zahlen-/Dummy-Audit (Report) | DONE | (this) | s. ZAHLEN-AUDIT; 4 Inkonsistenzen markiert; nichts geändert |
| DB DB-Vollständigkeits-Check (Report) | DONE | (this) | s. DB-VOLLSTÄNDIGKEIT; Content vollständig in DB, mehrere Seiten lesen aber static-Fallback |

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

## D2 — ZOE-Schreibweise (Audit, 0 Änderungen)

Konvention: Markenname als Versalien **„ZOE"** im Fließtext/UI (EN/DE), griechisches
„Ζωή" nur als bewusste Wortmarke/Erklärung („ZOE (Ζωή — ‚Leben')"). Grep über ALLE
getrackten Quellen (`*.ts/*.tsx/*.json/*.html`, ohne node_modules) nach `\bZoe\b`
(Title-Case) und Wort-`zoe` (lowercase):
- **„Zoe" (Title-Case): 0 Treffer.** Marke bereits durchgängig „ZOE".
- **lowercase „zoe": nur** in der E-Mail-Domain `…@zoe-corfu.gr` (legitim, kein
  Markenname im Fließtext).
- **„Ζωή": nur** als Wortmarke/Erklärung (z. B. `about.heroSubtitle` „ZOE (Ζωή — …)").
- FeedPost-Importe ohnehin ausgenommen.
→ Keine Vereinheitlichung nötig; Konvention ist bereits erfüllt.

## D1 — Favicon-Konsistenz (Befund + Fix)

Header-Icon (oben links) und Favicon stammen BEIDE aus derselben Quelle
`Logo_Icon_transparent.png`. Header = transparente Variante; Favicon = grüne
Wortmarke auf weißem Rundeck (bewusste, jüngste Nutzer-Entscheidung — auf dunklen
Tabs lesbar). `index.html` verweist korrekt auf `/favicon.png` (128, Marke) +
`/favicon.ico` (Marke, multi-size) + `/apple-touch-icon.png`. **Fix:** stale,
nicht mehr referenziertes Alt-Blatt-Icon `public/favicon.svg` entfernt;
`apple-touch-icon.png` mit demselben dunkleren Grün neu generiert (Farbkonsistenz).
Kein Alt-Blatt-Asset mehr im Repo/HTML.

## E1 — i18n-Vollständigkeit (Audit)

Flach-Vergleich der drei Locales: **EN/DE/EL je 924 Keys, 0 fehlende Keys** (volle
Parität, keine durchscheinenden Keys). „Englisch-in-DE"-Heuristik (DE-Wert == EN-Wert,
>3 Zeichen): 11 Treffer, **alle legitim** — deutsche Lehnwörter (Dashboard, Filter,
Status, Details, Input, optional), Beispiel-Platzhalter (Maria Georgiou,
maria@example.com) oder „[optional]". → **0 echte Lücken, keine Fills nötig.** Alle
neuen Texte aus A/B/C/F sind EN+DE+EL vollständig.

## EL-REVIEW offen

Selbst verfasste EL-Strings dieses Laufs (nicht muttersprachlich geprüft — bitte
gegenlesen):
- `rewards.guest.{lead,registerCta,haveAccount,loginCta}` (A4)
- `rewards.milestonePoints` (A6)
- `sdgDashboard.whatAreSdgs.{heading,body}` (B1)
- `auth.{showPassword,hidePassword}` (C1)
- `footer.newsletter.{heading,emailLabel,emailPlaceholder,subscribe,demoNotice,success,invalidEmail}` (F)

---

## ZAHLEN-AUDIT (G — nur Befund, nichts geändert)

| Wert | Ort (Datei/Seite) | DB vs. Dummy | Herkunft / Hinweis |
|---|---|---|---|
| 640 / 2.389 / 127 | Landing KPI-Banner · `data/landingFacts.ts` | **Dummy (hartkodiert)** | bewusste Demo (B2) |
| Active-Projects-Karten | Landing „Aktive Projekte" | **DB (dynamisch)** | live API `getProjects(OPEN)` |
| „X von 17 SDGs adressiert", aktive/abgeschlossene Projekte, „SDG-Beiträge" | `SDGDashboardPage` Übersicht | **static (Dummy)** ⚠️ | aus `data/projects.ts`-Fallback, NICHT live DB |
| SDG-Kachel „X abgeschlossen" (K1) | `SDGDashboardPage` | **static (Dummy)** ⚠️ | `data/projects.ts` (completed-Filter) |
| Projekt-Impact „Belegte Wirkung" (z. B. 4.866, 2.682,699 t, 15,08 %) | `ProjectDetailPage` `project.metrics` | **DB** | 5× `ProjectMetric` (echte Programmzahlen) |
| Transparenz-Metriken | `TransparencyPage` | **DB + static-Fallback** | `getImpactMetrics()` (live) + `data/metrics.ts` |
| Projekt-Beschreibungszahlen (4.866 LED, 2.682,699 t …) | DB `Project.description*` | **DB** | Seed/Programmzahlen (als Demo deklariert, Quellen in L1 entfernt) |
| About-Kontextzahlen (~102.000, 4 Mio., 350–400 t, 3,5 Mio.) | i18n `about.contextStats` | **Dummy (hartkodiert)** | Kontext mit Quellenangaben (ELSTAT 2021 etc.) |
| Reward-Tiers 0–5000, Earning 10/20, Milestone-points 500/1000/2000 | `data/rewards.ts` | **Dummy (Config, ×10)** | Demo-Config (A5/A6) |
| Demo-Milestones current/target (73/100, 500/500, 1000/1000) | `data/rewards.ts` | **Dummy** | Demo-Fortschritt |
| Event-Punkte 200–300, `EVENT_POINTS` 200 | DB `Event.rewardPoints` / Controller | **DB / Konstante (×10)** | Seed/DB (Prod-×10 → PENDING) |
| Badge-thresholds 0/1000/3000/5000/10000 | DB `Badge` (×10) | **DB** | Seed (UI nutzt aber Config-Tiers, nicht Badges) |

**Markierte Inkonsistenzen (⚠️):**
1. **SDG-Seite rechnet aus `data/projects.ts`-Fallback statt Live-DB** → driftet,
   falls Projekte nur in der DB geändert/ergänzt werden (Counts aktualisieren nicht).
2. **Rewards-System komplett static** (Config, keine DB) — Punkte/Tiers/Milestones
   nicht editierbar, nicht in DB.
3. **`data/projects.ts` ist ein manuelles static-Duplikat der DB-Projekte** →
   Drift-Risiko zwischen Fallback und DB.
4. **Badge-DB-Modell (5 Zeilen) wird vom Rewards-UI nicht genutzt** (UI = Config-Tiers).

---

## DB-VOLLSTÄNDIGKEIT (DB — nur Befund, keine Migration)

Live-Prod-DB (read-only, nach run-A-Cleanup):

| Entität | Zeilen | mit Bild | volle EN/EL/DE-Texte |
|---|---|---|---|
| `Project` | 9 (8 listed + 1 Umbrella) | 8/9 (Umbrella ohne Bild, korrekt) | **9/9** |
| `Event` | 9 | 8/9 (`evt-reforestation-day` ohne Bild) | **9/9** |
| `LearningResource` | 4 | 4/4 | **4/4** |
| `Post` (Lifecycle-News) | 3 | 3/3 | **3/3** |
| `FeedPost` (FB-Import) | 20 | 100 Bilder | je 20 EN/DE/EL |
| `ProjectMetric` | 5 | — | — |
| `Badge` / `User` / `Idea` | 5 / 4 / 4 | — | — |

→ **Alle vier Content-Entitäten (Project/Event/Learn/News) + FeedPost liegen
vollständig & trilingual in der DB, mit Bildern.** Inhalt ist persistent.

**ABER: Frontend-hartkodierte Inhalte, die NICHT (live) aus der DB kommen:**
- **`data/projects.ts`** — static Duplikat der 9 Projekte (Fallback). Genutzt von
  `SDGDashboardPage`, `LandingPage` (addressedSdgs), `GetInvolvedPage` (Karte),
  `TransparencyPage`. Diese Seiten lesen das STATIC-Duplikat, nicht die Live-DB.
- **`data/rewards.ts`** — Tiers, Activities, Community-Milestones: komplett static,
  KEIN Rewards-DB-Modell. (A6-DB-Modell-Pfad → PENDING.)
- **`data/landingFacts.ts`** — 640/2.389/127 (Demo-KPIs), nicht in DB.
- **`data/metrics.ts`** — Transparenz-Fallback (DB wird zusätzlich gefetcht).
- **`data/sdgs.ts`** — SDG-Katalog (17 Metadaten): static Referenzdaten (ok so).
- **`data/profiles.ts` / `data/audiences.ts` / `data/posts.ts`** — static Referenz/Fallback.
- **i18n `about.contextStats`** — 4 Kontextzahlen hartkodiert im Locale.
- **`Badge`-DB-Modell** vorhanden (5), aber vom Rewards-UI ungenutzt.

**Empfehlung (nicht umgesetzt):** SDG-/Landing-/GetInvolved-Seiten auf die Live-API
umstellen (statt `data/projects.ts`), und das Rewards-System (inkl. A6-Milestones)
auf DB-Modelle heben (Admin-Editierbarkeit) — beides größere Folge-Refactors.

---

## BE-Tests offen

Kein lokaler Postgres/Docker → BE-Test-Suite + Schema-Migrationen NICHT
ausgeführt. Sobald verfügbar (`docker compose up -d` im `backend/`, dann):
```
cd backend
npx prisma migrate dev --name add_newsletter_signup   # NewsletterSignup-Tabelle (F2)
npm test                                               # BE-Tests inkl. projects (A1: pointsAwarded 0)
```
Zu prüfen: A1-Projektteilnahme (0 Punkte), Event-Join (×10 Punkte), Newsletter-
Endpoint (`POST /api/newsletter`, idempotent by email). Frontend wurde gegen
`tsc/eslint/build/Vitest` grün gehalten; Backend nur `tsc`-geprüft.

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

### F2 — NewsletterSignup-Tabelle (Schema-Change)
Prisma-Modell ist in `schema.prisma` ergänzt (`prisma generate` lief). Migration
NICHT lokal angewandt (kein DB). Deploy-Pfad:
```
# bevorzugt (erzeugt + deployt Migration):
cd backend && npx prisma migrate dev --name add_newsletter_signup   # lokal
cd backend && npx prisma migrate deploy                              # prod
```
Oder direktes SQL (Prisma-Konvention) gegen Prod:
```sql
CREATE TABLE "NewsletterSignup" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NewsletterSignup_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "NewsletterSignup_email_key" ON "NewsletterSignup"("email");
```
Bis dahin ist der Endpoint demo-tolerant (`stored:false`, Toast erscheint trotzdem).

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
