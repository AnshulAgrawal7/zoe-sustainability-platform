# Architecture — ZOE Platform

## 1. Current Architecture: Frontend-Only

The ZOE platform (Version 1) is a **client-side-only single-page application (SPA)**. There is no server, no database, no API, and no authentication.

```
Browser
  └── React SPA (Vite build)
        ├── React Router (client-side routing)
        ├── Pages (9 routes)
        ├── Components (layout + UI)
        └── Data layer (TypeScript .ts files — no network calls)
```

All data is imported directly at module load time from files in `src/data/`. This means the application is completely self-contained and works from `npm run dev` with no external dependencies at runtime.

---

## 2. Folder Structure

```
src/
├── app/
│   └── Router.tsx              # createBrowserRouter config, route definitions
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Sticky navigation with mobile hamburger
│   │   ├── Footer.tsx          # Footer with links and research note
│   │   └── Layout.tsx          # Outlet wrapper with PrototypeBanner
│   └── ui/
│       ├── Badge.tsx           # Generic coloured badge
│       ├── ProgressBar.tsx     # Accessible progress bar with value
│       ├── PrototypeBanner.tsx # Amber top banner — never remove
│       ├── SDGBadge.tsx        # Coloured SDG number badge with tooltip
│       └── StatusBadge.tsx     # Project status badge (Active/Planning/etc)
│
├── data/
│   ├── projects.ts             # 8 prototype environmental projects
│   ├── events.ts               # 10 prototype events/initiatives
│   ├── sdgs.ts                 # 9 SDG definitions + progress data
│   └── metrics.ts              # 8 KPIs + 5 participation options
│
├── pages/
│   ├── LandingPage.tsx         # / — hero, stats, featured projects, pillars
│   ├── AboutPage.tsx           # /about — programme description, DSR steps
│   ├── ProjectsPage.tsx        # /projects — filterable grid
│   ├── ProjectDetailPage.tsx   # /projects/:id — full project detail
│   ├── SDGDashboardPage.tsx    # /sdg-dashboard — SDG cards with progress
│   ├── ParticipationPage.tsx   # /participate — 5 modes + mock form
│   ├── EventsPage.tsx          # /events — event list with category filter
│   ├── TransparencyPage.tsx    # /transparency — KPIs + progress table
│   └── RoadmapPage.tsx         # /roadmap — 5-phase roadmap timeline
│
├── types/
│   └── index.ts                # All shared TypeScript interfaces
│
└── index.css                   # Tailwind base/components/utilities
```

---

## 3. Routing

All routes are defined in `src/app/Router.tsx` using React Router v7's `createBrowserRouter`.

| Route | Component | Description |
|---|---|---|
| `/` | `LandingPage` | Home page |
| `/about` | `AboutPage` | About the ZOE programme |
| `/projects` | `ProjectsPage` | Filterable project grid |
| `/projects/:id` | `ProjectDetailPage` | Individual project detail |
| `/sdg-dashboard` | `SDGDashboardPage` | SDG overview |
| `/participate` | `ParticipationPage` | Citizen participation |
| `/events` | `EventsPage` | Events and initiatives |
| `/transparency` | `TransparencyPage` | Impact metrics |
| `/roadmap` | `RoadmapPage` | Development roadmap |

All routes share the `Layout` component (header, footer, prototype banner) via React Router's `Outlet`.

---

## 4. Data Flow

Since there is no backend, data flows as follows:

```
src/data/*.ts
    ↓ (static import at module load)
Page component
    ↓ (props / direct access)
UI components
    ↓ (rendered HTML)
Browser DOM
```

Example flow for the Projects page:
1. `ProjectsPage.tsx` imports `projects` array from `src/data/projects.ts`
2. React state manages filter selections (category, status, SDG)
3. `filtered` is computed from the `projects` array on each render
4. Each project card renders via inline JSX using `StatusBadge`, `ProgressBar`, `SDGBadge` components

There are no `useEffect` calls for data fetching. No `useState` initialised from API calls. No loading states.

---

## 5. Type System

All shared types are in `src/types/index.ts`:

- `Project` — full project shape including transparency metrics and citizen involvement
- `Event` — event with capacity tracking
- `SDG` — SDG definition with color and description
- `ImpactMetric` — KPI for transparency page
- `ParticipationOption` — participation card definition
- `ProjectCategory`, `ProjectStatus`, `SDGNumber` — union/literal types for type safety

Components that accept project data use these types for props. This ensures that if the data schema changes, TypeScript reports all affected components.

---

## 6. Component Architecture

### Layout components
`Layout.tsx` is the root wrapper for all pages. It renders `PrototypeBanner`, `Header`, `<Outlet />`, and `Footer` in order.

`Header.tsx` is stateful (hamburger open/closed) but has no other business logic.

### UI components
All UI components in `src/components/ui/` are **pure presentational components** with no side effects. They receive data as props and render HTML.

### Page components
Pages are the only components that access the data layer (`src/data/*`). They own filtering state when needed. Pages compose UI components but do not themselves handle HTTP requests or side effects beyond local state.

---

## 7. Styling Conventions

- Tailwind utility classes only
- No CSS modules, no styled-components, no global CSS beyond `src/index.css`
- `src/index.css` only contains the three Tailwind directives and a minimal `@layer base` for body/heading defaults
- Dynamic colors (SDG colors) use inline `style={{ backgroundColor: sdg.color }}` since they come from data, not Tailwind
- Responsive: all layouts are mobile-first with `sm:`, `md:`, `lg:` breakpoints

---

## 8. Future Backend Architecture Concept

> The following describes planned future architecture. Nothing below is implemented in Version 1.

See `docs/backend-future-concept.md` for full details. Summary:

```
Browser
  └── React SPA (same frontend)
        └── REST API (HTTPS)
              └── FastAPI / Node.js backend
                    ├── PostgreSQL database
                    │     ├── projects
                    │     ├── events
                    │     ├── users (citizens + municipality staff)
                    │     ├── participation_submissions
                    │     └── environmental_reports
                    ├── Authentication service (JWT)
                    └── Admin API (municipality staff)
```

**Integration approach for Version 4:**
- Replace static imports in `src/data/*.ts` with API client functions
- Add `src/api/` directory with typed fetch wrappers
- Add loading states and error handling where needed
- Add React Query or SWR for server state management
- The page and component structure can remain largely unchanged

This is why keeping data access isolated in `src/data/` is architecturally important — the migration surface is well-defined.
