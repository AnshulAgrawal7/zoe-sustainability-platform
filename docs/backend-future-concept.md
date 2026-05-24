# Backend Future Concept — ZOE Platform

## 1. Why the Backend Is Not Implemented Now

The current ZOE platform (Version 1) is a **frontend-only prototype**. This is a deliberate design decision, not a limitation:

1. **DSR demonstration goal:** The prototype demonstrates the information architecture and UX concept. These can be fully shown without a real backend.
2. **Scope constraint:** A backend adds significant complexity (server setup, database, authentication, deployment) without adding DSR insight at the demonstration stage.
3. **Iterative DSR process:** A backend should only be built after the frontend has been evaluated and the information architecture confirmed. Building it prematurely would mean rebuilding it after evaluation changes.
4. **Academic context:** The university seminar is evaluating the design research process, not production software. A well-documented frontend prototype scores better than a poorly-documented full-stack system.

---

## 2. When a Backend Becomes Necessary

A backend is required when:
- Citizens need to submit real ideas, reports, or volunteer registrations that are received and processed by the municipality
- Municipality staff need to create, update, and delete projects and events without code changes
- Real project progress data needs to be updated regularly
- Analytics are needed (page views, participation rates, geographic distribution)
- The platform needs user accounts (for personalised participation history, notifications)

Based on the roadmap, this corresponds to **Phase 4** (2026).

---

## 3. Possible Future Tech Stack Options

### Option A: Python FastAPI + PostgreSQL (Recommended)
**Why:** FastAPI is modern, fast, and well-documented. PostgreSQL is the standard relational database for EU public sector projects. Python is widely known in data/research contexts.

```
Frontend:    React (existing) → unchanged
API:         FastAPI (Python 3.12+)
Database:    PostgreSQL 15+
Auth:        JWT (python-jose) or OAuth2 (Google / EU Login)
Hosting:     Docker + Hetzner or DigitalOcean
ORM:         SQLAlchemy 2.0 + Alembic (migrations)
```

### Option B: Node.js + Express + PostgreSQL
**Why:** Same language as the frontend (JavaScript/TypeScript). Easier for the student group to maintain.

```
Frontend:    React (existing) → unchanged
API:         Express 5 + TypeScript
Database:    PostgreSQL 15+
Auth:        Passport.js + JWT
ORM:         Prisma
```

### Option C: Supabase (Managed Backend-as-a-Service)
**Why:** Very fast to set up, includes auth, real-time, and database. Good for a Phase 4 pilot where speed matters.
**Limitations:** Vendor lock-in; may not meet EU data sovereignty requirements for municipal data.

---

## 4. Database Entities

### `projects`
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `slug` | VARCHAR(100) | URL slug (e.g., `korisia-wetlands`) |
| `title` | TEXT | Project title |
| `category` | ENUM | One of 7 categories |
| `status` | ENUM | Planning / Active / Completed / Paused |
| `location` | TEXT | Location description |
| `description` | TEXT | Public-facing description |
| `problem` | TEXT | Problem addressed |
| `expected_impact` | TEXT | Expected outcomes |
| `start_date` | DATE | Project start |
| `end_date` | DATE | Project end (planned) |
| `progress_percent` | INTEGER | 0–100 |
| `participant_count` | INTEGER | Running total |
| `created_at` | TIMESTAMP | Record creation |
| `updated_at` | TIMESTAMP | Last update |

### `project_sdgs`
| Column | Type | Description |
|---|---|---|
| `project_id` | UUID | FK → projects |
| `sdg_number` | INTEGER | 1–17 |

### `project_metrics`
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `project_id` | UUID | FK → projects |
| `label` | TEXT | Metric label |
| `value` | TEXT | Current value |
| `unit` | TEXT | Unit of measurement |

### `events`
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `project_id` | UUID | Optional FK → projects |
| `title` | TEXT | Event title |
| `category` | ENUM | Same 7 categories |
| `date` | DATE | Event date |
| `time` | TIME | Event time |
| `location` | TEXT | Location description |
| `description` | TEXT | Public description |
| `max_participants` | INTEGER | Capacity |

### `users`
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `email` | VARCHAR(255) | Unique email |
| `role` | ENUM | `citizen` / `staff` / `admin` |
| `display_name` | TEXT | Optional display name |
| `created_at` | TIMESTAMP | Registration date |

### `participation_submissions`
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | Optional FK → users (anonymous allowed) |
| `type` | ENUM | `idea` / `volunteer` / `report` / `feedback` / `event_registration` |
| `message` | TEXT | Submission content |
| `project_id` | UUID | Optional linked project |
| `status` | ENUM | `pending` / `reviewed` / `accepted` / `rejected` |
| `created_at` | TIMESTAMP | Submission date |
| `reviewed_by` | UUID | Optional FK → users (staff) |
| `reviewed_at` | TIMESTAMP | Review timestamp |

---

## 5. API Endpoints (Draft)

### Public endpoints (no authentication)
```
GET  /api/projects                    List all projects (with filters)
GET  /api/projects/:slug              Single project detail
GET  /api/events                      List events (with date/category filters)
GET  /api/sdgs                        SDG definitions
GET  /api/metrics                     Programme KPIs
POST /api/submissions                 Submit citizen participation (idea, report, etc.)
POST /api/events/:id/register         Register for event
```

### Staff/admin endpoints (authenticated)
```
POST   /api/admin/projects            Create project
PUT    /api/admin/projects/:id        Update project
DELETE /api/admin/projects/:id        Archive project
POST   /api/admin/events              Create event
PUT    /api/admin/events/:id          Update event
GET    /api/admin/submissions         List submissions for review
PUT    /api/admin/submissions/:id     Update submission status
GET    /api/admin/analytics           Usage analytics
```

---

## 6. Admin Workflow

When Phase 4 is implemented, the admin workflow will be:

1. Municipality staff log in with their credentials (email + password or SSO)
2. They see the admin dashboard with:
   - Active projects and their progress metrics
   - Recent citizen submissions (ideas, reports, registrations)
   - Upcoming events with registration counts
3. Staff can create new projects, update progress, and add transparency metrics
4. When a citizen submits an idea or report:
   - Staff receive a notification
   - They can review, respond, and change the status
   - If accepted: the idea becomes a project proposal or the report triggers a response
   - If rejected: a polite explanation is sent to the submitter
5. Events can be created and managed, with capacity tracked automatically

---

## 7. Citizen Submission Workflow

1. Citizen fills in the participation form (choose type, describe idea/issue)
2. Form submits to `POST /api/submissions`
3. Email confirmation sent to citizen (optional, if email provided)
4. Submission appears in admin dashboard as "pending"
5. Municipality staff reviews within X working days
6. Status updated to accepted/rejected with a reason
7. If citizen provided email, they receive a notification

---

## 8. Security and Privacy Considerations

### GDPR compliance (required for any EU deployment)
- Collect only the minimum personal data necessary (email is optional for submissions)
- Include a clear privacy policy
- Allow users to delete their account and all associated data
- Store data in EU-based infrastructure
- Conduct a Data Protection Impact Assessment (DPIA) before collecting citizen data

### Security measures
- HTTPS enforced everywhere
- JWT tokens with short expiry (15 minutes access + refresh tokens)
- Rate limiting on public POST endpoints to prevent spam
- Input validation and sanitisation on all form inputs
- SQL injection prevention via ORM (no raw SQL with user input)
- CSRF protection for any session-based auth
- Regular dependency updates and security scanning

### Data minimisation
- Anonymous submissions should be allowed where possible
- IP addresses should not be logged in production unless legally required
- Analytics should use privacy-preserving methods (e.g., no Google Analytics; use Plausible or Matomo self-hosted)

---

## 9. Hosting and Infrastructure

### Recommended setup for Phase 4 pilot
- **Server:** Hetzner Cloud CX21 (2 vCPU, 4 GB RAM) — EU-based, GDPR-friendly
- **Database:** Managed PostgreSQL (Hetzner or Supabase EU)
- **CI/CD:** GitHub Actions → deploy on merge to `main`
- **SSL:** Let's Encrypt (automatic via Caddy or Nginx)
- **Monitoring:** Uptime Robot (free tier) + basic server monitoring

### Estimated cost (Phase 4 pilot)
- Server: ~€6/month
- Database: ~€10/month (managed) or ~€0 (self-managed on same server)
- SSL: Free (Let's Encrypt)
- Domain: ~€15/year
- **Total: ~€200/year for a pilot**
