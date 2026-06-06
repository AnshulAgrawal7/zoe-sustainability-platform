# Handover & Deployment — Szenario A (selbst-tragende Demo)

> Ziel: die Plattform so weit wie **technisch ohne Drittabhängigkeit (Gemeinde)** möglich **übergabe-bereit** machen; der Rest als klare TODO.
> **Szenario A** = öffentlich erreichbare **Demo unter neutraler Domain**, klar als **Prototyp** gekennzeichnet, **ohne echte personenbezogene Daten**, keine FB-Inhalte ohne Erlaubnis.
> ⚠️ **Keine Rechtsberatung** — Orientierung; finale rechtliche Texte prüfen (lassen).
> Verwandt: [`feature-evaluation.md`](../feature-evaluation.md) · Stand: 2026-06-06.

## Leitprinzip
- Was **im Repo** liegt und **keine fremden Accounts** braucht → wird vorbereitet (**🤖 = ich, additiv + getestet**).
- Was **eigene Accounts / Zahlung / Zugangsdaten / Entscheidungen** braucht → bleibt beim Betreiber (**👤 = du**), klar dokumentiert.
- **Keine Gemeinde-Mitwirkung nötig:** Prototyp-Banner bleibt, Dummy-Daten bleiben, keine FB-Bilder/Texte ohne Erlaubnis.

---

## Arbeitsteilung

### 🤖 Im Repo vorbereitbar (kein Account nötig)
- Prisma auf **Postgres** umstellbar machen (provider + env) + Migrations-/Seed-Skripte
- **`.env.example` für Produktion** (alle nötigen Variablen dokumentiert)
- **Sichere Cookies** in Prod (`secure` + `SameSite`); CORS ist bereits prod-strikt ✓
- **Host-Konfiguration** (z. B. `render.yaml` oder `Dockerfile`) + Build/Start-Skripte
- **Impressum-Seite** + Ausbau der **Datenschutz-Seite** als **Templates mit Platzhaltern** (`[Name]`, `[E-Mail]`, …) + Prototyp-Disclaimer
- *(optional)* Abgeschlossene Projekte: `imageUrl`-Feld + Status-Filter + Storage-Anbindung
- Diese **Deploy-Anleitung** + **Prod-Smoke-Test-Checkliste**

### 👤 Nur du (braucht Accounts/Zahlung/Entscheidung)
- **Supabase-Projekt** anlegen (**EU-Region**) → `DATABASE_URL` + Storage-Keys
- **Backend-Host** (Render / Fly / Railway) — Account + Service
- **Frontend-Host** (Vercel / Netlify) — Account
- **Domain kaufen** (neutral, z. B. `zoe-corfu-demo.org`) + DNS
- **Secrets** in den Host-Dashboards setzen (nie ins Repo)
- **Impressum/Datenschutz** mit **deinen echten Daten** ausfüllen (du als Betreiber:in — **nicht** die Gemeinde)

---

## Deploy-Reihenfolge (Schritt für Schritt)
1. **Supabase-Projekt** (EU) → `DATABASE_URL`.
2. **Prisma → Postgres**: `prisma migrate deploy` + `seed` gegen Supabase.
3. **Backend deployen** mit Env: `DATABASE_URL`, starkes `JWT_SECRET`, `DEEPL_API_KEY`, `NODE_ENV=production`, `CORS_ORIGIN=https://<deine-domain>`.
4. **Frontend deployen** mit `VITE_API_BASE_URL=https://<backend-domain>/api`.
5. **Domain** → DNS auf Frontend-Host; Subdomain/Service für Backend; TLS (autom. beim Host).
6. **Impressum/Datenschutz** ausfüllen. **Smoke-Test** (Admin-Login, Projekte laden, DeepL-Übersetzung, Sprachwechsel EN/EL/DE, Dark Mode).

---

## TODO-Checkliste (Übergabe)

**Technisch (Code) — 🤖 vorbereitbar**
- [ ] Prisma Postgres-Provider + prod `.env.example`
- [ ] Sichere Cookies (`secure` + `SameSite`) in Prod
- [ ] Host-Konfig (`render.yaml`/`Dockerfile`) + Build/Start-Skripte
- [ ] Impressum-Seite + Datenschutz-Template + Prototyp-Disclaimer (mit Platzhaltern)
- [ ] *(optional)* Abgeschlossene Projekte + Bildfeld + Storage
- [ ] Prod-Smoke-Test-Checkliste

**Betrieb — 👤 du**
- [ ] Supabase-Projekt (EU) + `DATABASE_URL` + Storage
- [ ] Backend-Host + Env-Secrets
- [ ] Frontend-Host + `VITE_API_BASE_URL`
- [ ] Domain + DNS + TLS
- [ ] starkes `JWT_SECRET` generieren (z. B. `openssl rand -base64 48`)
- [ ] Impressum/Datenschutz mit echten Daten füllen

**Rechtlich (Szenario A, minimal) — 👤 du**
- [ ] **Impressum** (du als Betreiber:in)
- [ ] **Datenschutzerklärung** (DSGVO) inkl. Nennung **Supabase** & **DeepL** als Auftragsverarbeiter; **AVV/DPA** abschließen (EU-Region)
- [ ] **Bilder** nur eigene/lizenzfreie/mit Erlaubnis (keine FB-Bilder ohne Zustimmung)
- [ ] **Prototyp-Kennzeichnung** sichtbar lassen (Banner) — keine Verwechslung mit offizieller Gemeinde-Seite
- [ ] *(falls echte Accounts)* öffentliche **Registrierung deaktivieren** ODER Datenschutz vollständig machen + Cookie-Hinweis

**Future Work (Szenario B / offiziell) — bewusst NICHT Teil von A**
- [ ] Gemeinde-Mandat, echte verifizierte Inhalte, vollständige Barrierefreiheitserklärung + Audit, Newsletter-Versand, Persistenz/Moderation der Einreichungen, Monitoring/Backups

---

## Bewusst NICHT Teil von Szenario A
FB-Daten-Import (ToS/Recht) · echte personenbezogene Nutzerdaten · offizielle Repräsentation der Gemeinde.
→ In DSR-Sprache: **bewusste Designentscheidungen** + Future Work (siehe `feature-evaluation.md`).

## Hinweis zu „dev vs. prod"-Datenbank
Prisma bindet **einen** `provider` pro Schema. Beim Umstieg auf Postgres nutzt dann auch die lokale Entwicklung Postgres (z. B. ein zweites, kostenloses Supabase-Projekt „dev" oder lokales Docker-Postgres). Das wird beim Umsetzen mitdokumentiert.
</content>
