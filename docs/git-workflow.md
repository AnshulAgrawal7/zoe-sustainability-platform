# Git Workflow — ZOE Platform

## 1. Branch Strategy

We use a simplified Git Flow for this student group project:

```
main              ← stable releases only (never commit directly in development)
develop           ← integration branch; all feature branches merge here
feature/*         ← individual work: feature/events-page, feature/sdg-filters
fix/*             ← bug fixes: fix/responsive-header
docs/*            ← documentation only: docs/evaluation-plan
```

### Branch purposes

| Branch | Purpose | Who commits |
|---|---|---|
| `main` | Public-facing stable version | Agreed group release only |
| `develop` | Integration of completed features | Merge from feature branches via PR |
| `feature/*` | New pages, features, components | Individual contributors |
| `fix/*` | Bug fixes | Individual contributors |
| `docs/*` | Documentation changes | Individual contributors |

---

## 2. Never Commit Directly to Main

Committing directly to `main` should only happen for:
- Initial project setup (first commit)
- Emergency hotfixes agreed by the full group
- Final release version agreed before a submission deadline

In all other cases, work on a branch and open a Pull Request.

---

## 3. Feature Branch Examples

```bash
# Start new work
git checkout develop
git pull origin develop
git checkout -b feature/events-filter

# Do work, commit regularly
git add src/pages/EventsPage.tsx
git commit -m "feat: add category filter to events page"

# Push and open PR
git push -u origin feature/events-filter
# → Open PR on GitHub: feature/events-filter → develop
```

Branch naming convention: `type/short-description` (all lowercase, hyphens, no spaces).

---

## 4. Commit Message Style

Use the Conventional Commits format:

```
<type>: <short description>

[optional body explaining why, not what]
```

### Types

| Type | When to use |
|---|---|
| `feat` | New feature or page |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, Tailwind tweaks, no logic change |
| `refactor` | Code restructuring, no behaviour change |
| `data` | Changes to dummy data in `src/data/` |
| `chore` | Config files, dependencies, scripts |

### Examples

```
feat: add SDG filter to projects page

fix: mobile nav closes after link click

docs: add evaluation plan draft

data: add Akharavi Water Watch project to projects.ts

refactor: extract ProgressBar into shared ui component

chore: add prettier-plugin-tailwindcss to format config
```

---

## 5. Pull Request Checklist

Before opening a PR from `feature/*` → `develop`:

**Code quality**
- [ ] `npm run build` passes (no TypeScript errors)
- [ ] `npm run lint` passes (no ESLint errors)
- [ ] No `console.log` statements left in code
- [ ] No commented-out code blocks left in

**Content**
- [ ] Prototype notices are present where needed (new pages should include them)
- [ ] No hardcoded absolute paths
- [ ] No real personal data or credentials

**Documentation**
- [ ] `docs/architecture.md` updated if routes or components changed
- [ ] `README.md` updated if the setup or structure changed significantly
- [ ] New dummy data in `src/data/` has the `// PROTOTYPE DATA —` comment

**Review**
- [ ] At least one team member has reviewed the PR
- [ ] Any reviewer comments have been addressed or discussed

---

## 6. Keeping Branches Up To Date

Before starting work and regularly during development:

```bash
git checkout develop
git pull origin develop

git checkout feature/my-branch
git merge develop
# or: git rebase develop (cleaner history, but be careful if others use this branch)
```

If you have merge conflicts, resolve them carefully. The data files (`src/data/*.ts`) are the most likely to conflict when multiple people add content.

---

## 7. Documenting Changes

Every PR should include:
- A clear PR title summarising the change (same style as commit messages)
- A short description of what changed and why
- A note on any documentation updates made

For significant feature additions, also update `docs/architecture.md` under the relevant section.

---

## 8. Recommended Workflow for a Student Group

### Weekly rhythm
1. **Start of week:** Pull from `develop`, assign tasks for the week
2. **Daily:** Commit your work with clear messages, push your branch
3. **End of week:** Open PRs, review each other's work, merge to `develop`
4. **Before submission:** Create a release PR from `develop` → `main`

### Communication
- Open a GitHub Issue for each task or bug you are working on
- Reference the issue in your PR description (`Closes #12`)
- Use GitHub comments for code review feedback — keep feedback constructive

### When to ask for help
- If you're stuck for more than 30 minutes, ask in the group chat with a clear description of the problem
- If you're unsure whether to change something, raise it in the next meeting rather than guessing
