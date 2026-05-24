# CLAUDE.md — ZOE Sustainability Platform

This file is the primary instruction source for Claude Code sessions on this project.
Read it fully at the start of every session before making any changes.

---

## Project Purpose

The ZOE Sustainability Platform is a **Design Science Research (DSR) artefact** — a frontend prototype demonstrating how a digital platform can support:

1. **Transparency** of municipal environmental actions
2. **Citizen participation** in environmental governance
3. **SDG communication** at the local level

It is developed for the Municipality of Northern Corfu, Greece, as part of a university seminar in Information Systems.

---

## DSR Context

| DSR Element | Value |
|---|---|
| Artefact | Digital platform prototype (frontend MVP) |
| Problem | Opacity of environmental governance + low citizen engagement |
| Relevance | Real municipality, real ecological challenges |
| Rigor | Based on DSR theory, SDGs, Open Innovation, e-participation literature |
| Evaluation | Planned — see `docs/evaluation-plan.md` |
| Communication | Documented in `docs/` folder and repository |

Full DSR mapping: `docs/dsr-methodology.md`

---

## Artefact Definition

- A single-page React application with React Router
- Demonstrates ZOE environmental programme of Northern Corfu
- Shows 8 fictional environmental projects with full detail
- SDG dashboard aligned with UN SDGs
- Citizen participation page with mock form (no backend)
- Events listing, impact metrics, and roadmap pages
- All data is clearly labelled as prototype/dummy

---

## Technical Stack

| Tool | Version | Notes |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6 | Strict types, use interfaces in `src/types/` |
| Vite | 8 | Build tool; `npm run dev` starts on port 5173 |
| Tailwind CSS | 3 | Utility classes; config in `tailwind.config.js` |
| React Router | 7 | `createBrowserRouter` in `src/app/Router.tsx` |
| lucide-react | latest | Icons only — do not add other icon libraries |
| ESLint | 10 | Config in `eslint.config.js` |
| Prettier | 3 | Config in `.prettierrc`; plugin: prettier-plugin-tailwindcss |

**No backend. No database. No authentication. No external APIs.**

---

## Coding Conventions

### TypeScript
- All shared types live in `src/types/index.ts`
- Use explicit types — avoid `any`
- Prefer `interface` for object shapes, `type` for unions/aliases

### Components
- One component per file; filename matches component name
- Small, focused components (< 150 lines preferred)
- Props typed inline or with a named interface
- Use semantic HTML (`<header>`, `<main>`, `<article>`, `<nav>`, etc.)
- Add `aria-*` attributes for interactive elements
- Use `aria-hidden="true"` on decorative icons

### Styling
- Tailwind utility classes only — no separate CSS modules
- No inline `style={{}}` except for dynamic values (e.g., SDG colors)
- Responsive: mobile-first. Always use `sm:`, `md:`, `lg:` breakpoints

### Data
- All dummy data lives in `src/data/`
- Never put raw data objects inside component files
- Each data file must start with a comment: `// PROTOTYPE DATA — ...`
- Helper functions (`getProjectById`, etc.) live at the bottom of data files

### Comments
- Write comments only when the WHY is non-obvious
- No multi-line comment blocks
- No "what" comments — names should explain that

---

## Documentation Conventions

- Update `docs/architecture.md` when changing routes, adding pages, or restructuring components
- Update `README.md` when adding major features or changing the setup process
- Keep `docs/dsr-methodology.md` accurate to the current iteration
- Never delete documentation files without replacing them

---

## Strict Rules

### DO NOT introduce a backend
This is an explicit scope constraint. The prototype uses TypeScript data files only.
If asked to add a backend, ask the user to confirm they are intentionally moving into Phase 4 of the roadmap.

### DO NOT remove prototype notices
The amber `PrototypeBanner` component and "dummy data" labels are intentional.
They are part of the DSR demonstration — showing academic honesty about what is and is not implemented.

### DO NOT use external APIs
No paid APIs, no weather APIs, no map APIs. No calls to external services.
If a feature requires real external data, implement it with dummy data instead and document it.

### DO NOT add authentication
Authentication is Phase 4+ work. Adding it now would complicate the prototype unnecessarily.

### DO update documentation
Any change to the routing structure, data schema, or component architecture must be reflected in `docs/architecture.md`. Any change to the evaluation plan must be reflected in `docs/evaluation-plan.md`.

---

## Git Workflow

See `docs/git-workflow.md` for the full guide. Summary:

- Never commit directly to `main` in normal development
- Use `feature/<short-description>` branches
- Commit messages: `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`, `style: ...`
- Keep PRs focused — one concern per PR

---

## Subagents

This project has four specialised Claude Code subagents in `.claude/agents/`. Use them when the task matches:

### `dsr-methodology-agent`
**When to use:** Reviewing DSR alignment, artifact logic, research contribution, evaluation plan, documentation for academic submission.
**What to review:** `docs/dsr-methodology.md`, `docs/artifact-description.md`, `docs/evaluation-plan.md`, academic framing in `README.md`.
**Output:** Identify gaps in DSR coverage, suggest improvements, flag non-academic language.

### `frontend-implementation-agent`
**When to use:** Implementing new pages or components, fixing bugs, refactoring, TypeScript errors, Tailwind class review.
**What to review:** `src/` directory; component structure, type safety, accessibility, Tailwind usage.
**Output:** Code changes with TypeScript types, semantic HTML, responsive classes, and no backend dependencies.

### `documentation-agent`
**When to use:** Writing or updating any `.md` file, ensuring consistency between docs and code, preparing academic documentation.
**What to review:** `docs/`, `README.md`, `CLAUDE.md`, inline code comments.
**Output:** Updated, consistent, well-structured documentation that accurately reflects the current codebase.

### `ux-content-agent`
**When to use:** Reviewing citizen-facing copy, participation page wording, event descriptions, accessibility labels, SDG descriptions.
**What to review:** Page headings, CTA labels, form copy, accessibility attributes, content clarity.
**Output:** Suggestions for clearer, more inclusive, citizen-centred wording; improved aria labels; better navigation labels.

---

## Running the Project

```bash
npm install       # Install dependencies
npm run dev       # Development server → http://localhost:5173
npm run build     # Production build (type-check + bundle)
npm run lint      # ESLint check
npm run format    # Prettier format
```
