# Implementation Plan: Passwordless Kids + Interactive Display

## Part A: True Passwordless Login

- [x] **A1** — Simplify `POST /api/auth/login-passwordless` to skip PIN, just verify `passwordless === 1` and return JWT
- [x] **A2** — Add `passwordless` field to `GET /api/auth/avatars` response
- [x] **A3** — Add `PUT /api/users/:id/passwordless` admin endpoint to toggle flag
- [x] **A4** — Update Login.tsx: passwordless users auto-login on avatar click (no password prompt)
- [x] **A5** — Add "Passwordless Login" toggle to Settings page per child user
- [x] **A6** — Add "Show on Display" toggle to Settings page per child user
- [x] **A7** — Auto-redirect passwordless + displayMode users to `/display` on login

## Part B: Interactive Display Page

- [x] **B1** — Add "Done" button to incomplete tasks in DisplayMode.tsx
- [x] **B2** — Wire Done button to `api.completeTask()` with confirmation feedback
- [x] **B3** — Completed tasks: strikethrough already in place, displayed separately
- [x] **B4** — Touch-friendly sizing for kiosk/tablet use

## Part C: Polish & Wiring

- [ ] **C1** — Deploy and test full flow

## Files Modified

### Backend (server/src/)
- `routes/auth.ts` - Simplified passwordless login, added avatars includes passwordless
- `routes/users.ts` - Updated USER_SELECT to include passwordless/displayMode, updated display-mode endpoint

### Frontend (client/src/)
- `hooks/useApi.ts` - Updated loginPasswordless return type, added updatePasswordless/updateDisplayMode
- `components/pages/Login.tsx` - Auto-login passwordless users on avatar click
- `components/pages/Settings.tsx` - Added passwordless and displayMode toggles to family management
- `components/pages/DisplayMode.tsx` - Added Done button for task completion
- `components/App.tsx` - Added auto-redirect for passwordless+displayMode users

### Database (server/src/)
- `database.ts` - Already had passwordless and displayMode columns in migrations

## Notes

- The system is immutable and cannot run tests locally in this environment.
- To test: build the client and server, deploy to container, then:
  1. Log in as admin
  2. Go to Settings > Family
  3. Enable "Passwordless Login" and "Display Mode" for Aurora and Cooper
  4. Log out
  5. Click the child's avatar - should auto-login and redirect to /display
  6. Tap "Done" on a task to complete it from the display