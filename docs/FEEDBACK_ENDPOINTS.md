# Feedback Endpoints

## Overview

Team leads can create, manage, and review 360-degree feedback requests for their team members. This enables structured performance feedback collection from peers, direct reports, and managers.

**Base URL:** `/api/team-lead`

---

## Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/members/:userCode/feedback-requests` | Create feedback request for member |
| GET | `/feedback-requests` | List all feedback requests by team lead |
| GET | `/teams/:teamCode/feedback-requests` | List feedback requests for a team |
| GET | `/feedback-requests/:requestCode` | Get single feedback request |
| PUT | `/feedback-requests/:requestCode` | Update feedback request |
| DELETE | `/feedback-requests/:requestCode` | Delete/cancel feedback request |
| GET | `/feedback-requests/:requestCode/responses` | Get all responses |
| GET | `/feedback-requests/:requestCode/summary` | Get aggregated summary |

---

## Endpoints

### 1. Create Feedback Request

**POST** `/members/:userCode/feedback-requests`

Create a new feedback request for a team member.

**Path Parameters:**
- `userCode` - The user code (e.g., USER00000002)

**Request Body:**
```json
{
  "title": "Q1 2026 Performance Feedback",
  "description": "Quarterly feedback collection for team member",
  "feedback_type": "360",
  "reviewers": [
    {
      "user_id": "uuid-of-reviewer-1",
      "relationship": "peer",
      "status": "pending"
    },
    {
      "user_id": "uuid-of-reviewer-2",
      "relationship": "direct_report",
      "status": "pending"
    }
  ],
  "questions": [
    {
      "id": 1,
      "text": "How would you rate this person's collaboration skills?",
      "type": "rating",
      "scale": 5
    },
    {
      "id": 2,
      "text": "What are their key strengths?",
      "type": "text"
    },
    {
      "id": 3,
      "text": "Which area needs improvement?",
      "type": "multiple_choice",
      "options": ["Communication", "Technical Skills", "Time Management", "Leadership"]
    }
  ],
  "anonymous": true,
  "deadline": "2026-02-15"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "request_code": "FREQ00000001",
  "subject_user_id": "uuid",
  "requested_by": "team_lead_uuid",
  "title": "Q1 2026 Performance Feedback",
  "description": "Quarterly feedback collection",
  "feedback_type": "360",
  "reviewers": [...],
  "questions": [...],
  "anonymous": true,
  "deadline": "2026-02-15T00:00:00.000Z",
  "status": "active",
  "created_at": "2026-01-07T10:00:00Z",
  "updated_at": "2026-01-07T10:00:00Z"
}
```

---

### 2. List All Feedback Requests

**GET** `/feedback-requests`

Get all feedback requests created by the team lead.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "request_code": "FREQ00000001",
    "subject_user_id": "uuid",
    "subject_name": "Jane Smith",
    "subject_user_code": "USER00000002",
    "title": "Q1 2026 Performance Feedback",
    "feedback_type": "360",
    "status": "active",
    "deadline": "2026-02-15T00:00:00.000Z",
    "created_at": "2026-01-07T10:00:00Z"
  }
]
```

---

### 3. List Team Feedback Requests

**GET** `/teams/:teamCode/feedback-requests`

Get all feedback requests for members of a specific team.

**Path Parameters:**
- `teamCode` - The team code (e.g., TEAM00000001)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "request_code": "FREQ00000001",
    "subject_name": "Jane Smith",
    "subject_user_code": "USER00000002",
    "title": "Q1 2026 Performance Feedback",
    "status": "active",
    "deadline": "2026-02-15T00:00:00.000Z"
  }
]
```

---

### 4. Get Single Feedback Request

**GET** `/feedback-requests/:requestCode`

Get details of a specific feedback request.

**Path Parameters:**
- `requestCode` - The feedback request code (e.g., FREQ00000001)

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "request_code": "FREQ00000001",
  "subject_user_id": "uuid",
  "requested_by": "team_lead_uuid",
  "title": "Q1 2026 Performance Feedback",
  "description": "Quarterly feedback collection",
  "feedback_type": "360",
  "reviewers": [
    {
      "user_id": "uuid",
      "relationship": "peer",
      "status": "completed"
    }
  ],
  "questions": [...],
  "anonymous": true,
  "deadline": "2026-02-15T00:00:00.000Z",
  "status": "active",
  "created_at": "2026-01-07T10:00:00Z",
  "updated_at": "2026-01-07T10:00:00Z"
}
```

---

### 5. Update Feedback Request

**PUT** `/feedback-requests/:requestCode`

Update an existing feedback request. Cannot update completed or cancelled requests.

**Path Parameters:**
- `requestCode` - The feedback request code

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "reviewers": [...],
  "questions": [...],
  "anonymous": false,
  "deadline": "2026-03-01",
  "status": "active"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "request_code": "FREQ00000001",
  "title": "Updated Title",
  ...
}
```

**Error Responses:**
- `400 Bad Request` - Cannot update completed/cancelled request
- `403 Forbidden` - Not authorized to update
- `404 Not Found` - Request not found

---

### 6. Delete Feedback Request

**DELETE** `/feedback-requests/:requestCode`

Delete/cancel a feedback request. Cannot delete completed requests.

**Path Parameters:**
- `requestCode` - The feedback request code

**Response:** `204 No Content`

**Error Responses:**
- `400 Bad Request` - Cannot delete completed request
- `403 Forbidden` - Not authorized to delete
- `404 Not Found` - Request not found

---

### 7. Get Feedback Responses

**GET** `/feedback-requests/:requestCode/responses`

Get all submitted responses for a feedback request.

**Path Parameters:**
- `requestCode` - The feedback request code

**Response:** `200 OK`

For non-anonymous requests:
```json
[
  {
    "id": "uuid",
    "reviewer_id": "uuid",
    "reviewer_name": "John Doe",
    "reviewer_user_code": "USER00000003",
    "responses": {
      "1": { "rating": 4 },
      "2": { "text": "Great collaboration skills" },
      "3": { "text": "Communication" }
    },
    "overall_rating": 4.5,
    "submitted_at": "2026-01-10T14:30:00Z"
  }
]
```

For anonymous requests (reviewer info hidden):
```json
[
  {
    "id": "uuid",
    "responses": {
      "1": { "rating": 4 },
      "2": { "text": "Great collaboration skills" }
    },
    "overall_rating": 4.5,
    "submitted_at": "2026-01-10T14:30:00Z"
  }
]
```

---

### 8. Get Feedback Summary

**GET** `/feedback-requests/:requestCode/summary`

Get aggregated summary of all feedback responses.

**Path Parameters:**
- `requestCode` - The feedback request code

**Response:** `200 OK`
```json
{
  "request_code": "FREQ00000001",
  "title": "Q1 2026 Performance Feedback",
  "status": "active",
  "deadline": "2026-02-15T00:00:00.000Z",
  "anonymous": true,
  "total_reviewers": 5,
  "completed_responses": 3,
  "pending_reviewers": 2,
  "completion_rate": 60,
  "average_overall_rating": 4.2,
  "question_summaries": [
    {
      "question": "How would you rate collaboration skills?",
      "ratings": [4, 5, 4],
      "avgRating": 4.33,
      "textResponses": []
    },
    {
      "question": "What are their key strengths?",
      "ratings": [],
      "avgRating": 0,
      "textResponses": [
        "Great team player",
        "Always helpful",
        "Strong technical skills"
      ]
    }
  ]
}
```

---

## Data Types

### Feedback Types
| Type | Description |
|------|-------------|
| `360` | Full 360-degree feedback from all directions |
| `peer` | Feedback from colleagues at same level |
| `upward` | Feedback from direct reports |
| `self` | Self-assessment |
| `customer` | External customer feedback |

### Feedback Status
| Status | Description |
|--------|-------------|
| `draft` | Not yet sent to reviewers |
| `active` | Sent and awaiting responses |
| `completed` | All responses received |
| `cancelled` | Request was cancelled |

### Reviewer Relationships
| Relationship | Description |
|--------------|-------------|
| `peer` | Same-level colleague |
| `direct_report` | Reports to the subject |
| `manager` | Subject's manager |
| `customer` | External customer |
| `other` | Other relationship |

### Question Types
| Type | Fields | Description |
|------|--------|-------------|
| `rating` | `scale` (1-5 or 1-10) | Numeric rating |
| `text` | - | Free-form text response |
| `multiple_choice` | `options` array | Select from options |

---

## Example Workflow

### 1. Create Feedback Request
```bash
curl -X POST \
  http://localhost:3000/api/team-lead/members/USER00000002/feedback-requests \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Q1 2026 Feedback",
    "feedback_type": "360",
    "reviewers": [
      {"user_id": "reviewer-uuid-1", "relationship": "peer", "status": "pending"},
      {"user_id": "reviewer-uuid-2", "relationship": "peer", "status": "pending"}
    ],
    "questions": [
      {"id": 1, "text": "Rate collaboration", "type": "rating", "scale": 5},
      {"id": 2, "text": "Key strengths?", "type": "text"}
    ],
    "anonymous": true,
    "deadline": "2026-02-15"
  }'
```

### 2. List All Requests
```bash
curl -X GET \
  http://localhost:3000/api/team-lead/feedback-requests \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Check Progress
```bash
curl -X GET \
  http://localhost:3000/api/team-lead/feedback-requests/FREQ00000001/summary \
  -H "Authorization: Bearer $TOKEN"
```

### 4. View Responses
```bash
curl -X GET \
  http://localhost:3000/api/team-lead/feedback-requests/FREQ00000001/responses \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Update Deadline
```bash
curl -X PUT \
  http://localhost:3000/api/team-lead/feedback-requests/FREQ00000001 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"deadline": "2026-03-01"}'
```

---

## Authorization

All endpoints require:
1. Valid JWT token
2. `team_lead` role
3. Either created the request OR has authority over the subject user

---

## Error Responses

| Status | Description |
|--------|-------------|
| `400 Bad Request` | Invalid input or cannot perform action |
| `403 Forbidden` | Not authorized |
| `404 Not Found` | Resource not found |
| `500 Internal Server Error` | Server error |
