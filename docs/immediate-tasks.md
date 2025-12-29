# Immediate Critical Tasks - Implementation Guide

## 1. Backend: Block/Unblock User Endpoints

### Missing Endpoints to Implement

```javascript
// Block User
POST /api/admin/users/:id/block
Request Body: {
  "reason": "Optional reason for blocking"
}
Response: {
  "message": "User blocked successfully",
  "user": {
    "id": "uuid",
    "status": "blocked"
  }
}

// Unblock User  
POST /api/admin/users/:id/unblock
Request Body: {
  "reason": "Optional reason for unblocking"
}
Response: {
  "message": "User unblocked successfully", 
  "user": {
    "id": "uuid",
    "status": "active"
  }
}
```

### Frontend Integration Required
- Update `src/services/admin.service.ts`
- Modify `src/components/admin/AdminUsers.tsx`
- Add block/unblock buttons with confirmation dialogs

---

## 2. Backend: Project Status Update

### Current Issue
Project status updates not working properly. Need to implement:

```javascript
PUT /api/project-manager/projects/:code/status
Request Body: {
  "status": "planning" | "active" | "on_hold" | "completed" | "cancelled"
}
Response: {
  "id": "uuid",
  "project_code": "PROJ00000020", 
  "status": "active",
  "updated_at": "2025-12-29T15:26:19.344Z"
}
```

### Frontend Fix Required
- Update `src/components/project-manager/ProjectCard.tsx`
- Add status dropdown with proper validation
- Show status change confirmation

---

## 3. Frontend: Fix Team Lead Dashboard API Calls

### Current Problem
Team lead dashboard is calling employee endpoints instead of team lead endpoints.

### Files to Fix

#### `src/services/teamlead.service.ts`
```typescript
// Current (WRONG)
const getTeams = () => api.get('/employee/teams');

// Should be (CORRECT)  
const getTeams = (teamCode: string) => api.get(`/team-lead/teams/${teamCode}`);
const getTasks = (teamCode: string) => api.get(`/team-lead/teams/${teamCode}/tasks`);
const getPerformance = (teamCode: string) => api.get(`/team-lead/teams/${teamCode}/performance`);
```

#### `src/pages/dashboard/TeamLeadDashboard.tsx`
```typescript
// Update all API calls to use team lead endpoints
useEffect(() => {
  const fetchData = async () => {
    try {
      // Get user's team first, then use team code for other calls
      const teamsResponse = await teamLeadService.getMyTeams();
      const teamCode = teamsResponse.data.teams[0]?.team_code;
      
      if (teamCode) {
        const [tasks, performance] = await Promise.all([
          teamLeadService.getTasks(teamCode),
          teamLeadService.getPerformance(teamCode)
        ]);
        // Update state...
      }
    } catch (error) {
      console.error('Error fetching team lead data:', error);
    }
  };
  
  fetchData();
}, []);
```

---

## 4. Frontend: Fix Team Member Selection

### Current Problem
Team lead appears in the member selection list when adding team members.

### Files to Fix

#### `src/components/project-manager/AddTeamMembers.tsx`
```typescript
// Filter out team lead from available members
const availableMembers = allEmployees.filter(employee => 
  employee.id !== selectedTeam.lead_id && 
  !currentTeamMembers.some(member => member.user_id === employee.id)
);
```

#### `src/components/project-manager/TeamMemberSelector.tsx`
```typescript
// Add prop to exclude specific users
interface TeamMemberSelectorProps {
  excludeUserIds?: string[];
  // ... other props
}

// In component
const filteredEmployees = employees.filter(emp => 
  !excludeUserIds?.includes(emp.id)
);
```

---

## 5. Frontend: User Role Update on Team Lead Assignment

### Current Problem
When PM assigns someone as team lead, their role doesn't update in the UI.

### Files to Fix

#### `src/contexts/AuthContext.tsx`
```typescript
// Add method to update user role
const updateUserRole = (newRole: string) => {
  setUser(prev => prev ? { ...prev, role: newRole } : null);
  // Also update in localStorage if persisting user data
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    user.role = newRole;
    localStorage.setItem('user', JSON.stringify(user));
  }
};
```

#### `src/services/project-manager.service.ts`
```typescript
// Update assign team lead to also update user role
const assignTeamLead = async (teamCode: string, leadId: string) => {
  const response = await api.put(`/project-manager/teams/${teamCode}/lead`, {
    lead_id: leadId
  });
  
  // If successful, update the user's role in context
  // This should ideally be handled by the backend
  return response;
};
```

---

## 6. Frontend: Implement Collapsible Sidebar

### New Component: `src/components/layout/Sidebar.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h2 className="text-lg font-semibold">Menu</h2>}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="overflow-hidden">
        {children}
      </div>
    </div>
  );
};
```

---

## 7. Frontend: Basic Search Implementation

### New Component: `src/components/common/GlobalSearch.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    try {
      // Implement search API call when backend is ready
      // const response = await searchService.globalSearch(searchQuery);
      // setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search... (Ctrl+K)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {/* Search results */}
        </div>
      )}
    </div>
  );
};
```

---

## Implementation Order

### Day 1
1. Fix team lead dashboard API calls
2. Implement block/unblock user endpoints (backend)
3. Update admin users component for block/unblock

### Day 2  
1. Fix team member selection logic
2. Implement user role update on team lead assignment
3. Add collapsible sidebar

### Day 3
1. Fix project status updates (backend + frontend)
2. Implement basic search component
3. Clean up navigation structure

### Day 4
1. Test all fixes
2. Handle edge cases
3. Update documentation

---

## Testing Checklist

### Backend Tests
- [ ] Block user endpoint works
- [ ] Unblock user endpoint works  
- [ ] Project status update works
- [ ] Role updates when team lead assigned

### Frontend Tests
- [ ] Team lead dashboard loads correctly
- [ ] Team member selection excludes team lead
- [ ] Sidebar collapses and persists state
- [ ] User role updates in UI when changed
- [ ] Project status can be updated
- [ ] Search component renders (even without backend)

### Integration Tests
- [ ] All user flows work end-to-end
- [ ] No console errors
- [ ] Proper error handling
- [ ] Loading states work correctly