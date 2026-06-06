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

**Request body:** `{ "role": "USER" | "ADMIN" }`

### GET /admin/stats
Dashboard statistics.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 4, "totalProjects": 8, "totalParticipations": 7,
    "openProjects": 8, "projectsByCategory": [...]
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
