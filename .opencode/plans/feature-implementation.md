# TidyQuest Feature Implementation Plan

## Date: 2026-05-05

## Features to Implement

### Feature 1: Dedicated Display Mode
A distraction-free page showing chore status for living room display

**Requirements:**
- Auto-refresh every 15 seconds
- Tasks grouped by person (columns)
- Completed tasks: strikethrough + move to bottom
- No gamification elements (coins, streaks, etc.)
- Clean, full-screen layout

### Feature 2: Passwordless Kids Accounts
Children can log in without passwords, using PIN-based authentication

**Requirements:**
- Parent creates passwordless account for child
- Child logs in with 6-digit PIN
- PIN expires after 5 minutes
- Admin can generate new PINs

---

## Implementation Status

### ✅ Phase 0: Backup System
- [x] Created backup script (`backup.sh`)
- [x] Created restore script (`restore.sh`)
- [x] Tested backup: `tidyquest-backup-20260505-091005.tar.gz` (92KB)
- [x] Created `BACKUP.md` documentation

### ✅ Phase 1: Database Migrations
- [x] Added `displayMode` column to users table
- [x] Added `passwordless` column to users table
- [x] Added migrations for existing databases

### ✅ Phase 2: Backend API Endpoints
- [x] Display mode endpoints (`GET/PUT /api/users/:id/display-mode`)
- [x] Display dashboard endpoint (`GET /api/dashboard/display`)
- [x] Passwordless login endpoints
- [x] PIN management endpoints

### ✅ Phase 3: Frontend Components
- [x] Display mode page (`DisplayMode.tsx`)
- [x] Updated login page (PIN login support)
- [x] Updated register page (passwordless option)
- [x] Updated settings page (display mode toggle)
- [x] API hooks for new endpoints
- [x] Translation strings added (EN/FR/DE/ES/IT)

### ✅ Phase 4: Build & Test
- [x] Build client and server - SUCCESS
- [x] Container running at http://localhost:3020
- [x] API functional (tested endpoints)
- [x] Database migrations verified (new columns present)
- [ ] Test display mode page in browser
- [ ] Test passwordless login flow
- [ ] Deploy to production

---

## Phase 1: Database Migrations

### 1.1 Display Mode Column
**File:** `server/src/database.ts`

Add `displayMode` column to users table:
```sql
ALTER TABLE users ADD COLUMN displayMode INTEGER NOT NULL DEFAULT 0
```

### 1.2 Passwordless Column
**File:** `server/src/database.ts`

Add `passwordless` column to users table:
```sql
ALTER TABLE users ADD COLUMN passwordless INTEGER NOT NULL DEFAULT 0
```

---

## Phase 2: Backend API Endpoints

### 2.1 Display Mode Endpoints
**File:** `server/src/routes/users.ts`

- `GET /api/users/:id/display-mode` - Check display mode status
- `PUT /api/users/:id/display-mode` - Toggle display mode (admin only)

### 2.2 Display Dashboard Endpoint
**File:** `server/src/routes/dashboard.ts`

- `GET /api/dashboard/display` - Get tasks grouped by user for display mode

### 2.3 Passwordless Login Endpoints
**File:** `server/src/routes/auth.ts`

- `POST /api/auth/login-passwordless` - Request PIN login
- `POST /api/auth/login-pin` - Complete login with PIN

### 2.4 PIN Management Endpoints
**File:** `server/src/routes/users.ts`

- `POST /api/users/:id/generate-pin` - Generate new PIN (admin only)
- `POST /api/users/:id/verify-pin` - Verify PIN
- `DELETE /api/users/:id/pin` - Clear PIN

---

## Phase 3: Frontend Components

### 3.1 Display Mode Page
**File:** `client/src/components/pages/DisplayMode.tsx` (NEW)

Features:
- Full-screen layout with columns (one per child)
- Auto-refresh every 15 seconds
- Incomplete tasks (sorted by health)
- Completed tasks (strikethrough, sorted by completion time)
- No sidebar, no navigation

### 3.2 Updated Login Page
**File:** `client/src/components/pages/Login.tsx`

- Add PIN login tab
- Auto-select mode based on user's passwordless setting
- 6-digit PIN input with numeric keyboard

### 3.3 Updated Register Page
**File:** `client/src/components/pages/Register.tsx`

- Add passwordless account option
- Hide password fields when passwordless enabled

### 3.4 Updated Settings Page
**File:** `client/src/components/pages/Settings.tsx`

- Display mode toggle for each child
- PIN generation button for passwordless kids

---

## Implementation Order

1. ✅ Backup system (DONE)
2. Database migrations
3. Backend API endpoints
4. Frontend components
5. Route updates
6. Testing

---

## Notes

- All changes must be backward compatible
- Existing password accounts continue to work
- Features are opt-in (admin enables for specific users)
- PINs hashed with bcrypt (10 rounds)
- Rate limiting on PIN login attempts
