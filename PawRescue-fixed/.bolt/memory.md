# Project memory

## Product intent & audience

- Full-stack MERN application named PawRescue with a Vite + React frontend and a separate Node/Express backend
- Backend exposes REST API routes including auth, reports, notifications, and admin abuse-report endpoints
- Data model includes users, reports, and notifications

## Brand personality & voice

- Not yet established

## Visual design & UX direction

- Not yet established; frontend stack is Vite + React
- Existing UI must be preserved (no visual changes)

## Decisions, constraints & rationale

- Backend is MongoDB-based; MongoDB Atlas chosen over Supabase (platform default) to avoid rewriting data layer for Postgres
- MongoDB path requires an Atlas connection string in backend environment file
- **JWT auth configured for 1-year session lifetime** (changed from 30 days, originally 7 days)
  - Tokens signed with `JWT_EXPIRES_IN` env var, defaulting to `365d`
  - HTTP-only cookie `maxAge` set to 31,536,000,000 ms (365 days) via shared constant to stay in sync with token expiry
  - Secure cookie settings preserved: `httpOnly: true`, `secure: true` in production, appropriate `sameSite`
  - Existing JWT secret left untouched; no auto-generated secret
- Auth import bug fixed across three route files
- Data model updated with missing report fields
- Notification key bug fixed
- `cloudinary` package added at project root — required for API to start (Vite-mounted API loads from root)
- `backend/.env` updated with `JWT_EXPIRES_IN=365d`; example env file updated to match
- Freshly signed token verified for 1-year expiry; build passes

## Open questions & assumptions

- MongoDB Atlas refusing connections from this environment; IP access list may need updating (allow current IP or `0.0.0.0/0` for testing)
- Full login-and-refresh test NOT yet verified — only token lifetime, cookie settings, and 401 rejection of expired/malformed/missing tokens verified without DB
- Backend fixes still pending: report responses, admin abuse-report endpoints
- Backend tests have not been run in full (blocked by DB connection)
- `.bolt/prompt` currently empty — no global instructions to follow