# Artefact Description — ZOE Platform

## 1. What Is the ZOE Platform Artefact?

The ZOE Sustainability Platform is a **digital artefact** — specifically an **instantiation** in the DSR taxonomy — designed to support the environmental governance work of the Municipality of Northern Corfu.

In its current form (Version 1), the artefact is a **frontend MVP prototype**: a fully navigable web application demonstrating the information architecture, interaction patterns, and citizen engagement workflows intended for the final system.

It is built as a React TypeScript single-page application using realistic dummy data to simulate what a real deployment would look like.

---

## 2. Target Users

| User Group | Primary Needs | How the Platform Serves Them |
|---|---|---|
| Citizens of Northern Corfu | Understand what the municipality does for the environment; find ways to get involved | Projects overview, participation page, events, SDG dashboard |
| Seasonal visitors / tourists | Understand local environmental situation; contribute during their stay | Events page, participation (report issue, join event) |
| Municipality staff | Communicate programme progress; gather citizen input | Transparency page, projects overview |
| Researchers / academics | Study DSR artefact; understand platform design | Documentation, this repo |
| Students (university context) | Demonstrate DSR project; learn about sustainability governance platforms | Full repository |

---

## 3. Problem Addressed

### Primary problem
Citizens of Northern Corfu have no single, accessible digital touchpoint to:
- Learn what environmental projects the municipality is running
- See honest progress data and impact metrics
- Find ways to participate in environmental action
- Understand how local actions relate to global sustainability goals (SDGs)

### Secondary problems
- Municipality environmental communication is fragmented across unlinked media
- No mechanism for citizens to submit environmental ideas or reports to the municipality
- No public accountability mechanism for environmental project outcomes
- Young people and tourists are not currently engaged in environmental governance

### Root causes
- Small municipalities lack digital capacity for transparency platforms
- No template or reference design exists for local-level environmental participation platforms in the Greek/EU context
- Sustainability governance tools focus on national/EU level, not the local level

---

## 4. Objectives

1. **Demonstrate feasibility** — show that a digital environmental transparency platform for a small Greek municipality is achievable and valuable
2. **Establish information architecture** — create a reusable page/section structure for future iterations
3. **Enable participation** — provide multiple low-barrier participation pathways for citizens at different levels of commitment
4. **Communicate SDG alignment** — show citizens and stakeholders how local actions connect to global goals
5. **Support future development** — document the prototype clearly enough that a real backend can be integrated in Phase 4

---

## 5. Main Features

### Current (Version 1)
- **Landing page** — Overview, hero, statistics, featured projects, CTAs
- **About ZOE** — Programme context, DSR steps, Northern Corfu context
- **Projects** — Filterable grid (category, status, SDG) with all 8 prototype projects
- **Project detail** — Problem, expected impact, citizen involvement, transparency metrics, SDG alignment
- **SDG Dashboard** — 9 SDGs with linked projects, progress bars, descriptions
- **Participation** — 5 participation modes with local-only mock form
- **Events** — Filterable event list with date, location, capacity, registration CTA
- **Impact & Transparency** — 8 KPIs, project progress table, transparency principles
- **Roadmap** — Phase-by-phase development plan

### Not implemented (future versions)
- Real data from a database
- User accounts / authentication
- Admin interface for municipality staff
- Persistent form submissions
- Push notifications for events
- Greek language support
- Map visualisations of project locations

---

## 6. Design Decisions

### Decision 1: Frontend-only prototype
**Decision:** Build a frontend-only prototype with dummy data rather than a minimal full-stack system.  
**Rationale:** For a DSR demonstration, the information architecture and UX value can be fully demonstrated without a real backend. A backend adds technical complexity without adding DSR insight at this stage.

### Decision 2: Visible prototype notices
**Decision:** Show a persistent "Prototype / Dummy Data" banner and labelling throughout.  
**Rationale:** Academic honesty requires clear communication of what is and is not real. The notices also serve as a visual reminder for seminar evaluators and stakeholders.

### Decision 3: Green colour scheme
**Decision:** Use a green-dominant palette (Tailwind green and teal) as the primary brand.  
**Rationale:** Green is universally associated with environmental sustainability. The palette avoids over-designed visuals in favour of clarity and content.

### Decision 4: Multiple participation modes
**Decision:** Offer five distinct participation options rather than a single "contact us" form.  
**Rationale:** Citizens have different levels of available time and commitment. Providing distinct modes (submit idea, volunteer, join event, report issue, feedback) increases the likelihood of any individual finding a suitable entry point.

### Decision 5: SDG alignment as first-class feature
**Decision:** Build a dedicated SDG dashboard and link SDGs on every project card and detail page.  
**Rationale:** SDG alignment is a key accountability mechanism in European environmental governance. Making it visible demonstrates the programme's global coherence.

### Decision 6: TypeScript data separation
**Decision:** Keep all data in `src/data/*.ts` files, separate from components.  
**Rationale:** This makes the data layer obvious and replaceable. Future backend integration only requires updating the data layer, not the components.

---

## 7. Limitations of the MVP

| Limitation | Impact | Mitigation |
|---|---|---|
| All data is fictional | Cannot demonstrate with real outcomes | Clearly labelled; realistic content reduces distraction |
| No real form submission | Citizens cannot actually participate through the platform yet | Local success message makes workflow clear; implementation is documented |
| No Greek language | Excludes non-English speakers (most Northern Corfu residents) | High priority for Phase 2 |
| No map visualisations | Project locations are text-only | Noted in roadmap |
| No search functionality | Users cannot search across projects/events | Could be added with minimal effort in Phase 2 |
| No accessibility audit | WCAG compliance not formally verified | Planned for Phase 2; semantic HTML and aria attributes used |

---

## 8. Future Artefact Evolution

### Phase 2: UX + Content
- Greek language (react-i18next)
- Formal accessibility audit (WCAG 2.1 AA)
- Map integration for project locations
- Improved mobile experience

### Phase 3: DSR Evaluation
- User testing with citizens and municipality staff
- Expert evaluation with IS researchers
- Iteration based on findings

### Phase 4: Real Backend
- PostgreSQL or equivalent database
- REST API (FastAPI or Node.js)
- Admin interface for municipality
- Real citizen submissions with moderation
- Authentication (citizen + staff roles)

### Phase 5: Production
- Hosting on Greek municipal infrastructure
- Analytics and reporting
- Integration with municipality systems
- Mobile app (optional)

The artefact is designed to evolve. The current frontend structure is intentionally modular so that components and pages can be reused without rewriting as the backend is added.
