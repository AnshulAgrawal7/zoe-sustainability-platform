# SDG Communication Research

> Research context: ZOE Sustainability Platform — DSR artefact for FAU WInf seminar SoSe 2026, Group 1.
> Municipality of Northern Corfu, Greece. Presentation: 15–17 June 2026.

## 1. Motivation

The UN Sustainable Development Goals (SDGs) form the normative backbone of ZOE's project categorisation. Displaying SDG affiliation is not merely decorative — it situates local municipal projects within a globally recognised framework, signals legitimacy to multilateral stakeholders, and helps citizens understand *why* a project matters beyond its immediate local context.

However, the SDG communication literature identifies a consistent problem: the goals are politically abstract and jargon-laden, making them difficult for lay citizens to connect to everyday life (Biermann et al., 2017). A civic engagement platform that lists "SDG 11 — Sustainable Cities and Communities" without further interpretation does not meaningfully increase environmental literacy or participation motivation.

ZOE addresses this gap by pairing SDG badges with plain-language descriptions, colour-coded visuals consistent with the official UN palette, and contextual anchoring to the Corfu municipal setting.

---

## 2. The SDG Framework and Municipal Relevance

### 2.1 Which SDGs apply to Northern Corfu?

Of the 17 SDGs, the following map most directly to the Northern Corfu municipal mandate:

| SDG | Title | Corfu Relevance |
|---|---|---|
| 3 | Good Health and Well-Being | Water quality, coastal pollution |
| 6 | Clean Water and Sanitation | Ionian Sea conservation, drinking water |
| 7 | Affordable and Clean Energy | Island energy transition (solar, wind) |
| 11 | Sustainable Cities and Communities | Urban mobility, heritage protection |
| 12 | Responsible Consumption and Production | Waste reduction, circular economy |
| 13 | Climate Action | Tourism carbon footprint, wildfire prevention |
| 14 | Life Below Water | Marine protected areas, Posidonia meadows |
| 15 | Life on Land | Olive grove preservation, biodiversity |
| 17 | Partnerships for the Goals | EU Interreg funding, NGO collaboration |

The ZOE seed data (`prisma/seed.ts`) assigns SDG combinations to each project grounded in this mapping, e.g., the "Ionian Sea Cleanup" project links SDGs 14, 13, and 6.

### 2.2 SDG Multi-tagging

Research on SDG interdependencies (Le Blanc, 2015) shows that real-world sustainability initiatives rarely map to a single goal. A coastal clean-up simultaneously advances SDG 14 (Life Below Water), SDG 13 (Climate Action), and SDG 3 (Good Health) through reduced marine plastic pollution. ZOE's data model therefore stores `sdgIds` as a JSON array (`String` field in the SQLite schema) to allow multi-tagging.

---

## 3. Communication Strategy

### 3.1 Colour Coding

The UN assigned a unique colour to each SDG as part of its official visual identity (UN, 2015). Using these colours in the ZOE interface provides:
- **Instant recognition** for users familiar with the SDG framework (educators, NGO workers, municipal staff)
- **Visual differentiation** to distinguish multiple SDG badges in the same project card
- **Legitimacy signal** — the platform is visually aligned with an internationally recognised standard

ZOE stores the official hex colours in `src/data/sdgs.ts` and applies them via inline `style={{ backgroundColor: sdg.color }}` — the only sanctioned case for inline styles in the codebase (Tailwind cannot handle runtime-dynamic colour values from a fixed palette).

### 3.2 Plain-Language Descriptions

EU citizen engagement research (Ramboll, 2021) consistently shows that abstract goal statements like "Take urgent action to combat climate change and its impacts" score poorly on comprehension among non-expert audiences. ZOE's SDG data includes short plain-language summaries adapted to the Corfu context (e.g., "Protect Corfu's forests, olive groves, and biodiversity") alongside the official UN formulation.

The trilingual (`titleEn`/`titleEl`/`titleDe`) structure ensures these plain-language descriptions are available in the user's active locale.

### 3.3 Progressive Disclosure

Following the UX principle of progressive disclosure (Shneiderman, 1997), ZOE shows only the SDG icon+colour on project list cards. The full SDG name and description appear in the project detail view. This prevents cognitive overload while preserving depth for motivated users.

---

## 4. Implementation Details

### 4.1 `src/data/sdgs.ts` structure

```typescript
export interface SDG {
  id: number;         // 1–17
  titleEn: string;    // Official UN English title
  titleEl: string;    // Greek title
  titleDe: string;    // German title
  descEn: string;     // Plain-language EN description
  descEl: string;
  descDe: string;
  color: string;      // Official UN hex colour
  icon: string;       // Path to official UN icon (public/sdg-icons/)
}
```

### 4.2 Parsing `sdgIds` from the backend

The backend stores `sdgIds` as a JSON string (`"[11, 14, 13]"`). Frontend services parse this before rendering:

```typescript
const ids: number[] = JSON.parse(project.sdgIds);
const sdgs = ids.map(id => SDG_DATA.find(s => s.id === id)).filter(Boolean);
```

This keeps the SQLite schema simple while the frontend handles presentation logic.

### 4.3 SDG Picker in Admin Forms

`NewProjectPage.tsx` and `EditProjectPage.tsx` present all 17 SDGs as toggleable buttons with their official colours, allowing admins to select multiple goals. Selected SDGs are tracked as `number[]` in form state and serialised on submit.

---

## 5. Awareness vs. Behaviour Change

A critical limitation identified in the SDG communication literature (Darnton, 2008) is that increased awareness of sustainability goals does not automatically translate into behaviour change. Displaying SDG badges informs citizens of the normative framing but does not by itself motivate participation.

ZOE addresses this through its reward system (see `docs/research/reward-system-research.md`): SDG alignment is one component of a broader engagement loop that combines points, badges, leaderboard placement, and social proof. The hypothesis (Artefact Utility in DSR terms) is that combining normative legitimacy (SDG framing) with behavioural incentives (gamification) produces higher sustained participation rates than either mechanism alone.

---

## 6. Sources

- Biermann, F., et al. (2017). The political impact of the Sustainable Development Goals. *Science*, 356(6339), 91–922.
- Le Blanc, D. (2015). Towards integration at last? The Sustainable Development Goals as a network of targets. *Sustainable Development*, 23(3), 176–187.
- UN (2015). *Transforming our world: the 2030 Agenda for Sustainable Development*. United Nations.
- Ramboll (2021). *Citizen Engagement in Sustainability Policy: European Survey Findings*. Ramboll Management Consulting.
- Shneiderman, B. (1997). *Designing the User Interface* (3rd ed.). Addison-Wesley.
- Darnton, A. (2008). *Behaviour Change Knowledge Review*. UK Government Social Research.
