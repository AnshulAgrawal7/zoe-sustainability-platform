# ZOE — Z1–Z6 Gap-Closure Run Log — 2026-06-11

Branch: `feature/z1-z6-gap-closure` (von `main` @ dabccf5).
Baseline: **BE 68 / FE 22 / E2E 55**. Regeln: nur additive Migrationen, i18n DE/EN/EL,
WCAG, keine erfundenen Daten, Persistenz in der DB, Commit nach jedem Block.

## Übersicht

| Block | Thema | Status | Ergebnis |
|---|---|---|---|
| A1 | Z3 öffentliches, moderiertes Ideen-Board | ✅ | `/ideas` + `GET /api/ideas/public` (nur ACCEPTED, keine PII) + Seed + Flow-Text |
| A2 | Z3 Forum (Kommentare + Likes, moderiert) | ⏳ | offen |
| B | Z5 Bildungsinhalte (LearningResource) | ⏳ | offen |
| C | Z2 SDG-Dashboard ehrlich machen | ⏳ | offen |
| D | Z1 belegte Wirkungszahlen | ⏳ | offen |
| E | Z4 Missionen (SDT-konform) | ⏳ | offen |
| F | Z6 hartkodierte Strings → i18n | ⏳ | offen |

## Chronologisches Protokoll

1. Branch `feature/z1-z6-gap-closure` von `main` erstellt. Baseline verifiziert: BE 68 / FE 22.
2. **Block A1 umgesetzt** (s. u.). BE 68→**70**, FE 22, E2E 55→**56**. Commit folgt.

## Block-Details

### Block A1 — Öffentliches, moderiertes Ideen-Board (Z3) ✅
Best Practice Decide Madrid / Consul: **Pre-Moderation** — Bürgerideen werden erst
nach Admin-Freigabe öffentlich; kein ungefilterter Post; nie personenbezogene Daten.

**Backend:**
- `ideaController.getPublicIdeas` — `GET /api/ideas/public`: liefert **nur** Ideen mit
  Status `ACCEPTED`, `select` exponiert **keine** PII (kein submitterName/Email/userId).
  Optionaler `?category=`-Filter. Server-seitige Filterung (nicht im Frontend).
- `routes/ideas.ts`: öffentliche, read-only Route `GET /public` ergänzt.
- **Keine Migration** — bestehendes `Idea`-Model genügt.

**Frontend:**
- Neue Seite `src/pages/IdeasPage.tsx` (`/ideas`): Liste freigegebener Ideen,
  Kategorie-Filter, „So funktioniert es"-Erklärbox, „Idee einreichen"-CTA → `/participate`,
  Leerzustand. WCAG: `role="group"`/`aria-pressed` Filter, `<time dateTime>`, Fokus-Ringe.
- `ideaService.getPublicIdeas`, Typ `PublicIdea`.
- Route `/ideas` registriert; in Nav-Gruppe **„Mitmachen"** eingehängt (nach „Idee
  einreichen"): `nav.ideas`.
- Flow erklärt: `participate.submitSuccess` ergänzt um „…nach Freigabe öffentlich im
  Ideen-Board" (EN behält „submitted to the municipality" → E2E bleibt grün).
- i18n `ideasBoard.*` + `nav.ideas` in EN/DE/EL.

**Seed:** 4 anonyme Demo-Ideen mit Status `ACCEPTED` (Ids `idea-demo-*`), plausible,
lokal verankerte Bürgervorschläge (Acharavi-Radständer, Refill-Stationen Erimitis/Nymfes,
Adopt-a-spot Küste, Schulbesuche Recycling-Hub) — keine erfundenen Statistiken, keine PII.

**Tests:** Backend +2 (`/public` zeigt nur ACCEPTED, keine PII; Kategorie-Filter) → **70**.
E2E +1 (voller Moderationsflow: einreichen → vor Freigabe nicht sichtbar → Admin setzt
ACCEPTED → erscheint auf `/ideas`) → **56**.

## Neue Migrationen
_(A1: keine.)_

---

## TODO — manuell zu erledigen
- [ ] **Supabase:** Bereits während des Runs `npm run db:seed` gegen Supabase ausgeführt
      (Demo-Ideen vorhanden) — bei späteren Schema-Blöcken erneut deployen (s. u.).
- [ ] Echte Bürgerideen werden über `/participate` eingereicht und im Admin freigegeben.
