# ZOE Sustainability Platform

**Strategischer Rahmen für Umweltmaßnahmen – ZOE-Programm**  
*Strategic Framework for Environmental Actions – ZOE Program*

---

## Overview

This repository contains the **frontend MVP prototype** of the ZOE Environmental Platform for the Municipality of Northern Corfu. It is developed as a **Design Science Research (DSR) artefact** for a university seminar in Information Systems.

The platform demonstrates how a digital tool can increase transparency, enable citizen participation, and communicate environmental sustainability impact aligned with the UN Sustainable Development Goals (SDGs).

> **Important:** This is a prototype with realistic dummy data. No real data is stored, transmitted, or collected. Backend, database, authentication, and real citizen submissions are intentional future work.

---

## University / DSR Context

| Field | Value |
|---|---|
| Project type | Design Science Research (DSR) artefact |
| Programme | ZOE — Municipality of Northern Corfu |
| Methodology | Peffers et al. (2007) DSR process |
| Artifact type | Digital platform prototype (frontend MVP) |
| Iteration | Version 1 — demonstration phase |

See [`docs/dsr-methodology.md`](docs/dsr-methodology.md) for full DSR mapping.

---

## What Is Implemented

- **Landing page** — ZOE programme overview, key statistics, featured projects, participation CTAs
- **About ZOE** — Programme description, DSR context, Northern Corfu background, design principles
- **Projects overview** — All ZOE projects with category/status/SDG filtering
- **Project detail page** — Problem, expected impact, citizen involvement, SDG alignment, transparency metrics
- **SDG Dashboard** — All addressed SDGs with progress bars, linked projects, SDG descriptions
- **Citizen Participation** — Five participation modes with a local-only mock form
- **Events & Initiatives** — Upcoming events with category filtering and capacity indicators
- **Impact & Transparency** — Programme KPIs, project progress table, transparency commitment
- **Roadmap** — Five-phase roadmap from MVP to production
- Responsive navigation, sticky header, and footer
- Visible prototype notice throughout

---

## What Is Intentionally NOT Implemented

| Feature | Reason |
|---|---|
| Backend / database | Future work — see `docs/backend-future-concept.md` |
| User authentication | Not needed for prototype demonstration |
| Real citizen submissions | Form shows local success message only |
| Admin dashboard | Municipality staff interface is future work |
| Greek language | Future work (internationalisation phase) |

---

## Setup Instructions

```bash
git clone <repository-url>
cd zoe-sustainability-platform
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available npm scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format source files with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm run type-check` | TypeScript check without emitting |

---

## Project Structure

```
zoe-sustainability-platform/
├── src/
│   ├── app/                  # Router configuration
│   ├── components/
│   │   ├── layout/           # Header, Footer, Layout
│   │   └── ui/               # Badge, ProgressBar, SDGBadge, StatusBadge, PrototypeBanner
│   ├── data/                 # All dummy/prototype data (TypeScript files)
│   │   ├── projects.ts       # Environmental projects with full detail
│   │   ├── events.ts         # Upcoming events and initiatives
│   │   ├── sdgs.ts           # SDG definitions and progress data
│   │   └── metrics.ts        # Impact KPIs and participation options
│   ├── pages/                # One file per route/page
│   ├── types/                # Shared TypeScript interfaces
│   └── index.css             # Tailwind CSS entry point
├── docs/                     # All project documentation
├── .claude/agents/           # Claude Code subagent definitions
├── CLAUDE.md                 # Claude Code session instructions
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + TypeScript 6 | UI framework with type safety |
| Vite 8 | Build tool and dev server |
| Tailwind CSS 3 | Utility-first styling |
| React Router 7 | Client-side routing |
| lucide-react | Icons |
| ESLint + Prettier | Code quality |

---

## Documentation

| Document | Description |
|---|---|
| [`docs/dsr-methodology.md`](docs/dsr-methodology.md) | DSR theory, Peffers process mapping, DSR Grid |
| [`docs/artifact-description.md`](docs/artifact-description.md) | Artefact definition, target users, design decisions |
| [`docs/architecture.md`](docs/architecture.md) | Frontend architecture, routing, data flow, future backend |
| [`docs/evaluation-plan.md`](docs/evaluation-plan.md) | How to evaluate the platform after demonstration |
| [`docs/git-workflow.md`](docs/git-workflow.md) | Branching, commit style, PR checklist |
| [`docs/roadmap.md`](docs/roadmap.md) | Five-phase development roadmap |
| [`docs/backend-future-concept.md`](docs/backend-future-concept.md) | Future backend architecture concept |

---

## Backend Note

This prototype uses only local TypeScript data files. A real backend is explicitly out of scope for this version. See [`docs/backend-future-concept.md`](docs/backend-future-concept.md) for how a production backend would be designed.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
