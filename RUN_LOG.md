# ZOE — Z1–Z6 Gap-Closure Run Log — 2026-06-11

Branch: `feature/z1-z6-gap-closure` (von `main` @ dabccf5).
Baseline: **BE 68 / FE 22 / E2E 55**. Regeln: nur additive Migrationen, i18n DE/EN/EL,
WCAG, keine erfundenen Daten, Persistenz in der DB, Commit nach jedem Block.

## Übersicht

| Block | Thema | Status | Ergebnis |
|---|---|---|---|
| A1 | Z3 öffentliches, moderiertes Ideen-Board | ✅ | `/ideas` + `GET /api/ideas/public` (nur ACCEPTED, keine PII) + Seed + Flow-Text |
| A2 | Z3 Forum (Kommentare + Likes, moderiert) | ✅ | Comment/CommentLike (additiv), Detailseite mit Kommentaren+Likes, Admin-Moderation |
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

### Block A2 — Forum: Kommentare + Likes, moderiert (Z3) ✅
Best Practice: nur **eingeloggte** Nutzer kommentieren/liken (Anti-Spam); Admin
moderiert; Gäste lesen nur. Alles persistiert.

**Schema (additiv):** `Comment` (id, ideaId FK, userId FK, body, status
VISIBLE/HIDDEN, createdAt) + `CommentLike` (commentId+userId Composite-PK = ein Like
pro Nutzer). Migration `20260611150000_add_idea_comments` (nur CREATE TABLE/INDEX/FK).

**Backend:**
- `GET /api/ideas/public/:id` (optionalAuth) — freigegebene Idee + **nur VISIBLE**
  Kommentare; je Kommentar Autor-**Anzeigename** (keine Mail/userId), Like-Count,
  `likedByMe`.
- `POST /api/ideas/:id/comments` (authenticate, rate-limited, `body` 1–2000) — nur
  auf ACCEPTED-Ideen (sonst 403).
- `POST /api/comments/:id/like` (authenticate) — Toggle, ein Like/Nutzer.
- `GET /api/admin/comments`, `PATCH /api/admin/comments/:id` (adminOnly,
  VISIBLE/HIDDEN). Versteckte Kommentare erscheinen nie öffentlich.
- `COMMENT_STATUSES`-Konstante; `commentController` + `routes/comments.ts`.

**Frontend:**
- `/ideas/:id` `IdeaDetailPage`: Idee + Kommentarliste (`aria-live="polite"`),
  Like-Button (eingeloggt) bzw. statischer Count (Gast), Kommentarformular
  (eingeloggt) bzw. „Anmelden zum Kommentieren"-Hinweis (Gast). Labels/Fokus/ARIA.
- Ideen-Karten verlinken auf die Diskussion (`ideasBoard.discuss`).
- Admin `/admin/comments` `ManageCommentsPage` (Ein-/Ausblenden) + Karte im
  Admin-Dashboard. Services `commentService.*`, Typen `PublicComment/IdeaDetail/AdminComment`.
- i18n `ideaDetail.*`, `adminComments.*`, `ideasBoard.discuss` (EN/DE/EL).

**Datenschutz-Entscheidung:** Kommentar zeigt den **Anzeigenamen** des eingeloggten
Autors (bewusste, öffentliche Beteiligung; Consul/Decide-Madrid-Praxis) — **nie**
E-Mail/Id. Ideen-Einreicher bleiben anonym (A1).

**Tests:** Backend +13 (`comments.test.ts`: 401/400/403, Erstellen, Public-Detail ohne
PII, Like-Toggle, Admin-Hide entfernt aus Public, invalider Status) → **83**.
E2E +1 (eingeloggt kommentieren → erscheint; Gast sieht kein Formular) → **57**.

## Neue Migrationen
_(A1: keine.)_

### `20260611150000_add_idea_comments` (Block A2)
Additiv: neue Tabellen `Comment` + `CommentLike` (+ Index + FKs), keine Datenänderung.
**Bereits während des Runs gegen Supabase deployed** (für E2E nötig).

**Deploy-Befehl (idempotent):**
```bash
cd backend && npx prisma migrate deploy && npx prisma generate
```

---

## TODO — manuell zu erledigen
- [ ] **Supabase:** Bereits während des Runs `npm run db:seed` gegen Supabase ausgeführt
      (Demo-Ideen vorhanden) — bei späteren Schema-Blöcken erneut deployen (s. u.).
- [ ] Echte Bürgerideen werden über `/participate` eingereicht und im Admin freigegeben.
