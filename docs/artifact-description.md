# Artefact Description — ZOE Platform

## 1. What Is the ZOE Platform Artefact?

The ZOE Sustainability Platform is a **digital artefact** — specifically an **instantiation** in the DSR taxonomy — designed to support the environmental governance work of the Municipality of Northern Corfu.

In its current form (Version 1), the artefact is a **full-stack prototype**: a fully navigable web application with a working REST API backend, JWT authentication, and a seeded database — demonstrating the information architecture, interaction patterns, and citizen engagement workflows of the target system.

It is built as a React 19 TypeScript SPA (frontend) with a Node.js + Express + Prisma backend using realistic seed data to simulate what a real deployment would look like.

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

### Current (Version 1) — Implemented

**Public pages:**
- **Landing page** — Overview, hero, statistics, featured projects, CTAs
- **About ZOE** — Programme context, DSR steps, Northern Corfu context
- **Projects** — Filterable grid (category, status, SDG) with API-backed projects
- **Project detail** — Problem, expected impact, citizen involvement, transparency metrics, SDG alignment
- **SDG Dashboard** — SDGs with linked projects, progress bars, descriptions
- **Participation** — 5 participation modes with authenticated form submission
- **Events** — Filterable event list with date, location, capacity
- **Impact & Transparency** — KPIs, project progress table, transparency principles
- **Roadmap** — Phase-by-phase development plan
- **Rewards** — Public overview of the gamification system and tier progression
- **Audiences** — Target audience descriptions (citizens, tourists, municipality)
- **Accessibility** — EU conformance statement (WCAG 2.1 AA / EN 301 549)
- **Privacy** — GDPR privacy notice

**Authenticated user features:**
- Citizen registration and login (JWT, httpOnly refresh cookie)
- User dashboard with points, participations, and project feed
- Profile editing, reward history, badge collection

**Admin features:**
- Admin dashboard with platform statistics
- Project CRUD (create, edit, delete)
- User management (view, promote to admin)

**Platform-wide:**
- Trilingual UI (EN/EL/DE) via react-i18next — 100% i18n compliant
- WCAG 2.1 AA accessibility (EU Directive 2016/2102 compliant)
- Dark mode (Tailwind class strategy, persisted)
- Point-based gamification (5–100 pts per action, 5 reward tiers)

### Not yet implemented (future versions)
- Real municipal project data (currently seed data)
- Map visualisations of project locations
- Push notifications for events
- Search across projects and events
- Mobile app (PWA or React Native)

---

## 6. Design Decisions

### Decision 1: Full-stack prototype with seed data
**Decision:** Build a full-stack prototype (React frontend + Node.js/Express backend + Prisma/SQLite) with seed data rather than a pure frontend mock.  
**Rationale:** A working backend demonstrates the complete interaction model — auth flows, role-based access, data persistence, and API contracts — which are essential to the participation and transparency goals. Seed data keeps the prototype deployable without real municipal data. See `docs/architecture.md` ADR-001.

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
| All data is seed/fictional | Cannot demonstrate with real municipal outcomes | Clearly labelled; realistic content reduces distraction |
| No real municipal data pipeline | Admins must enter data manually | Admin CRUD interface implemented; data import tooling is future work |
| No map visualisations | Project locations are text-only | Noted in roadmap |
| No search functionality | Users cannot search across projects/events | Could be added with minimal effort in next iteration |
| Evaluation not yet conducted | DSR Activity 5 remains planned | Full evaluation plan documented in `docs/evaluation-plan.md` |

---

## 8. Future Artefact Evolution

### Phase 2: DSR Evaluation & Iteration
- Formative user testing (citizens + municipality staff, 5–10 participants)
- Expert walkthroughs with IS/HCI researchers
- System Usability Scale (SUS) questionnaire
- Iteration based on evaluation findings
- See `docs/evaluation-plan.md` for full protocol

### Phase 3: Real Municipal Data
- Data migration: seed data → real project data approved by municipality
- PostgreSQL for production (Prisma schema is already compatible)
- Moderation workflow for citizen submissions
- Integration with municipality communication channels

### Phase 4: Production Deployment
- Hosting on Greek municipal or EU infrastructure
- Analytics and reporting dashboard
- Public launch communications campaign
- Map integration for project locations
- Mobile app (PWA or React Native, optional)

The artefact is designed to evolve. The current modular architecture (API services layer, i18n, Prisma schema) is explicitly designed for incremental extension without rewrites.
