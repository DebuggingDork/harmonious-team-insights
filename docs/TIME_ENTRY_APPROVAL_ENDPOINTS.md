# Time Entry Approval Endpoints

## Overview

Team leads can now review and approve time entries submitted by their team members. This feature enables weekly time validation, accurate billing, and workload verification.

**Base URL:** `/api/team-lead`

---

## Approval Workflow

```
Employee logs time → pending → Team Lead reviews → approved/rejected
```

**Approval Status:**
- `pending` - Awaiting team lead approval (default for new entries)
- `approved` - Accepted by team lead
- `rejected` - Denied by team lead with reason

---

## Endpoints

### 1. Get Pending Time Entries for Team

**GET** `/teams/:teamCode/time-entries`

Get all pending time entries for the team, optionally filtered by date range.

**Path Parameters:**
- `teamCode` - The team code (e.g., TEAM00000001)

**Query Parameters:**
- `start_date` - Optional. Filter by start date (YYYY-MM-DD)
- `end_date` - Optional. Filter by end date (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": "uuid",
    "time_code": "TIME00000001",
    "task_id": "uuid",
    "user_id": "uuid",
    "work_date": "2026-01-03T00:00:00.000Z",
    "hours": 8.5,
    "description": "Implemented authentication feature",
    "approval_status": "pending",
    "approved_by": null,
    "approved_at": null,
    "rejection_reason": null,
    "created_at": "2026-01-04T09:00:00Z",
    "updated_at": "2026-01-04T09:00:00Z",
    "user": {
      "user_id": "uuid",
      "user_code": "USER00000002",
      "full_name": "Jane Smith",
      "email": "jane.smith@example.com"
    },
    "task": {
      "task_id": "uuid",
      "task_code": "TASK00000001",
      "title": "Implement OAuth login"
    }
  }
]
```

**Example:**
```bash
# Get all pending time entries for team
curl -X GET \
  http://localhost:3000/api/team-lead/teams/TEAM00000001/time-entries \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get pending entries for this week
curl -X GET \
  "http://localhost:3000/api/team-lead/teams/TEAM00000001/time-entries?start_date=2026-01-01&end_date=2026-01-07" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Error Responses:**
- `404 Not Found` - Team not found
- `403 Forbidden` - Not authorized to view this team's time entries

---

### 2. Get Pending Time Entries for Member

**GET** `/teams/:teamCode/members/:userCode/time-entries`

Get pending time entries for a specific team member.

**Path Parameters:**
- `teamCode` - The team code (e.g., TEAM00000001)
- `userCode` - The user code (e.g., USER00000002)

**Query Parameters:**
- `start_date` - Optional. Filter by start date (YYYY-MM-DD)
- `end_date` - Optional. Filter by end date (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": "uuid",
    "time_code": "TIME00000001",
    "task_id": "uuid",
    "user_id": "uuid",
    "work_date": "2026-01-03T00:00:00.000Z",
    "hours": 8.5,
    "description": "Implemented authentication feature",
    "approval_status": "pending",
    "approved_by": null,
    "approved_at": null,
    "rejection_reason": null,
    "created_at": "2026-01-04T09:00:00Z",
    "updated_at": "2026-01-04T09:00:00Z"
  }
]
```

**Example:**
```bash
curl -X GET \
  http://localhost:3000/api/team-lead/teams/TEAM00000001/members/USER00000002/time-entries \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Error Responses:**
- `404 Not Found` - Team or user not found
- `403 Forbidden` - User is not a member of this team

---

### 3. Approve Time Entry

**PUT** `/teams/:teamCode/time-entries/:timeCode/approve`

Approve a pending time entry.

**Path Parameters:**
- `teamCode` - The team code (e.g., TEAM00000001)
- `timeCode` - The time entry code (e.g., TIME00000001)

**Request Body:** None required

**Response:**
```json
{
  "id": "uuid",
  "time_code": "TIME00000001",
  "task_id": "uuid",
  "user_id": "uuid",
  "work_date": "2026-01-03T00:00:00.000Z",
  "hours": 8.5,
  "description": "Implemented authentication feature",
  "approval_status": "approved",
  "approved_by": "team_lead_uuid",
  "approved_at": "2026-01-04T14:30:00Z",
  "rejection_reason": null,
  "created_at": "2026-01-04T09:00:00Z",
  "updated_at": "2026-01-04T14:30:00Z"
}
```

**Example:**
```bash
curl -X PUT \
  http://localhost:3000/api/team-lead/teams/TEAM00000001/time-entries/TIME00000001/approve \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Error Responses:**
- `400 Bad Request` - Time entry is already approved or rejected
- `404 Not Found` - Team or time entry not found
- `403 Forbidden` - Time entry is not for this team

---

### 4. Reject Time Entry

**PUT** `/teams/:teamCode/time-entries/:timeCode/reject`

Reject a pending time entry with a reason.

**Path Parameters:**
- `teamCode` - The team code (e.g., TEAM00000001)
- `timeCode` - The time entry code (e.g., TIME00000001)

**Request Body:**
```json
{
  "rejection_reason": "Hours don't match task completion. Please revise."
}
```

**Field Descriptions:**
- `rejection_reason` - Required. Explanation for rejection

**Response:**
```json
{
  "id": "uuid",
  "time_code": "TIME00000001",
  "task_id": "uuid",
  "user_id": "uuid",
  "work_date": "2026-01-03T00:00:00.000Z",
  "hours": 8.5,
  "description": "Implemented authentication feature",
  "approval_status": "rejected",
  "approved_by": "team_lead_uuid",
  "approved_at": "2026-01-04T14:30:00Z",
  "rejection_reason": "Hours don't match task completion. Please revise.",
  "created_at": "2026-01-04T09:00:00Z",
  "updated_at": "2026-01-04T14:30:00Z"
}
```

**Example:**
```bash
curl -X PUT \
  http://localhost:3000/api/team-lead/teams/TEAM00000001/time-entries/TIME00000001/reject \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rejection_reason": "Hours exceed task estimate. Please clarify."
  }'
```

**Error Responses:**
- `400 Bad Request` - Missing rejection_reason or already approved/rejected
- `404 Not Found` - Team or time entry not found
- `403 Forbidden` - Time entry is not for this team

---

### 5. Bulk Approve Time Entries

**POST** `/teams/:teamCode/time-entries/bulk-approve`

Approve multiple time entries at once (e.g., approve all entries for the week).

**Path Parameters:**
- `teamCode` - The team code (e.g., TEAM00000001)

**Request Body:**
```json
{
  "time_codes": ["TIME00000001", "TIME00000002", "TIME00000003"]
}
```

**Field Descriptions:**
- `time_codes` - Required. Array of time entry codes to approve

**Response:**
```json
{
  "approved": 3
}
```

**Example:**
```bash
curl -X POST \
  http://localhost:3000/api/team-lead/teams/TEAM00000001/time-entries/bulk-approve \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "time_codes": [
      "TIME00000001",
      "TIME00000002",
      "TIME00000003",
      "TIME00000004"
    ]
  }'
```

**Behavior:**
- Skips time entries that are not found
- Skips time entries that don't belong to this team
- Skips time entries that are already approved/rejected
- Returns count of successfully approved entries
- Logs warnings for skipped entries (visible in server logs)

**Error Responses:**
- `400 Bad Request` - time_codes missing or not an array
- `400 Bad Request` - No valid time entries to approve
- `404 Not Found` - Team not found
- `403 Forbidden` - Not authorized for this team

---

## Complete Workflow Example

### Weekly Time Approval Workflow

#### 1. Check Pending Entries for the Week
```bash
GET /api/team-lead/teams/TEAM00000001/time-entries?start_date=2026-01-01&end_date=2026-01-07
```

Response shows 10 pending time entries from 3 team members.

#### 2. Review Individual Member's Entries
```bash
GET /api/team-lead/teams/TEAM00000001/members/USER00000002/time-entries?start_date=2026-01-01&end_date=2026-01-07
```

Review Jane's entries for the week.

#### 3. Reject One Entry (Needs Clarification)
```bash
PUT /api/team-lead/teams/TEAM00000001/time-entries/TIME00000005/reject
Body: { "rejection_reason": "Please provide more detail about the hours logged." }
```

#### 4. Bulk Approve Remaining Entries
```bash
POST /api/team-lead/teams/TEAM00000001/time-entries/bulk-approve
Body: {
  "time_codes": [
    "TIME00000001",
    "TIME00000002",
    "TIME00000003",
    "TIME00000004",
    "TIME00000006",
    "TIME00000007",
    "TIME00000008",
    "TIME00000009",
    "TIME00000010"
  ]
}
```

Returns: `{ "approved": 9 }`

---

## Authorization

All endpoints verify:
1. **Authentication:** Valid JWT token required
2. **Role:** User must have `team_lead` role
3. **Team Ownership:** Team lead must own the team (team.lead_id === user_id)
4. **Time Entry Ownership:** Time entry must be for a task in the team

---

## Database Schema

### Migration: 021_add_time_entry_approval.sql

```sql
ALTER TABLE time_entries
ADD COLUMN approval_status VARCHAR(20) DEFAULT 'pending'
  CHECK (approval_status IN ('pending', 'approved', 'rejected'));

ADD COLUMN approved_by UUID REFERENCES users(id);
ADD COLUMN approved_at TIMESTAMPTZ;
ADD COLUMN rejection_reason TEXT;
```

**Indexes:**
- `idx_time_entries_approval_status` - Filter by approval status
- `idx_time_entries_approved_by` - Find entries approved by specific user
- `idx_time_entries_user_status` - Composite index for user + status queries

**Backward Compatibility:**
- Existing time entries are automatically set to `approved` status
- Ensures old entries don't need re-approval

---

## Implementation Details

**Files Created/Modified:**

1. **Migration**
   - `src/migrations/sql/021_add_time_entry_approval.sql` - Database schema changes

2. **Model**
   - `src/entities/time-entry/models/time-entry.model.ts` - Added approval fields

3. **Repository**
   - `src/repositories/time-entry/time-entry.repository.ts` - Added methods:
     - `findPendingByTeam()` - Get pending entries for team
     - `findPendingByUser()` - Get pending entries for user
     - `approve()` - Approve entry
     - `reject()` - Reject entry
     - `bulkApprove()` - Bulk approve multiple entries

4. **Service**
   - `src/services/team-lead/team-lead.service.ts` - Added methods (lines 492-723):
     - `getTeamPendingTimeEntries()` - List pending with user/task details
     - `getMemberPendingTimeEntries()` - List pending for specific member
     - `approveTimeEntry()` - Approve with validation
     - `rejectTimeEntry()` - Reject with reason validation
     - `bulkApproveTimeEntries()` - Bulk approve with filtering

5. **Handler**
   - `src/handlers/team-lead/team-lead.handler.ts` - Added handlers (lines 260-362)

6. **Routes**
   - `src/routes/team-lead/team-lead.routes.ts` - Added 5 routes (lines 51-58)

---

## Testing

### Quick Test Script

```bash
# Set your JWT token
TOKEN="your_jwt_token_here"
TEAM="TEAM00000001"

# 1. Get all pending time entries
echo "=== Getting pending time entries ==="
curl -X GET \
  "http://localhost:3000/api/team-lead/teams/$TEAM/time-entries" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 2. Approve one entry
echo "\n=== Approving TIME00000001 ==="
curl -X PUT \
  "http://localhost:3000/api/team-lead/teams/$TEAM/time-entries/TIME00000001/approve" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 3. Reject one entry
echo "\n=== Rejecting TIME00000002 ==="
curl -X PUT \
  "http://localhost:3000/api/team-lead/teams/$TEAM/time-entries/TIME00000002/reject" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rejection_reason": "Please provide task details"}' | jq .

# 4. Bulk approve remaining
echo "\n=== Bulk approving TIME00000003-005 ==="
curl -X POST \
  "http://localhost:3000/api/team-lead/teams/$TEAM/time-entries/bulk-approve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "time_codes": ["TIME00000003", "TIME00000004", "TIME00000005"]
  }' | jq .
```

---

## Use Cases

### Use Case 1: Weekly Time Review
**Scenario:** Every Monday, review and approve last week's time entries

```bash
# Get last week's pending entries
GET /teams/TEAM00000001/time-entries?start_date=2025-12-30&end_date=2026-01-05

# Bulk approve all valid entries
POST /teams/TEAM00000001/time-entries/bulk-approve
```

### Use Case 2: Individual Review
**Scenario:** Review a specific team member's time before payroll

```bash
# Get member's pending entries
GET /teams/TEAM00000001/members/USER00000002/time-entries

# Approve each individually or bulk approve
```

### Use Case 3: Reject and Request Correction
**Scenario:** Entry needs clarification

```bash
PUT /teams/TEAM00000001/time-entries/TIME00000001/reject
Body: {
  "rejection_reason": "Task was completed in 4 hours, not 8. Please revise."
}

# Employee updates entry and resubmits
# Team lead re-reviews and approves
```

---

## Benefits

1. **Accurate Billing** - Validated time entries ensure accurate client billing
2. **Workload Verification** - Confirm team members' actual work hours
3. **Budget Tracking** - Approved hours feed into project budget tracking
4. **Audit Trail** - Complete history of who approved what and when
5. **Quality Control** - Catch over/under reporting early
6. **Team Communication** - Rejection reasons provide feedback

---

## Next Steps

With time entry approval complete, the team lead workflow now supports:

1. ✅ **Team Member Management** - Add/remove/update members
2. ✅ **Sprint Management** - Create, update, close sprints
3. ✅ **Task Assignment** - Assign tasks to members
4. ✅ **Time Entry Approval** - Review and approve weekly time logs

**Remaining Phase 1 Feature:**
- **Leave/Vacation Approval** (~3-4 days) - Approve time-off requests and manage team availability

**Phase 2 Features:**
- **Sprint Retrospectives** (~5-7 days) - Team improvement feedback loops
- **Conflict Resolution** (~4-5 days) - Document and resolve team conflicts
