# Existing System Audit — ZOE Sustainability Platform

**Audit Date:** 2026-05-25  
**Auditor:** Phase 0 analysis prior to Phase 4 (backend) integration  
**Purpose:** Inventory of current prototype for migration planning

---

## 1. Repository Overview

| Property | Value |
|---|---|
| Root | `/zoe-sustainability-platform/` |
| Type | Frontend-only SPA (no backend, no auth) |
| Build tool | Vite 8 |
| Framework | React 19 + TypeScript 6 |
| Styling | Tailwind CSS 3 |
| Routing | React Router 7 (Browser Router) |
| Icons | lucide-react |
| Node modules | 176 packages |

---

## 2. Directory Structure (Current)

```
/
├── .claude/agents/          # 4 sub-agents (to be extended to 8)
├── docs/                    # 7 markdown files
├── public/                  # static assets
├── src/
│   ├── app/Router.tsx       # central router
│   ├── assets/              # hero.png, SVGs
│   ├── components/
│   │   ├── layout/          # Header, Footer, Layout
│   │   └── ui/              # Badge, ProgressBar, PrototypeBanner, SDGBadge, StatusBadge
│   ├── data/                # 5 prototype data files
│   ├── pages/               # 11 page components
│   └── types/index.ts       # shared TypeScript types
├── CLAUDE.md
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.app.json
```

---

## 3. Routes Inventory

| Path | Component | Status |
|---|---|---|
| `/` | LandingPage | Keep + i18n wrap |
| `/about` | AboutPage | Keep + i18n wrap |
| `/projects` | ProjectsPage | Keep + connect to API |
| `/projects/:id` | ProjectDetailPage | Keep + connect to API |
| `/sdg-dashboard` | SDGDashboardPage | Keep + i18n wrap |
| `/participate` | ParticipationPage | Keep + connect auth |
| `/audiences` | AudiencesPage | Keep + i18n wrap |
| `/events` | EventsPage | Keep + i18n wrap |
| `/transparency` | TransparencyPage | Keep + i18n wrap |
| `/roadmap` | RoadmapPage | Keep + i18n wrap |
| `/rewards` | RewardsPage | Extend with live data |
| `/login` | LoginPage | **NEW** |
| `/register` | RegisterPage | **NEW** |
| `/dashboard` | UserDashboard | **NEW** |
| `/profile` | ProfilePage | **NEW** |
| `/admin` | AdminDashboard | **NEW** |
| `/admin/projects` | ManageProjects | **NEW** |
| `/admin/projects/new` | NewProject | **NEW** |
| `/admin/projects/:id/edit` | EditProject | **NEW** |
| `/admin/users` | ManageUsers | **NEW** |

---

## 4. Components Inventory

### `components/layout/`
| File | Description | Action |
|---|---|---|
| `Header.tsx` | Nav + logo, responsive | Extend: add auth state, language toggle, dark mode toggle, points display |
| `Footer.tsx` | Links, copyright | Extend: add i18n strings |
| `Layout.tsx` | Shell with PrototypeBanner | Keep as-is, extend with dark mode class on `<html>` |

### `components/ui/`
| File | Description | Action |
|---|---|---|
| `Badge.tsx` | Generic badge | Keep, add dark variants |
| `ProgressBar.tsx` | Progress indicator | Keep, extend for points progress |
| `PrototypeBanner.tsx` | Research disclaimer | Keep unchanged (academic requirement) |
| `SDGBadge.tsx` | SDG number + color | Keep, add i18n title support |
| `StatusBadge.tsx` | Project status | Keep, add i18n |

**Missing UI primitives to create:**
Button, Card, Modal, Input, Textarea, Select, Avatar, Spinner, Alert

---

## 5. Data Files Inventory

| File | Type | Records | Action |
|---|---|---|---|
| `data/projects.ts` | `Project[]` | 8 projects (Corfu-grounded) | Keep as fallback; API becomes primary source |
| `data/sdgs.ts` | `SDG[]` | 11 SDGs (subset) | Keep as static reference |
| `data/events.ts` | `Event[]` | ~6 events | Keep as fallback |
| `data/rewards.ts` | `RewardTier[] + RewardActivity[] + CommunityMilestone[]` | Tiers, activities | Keep as fallback; backend becomes authoritative |
| `data/audiences.ts` | `TargetAudience[]` | ~6 audience profiles | Keep (static, non-user-data) |

All files correctly start with `// PROTOTYPE DATA —`.

---

## 6. Type Definitions (`types/index.ts`)

Current types (133 lines):
- `ProjectCategory`, `ProjectStatus`, `SDGNumber` (type unions)
- `SDG`, `Project`, `TransparencyMetric` (domain shapes)
- `Event`, `ImpactMetric`, `SDGProgress` (domain shapes)
- `ParticipationOption`, `RewardTier`, `RewardActivity`, `CommunityMilestone` (engagement shapes)
- `TargetAudience` (personas)

**New types to add:** `User`, `AuthUser`, `Participation`, `Badge`, `UserBadge`, `ApiResponse<T>`, `AuthTokens`, `LoginPayload`, `RegisterPayload`

---

## 7. Existing Sub-Agents

| Agent file | Role |
|---|---|
| `documentation-agent.md` | Markdown/docs writing |
| `dsr-methodology-agent.md` | DSR alignment, academic framing |
| `frontend-implementation-agent.md` | React components, TS, Tailwind |
| `ux-content-agent.md` | Citizen copy, aria labels |

**→ 4 new agents to add:** research-agent, architect-agent, backend-agent, review-agent, testing-agent *(note: total will be 8 by replacing/extending existing 4)*

---

## 8. Documentation Inventory

| File | Status |
|---|---|
| `docs/architecture.md` | Exists, frontend-only — needs full rewrite for full-stack |
| `docs/dsr-methodology.md` | Complete, solid. Needs Phase 4–6 update |
| `docs/artifact-description.md` | Exists |
| `docs/backend-future-concept.md` | Placeholder concept — superseded by Phase 4 |
| `docs/evaluation-plan.md` | Exists |
| `docs/git-workflow.md` | Exists |
| `docs/roadmap.md` | Exists |
| `docs/api.md` | **MISSING** — must create |
| `docs/user-guide.md` | **MISSING** — must create |
| `docs/admin-guide.md` | **MISSING** — must create |

---

## 9. What Is RETAINED vs. CHANGED

### Retained (no structural change)
- All 8 existing project data files (Corfu-grounded content)
- `PrototypeBanner` component (academic requirement)
- `SDGBadge`, `StatusBadge`, `ProgressBar`, `Badge` UI components
- All 11 existing page layouts (content stays, wrapped with i18n)
- DSR methodology document (extend, not replace)
- `tailwind.config.js`, `vite.config.ts`, `tsconfig` files

### Changed / Extended
- `Header.tsx` — auth state, language toggle, dark mode toggle
- `src/types/index.ts` — new auth/backend types added
- `CLAUDE.md` — full rewrite reflecting backend + i18n

### NEW
- `backend/` — full Node.js/Express/Prisma backend
- `src/stores/` — Zustand stores (auth, theme, language)
- `src/services/` — API service layer
- `src/hooks/` — custom hooks
- `src/locales/` — EN/EL/DE translation files
- `src/pages/auth/` — Login, Register
- `src/pages/user/` — Dashboard, Profile, Rewards (extended)
- `src/pages/admin/` — AdminDashboard, ManageProjects, ManageUsers
- `src/components/auth/` — ProtectedRoute, AdminRoute
- 8 updated/new sub-agents

---

## 10. Architecture Decision: No Monorepo Split

**Decision:** Frontend remains at root `src/` (not moved to `frontend/src/`).  
**Rationale:** Moving the entire frontend tree would break the working build and create a high-risk migration with no functional benefit for the prototype. Backend is added as `backend/` alongside.  
**ADR:** Documented. Revisit for Phase 5 (production deployment).
