# Team Member Management Endpoints

## Overview

Team leads can now manage team membership through the following endpoints. All endpoints require JWT authentication and the `team_lead` role.

**Base URL:** `/api/team-lead`

---

## Endpoints

### 1. Get Available Members

**GET** `/teams/:teamCode/available-members`

Get a list of users who are NOT currently members of the team and can be added.

**Path Parameters:**
- `teamCode` - The team code (e.g., TEAM00000001)

**Response:**
```json
[
  {
    "user_id": "uuid",
    "user_code": "USER00000001",
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "avatar_url": "https://...",
    "role": "employee",
    "department_id": "uuid"
  }
]
```

**Example:**
```bash
curl -X GET \
  http://localhost:3000/api/team-lead/teams/TEAM00000001/available-members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 2. Add Team Member

**POST** `/teams/:teamCode/members`

Add a new member to the team.

**Path Parameters:**
- `teamCode` - The team code (e.g., TEAM00000001)

**Request Body:**
```json
{
  "user_code": "USER00000002",
  "allocation_percentage": 100  // Optional, default is 100
}
```

**Field Descriptions:**
- `user_code` - Required. The user code of the person to add
- `allocation_percentage` - Optional. Percentage of their time allocated to this team (0-100). Default: 100

**Response:**
```json
{
  "membership_id": "uuid",
  "team_id": "uuid",
  "user_id": "uuid",
  "allocation_percentage": 100,
  "joined_at": "2026-01-04T12:00:00Z",
  "user_code": "USER00000002",
  "full_name": "Jane Smith",
  "email": "jane.smith@example.com",
  "avatar_url": "https://...",
  "role": "employee"
}
```

**Example:**
```bash
curl -X POST \
  http://localhost:3000/api/team-lead/teams/TEAM00000001/members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_code": "USER00000002",
    "allocation_percentage": 80
  }'
```

**Error Responses:**
- `400 Bad Request` - Missing user_code or invalid allocation_percentage
- `404 Not Found` - Team or user not found
- `403 Forbidden` - Not authorized to manage this team
- `409 Conflict` - User is already a member of this team

---

### 3. Remove Team Member

**DELETE** `/teams/:teamCode/members/:userCode`

Remove a member from the team (soft delete - sets left_at timestamp).

**Path Parameters:**
- `teamCode` - The team code (e.g., TEAM00000001)
- `userCode` - The user code of the member to remove (e.g., USER00000002)

**Response:**
```json
{
  "message": "Team member removed successfully"
}
```

**Example:**
```bash
curl -X DELETE \
  http://localhost:3000/api/team-lead/teams/TEAM00000001/members/USER00000002 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Error Responses:**
- `404 Not Found` - Team, user, or membership not found
- `403 Forbidden` - Not authorized to manage this team

---

### 4. Update Team Member Allocation

**PUT** `/teams/:teamCode/members/:userCode`

Update the allocation percentage for a team member.

**Path Parameters:**
- `teamCode` - The team code (e.g., TEAM00000001)
- `userCode` - The user code of the member (e.g., USER00000002)

**Request Body:**
```json
{
  "allocation_percentage": 50
}
```

**Field Descriptions:**
- `allocation_percentage` - Required. Percentage of their time (0-100)

**Response:**
```json
{
  "membership_id": "uuid",
  "team_id": "uuid",
  "user_id": "uuid",
  "allocation_percentage": 50,
  "joined_at": "2026-01-04T12:00:00Z",
  "user_code": "USER00000002",
  "full_name": "Jane Smith",
  "email": "jane.smith@example.com",
  "avatar_url": "https://...",
  "role": "employee"
}
```

**Example:**
```bash
curl -X PUT \
  http://localhost:3000/api/team-lead/teams/TEAM00000001/members/USER00000002 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "allocation_percentage": 50
  }'
```

**Error Responses:**
- `400 Bad Request` - Missing or invalid allocation_percentage
- `404 Not Found` - Team, user, or membership not found
- `403 Forbidden` - Not authorized to manage this team

---

## Complete Workflow Example

Here's a complete workflow showing how a team lead would manage team members:

### 1. Check Available Members
```bash
GET /api/team-lead/teams/TEAM00000001/available-members
```

### 2. Add a Member
```bash
POST /api/team-lead/teams/TEAM00000001/members
Body: { "user_code": "USER00000002", "allocation_percentage": 100 }
```

### 3. View Team Info (with members)
```bash
GET /api/team-lead/teams/TEAM00000001
```
Response includes all team members in the `members` array.

### 4. Update Member Allocation
```bash
PUT /api/team-lead/teams/TEAM00000001/members/USER00000002
Body: { "allocation_percentage": 75 }
```

### 5. Remove Member
```bash
DELETE /api/team-lead/teams/TEAM00000001/members/USER00000002
```

---

## Authorization

All endpoints verify:
1. **Authentication:** Valid JWT token required
2. **Role:** User must have `team_lead` role
3. **Team Ownership:** Team lead must be the owner of the team (team.lead_id === user_id)

---

## Database Schema

The team member management uses the `team_members` table:

```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id),
  user_id UUID REFERENCES users(id),
  allocation_percentage INT (0-100),
  joined_at TIMESTAMPTZ,
  left_at TIMESTAMPTZ  -- NULL for active members
);
```

**Key Constraints:**
- Unique active membership: A user can only be an active member of a team once (where left_at IS NULL)
- Soft delete: Removing a member sets `left_at` timestamp instead of deleting the record
- History tracking: All membership history is preserved

---

## Implementation Details

**Files Modified:**
- `src/services/team-lead/team-lead.service.ts` - Business logic (lines 99-288)
- `src/handlers/team-lead/team-lead.handler.ts` - HTTP handlers (lines 43-126)
- `src/routes/team-lead/team-lead.routes.ts` - Route definitions (lines 30-36)

**Files Used (Already Existed):**
- `src/repositories/team/team-member.repository.ts` - Data access layer
- `src/entities/team/models/team-member.model.ts` - TypeScript types

---

## Testing

To test these endpoints, you'll need:
1. A valid JWT token for a user with `team_lead` role
2. A team where the team lead is the owner (team.lead_id === user_id)
3. Users with `active` status who can be added to the team

**Quick Test Script:**
```bash
# Set your JWT token
TOKEN="your_jwt_token_here"

# 1. Get available members
curl -X GET http://localhost:3000/api/team-lead/teams/TEAM00000001/available-members \
  -H "Authorization: Bearer $TOKEN"

# 2. Add a member
curl -X POST http://localhost:3000/api/team-lead/teams/TEAM00000001/members \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"user_code": "USER00000002"}'

# 3. Update allocation
curl -X PUT http://localhost:3000/api/team-lead/teams/TEAM00000001/members/USER00000002 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"allocation_percentage": 75}'

# 4. Remove member
curl -X DELETE http://localhost:3000/api/team-lead/teams/TEAM00000001/members/USER00000002 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Next Steps

With team member management complete, the remaining workflow gaps are:

1. **Time Entry Approval** - Approve/reject team member time entries
2. **Leave/Vacation Approval** - Approve/reject time-off requests
3. **Sprint Update/Close** - Update sprint status and officially close sprints
4. **Sprint Retrospectives** - Run retrospectives and track action items

Team member management was identified as the **highest priority** gap because team leads need to build their teams before they can assign tasks and manage workload.
