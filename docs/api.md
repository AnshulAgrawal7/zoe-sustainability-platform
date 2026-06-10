# ZOE Platform — API Documentation

Base URL: `http://localhost:3001/api`  
All responses follow: `{ success: boolean, data: T }` (success) / `{ success: false, error: string }` (error)  
Auth: `Authorization: Bearer <accessToken>` for protected endpoints.

---

## Auth (`/api/auth`)

### POST /auth/register
Register a new user.

**Request body:**
```json
{ "email": "user@example.com", "password": "Min8chars", "name": "Maria", "language": "EL" }
```

**Response 201:**
```json
{ "success": true, "data": { "user": { "id": "...", "email": "...", "name": "...", "role": "USER", "points": 0, "language": "EL" }, "accessToken": "eyJ..." } }
```
Sets `refreshToken` httpOnly cookie.

---

### POST /auth/login
Login with email + password.

**Request body:**
```json
{ "email": "user@example.com", "password": "Test1234!" }
```

**Response 200:**
```json
{ "success": true, "data": { "user": { ... }, "accessToken": "eyJ..." } }
```
Sets `refreshToken` httpOnly cookie.

**Error 401:** `{ "success": false, "error": "Invalid credentials" }`

---

### POST /auth/refresh
Exchange refresh token (cookie) for new access token.

**Response 200:**
```json
{ "success": true, "data": { "accessToken": "eyJ..." } }
```

---

### POST /auth/logout
Invalidate refresh token. Requires auth.

**Response 200:**
```json
{ "success": true, "data": null, "message": "Logged out" }
```

---

## Projects (`/api/projects`)

### GET /projects
List projects. Public endpoint.

**Query params:** `page` (int), `limit` (1–50), `category` (ENVIRONMENT|MOBILITY|COMMUNITY|EDUCATION|CULTURE), `status` (default: OPEN)

**Response 200:**
```json
{ "success": true, "data": { "projects": [...], "total": 8, "page": 1, "pages": 1 } }
```

---

### GET /projects/:id
Get single project. Public endpoint.

**Response 200:** `{ "success": true, "data": { ...project, "_count": { "participations": 3 } } }`

---

### POST /projects
Create project. **ADMIN only.**

**Request body:**
```json
{
  "titleEn": "...", "titleEl": "...", "titleDe": "...",
  "descriptionEn": "...", "descriptionEl": "...", "descriptionDe": "...",
  "category": "ENVIRONMENT", "sdgIds": [13, 14, 15],
  "rewardPoints": 50, "location": "Kassiopi"
}
```

---

### PUT /projects/:id
Update project. **ADMIN only.** All fields optional.

---

### DELETE /projects/:id
Close project (sets status to CLOSED). **ADMIN only.**

---

### POST /projects/:id/participate
Join a project and earn reward points. **USER auth required.**

**Response 200:**
```json
{ "success": true, "data": { "participation": { ... }, "pointsAwarded": 75 } }
```

**Error 409:** Already participating.  
**Error 403:** Project not open.

---

### DELETE /projects/:id/participate
Withdraw from a project (deducts points). **USER auth required.**

---

## Events (`/api/events`)

An event is a concrete, dated appointment that optionally belongs to a project
(`projectId`, nullable) or stands alone. Trilingual; `category` reuses the
project categories. Attendance is stored in `EventRegistration` (the `eventId` is
a deliberately soft reference — no FK — so historical RSVPs are preserved).

### GET /events
Public list. Query filters: `category` (project category), `projectId`,
`upcoming=true` (date ≥ now). Each event includes the linked `project`
(id + trilingual titles + category) and a derived `registeredCount`.

**Response 200:**
```json
{ "success": true, "data": { "events": [ { "id": "evt-…", "titleEn": "…", "date": "2026-07-12T09:00:00.000Z", "category": "ENVIRONMENT", "rewardPoints": 25, "capacity": 80, "projectId": "proj-marine", "project": { "id": "proj-marine", "titleEn": "…" }, "registeredCount": 12 } ] } }
```

### GET /events/:id
Public detail (same shape as a list item).

### POST /events/:id/join
Logged-in attendance: earns the event's `rewardPoints`, grants threshold badges.
**USER auth required.**

**Response 201:** `{ "success": true, "data": { "id": "…", "pointsAwarded": 25, "guest": false } }`  
**Error 409:** Already registered.  **Error 403:** Fully booked.  **Error 404:** Event not found.

### POST /events/:eventId/register
Open RSVP (rate-limited). Logged-in users earn points; **guests** pass
`guestName` + `guestEmail` + `consent:true` and earn none. `optionalAuth`.

### GET /events/:eventId/count
Public registration count: `{ "success": true, "data": { "count": 12 } }`.

---

## Users (`/api/users`)

### GET /users/me
Get own profile with participations. **Auth required.**

**Response 200:**
```json
{ "success": true, "data": { "id": "...", "email": "...", "name": "...", "role": "USER", "points": 320, "participations": [...] } }
```

---

### PUT /users/me
Update own profile. **Auth required.**

**Request body (all optional):** `{ "name": "...", "language": "EN|EL|DE", "avatarUrl": "..." }`

---

### GET /users/me/badges
Get own badges + all available badges. **Auth required.**

**Response 200:**
```json
{ "success": true, "data": { "earned": [...], "all": [...], "points": 320, "nextBadge": { ... } } }
```

---

### GET /users/leaderboard
Top 10 users by points. **Public.**

**Response 200:**
```json
{ "success": true, "data": [ { "id": "...", "name": "Maria", "points": 320, "_count": { "participations": 4 } }, ... ] }
```

---

## Admin (`/api/admin`)

All admin endpoints require **ADMIN role**.

### GET /admin/users
List all users with participation/badge counts.

### PUT /admin/users/:id/role
Change user role.

**Request body:** `{ "role": "USER" | "ADMIN" | "SCHOOL" }`

### GET /admin/stats
Dashboard statistics.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 4, "totalProjects": 8, "totalParticipations": 7,
    "openProjects": 8, "totalEvents": 9, "projectsByCategory": [...]
  }
}
```

### POST /admin/translate
Auto-translate project fields (e.g. `title`, `description`) from one language
into the others via **DeepL**. Used by the admin "auto-translate" button.

Requires `DEEPL_API_KEY` in `backend/.env` (Free keys end with `:fx` and use the
free endpoint automatically; swap for a Pro key to upgrade — no code change). If
the key is missing the endpoint returns `503 translation_not_configured`.

**Request:**
```json
{
  "fields": { "title": "Beach cleanup", "description": "Join us at Sidari." },
  "sourceLang": "EN",
  "targetLangs": ["EL", "DE"]   // optional; defaults to the other two languages
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "sourceLang": "EN",
    "translations": {
      "EL": { "title": "Καθαρισμός παραλίας", "description": "..." },
      "DE": { "title": "Strandsäuberung", "description": "..." }
    }
  }
}
```
Errors: `400` (invalid `sourceLang`/fields, field too long), `503 translation_not_configured` (no key).

### POST /admin/events
Create an event. **ADMIN auth required.** Body: trilingual `title*`/`description*`,
`date` (ISO 8601), `category` (project category), optional `location`,
`rewardPoints`, `capacity`, `projectId` (validated to exist if given).

### PATCH /admin/events/:id
Update an event (partial). **ADMIN auth required.**

### DELETE /admin/events/:id
Delete an event. **ADMIN auth required.** RSVPs keep their soft `eventId` and are
not cascaded.

### POST /admin/schools
Create a school, optionally with a coordinator login (role `SCHOOL`).

**Request body:**
```json
{
  "name": "1ο Γυμνάσιο Κέρκυρας",
  "code": "KERKYRA-7F",
  "location": "Corfu Town",
  "coordinatorEmail": "school1@zoe-corfu.gr",   // optional
  "coordinatorName": "…",                         // optional
  "coordinatorPassword": "…"                      // optional; auto-generated if omitted
}
```
**Response 201:** `{ "school": {...}, "coordinator": { "email", "password" } }`
(the coordinator password is returned **once**). Errors: `409` (code or email already used).

### PUT /admin/schools/:id
Edit a school (`name`, `code`, `location`). Errors: `409` (code clash), `404`.

### DELETE /admin/schools/:id
Delete a school. Members are unlinked (`schoolId` set to `null`) but keep their accounts.

---

## Schools (`/api/schools`)

Ranking is by **average points per member** (only `USER`-role members count); a
school needs at least **3 members** to be ranked (`minRankedMembers`).

### GET /schools
Public list: `[{ id, name, location, memberCount, totalPoints, avgPoints, ranked }]`.

### GET /schools/leaderboard
Public ranking. **Response:** `{ schools: [...], minRankedMembers: 3 }`, ranked
schools first (by `avgPoints` desc), then unranked.

### GET /schools/:id
Public detail incl. `members: [{ id, name, points }]`.

### GET /schools/me
**SCHOOL role.** The coordinator's own school dashboard incl. `code`, `members`,
`rank`, `totalSchools`, `minRankedMembers`. `403` for non-SCHOOL users.

### POST /schools/join
**Authenticated.** Join a school by code. **Body:** `{ "code": "KERKYRA-7F" }`
(case-insensitive). Errors: `404` (unknown code).

### POST /schools/leave
**Authenticated.** Leave the current school (`schoolId` → `null`).

---

## Posts / News (`/api/posts`)

A news/blog feed. Posts are **auto-created** when a project is published (status →
`OPEN`, type `PROJECT_NEW`) or completed (→ `COMPLETED`, type `PROJECT_COMPLETED`)
— idempotent, never duplicated — or written manually by an admin. Trilingual
(`titleEn/El/De`, `bodyEn/El/De`). Type: `PROJECT_NEW | PROJECT_COMPLETED | ANNOUNCEMENT`.

### GET /posts
Public list of published posts, newest first. Query: `?type=`, `?limit=` (max 50).

### GET /posts/:id
Public single post (`404` if not found or unpublished).

### POST /posts
**ADMIN.** Create a manual post (all `title*`/`body*` required).

### PUT /posts/:id
**ADMIN.** Edit any post (incl. auto-posts).

### DELETE /posts/:id
**ADMIN.** Delete a post.

---

## Error Codes

| Code | Meaning |
|---|---|
| 400 | Validation failed (see `details`) |
| 401 | Missing or invalid token |
| 403 | Insufficient role |
| 404 | Resource not found |
| 409 | Conflict (duplicate participation, duplicate email) |
| 500 | Internal server error |
