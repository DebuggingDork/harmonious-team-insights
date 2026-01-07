# Sprint Update & Close Endpoints

## Overview

Team leads can now update sprint details and officially close sprints through the following endpoints. These complete the sprint lifecycle: create → update → activate → complete/cancel.

**Base URL:** `/api/team-lead`

---

## Sprint Lifecycle

```
planning → active → completed
    ↓
cancelled
```

**Valid Transitions:**
- `planning` → `active` or `cancelled`
- `active` → `completed` or `cancelled`
- `completed` → *no transitions (final state)*
- `cancelled` → *no transitions (final state)*

---

## Endpoints

### 1. Update Sprint

**PUT** `/sprints/:sprintCode`

Update sprint details including name, dates, capacity, goals, and status.

**Path Parameters:**
- `sprintCode` - The sprint code (e.g., SPRINT00000001)

**Request Body:**
```json
{
  "name": "Sprint 15 - Updated",
  "description": "Updated sprint description",
  "start_date": "2026-01-06",
  "end_date": "2026-01-20",
  "capacity_hours": 160,
  "goals": ["Complete auth feature", "Fix critical bugs", "Deploy to staging"],
  "success_criteria": ["All tests passing", "Zero critical bugs"],
  "status": "active"
}
```

**All fields are optional** - only include the fields you want to update.

**Field Descriptions:**
- `name` - Sprint name
- `description` - Sprint description
- `start_date` - Start date (YYYY-MM-DD)
- `end_date` - End date (YYYY-MM-DD), must be after start_date
- `capacity_hours` - Total capacity in hours for the sprint
- `committed_hours` - Hours committed to tasks
- `goals` - Array of sprint goals
- `success_criteria` - Array of success criteria
- `status` - Sprint status: `planning`, `active`, `completed`, `cancelled`

**Response:**
```json
{
  "id": "uuid",
  "sprint_code": "SPRINT00000001",
  "project_id": "uuid",
  "team_id": "uuid",
  "name": "Sprint 15 - Updated",
  "description": "Updated sprint description",
  "sprint_number": 15,
  "start_date": "2026-01-06T00:00:00.000Z",
  "end_date": "2026-01-20T00:00:00.000Z",
  "capacity_hours": 160,
  "committed_hours": 0,
  "goals": ["Complete auth feature", "Fix critical bugs", "Deploy to staging"],
  "success_criteria": ["All tests passing", "Zero critical bugs"],
  "status": "active",
  "velocity": null,
  "created_at": "2026-01-04T12:00:00Z",
  "updated_at": "2026-01-04T14:30:00Z",
  "created_by": "uuid"
}
```

**Example:**
```bash
curl -X PUT \
  http://localhost:3000/api/team-lead/sprints/SPRINT00000001 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active"
  }'
```

**Example - Update Sprint Dates:**
```bash
curl -X PUT \
  http://localhost:3000/api/team-lead/sprints/SPRINT00000001 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2026-01-07",
    "end_date": "2026-01-21"
  }'
```

**Error Responses:**
- `400 Bad Request` - Invalid status transition or end_date before start_date
- `404 Not Found` - Sprint not found
- `403 Forbidden` - Not authorized to update this sprint

**Status Transition Errors:**
```json
{
  "error": "ValidationError",
  "message": "Invalid status transition from completed to active. Allowed transitions: none"
}
```

---

### 2. Close Sprint

**POST** `/sprints/:sprintCode/close`

Specialized endpoint for completing or cancelling a sprint. Automatically calculates velocity when completing.

**Path Parameters:**
- `sprintCode` - The sprint code (e.g., SPRINT00000001)

**Request Body:**
```json
{
  "action": "complete",
  "notes": "All goals achieved. Great work team!"
}
```

**Field Descriptions:**
- `action` - Required. Must be either `"complete"` or `"cancel"`
- `notes` - Optional. Notes about why the sprint was closed

**Response:**
```json
{
  "id": "uuid",
  "sprint_code": "SPRINT00000001",
  "project_id": "uuid",
  "team_id": "uuid",
  "name": "Sprint 15",
  "description": "Auth feature sprint",
  "sprint_number": 15,
  "start_date": "2026-01-06T00:00:00.000Z",
  "end_date": "2026-01-20T00:00:00.000Z",
  "capacity_hours": 160,
  "committed_hours": 140,
  "goals": ["Complete auth feature"],
  "success_criteria": ["All tests passing"],
  "status": "completed",
  "velocity": 42,
  "created_at": "2026-01-04T12:00:00Z",
  "updated_at": "2026-01-20T18:00:00Z",
  "created_by": "uuid"
}
```

**Example - Complete Sprint:**
```bash
curl -X POST \
  http://localhost:3000/api/team-lead/sprints/SPRINT00000001/close \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "complete",
    "notes": "All sprint goals achieved!"
  }'
```

**Example - Cancel Sprint:**
```bash
curl -X POST \
  http://localhost:3000/api/team-lead/sprints/SPRINT00000001/close \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "cancel",
    "notes": "Project priorities changed"
  }'
```

**Error Responses:**
- `400 Bad Request` - Invalid action or sprint already closed
- `404 Not Found` - Sprint not found
- `403 Forbidden` - Not authorized to close this sprint

---

## Velocity Calculation

When a sprint is **completed** (not cancelled), the velocity is automatically calculated:

**Formula:** Sum of story points from all tasks with `status = 'done'` in the sprint

```typescript
velocity = completedTasks.reduce((sum, task) => sum + task.story_points, 0)
```

**Example:**
- Task 1: 8 story points (done)
- Task 2: 5 story points (done)
- Task 3: 3 story points (in_progress) - not counted
- **Velocity = 13**

This velocity is automatically stored in the sprint record and can be used for:
- Sprint planning (capacity estimation)
- Team performance tracking
- Burndown charts

---

## Complete Sprint Lifecycle Workflow

### 1. Create Sprint
```bash
POST /api/team-lead/sprints
Body: {
  "project_id": "uuid",
  "team_id": "uuid",
  "name": "Sprint 15",
  "start_date": "2026-01-06",
  "end_date": "2026-01-20",
  "capacity_hours": 160,
  "goals": ["Complete auth feature"],
  "status": "planning"
}
```

### 2. Activate Sprint (Start Sprint)
```bash
PUT /api/team-lead/sprints/SPRINT00000001
Body: {
  "status": "active"
}
```

### 3. Update Sprint During Execution
```bash
PUT /api/team-lead/sprints/SPRINT00000001
Body: {
  "goals": ["Complete auth feature", "Added: Fix critical bug #123"]
}
```

### 4. Complete Sprint
```bash
POST /api/team-lead/sprints/SPRINT00000001/close
Body: {
  "action": "complete",
  "notes": "Successful sprint!"
}
```

---

## Status Transition Validation

The system enforces valid status transitions:

### Planning → Active
```bash
# ✅ Valid
PUT /sprints/SPRINT00000001
Body: { "status": "active" }
```

### Planning → Cancelled
```bash
# ✅ Valid
POST /sprints/SPRINT00000001/close
Body: { "action": "cancel" }
```

### Active → Completed
```bash
# ✅ Valid
POST /sprints/SPRINT00000001/close
Body: { "action": "complete" }
```

### Completed → Active
```bash
# ❌ Invalid - will return 400 error
PUT /sprints/SPRINT00000001
Body: { "status": "active" }

Error: "Invalid status transition from completed to active. Allowed transitions: none"
```

---

## Authorization

All endpoints verify:
1. **Authentication:** Valid JWT token required
2. **Role:** User must have `team_lead` role
3. **Team Ownership:** Team lead must own the team associated with the sprint

---

## Use Cases

### Use Case 1: Start Sprint Planning
```bash
# Create sprint in planning status
POST /api/team-lead/sprints
Body: { ..., "status": "planning" }
```

### Use Case 2: Activate Sprint (Sprint Kickoff)
```bash
# Transition from planning to active
PUT /api/team-lead/sprints/SPRINT00000001
Body: { "status": "active" }
```

### Use Case 3: Extend Sprint Duration
```bash
# Extend sprint by 2 days
PUT /api/team-lead/sprints/SPRINT00000001
Body: {
  "end_date": "2026-01-22"  # was 2026-01-20
}
```

### Use Case 4: Add Sprint Goal Mid-Sprint
```bash
# Get current sprint first
GET /api/team-lead/sprints/SPRINT00000001/dashboard

# Update with additional goal
PUT /api/team-lead/sprints/SPRINT00000001
Body: {
  "goals": [...existingGoals, "Fix critical security vulnerability"]
}
```

### Use Case 5: Complete Sprint Successfully
```bash
POST /api/team-lead/sprints/SPRINT00000001/close
Body: {
  "action": "complete",
  "notes": "Delivered all features. Velocity: 42 points"
}
# Velocity automatically calculated
```

### Use Case 6: Cancel Sprint Early
```bash
POST /api/team-lead/sprints/SPRINT00000001/close
Body: {
  "action": "cancel",
  "notes": "Product pivot - sprint goals no longer relevant"
}
```

---

## Implementation Details

**Files Modified:**
- `src/services/team-lead/team-lead.service.ts` - Business logic (lines 329-411)
  - `updateSprint()` - General update with validation
  - `closeSprint()` - Specialized close with velocity calculation
  - `validateSprintStatusTransition()` - Validates state machine
  - `calculateSprintVelocity()` - Sums completed story points

- `src/handlers/team-lead/team-lead.handler.ts` - HTTP handlers (lines 200-242)
  - `updateSprint()` - PUT handler with date parsing
  - `closeSprint()` - POST handler with action validation

- `src/routes/team-lead/team-lead.routes.ts` - Route definitions (lines 48-49)

**Files Used (Already Existed):**
- `src/repositories/sprint/sprint.repository.ts` - Has `update()` method
- `src/entities/sprint/models/sprint.model.ts` - SprintUpdateInput type
- `src/repositories/task/task.repository.ts` - Has `findBySprintId()` method

---

## Testing

### Quick Test Script
```bash
# Set your JWT token
TOKEN="your_jwt_token_here"

# 1. Create a sprint
SPRINT_CODE=$(curl -X POST http://localhost:3000/api/team-lead/sprints \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "PROJECT_UUID",
    "team_id": "TEAM_UUID",
    "name": "Test Sprint",
    "start_date": "2026-01-06",
    "end_date": "2026-01-20",
    "capacity_hours": 160
  }' | jq -r '.sprint_code')

echo "Created sprint: $SPRINT_CODE"

# 2. Activate sprint
curl -X PUT http://localhost:3000/api/team-lead/sprints/$SPRINT_CODE \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "active"}'

# 3. Update sprint goals
curl -X PUT http://localhost:3000/api/team-lead/sprints/$SPRINT_CODE \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"goals": ["Goal 1", "Goal 2"]}'

# 4. Complete sprint
curl -X POST http://localhost:3000/api/team-lead/sprints/$SPRINT_CODE/close \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "complete", "notes": "Test completion"}'
```

---

## Next Steps

With sprint update/close complete, the team lead workflow now supports:

1. ✅ **Team Member Management** - Add/remove/update members
2. ✅ **Sprint Creation** - Create new sprints
3. ✅ **Sprint Update** - Update details during planning/execution
4. ✅ **Sprint Activation** - Transition to active status
5. ✅ **Sprint Completion** - Close with velocity calculation
6. ✅ **Task Assignment** - Assign tasks to members

**Remaining Phase 1 gaps:**
- **Time Entry Approval** (~3-4 days)
- **Leave/Vacation Approval** (~3-4 days)

**Phase 2 enhancements:**
- **Sprint Retrospectives** (~5-7 days)
- **Conflict Resolution** (~4-5 days)
