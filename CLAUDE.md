# ZOE Sustainability Platform — CLAUDE.md

Frontend-only MVP prototype. DSR artefact for a university IS seminar (Peffers et al., 2007).
Municipality of Northern Corfu, Greece. Full DSR mapping: `docs/dsr-methodology.md`.

## Stack
React 19 · TypeScript 6 · Vite 8 · Tailwind CSS 3 · React Router 7 · lucide-react  
Router: `src/app/Router.tsx` | Types: `src/types/index.ts` | Data: `src/data/*.ts`

## Hard rules — never break
- **No backend / API calls / auth** — prototype uses `src/data/*.ts` only (backend = Phase 4)
- **No external APIs** — implement features with dummy data instead
- **Keep `PrototypeBanner`** and all "dummy data" labels — required for DSR academic honesty
- **Data in `src/data/` only** — never inline data objects in components
- Each data file starts with `// PROTOTYPE DATA — ...`
- If user asks for backend/auth, confirm they intend to start Phase 4

## Conventions
- No `any`; shared types → `src/types/index.ts`; `interface` for shapes, `type` for unions
- New pages → `src/pages/` + register in `src/app/Router.tsx`
- Tailwind only; inline `style={{}}` only for data-driven dynamic values (e.g. SDG colors)
- `aria-hidden="true"` on decorative icons; `aria-label` on icon-only buttons
- Comments only for non-obvious WHY; no "what" comments

## Docs — update when:
- Route or folder structure changes → `docs/architecture.md`
- Major feature or setup changes → `README.md`

## Git
`feature/<name>` → `develop` → `main` (never commit direct to `main`)  
Types: `feat:` `fix:` `docs:` `refactor:` `style:` `data:` `chore:`

## Subagents (`.claude/agents/`)
| Agent | Use when |
|---|---|
| `dsr-methodology-agent` | DSR alignment, academic framing, evaluation plan |
| `frontend-implementation-agent` | New pages/components, TS errors, refactoring |
| `documentation-agent` | Any `.md` update, code↔docs consistency |
| `ux-content-agent` | Citizen-facing copy, aria labels, accessibility |
