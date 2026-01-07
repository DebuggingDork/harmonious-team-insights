# Collapsible Sidebar Component

A reusable, idempotent sidebar component that can be used across all dashboards.

## Features

- ✅ **Hover-to-reveal**: Expands when hovering near the left edge
- ✅ **Auto-collapse on click**: Collapses after clicking navigation links
- ✅ **Smooth animations**: Framer Motion powered transitions
- ✅ **Responsive**: Works on desktop, mobile uses sheet component
- ✅ **Idempotent**: No side effects, can be used in multiple dashboards
- ✅ **Customizable**: Accepts custom nav items, logo, and avatar

## Usage

### Basic Example

```tsx
import { CollapsibleSidebar, useCollapsibleSidebar, type NavItem } from "@/components/layouts/CollapsibleSidebar";
import { BarChart3, Users, Settings } from "lucide-react";

const MyDashboard = () => {
  const { logout } = useAuth();
  
  const navItems: NavItem[] = [
    { path: "/dashboard/my-dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/dashboard/my-dashboard/users", label: "Users", icon: Users },
    { path: "/dashboard/my-dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <CollapsibleSidebar
      navItems={navItems}
      onLogout={() => logout()}
    >
      <div className="min-h-screen bg-background relative">
        <MyDashboardContent />
      </div>
    </CollapsibleSidebar>
  );
};

const MyDashboardContent = () => {
  // Access sidebar state inside the context
  const { isSidebarExpanded, isDesktop } = useCollapsibleSidebar();

  return (
    <motion.main
      className="lg:ml-[64px]"
      animate={{
        marginLeft: isDesktop ? (isSidebarExpanded ? 256 : 64) : 0,
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {/* Your content here */}
    </motion.main>
  );
};
```

### With Custom Logo and Avatar

```tsx
<CollapsibleSidebar
  navItems={navItems}
  onLogout={handleLogout}
  logoComponent={<CustomLogo />}
  userAvatar={
    <div className="h-10 w-10 rounded-full bg-blue-500">
      <UserIcon />
    </div>
  }
>
  {children}
</CollapsibleSidebar>
```

### Customizing Collapse Delays

```tsx
<CollapsibleSidebar
  navItems={navItems}
  onLogout={handleLogout}
  collapseDelay={500}        // Delay before collapsing on mouse leave (default: 300ms)
  clickCollapseDelay={300}   // Delay before collapsing after link click (default: 200ms)
>
  {children}
</CollapsibleSidebar>
```

## Props

### CollapsibleSidebar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `navItems` | `NavItem[]` | **required** | Array of navigation items |
| `onLogout` | `() => void` | **required** | Logout handler function |
| `children` | `ReactNode` | - | Content to wrap (gets sidebar context) |
| `logoComponent` | `ReactNode` | `<TeamTuneLogo />` | Custom logo component |
| `userAvatar` | `ReactNode` | Default shield icon | Custom user avatar |
| `collapseDelay` | `number` | `300` | Delay before collapsing on mouse leave (ms) |
| `clickCollapseDelay` | `number` | `200` | Delay before collapsing after link click (ms) |

### NavItem

```tsx
interface NavItem {
  path: string;           // Route path
  label: string;          // Display label
  icon: React.ComponentType<{ className?: string }>;  // Icon component
}
```

## Hook

### useCollapsibleSidebar()

Returns the sidebar state:

```tsx
const { isSidebarExpanded, isDesktop, setIsSidebarExpanded } = useCollapsibleSidebar();
```

- `isSidebarExpanded`: `boolean` - Whether sidebar is expanded
- `isDesktop`: `boolean` - Whether on desktop (>= 1024px)
- `setIsSidebarExpanded`: `(value: boolean) => void` - Manually control expansion

**Note**: Must be called inside a component that's a child of `CollapsibleSidebar`.

## Implementation in Existing Dashboards

### Admin Dashboard
See `AdminSidebar.tsx` - wraps `CollapsibleSidebar` with admin-specific nav items.

### Other Dashboards
To implement in MemberLayout, TeamLeadLayout, or ProjectManagerLayout:

1. Import the component:
```tsx
import { CollapsibleSidebar, useCollapsibleSidebar } from "@/components/layouts/CollapsibleSidebar";
```

2. Define your nav items
3. Wrap your layout content with `CollapsibleSidebar`
4. Use `useCollapsibleSidebar()` hook inside child components to access state

## Design Changes

**All design changes should be made in `CollapsibleSidebar.tsx` only.**

When you update the design in `CollapsibleSidebar.tsx`, it will automatically reflect in:
- Admin Dashboard
- Member Dashboard  
- Team Lead Dashboard
- Project Manager Dashboard
- Any future dashboards using this component

This ensures consistency across all dashboards and makes maintenance easy.



