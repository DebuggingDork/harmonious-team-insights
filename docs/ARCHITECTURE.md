# TeamTune Frontend Architecture

> **Comprehensive Architecture Guide & Refactoring Roadmap**

Last Updated: 2026-01-01
Version: 2.0.0

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Current Architecture](#current-architecture)
3. [Refactoring Progress](#refactoring-progress)
4. [New Components](#new-components)
5. [Best Practices](#best-practices)
6. [Complete File Structure](#complete-file-structure)
7. [Migration Guide](#migration-guide)
8. [Future Improvements](#future-improvements)

---

## 🎯 Overview

TeamTune is a role-based team management and performance tracking platform built with:

- **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **React Router** for routing
- **React Query** for server state
- **Framer Motion** for animations
- **Recharts** for data visualization

### Supported Roles

| Role | Dashboard | Key Features |
|------|-----------|--------------|
| **Admin** | `/dashboard/admin` | User management, role assignment, system settings |
| **Project Manager** | `/dashboard/project-manager` | Project oversight, timeline tracking, reports |
| **Team Lead** | `/dashboard/team-lead` | Team management, task assignment, feedback |
| **Member/Employee** | `/dashboard/member` | Task tracking, time logging, progress reports |

---

## 🏗️ Current Architecture

### Technology Stack

```
Frontend Framework:    React 18.3.1 + TypeScript 5.8.3
Styling:              Tailwind CSS 3.4.17 + shadcn/ui
State Management:     React Query 5.83.0 + Context API
Routing:              React Router DOM 6.30.1
Animations:           Framer Motion 12.23.26
Charts:               Recharts 2.15.4
Form Handling:        React Hook Form 7.61.1 + Zod 3.25.76
Build Tool:           Vite 5.4.19
```

### Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                    Presentation Layer                 │
│  (Pages, Layouts, Components, UI Components)          │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────┴─────────────────────────────────┐
│                    Business Logic Layer               │
│  (Hooks, Contexts, State Management)                  │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────┴─────────────────────────────────┐
│                    Data Access Layer                  │
│  (Services, API Client, React Query)                  │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────┴─────────────────────────────────┐
│                    External APIs                      │
│  (Backend REST API)                                   │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Refactoring Progress

### Phase 1: Layout System ✅ COMPLETED

**Problem:** 95% code duplication across 4 layout files (1,200+ lines)

**Solution:** Created `BaseLayout` system

**Results:**
- AdminLayout: 339 lines → **54 lines** (84% reduction)
- MemberLayout: 310 lines → **54 lines** (83% reduction)
- ProjectManagerLayout: 305 lines → **54 lines** (82% reduction)
- TeamLeadLayout: 304 lines → **54 lines** (82% reduction)

**New Components:**
```
src/components/layouts/BaseLayout/
├── BaseLayout.tsx               (105 lines - reusable core)
├── components/
│   ├── LayoutHeader.tsx         (128 lines - shared header)
│   ├── MobileNavigation.tsx     (117 lines - mobile menu)
│   ├── LayoutPageContent.tsx    (46 lines - page wrapper)
│   └── UserAvatar.tsx           (54 lines - role-based avatar)
├── types.ts                     (shared types)
├── hooks.ts                     (shared utilities)
├── config.ts                    (navigation config)
└── README.md                    (documentation)
```

### Phase 2: Shared Components ✅ COMPLETED

**Problem:** Stats cards, charts, role selects duplicated across dashboards

**Solution:** Created reusable shared components

**New Components:**
```
src/components/shared/
├── StatCard.tsx                 (Reusable stats display)
├── ChartWrapper.tsx             (Consistent chart container)
├── RoleSelect.tsx               (Role dropdown component)
└── index.ts                     (barrel exports)
```

**Impact:**
- Eliminates 500+ lines of duplicated component code
- Ensures UI consistency across all dashboards
- Single source of truth for stats/chart styling

### Phase 3: Shared Hooks ✅ COMPLETED

**Problem:** Date range calculation duplicated in 2+ dashboards

**Solution:** Created `useDateRanges` hook

**New Hooks:**
```
src/hooks/
└── useDateRanges.ts             (Date range calculations)
```

### Phase 4: Route Configuration ✅ COMPLETED

**Problem:** 34 hardcoded routes in App.tsx

**Solution:** Centralized route configuration

**New Config:**
```
src/config/
└── routes.ts                    (All route definitions)
```

**Benefits:**
- Type-safe route access
- Automatic nav generation
- Easier maintenance

### Phase 5: UI State Management ⚠️ NOT IMPLEMENTED

**Note:** `UIContext` was created but not integrated. BaseLayout uses local state management instead, which works well for the current architecture.

---

## 🧩 New Components

### 1. StatCard

**Purpose:** Display statistics with icon, label, value, and optional trend

**Location:** `src/components/shared/StatCard.tsx`

**Usage:**
```tsx
import { StatCard } from "@/components/shared";
import { Users } from "lucide-react";

<StatCard
  label="Total Users"
  value={152}
  icon={Users}
  gradient="from-blue-500/20 to-blue-600/10"
  iconColor="text-blue-500"
  trend={{ value: 12, label: "vs last month" }}
  isLoading={isLoading}
/>
```

**Props:**
- `label`: string - Stat label
- `value`: string | number - Stat value
- `icon`: LucideIcon - Icon component
- `gradient?`: string - Background gradient
- `iconColor?`: string - Icon color class
- `isLoading?`: boolean - Show loading state
- `trend?`: { value: number, label: string } - Trend indicator

### 2. ChartWrapper

**Purpose:** Consistent wrapper for all chart components

**Location:** `src/components/shared/ChartWrapper.tsx`

**Usage:**
```tsx
import { ChartWrapper } from "@/components/shared";
import { TrendingUp } from "lucide-react";
import { LineChart, Line } from "recharts";

<ChartWrapper
  title="Performance Trends"
  description="Last 30 days"
  icon={TrendingUp}
  isLoading={isLoading}
  headerActions={<Button size="sm">Export</Button>}
>
  <LineChart data={data}>
    <Line dataKey="value" />
  </LineChart>
</ChartWrapper>
```

**Props:**
- `title`: string - Chart title
- `description?`: string - Chart description
- `icon?`: LucideIcon - Header icon
- `children`: ReactNode - Chart content
- `isLoading?`: boolean - Show loading state
- `headerActions?`: ReactNode - Action buttons

### 3. RoleSelect

**Purpose:** Reusable role dropdown selector

**Location:** `src/components/shared/RoleSelect.tsx`

**Usage:**
```tsx
import { RoleSelect } from "@/components/shared";

<RoleSelect
  value={selectedRole}
  onChange={setSelectedRole}
  size="sm"
  allowedRoles={["employee", "team_lead"]}
  placeholder="Select role"
/>
```

**Props:**
- `value`: UserRole - Selected role
- `onChange`: (role: UserRole) => void - Change handler
- `size?`: "sm" | "md" | "lg" - Size variant
- `allowedRoles?`: UserRole[] - Filter options
- `disabled?`: boolean - Disable state

### 4. useDateRanges Hook

**Purpose:** Calculate date ranges for API queries

**Location:** `src/hooks/useDateRanges.ts`

**Usage:**
```tsx
import { useDateRanges, useWeekRanges, useMonthRange } from "@/hooks/useDateRanges";

// Last 6 weeks (42 days)
const dateRanges = useDateRanges(42);

// Last 6 weeks (shorthand)
const weekRanges = useWeekRanges(6);

// Last month (30 days)
const monthRange = useMonthRange();

// Use in API call
const { data } = useMyPerformance(dateRanges);
```

**Returns:**
```typescript
{
  period_start: string;  // "2025-11-20"
  period_end: string;    // "2026-01-01"
  start_date: string;    // "2025-11-20"
  end_date: string;      // "2026-01-01"
}
```

### 5. UIContext

**Purpose:** Global UI state management

**Location:** `src/contexts/UIContext.tsx`

**Setup:**
```tsx
// main.tsx or App.tsx
import { UIProvider } from "@/contexts/UIContext";

<UIProvider>
  <App />
</UIProvider>
```

**Usage:**
```tsx
import { useUI } from "@/contexts/UIContext";

const Dashboard = () => {
  const {
    isMobileMenuOpen,
    toggleMobileMenu,
    isNotificationPanelOpen,
    setNotificationPanelOpen,
    activeTab,
    setActiveTab,
  } = useUI();

  return (
    <div>
      <button onClick={toggleMobileMenu}>Menu</button>
      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
      />
    </div>
  );
};
```

---

## 📚 Best Practices

### 1. Component Organization

**DO:**
```tsx
// ✅ Use shared components
import { StatCard } from "@/components/shared";

<StatCard label="Users" value={count} icon={Users} />
```

**DON'T:**
```tsx
// ❌ Duplicate component structure
<div className="bg-card p-6 rounded-2xl...">
  <div className="flex items-center justify-between">
    {/* Repeated markup */}
  </div>
</div>
```

### 2. Layout Usage

**DO:**
```tsx
// ✅ Use role-specific layout wrapper
import { AdminLayout } from "@/components/layouts/AdminLayout";

export const UsersPage = () => (
  <AdminLayout headerTitle="Users" headerDescription="Manage users">
    <UsersList />
  </AdminLayout>
);
```

**DON'T:**
```tsx
// ❌ Create custom layout structure
export const UsersPage = () => (
  <div className="min-h-screen">
    <header>{/* Custom header */}</header>
    <main><UsersList /></main>
  </div>
);
```

### 3. Hook Usage

**DO:**
```tsx
// ✅ Use centralized hooks
import { useDateRanges } from "@/hooks/useDateRanges";

const dateRanges = useDateRanges(42);
const { data } = useMyPerformance(dateRanges);
```

**DON'T:**
```tsx
// ❌ Inline date calculation
const getDateRanges = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 42);
  // ...
};
```

### 4. State Management

**DO:**
```tsx
// ✅ Use local state in BaseLayout (handled automatically)
// BaseLayout manages mobile menu and notification panel state internally
```

**DON'T:**
```tsx
// ❌ Duplicate state management in individual pages
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
```

---

## 📁 Complete File Structure

```
src/
├── api/
│   ├── client.ts                    # Axios instance
│   ├── endpoints.ts                 # API endpoints
│   ├── types.ts                     # API type definitions
│   └── client.ts                    # Axios instance with interceptors
│
├── components/
│   ├── ui/                          # shadcn/ui components (57 files)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── select.tsx
│   │   └── ... (54 more)
│   │
│   ├── layouts/                     # Layout system ✅ REFACTORED
│   │   ├── BaseLayout/
│   │   │   ├── BaseLayout.tsx
│   │   │   ├── components/
│   │   │   │   ├── LayoutHeader.tsx
│   │   │   │   ├── MobileNavigation.tsx
│   │   │   │   ├── LayoutPageContent.tsx
│   │   │   │   ├── UserAvatar.tsx
│   │   │   │   └── index.ts
│   │   │   ├── types.ts
│   │   │   ├── hooks.ts
│   │   │   ├── config.ts
│   │   │   ├── index.ts
│   │   │   └── README.md
│   │   ├── AdminLayout.tsx          (54 lines)
│   │   ├── MemberLayout.tsx         (54 lines)
│   │   ├── ProjectManagerLayout.tsx (54 lines)
│   │   ├── TeamLeadLayout.tsx       (54 lines)
│   │   ├── AdminSidebar.tsx
│   │   ├── MemberSidebar.tsx
│   │   ├── ProjectManagerSidebar.tsx
│   │   ├── TeamLeadSidebar.tsx
│   │   └── CollapsibleSidebar.tsx
│   │
│   ├── shared/                      # Shared components ✅ NEW
│   │   ├── StatCard.tsx
│   │   ├── ChartWrapper.tsx
│   │   ├── RoleSelect.tsx
│   │   └── index.ts
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── index.ts
│   │
│   ├── common/
│   │   ├── NotificationPanel.tsx
│   │   ├── GlobalSearch.tsx
│   │   └── index.ts
│   │
│   ├── admin/
│   │   ├── AdminUsers.tsx
│   │   ├── AdminRoles.tsx
│   │   ├── AdminSettings.tsx
│   │   └── index.ts
│   │
│   ├── employee/
│   │   ├── MyProgress.tsx
│   │   ├── MyFeedback.tsx
│   │   └── index.ts
│   │
│   ├── profile/
│   │   ├── ProfileForm.tsx
│   │   └── index.ts
│   │
│   ├── TeamTuneLogo.tsx
│   └── ProtectedRoute.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useAdmin.ts
│   ├── useTeamLead.ts
│   ├── useProjectManager.ts
│   ├── useEmployee.ts
│   ├── useDateRanges.ts             # ✅ NEW
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
├── contexts/
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── index.ts
│
├── services/
│   ├── auth.service.ts
│   ├── admin.service.ts
│   ├── teamLead.service.ts
│   ├── projectManager.service.ts
│   └── employee.service.ts
│
├── config/
│   ├── routes.ts                    # ✅ NEW
│   └── index.ts
│
├── utils/
│   ├── storage.ts
│   ├── errorHandler.ts
│   └── index.ts
│
├── lib/
│   └── utils.ts                     # Tailwind class utilities
│
├── pages/
│   ├── Index.tsx
│   ├── Pricing.tsx
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Callback.tsx
│   └── dashboard/
│       ├── AdminDashboard.tsx
│       ├── MemberDashboard.tsx
│       ├── TeamLeadDashboard.tsx
│       ├── ProjectManagerDashboard.tsx
│       ├── admin/
│       │   ├── AdminProfile.tsx
│       │   └── AdminSettings.tsx
│       ├── member/
│       │   ├── MemberTasks.tsx
│       │   ├── MemberTimeTracking.tsx
│       │   ├── MemberProgress.tsx
│       │   ├── MemberFeedback.tsx
│       │   └── MemberProfile.tsx
│       ├── team-lead/
│       │   ├── TeamLeadTasks.tsx
│       │   ├── TeamLeadFeedback.tsx
│       │   ├── TeamLeadTeam.tsx
│       │   └── TeamLeadProfile.tsx
│       └── project-manager/
│           ├── ProjectManagerProjects.tsx
│           ├── ProjectManagerTimeline.tsx
│           ├── ProjectManagerProjectDetail.tsx
│           ├── ProjectManagerReports.tsx
│           └── ProjectManagerProfile.tsx
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🔄 Migration Guide

### Migrating a Dashboard to Use New Components

**Before:**
```tsx
// MemberDashboard.tsx - OLD (650 lines)
export const MemberDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const getDateRanges = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 42);
    // ... date calculation
  };

  const dateRanges = useMemo(() => getDateRanges(), []);

  return (
    <MemberSidebar>
      <header>{/* Custom header code */}</header>
      <div className="grid grid-cols-4 gap-6">
        {/* Repeated stat card code */}
        <div className="bg-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <p>Total Tasks</p>
            <div className="p-3 bg-gradient...">
              <CheckSquare />
            </div>
          </div>
          <p className="text-3xl font-bold">{totalTasks}</p>
        </div>
        {/* Repeated 4 times */}
      </div>
    </MemberSidebar>
  );
};
```

**After:**
```tsx
// MemberDashboard.tsx - NEW (200 lines)
import { MemberLayout } from "@/components/layouts/MemberLayout";
import { StatCard, ChartWrapper } from "@/components/shared";
import { useDateRanges } from "@/hooks/useDateRanges";
import { useUI } from "@/contexts/UIContext";

export const MemberDashboard = () => {
  const dateRanges = useDateRanges(42);
  const { data, isLoading } = useMyPerformance(dateRanges);

  return (
    <MemberLayout
      headerTitle="Welcome back!"
      headerDescription="Here's your performance overview"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Tasks"
          value={data?.totalTasks || 0}
          icon={CheckSquare}
          gradient="from-blue-500/20 to-blue-600/10"
          iconColor="text-blue-500"
          isLoading={isLoading}
        />
        <StatCard
          label="Completed"
          value={data?.completedTasks || 0}
          icon={CheckCircle}
          gradient="from-green-500/20 to-green-600/10"
          iconColor="text-green-500"
          isLoading={isLoading}
        />
        {/* 2 more stat cards */}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper
          title="Performance Trends"
          description="Last 6 weeks"
          icon={TrendingUp}
          isLoading={isLoading}
        >
          <LineChart data={data?.trends}>
            {/* Chart configuration */}
          </LineChart>
        </ChartWrapper>
      </div>
    </MemberLayout>
  );
};
```

**Benefits:**
- ✅ Reduced from 650 lines to ~200 lines
- ✅ No duplicate header/sidebar code
- ✅ No duplicate state management
- ✅ No duplicate date calculations
- ✅ Consistent UI components
- ✅ Easier to maintain

---

## 🚀 Future Improvements

### Phase 6: Feature Modules (PENDING)

Create cohesive feature modules:

```
src/features/
├── admin/
│   ├── components/
│   │   ├── UserApprovalDialog.tsx
│   │   ├── UserTable.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useUserManagement.ts
│   │   └── index.ts
│   ├── types/
│   │   └── admin.types.ts
│   └── index.ts
│
├── feedback/
│   ├── components/
│   │   ├── FeedbackForm.tsx
│   │   ├── FeedbackCard.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useFeedbackForm.ts
│   │   └── index.ts
│   └── index.ts
│
└── analytics/
    ├── components/
    ├── hooks/
    └── index.ts
```

### Phase 7: Advanced State Management (PENDING)

Consider adding Zustand for complex state:

```bash
npm install zustand
```

```typescript
// store/uiStore.ts
import { create } from 'zustand';

interface UIStore {
  isMobileMenuOpen: boolean;
  isNotificationPanelOpen: boolean;
  toggleMobileMenu: () => void;
  toggleNotificationPanel: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isNotificationPanelOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleNotificationPanel: () => set((state) => ({ isNotificationPanelOpen: !state.isNotificationPanelOpen })),
}));
```

### Phase 8: Component Testing (PENDING)

Add testing infrastructure:

```bash
npm install -D @testing-library/react @testing-library/jest-dom vitest jsdom
```

### Phase 9: Performance Optimization (PENDING)

- Code splitting with React.lazy
- Image optimization
- Bundle size analysis
- React.memo for expensive components

---

## 📊 Metrics

### Code Reduction

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Layout Files | 1,258 lines | 766 lines | **39% reduction** |
| Duplicate Code | 1,200 lines | <100 lines | **92% reduction** |
| Dashboard Avg Size | 650 lines | 200 lines | **69% reduction** |

### Maintainability

| Task | Before | After |
|------|--------|-------|
| Update header design | Edit 4 files | Edit 1 file |
| Add navigation item | Edit 8 files | Edit 1 config |
| Fix layout bug | Fix in 4 places | Fix once |
| Add new role | Copy 300+ lines | Create 54-line wrapper |

---

## 🤝 Contributing

When adding new features:

1. **Check for existing patterns** - Look in `/components/shared` first
2. **Use centralized config** - Add nav items to `config/routes.ts`
3. **Leverage hooks** - Use `useDateRanges`, `useUI`, etc.
4. **Follow naming conventions** - Component files use PascalCase
5. **Document changes** - Update this ARCHITECTURE.md

---

## 📝 Notes

- **BaseLayout README:** See `src/components/layouts/BaseLayout/README.md` for layout-specific docs
- **Route Config:** See `src/config/routes.ts` for route definitions
- **Shared Components:** All shared components have JSDoc documentation

---

**Questions?** Check the README files in each module or create an issue.

**Happy Coding! 🚀**
