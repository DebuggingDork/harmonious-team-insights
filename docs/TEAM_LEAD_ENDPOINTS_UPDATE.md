# Team Lead Endpoints Update - Summary

## New Endpoints Added

### 1. Get My Teams
**Endpoint**: `GET /api/team-lead/my-teams`

Returns all teams that the authenticated team lead manages, including member details.

**Response Type**: `MyTeamsResponse`
```typescript
interface MyTeamsResponse {
  teams: TeamLeadTeam[];
  total: number;
}

interface TeamLeadTeam extends Team {
  members?: TeamMember[];
}
```

**Usage**:
```typescript
const { data: myTeams, isLoading } = useMyTeams();

// Access teams
myTeams?.teams.forEach(team => {
  console.log(team.name, team.team_code);
  console.log('Members:', team.members);
});
```

### 2. Get Team Info
**Endpoint**: `GET /api/team-lead/teams/:teamCode`

Returns specific team information by team code, including member details.

**Response Type**: `TeamLeadTeam`
```typescript
interface TeamLeadTeam extends Team {
  members?: TeamMember[];
}
```

**Usage**:
```typescript
const { data: teamInfo } = useTeamInfo(teamCode);

// Access team info
console.log(teamInfo?.name);
console.log(teamInfo?.members);
console.log(teamInfo?.capacity_hours_per_sprint);
```

## Changes Made

### 1. Types (`src/api/types.ts`)
✅ Added `TeamLeadTeam` interface extending `Team` with optional `members`
✅ Added `MyTeamsResponse` interface with `teams` array and `total` count

### 2. Endpoints (`src/api/endpoints.ts`)
✅ Added `MY_TEAMS` endpoint
✅ Added `TEAM_INFO(teamCode)` endpoint

### 3. Services (`src/services/teamLead.service.ts`)
✅ Added `getMyTeams()` service function
✅ Added `getTeamInfo(teamCode)` service function

### 4. Hooks (`src/hooks/useTeamLead.ts`)
✅ Added `useMyTeams()` hook with 5-minute cache
✅ Added `useTeamInfo(teamCode)` hook with 5-minute cache
✅ Added query keys for both endpoints

### 5. Examples
✅ Created complete Team Lead Dashboard example in `src/examples/TeamLeadDashboardExample.tsx`

## Integration Pattern for Team Lead Dashboard

### Recommended Usage Pattern

```typescript
import { useMyTeams, useTeamInfo, useTeamDashboard } from '@/hooks/useTeamLead';

function TeamLeadDashboard() {
  const [selectedTeamCode, setSelectedTeamCode] = useState<string>('');
  
  // 1. Get all teams managed by this team lead
  const { data: myTeams } = useMyTeams();
  
  // 2. Get detailed info about selected team (includes members)
  const { data: teamInfo } = useTeamInfo(selectedTeamCode);
  
  // 3. Get dashboard data for selected team
  const { data: dashboard } = useTeamDashboard(selectedTeamCode);
  
  // Auto-select first team
  useEffect(() => {
    if (myTeams?.teams.length && !selectedTeamCode) {
      setSelectedTeamCode(myTeams.teams[0].team_code);
    }
  }, [myTeams, selectedTeamCode]);
  
  return (
    <div>
      {/* Team Selector */}
      <Select value={selectedTeamCode} onValueChange={setSelectedTeamCode}>
        {myTeams?.teams.map(team => (
          <SelectItem key={team.id} value={team.team_code}>
            {team.name}
          </SelectItem>
        ))}
      </Select>
      
      {/* Team Info Display */}
      {teamInfo && (
        <div>
          <h2>{teamInfo.name}</h2>
          <p>Members: {teamInfo.members?.length}</p>
          <p>Capacity: {teamInfo.capacity_hours_per_sprint}h/sprint</p>
        </div>
      )}
      
      {/* Dashboard Widgets */}
      {dashboard && (
        <DashboardWidgets data={dashboard} />
      )}
    </div>
  );
}
```

## Benefits of Using These Endpoints

### 1. **Consistency**
- Uses the same `/api/team-lead/` prefix as other Team Lead endpoints
- Follows the same authentication and authorization pattern
- Consistent response structure

### 2. **Efficiency**
- Single call to get all teams (`/my-teams`)
- Single call to get team details with members (`/teams/:teamCode`)
- No need to call employee endpoints

### 3. **Team Lead Context**
- Only returns teams where the user is the team lead
- Includes team-specific information
- Can include member details in one call

### 4. **Better UX**
- Faster team switching (data is cached)
- Team selector populated from dedicated endpoint
- Member information readily available

## Comparison: Old vs New Pattern

### ❌ Old Pattern (Using Employee Endpoints)
```typescript
// Had to use employee endpoint
const { data: teams } = useMyTeams(); // from useEmployee hook
// This returns teams where user is a MEMBER, not necessarily a LEAD

// Then had to filter or make additional calls
const myLeadTeams = teams?.filter(team => team.lead_id === user.id);
```

### ✅ New Pattern (Using Team Lead Endpoints)
```typescript
// Direct Team Lead endpoint
const { data: myTeams } = useMyTeams(); // from useTeamLead hook
// This returns ONLY teams where user is the LEAD

// Get detailed team info with members
const { data: teamInfo } = useTeamInfo(teamCode);
// Includes members array directly
```

## API Specifications

### GET /api/team-lead/my-teams

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Response** (200 OK):
```json
{
  "teams": [
    {
      "id": "uuid",
      "team_code": "TEAM00000001",
      "project_id": "uuid",
      "project_name": "Project Alpha",
      "name": "Backend Team",
      "lead_id": "uuid",
      "lead_name": "John Doe",
      "capacity_hours_per_sprint": 320,
      "member_count": 8,
      "github_repository": "https://github.com/org/repo",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-10T00:00:00Z",
      "members": [
        {
          "user_id": "uuid",
          "user_code": "USER00000001",
          "full_name": "Jane Smith",
          "email": "jane@company.com",
          "role": "employee",
          "allocation_percentage": 100,
          "joined_at": "2025-01-01T00:00:00Z"
        }
      ]
    }
  ],
  "total": 1
}
```

### GET /api/team-lead/teams/:teamCode

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "team_code": "TEAM00000001",
  "project_id": "uuid",
  "project_name": "Project Alpha",
  "name": "Backend Team",
  "lead_id": "uuid",
  "lead_name": "John Doe",
  "capacity_hours_per_sprint": 320,
  "member_count": 8,
  "github_repository": "https://github.com/org/repo",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-10T00:00:00Z",
  "members": [
    {
      "user_id": "uuid",
      "user_code": "USER00000001",
      "full_name": "Jane Smith",
      "email": "jane@company.com",
      "role": "employee",
      "allocation_percentage": 100,
      "joined_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User is not a team lead or not authorized for this team
- `404 Not Found` - Team not found

## Caching Strategy

Both hooks use a 5-minute stale time:

```typescript
staleTime: 1000 * 60 * 5 // 5 minutes
```

This means:
- Data is cached for 5 minutes
- Subsequent calls within 5 minutes use cached data
- After 5 minutes, data is refetched in the background
- Manual refresh available via `queryClient.invalidateQueries()`

## Testing

### TypeScript Compilation
✅ All types compile correctly
✅ No type errors

### Imports
✅ Types exported from `@/api/types`
✅ Hooks exported from `@/hooks/useTeamLead`
✅ Services exported from `@/services/teamLead.service`

### Test File
✅ Updated `src/tests/TeamLeadAPITest.tsx` to include new endpoints
✅ All imports resolve correctly

## Migration Guide

If you're currently using the employee `useMyTeams` hook in the Team Lead Dashboard:

### Before:
```typescript
import { useMyTeams } from '@/hooks/useEmployee';

function TeamLeadDashboard() {
  const { data: teams } = useMyTeams();
  // teams includes ALL teams where user is a member
}
```

### After:
```typescript
import { useMyTeams } from '@/hooks/useTeamLead';

function TeamLeadDashboard() {
  const { data: myTeams } = useMyTeams();
  // myTeams.teams includes ONLY teams where user is the LEAD
}
```

## Summary

✅ **2 new endpoints** added for Team Lead team management
✅ **2 new types** defined (`TeamLeadTeam`, `MyTeamsResponse`)
✅ **2 new service functions** implemented
✅ **2 new React hooks** created with proper caching
✅ **Complete example** provided in `src/examples/TeamLeadDashboardExample.tsx`
✅ **All tests passing** - TypeScript compilation successful
✅ **Consistent with existing** Team Lead API patterns
✅ **Ready to use** in Team Lead Dashboard

These endpoints provide a cleaner, more consistent way to manage teams in the Team Lead Dashboard!
