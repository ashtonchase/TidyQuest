# Collapsible Sidebar (Hamburger Toggle) - Implementation Plan

## Overview

Add a hamburger toggle button to collapse/expand the sidebar between full width (240px) and collapsed (icons only, ~60px). Persist state in `localStorage`.

## Files to Modify

### 1. `client/src/App.tsx`

#### 1.1 Add collapsed state with localStorage persistence

```tsx
const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
  const saved = localStorage.getItem('tidyquest-sidebar-collapsed');
  return saved === 'true';
});
```

#### 1.2 Add toggle function

```tsx
const toggleSidebar = () => {
  setSidebarCollapsed(prev => !prev);
};
```

#### 1.3 Pass collapsed prop to Sidebar

```tsx
<Sidebar
  user={user}
  isMobileOpen={isMobileSidebarOpen}
  onClose={() => setIsMobileSidebarOpen(false)}
  gamificationEnabled={gamificationEnabled}
  collapsed={sidebarCollapsed}
  onToggle={toggleSidebar}
/>
```

#### 1.4 Update main content marginLeft dynamically

```tsx
<main style={{
  marginLeft: sidebarCollapsed ? 60 : 240,
  flex: 1,
  padding: '28px 36px',
  maxWidth: 1320,
  backgroundColor: 'var(--warm-bg)',
  transition: 'margin-left 0.3s ease',
}} className="main-content">
```

#### 1.5 Add hamburger toggle button in header

Add a visible toggle button above the main content area, next to the hamburger menu button that currently exists only for mobile. Reuse the existing hamburger SVG (three vertical bars):

```tsx
<button
  onClick={toggleSidebar}
  style={{
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--warm-text)',
  }}
  aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
</button>
```

### 2. `client/src/components/layout/Sidebar.tsx`

#### 2.1 Update interface

```tsx
interface SidebarProps {
  user: User;
  isMobileOpen?: boolean;
  onClose?: () => void;
  gamificationEnabled?: boolean;
  collapsed?: boolean;      // NEW
  onToggle?: () => void;    // NEW
}
```

#### 2.2 Update function signature

```tsx
export function Sidebar({
  user,
  isMobileOpen = false,
  onClose,
  gamificationEnabled = true,
  collapsed = false,
  onToggle,
}: SidebarProps)
```

#### 2.3 Add collapse toggle button inside Sidebar

Add at the bottom of the sidebar (above user card) or at the top next to the logo. Use same hamburger icon:

```tsx
{/* Collapse toggle button */}
<button
  onClick={onToggle}
  style={{
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    borderRadius: 8,
    color: 'var(--warm-text-muted)',
    display: collapsed ? 'none' : 'flex',
  }}
  aria-label={collapsed ? 'Expand' : 'Collapse'}
>
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 10h14M3 5h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
</button>
```

#### 2.4 Update sidebar width and content visibility

Replace fixed width with dynamic:

```tsx
<nav
  style={{
    width: collapsed ? 60 : 240,
    minHeight: '100vh',
    backgroundColor: 'var(--warm-sidebar)',
    borderRight: '1.5px solid var(--warm-sidebar-border)',
    padding: collapsed ? '24px 8px' : '24px 0',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 50,
    transition: 'width 0.3s ease, padding 0.3s ease',
  }}
>
```

#### 2.5 Hide logo/text when collapsed

Update the logo section:

```tsx
{/* Logo */}
<div style={{
  padding: collapsed ? '0 8px' : '0 20px',
  marginBottom: collapsed ? 8 : 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: collapsed ? 'center' : 'flex-start',
  gap: collapsed ? 0 : 12,
  position: 'relative',
}}>
  {/* Toggle button - show when collapsed (in place of logo text) */}
  {collapsed && onToggle && (
    <button
      onClick={onToggle}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 8,
        borderRadius: 8,
        color: 'var(--warm-text-muted)',
      }}
      aria-label="Expand"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 10h14M3 5h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </button>
  )}
  {!collapsed && (
    <>
      <div style={{
        width: 42, height: 42, borderRadius: 14,
        background: 'var(--warm-sidebar-active)',
        border: '1.5px solid var(--warm-sidebar-user-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <SparkleIcon />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 19, fontWeight: 900, color: 'var(--warm-text)', letterSpacing: -0.5 }}>TidyQuest</div>
        <div style={{ fontSize: 10, color: 'var(--warm-text-light)', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>
          {t('nav.tagline')}
        </div>
      </div>
    </>
  )}
</div>
```

#### 2.6 Hide nav labels when collapsed

Update nav item rendering:

```tsx
<div style={{
  display: 'flex', alignItems: 'center', gap: 12,
  padding: collapsed ? '11px 0' : '11px 16px',
  justifyContent: collapsed ? 'center' : 'flex-start',
  borderRadius: 14,
  backgroundColor: isActive ? 'var(--warm-sidebar-active)' : 'transparent',
  borderLeft: isActive ? '3px solid var(--warm-accent)' : '3px solid transparent',
  transition: 'all 0.15s ease',
}}>
  <span style={{ flexShrink: 0 }}><item.Icon active={isActive} /></span>
  {!collapsed && (
    <span style={{
      fontSize: 14, fontWeight: isActive ? 800 : 600,
      color: isActive ? 'var(--warm-accent)' : 'var(--warm-text-muted)',
    }}>{t(`nav.${item.label.toLowerCase()}`)}</span>
  )}
</div>
```

#### 2.7 Hide user card when collapsed (or show minimal)

Option A: Hide entirely when collapsed
Option B: Show minimal avatar only

For now, hide when collapsed:

```tsx
{/* User Card */}
{!collapsed && (
  <div style={{ padding: '0 14px' }}>
    {/* ... existing user card code ... */}
  </div>
)}
```

Or show minimal:

```tsx
{/* User Card */}
<div style={{
  padding: collapsed ? '0 8px' : '0 14px',
  display: 'flex',
  justifyContent: collapsed ? 'center' : 'flex-start',
}}>
  <div
    onClick={() => navigate('/profile')}
    style={{
      display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10,
      padding: collapsed ? '8px' : '12px 14px',
      backgroundColor: 'var(--warm-sidebar-user-bg)',
      borderRadius: 16,
      border: '1.5px solid var(--warm-sidebar-user-border)',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    }}
  >
    <UserAvatar
      name={user.displayName}
      color={user.avatarColor}
      size={collapsed ? 28 : 38}
      avatarType={user.avatarType}
      avatarPreset={user.avatarPreset}
      avatarPhotoUrl={user.avatarPhotoUrl}
    />
    {!collapsed && (
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--warm-text)' }}>{user.displayName}</div>
        {gamificationEnabled && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--warm-text-light)', fontWeight: 600 }}>
              <CoinIcon /> {user.coins}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--warm-text-light)', fontWeight: 600 }}>
              <FireIcon /> {user.currentStreak}d
            </span>
          </div>
        )}
      </div>
    )}
  </div>
</div>
```

#### 2.8 Mobile considerations

When mobile (`isMobileOpen` is true), ignore collapsed state and show full sidebar (existing behavior):

```tsx
const effectiveCollapsed = isMobileOpen ? false : collapsed;
```

Then use `effectiveCollapsed` throughout the sidebar rendering.

## Key Implementation Details

1. **CSS transitions**: Use existing `transition: 'width 0.3s ease'` for smooth animation
2. **localStorage key**: `tidyquest-sidebar-collapsed`
3. **Default state**: Expanded (false) on first load
4. **Icon reuse**: Hamburger SVG from lines 303-327 in App.tsx (already exists)
5. **Mobile behavior**: Ignore collapsed state when mobile menu is open

## No Changes Needed

- No API changes
- No database changes
- No new translations needed (existing labels)
- No CSS file changes (use inline styles like existing code)

## Testing Checklist

- [ ] Initial load shows expanded sidebar (first visit)
- [ ] Clicking hamburger collapses sidebar with animation
- [ ] Clicking again expands sidebar with animation
- [ ] Collapsed state persists after page refresh
- [ ] All nav items visible as icons when collapsed
- [ ] Main content adjusts margin smoothly
- [ ] Mobile menu still works correctly
- [ ] No layout breaks on narrow screens

## Acceptance Criteria

1. Hamburger button (three vertical bars) visible in sidebar
2. Clicking toggle smoothly collapses/expands sidebar
3. Collapsed sidebar shows only icons (no text)
4. Main content adjusts left margin to fill space
5. State persists in localStorage across sessions
6. Mobile menu behavior unchanged