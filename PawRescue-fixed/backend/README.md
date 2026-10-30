# PawRescue Backend

Express.js + MongoDB Atlas + Socket.IO backend for the PawRescue emergency animal rescue platform.

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

## Setup

1. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Seed the database with demo data and an admin account. This deletes all existing data, so it requires the confirmation flag:
   ```bash
   npm run seed -- --confirm
   ```
   If `ADMIN_BOOTSTRAP_PASSWORD` is not set, a random admin password and demo password are printed once.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB Atlas connection string | required |
| `JWT_SECRET` | JWT signing secret | required |
| `JWT_EXPIRES_IN` | Token expiry | 7d |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:5173 |
| `NODE_ENV` | Environment | development |
| `COOKIE_SECURE` | Use secure cookies | false |
| `COOKIE_SAME_SITE` | SameSite cookie policy | lax |
| `CLOUDINARY_*` | Optional Cloudinary image hosting | optional |
| `SMTP_*` | Optional email notifications | optional |
| `ESCALATION_INTERVAL_MS` | Escalation check interval | 300000 (5 min) |
| `ADMIN_BOOTSTRAP_EMAIL` | Admin email for seed | admin@pawrescue.example.org |
| `ADMIN_BOOTSTRAP_PASSWORD` | Admin password for seed | random, printed once |

## API Routes

### Auth
- `POST /api/auth/register` - Register (citizen, volunteer, organization)
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Clear session cookie
- `GET /api/auth/me` - Get current authenticated user
- `POST /api/auth/forgot-password` - Request password reset

### Users
- `GET /api/users/me` - Get profile
- `PATCH /api/users/me` - Update profile
- `PATCH /api/users/me/availability` - Toggle online status

### Reports
- `GET /api/reports` - List reports (supports animalType, emergencyType, severity, status, lat, lng, radiusKm filters)
- `GET /api/reports/nearby` - Geospatial nearby search
- `GET /api/reports/mine` - Current user's reports
- `GET /api/reports/:id` - Single report
- `POST /api/reports` - Create report
- `POST /api/reports/photos` - Upload up to 6 report photos (JPG, PNG, WebP, 5 MB each) to Cloudinary; returns 503 until Cloudinary keys are set
- `DELETE /api/reports/:id` - Delete (own reports only, no active assignment)

### Rescues
- `GET /api/rescues/available` - Cases awaiting a responder
- `GET /api/rescues/mine` - Assigned cases
- `GET /api/rescues/:id` - Case details
- `GET /api/rescues/:id/timeline` - Status history
- `POST /api/rescues/:id/accept` - Accept (atomic, returns 409 if taken)
- `POST /api/rescues/:id/decline` - Decline
- `PATCH /api/rescues/:id/status` - Update status (enforces transitions)
- `POST /api/rescues/:id/evidence` - Add evidence photos
- `POST /api/rescues/:id/reassign` - Admin/org reassign

### Notifications
- `GET /api/notifications` - List for current user
- `PATCH /api/notifications/:id/read` - Mark read
- `PATCH /api/notifications/read-all` - Mark all read

### Recovery
- `GET /api/recovery/:rescueCaseId` - Get recovery record
- `POST /api/recovery/:rescueCaseId` - Create recovery record
- `PATCH /api/recovery/:rescueCaseId` - Update recovery record

### Admin
- `GET /api/admin/analytics` - Aggregated platform analytics
- `GET /api/admin/users` - All users
- `PATCH /api/admin/users/:id` - Suspend/reinstate
- `GET /api/admin/reports` - All reports (paginated)
- `GET /api/admin/verifications` - Pending verifications
- `PATCH /api/admin/verifications/:id` - Approve/reject verification
- `GET /api/admin/rescues` - All active rescues
- `POST /api/admin/rescues/:id/reassign` - Reassign rescue

### Organization
- `GET /api/organization/profile` - Org profile
- `PATCH /api/organization/profile` - Update profile
- `GET /api/organization/team` - List team members
- `POST /api/organization/team` - Add member
- `DELETE /api/organization/team/:memberId` - Remove member

## Rescue Status Flow

```
Reported → Accepted → En Route → On Scene → Rescued → In Care → Resolved
```

Invalid transitions are rejected by the server. Status changes are recorded in StatusUpdate documents with the actor and timestamp.

## Real-Time Updates

Socket.IO sends events for new cases, acceptance, status changes, reassignment, and verification decisions. Connections are authenticated via JWT.

## Security

- Helmet for security headers
- CORS configured for the frontend origin
- Rate limiting on auth and report creation
- bcrypt password hashing
- HTTP-only JWT cookies
- Role-based authorization middleware
- Input validation with express-validator
- Private notes and medical records access-controlled by role

## Running Tests

```bash
npm test
```
