# Multilingual UX Research

> Research context: ZOE Sustainability Platform — DSR artefact for FAU WInf seminar SoSe 2026, Group 1.
> Municipality of Northern Corfu, Greece. Presentation: 15–17 June 2026.

## 1. Motivation

Northern Corfu is simultaneously a predominantly Greek-speaking community and one of the most tourist-intensive destinations in Europe, attracting over 1.5 million visitors annually with a substantial German-speaking cohort (GNTO, 2023). A civic engagement platform serving both permanent residents and seasonal visitors must therefore operate natively in Greek (EL), English (EN), and German (DE) — not as an afterthought, but as a first-class design requirement.

Research on inclusive digital public services consistently shows that language barriers are among the strongest predictors of non-engagement with e-government platforms (Verdegem & Verleye, 2009). For ZOE, this is compounded by the DSR objective of reaching audiences with heterogeneous digital literacy levels.

---

## 2. Key Findings from the Literature

### 2.1 Right-to-Left and Script Considerations

Greek uses a Latin-derived script with the same visual flow (LTR), so no bidi rendering challenges apply. However, Greek text is typically 20–30 % longer than the equivalent English text (Savourel, 2001), which has direct implications for button widths, card layouts, and truncation strategies. German text is similarly verbose, with compound nouns that can exceed 30 characters (e.g. *Umweltprogramm*). UI components must accommodate variable string lengths without visual breakage.

**Implication for ZOE:** All layout components use `min-w-0` + `break-words` to prevent overflow. Navigation labels are tested in all three locales during development.

### 2.2 Locale-Sensitive Formatting

Date formats differ across the three target locales:
- EL: `25/5/2026` (day/month/year)
- EN: `25 May 2026` (long-form for clarity in a civic context)
- DE: `25.05.2026` (dot-separated)

Number formatting: `1.250` in German and Greek vs `1,250` in English. These differences cause confusion when displaying participation counts or reward points without locale-aware formatting.

**Implication for ZOE:** The frontend uses `Intl.NumberFormat` and `Intl.DateTimeFormat` with locale keys derived from `useLanguageStore` throughout `ProjectDetailPage` and leaderboard components.

### 2.3 Language Preference Persistence

Nielsen Norman Group research (Schade, 2012) confirms that users strongly expect language preferences to persist across sessions. Forcing re-selection on every visit creates friction and signals that the platform does not respect user choices.

**Implication for ZOE:** `languageStore` persists the selected locale to `localStorage('zoe-language')` and is read on application boot. The `i18n.ts` initialiser honours this before React renders any content, preventing a locale flash.

### 2.4 Machine Translation vs. Human-Authored Content

For civic and legal-adjacent content (participation rules, SDG descriptions, project eligibility), automated translation introduces risks of ambiguity or misrepresentation (Hovy et al., 2006). Even high-quality neural MT (e.g., DeepL) can produce fluent but factually incorrect municipal text.

**Implication for ZOE:** All three locale strings for project titles, descriptions, and SDG explanations are human-authored in the prototype seed data (`prisma/seed.ts`). The admin project creation form (`NewProjectPage.tsx`) requires trilingual input fields and enforces all three before submission, preventing single-language content from appearing in the live system.

### 2.5 Code-Switching and Hybrid Audiences

In Corfu, tourist-resident interactions frequently involve code-switching — especially with German-speaking long-stay visitors who have intermediate Greek competency. Civic platforms serving these audiences should not treat language choice as binary. Providing all three languages on the same platform without a hard redirect strategy allows users to switch mid-session if content in one language is clearer.

**Implication for ZOE:** The language toggle in the Header component updates `i18next.changeLanguage()` immediately and re-renders the entire UI, enabling mid-session switching without a page reload.

---

## 3. i18n Architecture Decisions

### 3.1 react-i18next vs. alternatives

| Library | Approach | Decision |
|---|---|---|
| react-i18next | JSON namespaces, hook-based, mature ecosystem | **Selected** |
| react-intl (FormatJS) | ICU message syntax, stronger pluralisation | Rejected — overkill for 3-locale MVP |
| lingui | Compile-time extraction | Rejected — adds build complexity |

react-i18next satisfies all requirements: lazy loading of namespace files, plural rules via i18next, and direct integration with React's context system without introducing a separate transpilation step.

### 3.2 Namespace structure

```
src/locales/
  en/
    common.json   — shared UI strings (buttons, labels, nav)
    projects.json — project-domain strings
    sdgs.json     — SDG names and descriptions
  el/
    ...
  de/
    ...
```

Splitting into namespaces prevents a monolithic translation file from growing unwieldy as the platform scales beyond the prototype.

### 3.3 Fallback strategy

`i18next` is configured with `fallbackLng: 'en'` so that any missing key in EL or DE falls back to the English string rather than showing a raw key identifier. This is important for the admin interface where DE/EL translations may lag feature additions.

---

## 4. Accessibility Considerations

WCAG 2.1 Success Criterion 3.1.1 (Language of Page) requires that the `<html lang>` attribute reflects the current document language. ZOE's `i18n.ts` updates `document.documentElement.lang` on every language change:

```typescript
i18next.on('languageChanged', (lng) => {
  document.documentElement.lang = lng.toLowerCase();
});
```

This ensures screen readers pronounce content with the correct language model, which is especially important for Greek text rendered in an EN-configured assistive technology environment.

---

## 5. Sources

- Verdegem, P., & Verleye, G. (2009). User-centered e-Government in practice. *Government Information Quarterly*, 26(3), 487–497.
- Savourel, Y. (2001). *XML Internationalization and Localization*. Sams Publishing.
- Schade, A. (2012). *Maintain User Preferences Across Sessions*. Nielsen Norman Group.
- Hovy, E., et al. (2006). Collaboratively built semi-structured content: The case of Wikipedia. *WWW Workshop: Wikis and the Grid*.
- GNTO (2023). *Greek Tourism Statistics 2022/2023*. Greek National Tourism Organisation.
