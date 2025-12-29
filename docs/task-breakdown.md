# Harmonious Team Insights - Task Breakdown

## Overview
This document organizes all pending tasks into backend and frontend categories with clear priorities and implementation details.

## Backend Tasks (API Endpoints)

### High Priority - Missing Endpoints

#### 1. Admin User Management
- **Block User**: `POST /api/admin/users/:id/block`
- **Unblock User**: `POST /api/admin/users/:id/unblock`
- **Status**: Missing implementation
- **Error**: `Cannot POST /api/admin/users/e1a484bd-0f3b-4151-841b-97db39db354d/unblock`

#### 2. Project Status Management
- **Update Project Status**: `PUT /api/project-manager/projects/:code/status`
- **Current Issue**: Status updates not working properly
- **Required Statuses**: `planning`, `active`, `on_hold`, `completed`, `cancelled`

#### 3. User Role Updates
- **Auto-promote to Team Lead**: When PM assigns someone as team lead, their role should automatically update
- **Endpoint**: Modify existing team lead assignment endpoints to update user role
- **Affected**: `PUT /api/project-manager/teams/:code/lead`

#### 4. Notifications System
- **Get Notifications**: `GET /api/notifications`
- **Mark as Read**: `PUT /api/notifications/:id/read`
- **Create Notification**: `POST /api/notifications`
- **Status**: Completely missing

#### 5. Google Calendar Integration
- **Connect Calendar**: `POST /api/integrations/google-calendar/connect`
- **Sync Events**: `POST /api/integrations/google-calendar/sync`
- **Get Events**: `GET /api/integrations/google-calendar/events`
- **Status**: Not implemented

### Medium Priority - Enhancements

#### 6. Search Functionality
- **Global Search**: `GET /api/search?q=query&type=users|projects|tasks`
- **User Search**: `GET /api/users/search?q=query`
- **Project Search**: `GET /api/projects/search?q=query`

#### 7. Timeline/Deadline Management
- **Get Upcoming Deadlines**: `GET /api/deadlines/upcoming`
- **Project Timeline**: `GET /api/projects/:code/timeline`

---

## Frontend Tasks

### High Priority - Critical Fixes

#### 1. Dashboard Role-Based Routing
- **Issue**: Team lead dashboard calling employee endpoints
- **Current**: `https://upea.onrender.com/api/employee/teams`
- **Should be**: `https://upea.onrender.com/api/team-lead/teams/:teamCode/*`
- **Files to fix**:
  - `src/pages/dashboard/TeamLeadDashboard.tsx`
  - `src/services/teamlead.service.ts`

#### 2. User Role Management
- **Issue**: User role not updating when assigned as team lead
- **Fix**: Update user context when role changes
- **Files to modify**:
  - `src/contexts/AuthContext.tsx`
  - `src/services/auth.service.ts`

#### 3. Team Member Selection
- **Issue**: Team lead appears in member selection list
- **Fix**: Filter out team lead from available members
- **Files to fix**:
  - `src/components/project-manager/AddTeamMembers.tsx`
  - `src/components/project-manager/TeamMemberSelector.tsx`

### High Priority - Missing Components

#### 4. Notifications System
- **Components needed**:
  - `src/components/common/NotificationBell.tsx`
  - `src/components/common/NotificationPanel.tsx`
  - `src/components/common/NotificationItem.tsx`
- **Features**:
  - Real-time notifications
  - Mark as read/unread
  - Notification categories

#### 5. Collapsible Sidebar
- **File**: `src/components/layout/Sidebar.tsx`
- **Features**:
  - Toggle collapse/expand
  - Persist state in localStorage
  - Responsive behavior

#### 6. Search Functionality
- **Components needed**:
  - `src/components/common/GlobalSearch.tsx`
  - `src/components/common/SearchResults.tsx`
- **Features**:
  - Global search bar in header
  - Search users, projects, tasks
  - Keyboard shortcuts (Ctrl+K)

### Medium Priority - Dashboard Implementations

#### 7. Team Lead Dashboard
- **File**: `src/pages/dashboard/TeamLeadDashboard.tsx`
- **Components needed**:
  - `src/components/teamlead/TeamOverview.tsx`
  - `src/components/teamlead/TaskManagement.tsx`
  - `src/components/teamlead/TeamPerformance.tsx`
  - `src/components/teamlead/ObservationPanel.tsx`

#### 8. Employee Dashboard (Member)
- **File**: `src/pages/dashboard/EmployeeDashboard.tsx`
- **Components needed**:
  - `src/components/employee/TaskList.tsx`
  - `src/components/employee/TimeTracking.tsx`
  - `src/components/employee/PerformanceMetrics.tsx`
  - `src/components/employee/TeamInfo.tsx`

#### 9. Profile Pages (Role-based)
- **Admin Profile**: `src/pages/profile/AdminProfile.tsx`
- **PM Profile**: `src/pages/profile/ProjectManagerProfile.tsx`
- **Employee Profile**: `src/pages/profile/EmployeeProfile.tsx`
- **Team Lead Profile**: `src/pages/profile/TeamLeadProfile.tsx`

### Medium Priority - Feature Enhancements

#### 10. Project Timeline
- **File**: `src/components/project-manager/ProjectTimeline.tsx`
- **Features**:
  - Upcoming deadlines tab (functional)
  - Google Calendar integration
  - Gantt chart view
  - Milestone tracking

#### 11. Project Status Management
- **File**: `src/components/project-manager/ProjectStatusManager.tsx`
- **Features**:
  - Status dropdown with proper options
  - Status change confirmation
  - Status history tracking

### Low Priority - Data Management

#### 12. Remove Mock Data
- **Files to clean**:
  - `src/data/mockData.ts`
  - `src/utils/mockData.ts`
- **Replace with**: Real API calls

---

## UI/UX Improvements Needed

### 1. Navigation Structure
```
Current Issues:
- Team lead should be under Employee section
- Profile routes should be role-specific
- Inconsistent navigation patterns

Proposed Structure:
├── Admin
│   ├── Dashboard
│   ├── Users
│   ├── Departments
│   └── Profile (/admin/profile)
├── Project Manager
│   ├── Dashboard
│   ├── Projects
│   ├── Timeline
│   └── Profile (/project-manager/profile)
└── Employee
    ├── Dashboard (/employee/dashboard)
    ├── Team Lead (/employee/team-lead)
    ├── Member (/employee/member)
    └── Profile (/employee/profile)
```

### 2. Component Consistency
- Standardize loading states
- Consistent error handling
- Uniform styling patterns
- Responsive design improvements

### 3. User Experience
- Better form validation
- Loading indicators
- Success/error notifications
- Keyboard navigation support

---

## Implementation Priority Order

### Phase 1 (Critical - Week 1)
1. Fix team lead dashboard API calls
2. Implement block/unblock user endpoints
3. Fix user role updates
4. Implement collapsible sidebar
5. Fix team member selection logic

### Phase 2 (High Priority - Week 2)
1. Implement notifications system (backend + frontend)
2. Add search functionality
3. Complete team lead dashboard UI
4. Implement employee dashboard
5. Fix project status updates

### Phase 3 (Medium Priority - Week 3)
1. Role-based profile pages
2. Project timeline enhancements
3. Google Calendar integration
4. Remove mock data
5. UI/UX improvements

### Phase 4 (Polish - Week 4)
1. Performance optimizations
2. Error handling improvements
3. Accessibility enhancements
4. Mobile responsiveness
5. Testing and bug fixes

---

## Technical Debt

### Code Quality Issues
1. Inconsistent error handling patterns
2. Missing TypeScript types in some components
3. Unused imports and dead code
4. Inconsistent naming conventions

### Performance Issues
1. Unnecessary re-renders in dashboards
2. Large bundle size due to unused dependencies
3. Missing memoization in expensive components
4. Inefficient API calls (no caching)

### Security Concerns
1. Missing input validation on forms
2. No rate limiting on API calls
3. Sensitive data in localStorage
4. Missing CSRF protection

---

## Success Metrics

### Backend
- All API endpoints return proper status codes
- Response times under 200ms for most endpoints
- Proper error handling and validation
- 100% endpoint test coverage

### Frontend
- All user flows work without errors
- Page load times under 2 seconds
- Mobile responsive on all screen sizes
- Accessibility score above 90%

### User Experience
- Zero critical bugs in production
- User can complete all workflows
- Consistent UI/UX across all pages
- Proper loading and error states