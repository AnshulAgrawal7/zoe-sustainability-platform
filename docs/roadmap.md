# Development Roadmap — ZOE Platform

This roadmap describes the planned evolution of the ZOE Sustainability Platform from the current prototype through to a potential production system. Each phase is grounded in the DSR iterative process: build → demonstrate → evaluate → iterate.

---

## Phase 1 — MVP Prototype (Current)
**Timeline:** Spring 2025  
**Status:** Complete

### Goal
Demonstrate the concept, information architecture, and citizen engagement workflows. Establish a working codebase ready for evaluation.

### Scope
- Frontend-only React + TypeScript + Tailwind SPA
- 8 environmental projects with dummy data
- 9 pages: Landing, About, Projects, Project Detail, SDG Dashboard, Participation, Events, Transparency, Roadmap
- Local-only mock form for citizen participation
- Full DSR documentation

### Success criteria
- `npm run build` passes with no TypeScript errors
- All pages navigable
- Prototype notices visible throughout
- Documentation complete and accurate
- Demonstrable to seminar and municipality stakeholders

---

## Phase 2 — UX & Content Improvement
**Timeline:** Summer–Autumn 2025  
**Status:** Planned

### Goal
Improve the platform based on initial feedback and expert review. Conduct formative user testing.

### Scope
- Expert UI/UX review and prioritised iterations
- WCAG 2.1 AA accessibility audit and fixes
- Greek language support (`react-i18next`)
- Improved mobile experience (especially navigation and project cards)
- Enhanced SDG visualisation (e.g., Recharts bar/donut charts)
- Content review by municipality communications team
- Search functionality across projects and events
- Map integration for project locations

### Evaluation milestone
5–10 formative user testing sessions (see `docs/evaluation-plan.md`)

---

## Phase 3 — DSR Evaluation & Iteration
**Timeline:** Autumn–Winter 2025  
**Status:** Planned

### Goal
Conduct structured DSR evaluation. Iterate on findings. Produce evaluation report for academic submission.

### Scope
- Structured evaluation sessions (8–15 participants: citizens, staff, researchers)
- System Usability Scale (SUS) questionnaire
- Expert walkthroughs with IS/HCI researchers
- Thematic analysis of interview findings
- Artefact iteration based on top 3–5 findings
- Evaluation report for academic publication / seminar submission
- Stakeholder presentation to municipality

### Success criteria
- SUS score ≥ 68 (average usability threshold)
- All six evaluation criteria scored and documented
- Iteration decisions documented with rationale
- Academic report submitted

---

## Phase 4 — Backend Concept & Pilot
**Timeline:** 2026  
**Status:** Future work (not started)

### Goal
Design and implement a real backend to replace dummy data. Establish the data model, API, and admin interface.

### Scope
- Database schema design (PostgreSQL or equivalent)
- REST API design and implementation (FastAPI or Node.js + Express)
- Authentication and role management (citizen / municipality staff)
- Admin dashboard for municipality staff
- Citizen submission workflow with moderation
- Data migration: dummy → real project data
- GDPR and security assessment
- Pilot deployment with selected municipality staff

### Technical requirements
See `docs/backend-future-concept.md` for full technical specification.

### Success criteria
- Staff can create and update projects without code changes
- Citizens can submit ideas/reports and receive confirmation
- Admin can moderate submissions before they are published
- All real data verified and approved by municipality

---

## Phase 5 — Production Deployment
**Timeline:** 2026–2027  
**Status:** Future work (not started)

### Goal
Full public deployment for Northern Corfu citizens. Ongoing operations, monitoring, and feature development.

### Scope
- Production hosting on reliable infrastructure (Greek municipal or EU-hosted)
- Public launch communications campaign
- Citizen onboarding guides and tutorials
- Analytics dashboard for usage monitoring
- Summative evaluation (before/after metrics)
- Mobile app exploration (React Native or PWA)
- Open data API for researchers and journalists
- Potential integration with EU/national sustainability reporting systems

### Success criteria
- Platform live and publicly accessible
- 100+ unique citizen interactions in first month
- Summative evaluation completed and published
- Municipality staff independently maintaining content

---

## Key Dependencies

| Phase | Depends on |
|---|---|
| Phase 2 | Phase 1 complete; user testing participants recruited |
| Phase 3 | Phase 2 complete; evaluation participants recruited |
| Phase 4 | Phase 3 complete; municipality decision to invest in backend; developer capacity |
| Phase 5 | Phase 4 complete; hosting budget; municipal IT approval |

---

## What Is Out of Scope (All Phases)

- National-level data aggregation (this is a local platform)
- Blockchain or NFT features
- Gamification / points / leaderboards (considered but deprioritised; may revisit in Phase 5)
- Social media integration (privacy concerns; out of scope)
- Real-time collaboration features
