# ZOE — Z1–Z6 Gap-Closure Run Log — 2026-06-11

Branch: `feature/z1-z6-gap-closure` (von `main` @ dabccf5).
Baseline: **BE 68 / FE 22 / E2E 55**. Regeln: nur additive Migrationen, i18n DE/EN/EL,
WCAG, keine erfundenen Daten, Persistenz in der DB, Commit nach jedem Block.

## Übersicht

| Block | Thema | Status | Ergebnis |
|---|---|---|---|
| A1 | Z3 öffentliches, moderiertes Ideen-Board | ✅ | `/ideas` + `GET /api/ideas/public` (nur ACCEPTED, keine PII) + Seed + Flow-Text |
| A2 | Z3 Forum (Kommentare + Likes, moderiert) | ✅ | Comment/CommentLike (additiv), Detailseite mit Kommentaren+Likes, Admin-Moderation |
| B | Z5 Bildungsinhalte (LearningResource) | ✅ | Entität + /learn (+Detail) + Admin-CRUD (DeepL) + Projekt-Verknüpfung + 4 reale Seeds |
| C | Z2 SDG-Dashboard ehrlich machen | ✅ | Erfundene %-Balken entfernt; zählbare Fakten (beitragende/abgeschlossene Projekte) + Disclaimer |
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

### Block B — Bildungsinhalte / LearningResource (Z5) ✅
Eigenständige, lokal verankerte Bildungsinhalte; Infrastruktur + reale Inhalte.

**Schema (additiv):** `LearningResource` (trilingual title+body, category, sdgIds JSON,
imageUrl?, sourceNote?, projectId? FK → Project, timestamps). Migration
`20260611160000_add_learning_resources` (CREATE TABLE/INDEX/FK; FK ON DELETE SET NULL).

**Backend:** `learningController` (public list/detail, admin create/update/delete);
`routes/learn.ts` (öffentlich `GET /api/learn`, `GET /api/learn/:id`); Admin-CRUD in
`admin.ts` (`/admin/learn`, validiert: category∈PROJECT_CATEGORIES, sdgIds Array,
imageUrl URL, projectId existiert). Public-Liste filtert nach category/projectId.

**Frontend:** `/learn` (`LearnPage`, Kategorie-Filter, EntityImage-Karten,
Projekt-Chip, „Mehr erfahren") und `/learn/:id` (`LearnDetailPage`, Headerbild,
`whitespace-pre-line`-Text, SDG-Badges, Quelle, Projekt-Link). Projekt-Detailseite
zeigt verknüpfte Lerninhalte („Mehr erfahren zu diesem Thema"). Admin: `ManageLearnPage`
+ `NewLearnPage` + `EditLearnPage` + `LearnFormFields` (mit `AutoTranslatePanel`/DeepL
für title+body) + Dashboard-Karte. Service `learnService`, Typ `LearningResource`,
i18n `learn.*`/`learnDetail.*`/`adminLearn.*` + `nav.learn`.

**Nav-Einordnung:** unter **„Initiativen"** (Projekte · Termine · **Wissen** ·
Neuigkeiten) — Begründung: die Lerninhalte sind orts-/themenbezogene Inhalte ÜBER die
Initiativen (Antinioti, Erimitis, Meeresschutz, Recycling) und verlinken auf Projekte,
ergänzen also „was wir tun" inhaltlich; passt besser zu Initiativen als zu Transparenz.

**Seed:** 4 **reale**, belegte Inhalte, verknüpft mit echten Projekten —
Antinioti-Lagune (Natura 2000) → proj-antinioti; Erimitis/Naturdenkmäler →
proj-natural-monuments; Meeresschildkröten/ODEK/ARCHELON → proj-marine; Recycling →
proj-circular. Beschreibend, **keine erfundenen Statistiken**.

**Tests:** Backend +6 (`learn.test.ts`: Public-Liste mit Projekt, Filter, Detail/404,
Admin-CRUD 401/403, Create/Update/Delete, invalide Category/Project) → **89**.
E2E +1 (`learn.spec.ts`: /learn lädt, Detail zeigt Inhalt + Projektlink) → **58**.

### Block C — SDG-Dashboard ehrlich machen (Z2) ✅
Angemaßte „% erfüllt" entfernt, durch zählbare Zuordnung ersetzt.
- **Entfernt:** die ProgressBar + „{progress}%" je SDG **und** die erfundene
  `sdgProgressData` (illustrative Prozente) aus `src/data/sdgs.ts` (samt `SDGProgress`-Import).
- **Stattdessen je SDG:** „X beitragende Projekte · Y abgeschlossen" (gezählt aus den
  realen Projektdaten, Status `Completed`).
- **Übersichts-Stat** „Ø Fortschritt %" → **„SDG-Beiträge"** = zählbare Zahl der
  Aktion→SDG-Zuordnungen (Summe der SDGs über alle Projekte).
- **Disclaimer** über den Detailkarten: „…zählbare Zuordnung, kein gemessener
  Zielerreichungsgrad." UN-Icons/Links/Attribution unverändert.
- i18n `sdgDashboard.{statContributions,unitContributions,contributing,ofWhichCompleted,mappingDisclaimer}` (EN/DE/EL).
- Keine Migration, kein Backend. tsc/eslint sauber, FE 22 grün; keine Tests prüften die
  alten Balken (verifiziert).

## Neue Migrationen
_(A1: keine.)_

### `20260611150000_add_idea_comments` (Block A2)
Additiv: neue Tabellen `Comment` + `CommentLike` (+ Index + FKs), keine Datenänderung.
**Bereits während des Runs gegen Supabase deployed** (für E2E nötig).

**Deploy-Befehl (idempotent):**
```bash
cd backend && npx prisma migrate deploy && npx prisma generate
```

### `20260611160000_add_learning_resources` (Block B)
Additiv: neue Tabelle `LearningResource` (+ Index + FK auf Project, ON DELETE SET NULL).
**Bereits während des Runs gegen Supabase deployed + geseedet** (für E2E nötig).
```bash
cd backend && npx prisma migrate deploy && npx prisma generate && npm run db:seed
```

---

## TODO — manuell zu erledigen
- [ ] **Supabase:** Bereits während des Runs `npm run db:seed` gegen Supabase ausgeführt
      (Demo-Ideen vorhanden) — bei späteren Schema-Blöcken erneut deployen (s. u.).
- [ ] Echte Bürgerideen werden über `/participate` eingereicht und im Admin freigegeben.
