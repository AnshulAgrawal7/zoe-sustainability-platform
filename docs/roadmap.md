# Development Roadmap — ZOE Platform

This roadmap describes the planned evolution of the ZOE Sustainability Platform from the current prototype through to a potential production system. Each phase is grounded in the DSR iterative process: build → demonstrate → evaluate → iterate.

---

## Phase 1 — Full-Stack Prototype (Current)
**Timeline:** SoSe 2026 (FAU Seminar)  
**Status:** ✅ Complete

### Goal
Demonstrate the full concept — information architecture, citizen engagement workflows, authentication, and admin tooling — as a working full-stack prototype ready for evaluation.

### Scope
- React 19 + TypeScript + Tailwind CSS SPA (frontend)
- Node.js + Express + Prisma + SQLite REST API (backend)
- JWT authentication (citizen + admin roles)
- 8 environmental projects (seed data)
- Public pages: Landing, About, Projects, Project Detail, SDG Dashboard, Participation, Events, Transparency, Roadmap, Rewards, Audiences
- Authenticated pages: Dashboard, Profile, User Rewards
- Admin pages: Manage Projects (CRUD), Manage Users, New/Edit Project
- Trilingual UI: English, Greek, German (react-i18next)
- WCAG 2.1 AA accessibility (EU Directive 2016/2102)
- Point-based gamification: 5 reward tiers, 5 achievement badges
- Full documentation: DSR methodology, API, user guide, admin guide, architecture

### Success criteria
- All pages navigable, backend and frontend connected
- Auth flows working (register, login, logout, role-based access)
- Admin can create/edit/delete projects and manage users
- Citizens earn points for participation actions
- 37 frontend + 32 backend + 49 E2E tests passing
- Demonstrable to seminar and municipality stakeholders

---

## Phase 2 — DSR Evaluation & Iteration
**Timeline:** Summer–Autumn 2026  
**Status:** Planned

### Goal
Conduct structured DSR evaluation with real users. Iterate on findings. Produce evaluation report for academic submission.

### Scope
- Formative user testing (5–10 participants: citizens, municipality staff, IS researchers)
- Expert walkthroughs with IS/HCI researchers
- System Usability Scale (SUS) questionnaire
- Semi-structured interviews on usefulness, usability, participation intent
- Iteration based on top 3–5 evaluation findings
- Evaluation report for academic publication / seminar submission
- Stakeholder presentation to Municipality of Northern Corfu

### Evaluation milestone
Full evaluation protocol in `docs/evaluation-plan.md`. Target: SUS score ≥ 68 (average usability threshold).

---

## Phase 3 — Real Municipal Data
**Timeline:** Autumn–Winter 2026  
**Status:** Planned

### Goal
Replace seed data with real, municipality-approved project data. Establish content management workflows.

### Scope
- Data migration: prototype seed → real municipal project data
- PostgreSQL for production (Prisma schema already compatible)
- Moderation workflow for citizen submissions
- Content review by municipality communications team
- Enhanced SDG visualisation (charts, timelines)
- Map integration for project locations
- Search functionality across projects and events

---

## Phase 4 — Production Deployment
**Timeline:** 2027  
**Status:** Planned

### Goal
Full public deployment for Northern Corfu citizens. Ongoing operations, monitoring, and feature development.

### Scope
- Production hosting on reliable infrastructure (Greek municipal or EU-hosted)
- Public launch communications campaign
- Citizen onboarding guides and tutorials
- Analytics dashboard for usage monitoring
- Summative evaluation (before/after metrics)
- Open data API for researchers and journalists
- Mobile app exploration (PWA or React Native)

### Success criteria
- Platform live and publicly accessible
- 100+ unique citizen interactions in first month
- Summative evaluation completed and published
- Municipality staff independently maintaining content

---

## Key Dependencies

| Phase | Depends on |
|---|---|
| Phase 2 | Phase 1 complete; evaluation participants recruited |
| Phase 3 | Phase 2 complete; municipality decision to provide real data |
| Phase 4 | Phase 3 complete; hosting budget; municipal IT approval |

---

## What Is Out of Scope (All Phases)

- National-level data aggregation (this is a local platform)
- Blockchain or NFT features
- Social media integration (privacy concerns; out of scope)
- Real-time collaboration features
