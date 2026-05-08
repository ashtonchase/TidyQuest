## Description

Adds a collapsible sidebar with a hamburger toggle button. Users can collapse the sidebar to show icons only (60px wide) or expand it to show the full navigation (240px wide). The collapsed state persists in localStorage.

## Type of Change

- [x] New feature (non-breaking change which adds functionality)

## Changes Made

- Add `sidebarCollapsed` state with localStorage persistence (`tidyquest-sidebar-collapsed` key)
- Pass `collapsed` and `onToggle` props to Sidebar component
- Update main content `marginLeft` dynamically (60px when collapsed, 240px when expanded)
- Smooth CSS transition animation (0.3s ease)
- Show hamburger toggle button (three vertical bars) when expanded, in top-right corner
- Hide navigation labels and show icons only when collapsed
- When collapsed, hide user card details and show only the avatar
- Mobile: ignore collapsed state when mobile menu is open

## Testing

- [x] Tested locally with Docker (built via podman)
- [x] Tested on production-like environment (test container on port 3050)
- [ ] Added/updated tests
- [ ] All existing tests pass

## Checklist

- [x] My code follows the project's code style
- [x] I have performed a self-review of my code
- [ ] I have commented my code where necessary (per project conventions, no comments added)
- [x] My changes generate no new warnings or errors
- [x] I have checked for security vulnerabilities
- [x] I have not committed any secrets (.env, API keys, passwords)

## Screenshots

N/A - text-based UI change only

## Additional Notes

- No server, database, or API changes needed
- No new translations required
- Uses existing CSS variables and transitions
- Works on desktop only (mobile has separate hamburger menu behavior)