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
Exchange refresh token (cookie) for a new access token **plus the user**, so a
page reload restores the whole session in one round-trip (see the frontend's
auth bootstrap in `AppRouter`).

**Response 200:**
```json
{ "success": true, "data": { "accessToken": "eyJ...", "user": { "id": "…", "email": "…", "name": "…", "role": "USER", "points": 150, "language": "EL", "profile": "STUDENT" } } }
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

An event is a concrete, dated appointment belonging to a project. Trilingual;
`category` reuses the project categories. Attendance is stored in
`EventRegistration` (the `eventId` is a deliberately soft reference — no FK — so
historical RSVPs are preserved).

**Lifecycle:** events start as `status: "UPCOMING"`. Registering awards **no**
points; the event's `rewardPoints` stay *pending* until an admin marks the event
`COMPLETED` (`POST /admin/events/:id/complete`), at which point every registered
logged-in user is credited exactly once. Completed events accept no new
registrations and no cancellations.

### GET /events
Public list (`optionalAuth`). Query filters: `category` (project category),
`projectId`, `upcoming=true` (date ≥ now). Each event includes the linked
`project` (id + trilingual titles + category), a derived `registeredCount`, its
`status`, and — for logged-in callers — `registeredByMe`.

**Response 200:**
```json
{ "success": true, "data": { "events": [ { "id": "evt-…", "titleEn": "…", "date": "2026-07-12T09:00:00.000Z", "category": "ENVIRONMENT", "status": "UPCOMING", "rewardPoints": 25, "capacity": 80, "projectId": "proj-marine", "project": { "id": "proj-marine", "titleEn": "…" }, "registeredCount": 12, "registeredByMe": false } ] } }
```

### GET /events/:id
Public detail (same shape as a list item; `optionalAuth` adds `registeredByMe`).

### GET /events/registrations/me
The logged-in user's own registrations, each enriched with the event and the
pending vs. awarded points. **USER auth required.**

**Response 200:** `{ "success": true, "data": { "registrations": [ { "id": "…", "eventId": "…", "pointsAwarded": 0, "pointsPending": 25, "event": { … } } ] } }`

### POST /events/:id/join
Logged-in attendance: creates the registration only — points stay pending until
the event is completed. **USER auth required.**

**Response 201:** `{ "success": true, "data": { "id": "…", "pointsAwarded": 0, "pointsPending": 25, "guest": false } }`  
**Error 409:** Already registered.  **Error 403:** Fully booked / event already completed.  **Error 404:** Event not found.

### DELETE /events/:id/registration
Cancel the own registration — allowed any time **before** the event is
completed. **USER auth required.**

**Error 403:** Event already completed.  **Error 404:** Not registered.

### POST /events/:eventId/register
Open RSVP (rate-limited). Logged-in users register via their account (points
pending, as for join); **guests** pass `guestName` + `guestEmail` +
`consent:true` and earn none. `optionalAuth`. **Error 403** when completed.

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

### GET /admin/events/:id/registrations
Attendance overview for one event: every registration with the linked member
(`user`: id/name/email + `pointsAwarded`, 0 = pending) or the guest details
(`guestName`/`guestEmail`), newest first, plus the `event` itself. Read-only.
**ADMIN auth required.**

### POST /admin/events/:id/complete
Mark an event `COMPLETED` and credit its `rewardPoints` to every registered
logged-in user that has not been credited yet (then grant threshold badges).
Idempotent — re-running never double-awards. **ADMIN auth required.**

**Response 200:** `{ "success": true, "data": { "id": "…", "status": "COMPLETED", "awardedCount": 3, "pointsPerUser": 25 } }`

### GET /admin/submissions
Citizen reports & feedback from `/api/submissions` (read-only overview; newest
first). Optional `?type=REPORT|FEEDBACK`. Includes the linked `user`
(id/name/email) when the submitter was logged in. **ADMIN auth required.**

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

## Rewards (`/api/rewards`)

The five ZOE levels (Σπόρος … Θεματοφύλακας) are **admin-editable DB content**:
point ranges, icon and Greek name per tier, plus role-specific designations,
descriptions and reward lists (4 roles × 5 tiers, trilingual). The frontend
keeps a static copy (`src/data/rewards.ts` + i18n) as prototype fallback.

### GET /rewards/tiers
Public. Tiers ordered by `order`, each with all `roleVariants` (all three
languages; the client picks). `rewards*` fields are newline-separated lists.

**Response 200:** `{ "success": true, "data": { "tiers": [ { "id": "sporos", "order": 1, "greekName": "Σπόρος", "icon": "🌱", "pointsMin": 0, "pointsMax": 24, "roleVariants": [ { "role": "RESIDENT", "nameEn": "Neighbour", "rewardsEn": "…\n…", … } ] } ] } }`

### PUT /admin/rewards/tiers/:id
**ADMIN.** Update a tier's base fields (`greekName`, `icon`, `pointsMin`,
`pointsMax` — `null` for the open-ended top tier) and/or upsert role
`variants` (full trilingual texts per role). Sanity checks: `pointsMin ≥ 0`,
`pointsMax > pointsMin`; keeping the five ranges contiguous is the admin's
responsibility (prototype scope).

---

## Submissions (`/api/submissions`)

Citizen reports of environmental issues and general feedback from the
participation page. Mirrors the ideas flow: open **without** an account
(rate-limited, `optionalAuth`); a valid token links the submission to the user,
otherwise it is stored anonymously. Admins review them via
`GET /admin/submissions` (read-only — no workflow yet, Future Work).

### POST /submissions
**Body:** `type` (`REPORT | FEEDBACK`), `message` (≤ 4000 chars), optional
`submitterName` / `submitterEmail` (guests only — logged-in submitters are
linked via the token).

**Response 201:** `{ "success": true, "data": { "id": "…", "type": "REPORT", "createdAt": "…" } }`

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
