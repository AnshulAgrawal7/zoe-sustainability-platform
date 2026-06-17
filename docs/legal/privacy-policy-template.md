# Datenschutzerklärung — Textgerüst (Vorlage)

> ⚠️ **Keine Rechtsberatung.** Dieses Gerüst (Future_Work 9.2) listet die im
> Echtbetrieb (Szenario B) zu beschreibenden Verarbeitungen auf Basis des
> tatsächlichen Tech-Stacks. **Platzhalter `[…]` ersetzen** und vor
> Veröffentlichung **anwaltlich prüfen** lassen. Verantwortliche Stelle im
> Echtbetrieb ist die **Gemeinde Nord-Korfu**.

## 1. Verantwortliche Stelle
[Name der Gemeinde/Behörde], [Anschrift], [E-Mail], [Telefon].
Datenschutzbeauftragte:r: [Name/Kontakt].

## 2. Verarbeitete Daten & Zwecke
| Daten | Zweck | Rechtsgrundlage (DSGVO) |
|---|---|---|
| Konto: E-Mail, Username, Name, Passwort-Hash, Rolle, Sprache, Profiltyp | Registrierung, Login, Teilnahme, Gamification | Art. 6(1)(b) Vertrag / (a) Einwilligung |
| Einwilligungs-Zeitpunkt (`acceptedTermsAt`) | Nachweis der Einwilligung | Art. 7(1) |
| Beiträge: Ideen, Meldungen/Feedback, Event-Vorschläge (optional Name/E-Mail) | Bürgerbeteiligung | Art. 6(1)(a)/(e) |
| Event-Anmeldungen (RSVP), Kommentare, Votes, Badges, Punkte | Teilnahme/Community | Art. 6(1)(b) |
| Newsletter: E-Mail + Sprache | Newsletter-Opt-in | Art. 6(1)(a) — **siehe §7.4 Future_Work (Versand/Unsubscribe noch offen)** |
| Aggregierte Tages-Zähler (Seitenaufrufe/Besuche) | Reichweitenmessung | Art. 6(1)(f) — **cookielos, keine IP/UA gespeichert** |

## 3. Empfänger / Auftragsverarbeiter (Art. 28)
- **Supabase** (PostgreSQL-Hosting + Storage) — Region **[EU, z. B. eu-central-1]**. AVV erforderlich.
- **DeepL** (maschinelle Übersetzung von Admin-Inhalten) — AVV erforderlich.
- **[Mailprovider]** (Transaktions-/Newsletter-Mail, sobald aktiviert) — AVV + EU-Region.
- **OpenStreetMap-Tiles** (Karten) — Tile-Server-Betreiber erhält die IP des Browsers beim Kartenabruf; in der Erklärung benennen.
- **[Backend-Host]**, **[Frontend-Host]** — AVV erforderlich.

## 4. Cookies
Nur **essenzielles** Auth-Cookie (httpOnly Refresh-Token). **Kein** Tracking-/
Marketing-Cookie. → Aktuell **keine** Consent-Banner-Pflicht. Sobald Analytics/
Embeds aktiviert werden: Consent-Management ergänzen (siehe Future_Work 9.4).

## 5. Speicherdauer
- Konten: bis zur Löschung durch Nutzer:in (Self-Service) oder Admin.
- Beiträge: anonymisiert statt gelöscht bei Konto-Löschung (Thread-Integrität).
- Aggregat-Zähler: [Aufbewahrungsfrist definieren].
- Refresh-Tokens: max. 7 Tage; bei Logout/Sperre sofort entfernt.
- → Retention-Policy vollständig festlegen (Future_Work 5.6).

## 6. Betroffenenrechte
Auskunft (Art. 15), Berichtigung (16), Löschung (17), Einschränkung (18),
Datenübertragbarkeit (20), Widerspruch (21), Widerruf der Einwilligung (7(3)),
Beschwerde bei der Aufsichtsbehörde (77): **[zuständige Aufsichtsbehörde]**.

> **Self-Service bereits umgesetzt:** Datenexport (`/profile` → Export, JSON)
> und Konto-Löschung (`/profile` → Konto löschen). Siehe `user-guide.md`.

## 7. Internationale Übermittlung
Sofern ein Auftragsverarbeiter außerhalb der EU/des EWR verarbeitet:
Rechtsgrundlage benennen (Angemessenheitsbeschluss / SCC).
