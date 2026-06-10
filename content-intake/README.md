# Content-Intake — Facebook-Beiträge (Frau Kokkali)

Sammelstelle für die Facebook-Beiträge (Text + Bilder), bevor sie in die Website
einfließen. **Du legst hier nur ab — sortieren mache ich (Claude).**

Am Ende wird jeder Beitrag genau einer dieser drei Schubladen zugeordnet:

| Typ | Wohin auf der Website |
|---|---|
| **PROJECT** | Eintrag unter „Projekte" (Kategorie, Status, SDGs, Ort, Zeitraum …) |
| **ANNOUNCEMENT** | News-Beitrag im Feed (`/news`) |
| **EVENT** | Eintrag unter „Veranstaltungen" |

---

## So legst du einen Beitrag ab

1. Kopiere den Ordner `_TEMPLATE-post/` nach `inbox/` und benenne die Kopie
   `JJJJ-MM-TT-stichwort` — z. B. `inbox/2026-05-14-strandreinigung`.
   (Das Datums-Präfix sorgt für chronologische Sortierung.)
2. Öffne `post.md` und füge oben Datum + (optional) den FB-Link ein, unten den
   **Original-Text** (griechisch, einfach reinkopieren).
3. Lege die Bilder des Beitrags in den Unterordner `images/` (Dateinamen egal).
4. Wiederhole pro Beitrag. So viele wie du willst.

Du musst **nichts** kategorisieren oder übersetzen — nur Text + Bilder ablegen.

---

## Was ich danach mache

- Ich lese alle Ordner in `inbox/`, fasse jeden Beitrag kurz zusammen und
  schlage einen **Typ** vor (PROJECT / ANNOUNCEMENT / EVENT).
- Ich verschiebe sie nach `sorted/<typ>/` und fülle die Metadaten aus
  (Kategorie, SDGs, Ort, Zeitraum …).
- Übersetzungen (EN/DE) erstelle ich beim Einpflegen mit — die Plattform ist
  dreisprachig.
- Dann gehen wir gemeinsam durch, was wirklich auf die Seite kommt.

---

## ⚠️ Hinweis: Urheberrecht & Git

Texte und Fotos stammen von einer fremden Facebook-Seite. Als internes
Quellmaterial ist das ok — aber **dieser Ordner sollte nicht ins öffentliche
Repo gepusht werden**. In die Website übernehmen wir am Ende nur die kuratierten,
neu formulierten Inhalte. Siehe `.gitignore` in diesem Ordner.
