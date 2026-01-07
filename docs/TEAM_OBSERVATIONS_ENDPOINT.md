# Team Observations Endpoint Specification

## Missing Endpoint

### Get All Team Observations

**Endpoint:** `GET /api/team-lead/teams/:teamCode/observations`

**Description:** Get all observations for ALL members of a team (aggregated view)

**Path Parameters:**
- `teamCode` - The team code (e.g., TEAM00000001)

**Query Parameters:**
- `page` - Optional, page number (default: 1)
- `limit` - Optional, items per page (default: 10)
- `category` - Optional, filter by category (technical, communication, leadership, delivery, quality, collaboration)
- `rating` - Optional, filter by rating (positive, neutral, negative)
- `user_code` - Optional, filter by specific user

**Response:**
```json
{
  "observations": [
    {
      "id": "uuid",
      "observation_code": "OBS00000001",
      "user_id": "uuid",
      "user_code": "USER00000002",
      "user_name": "Shreya",
      "evaluator_id": "uuid",
      "evaluator_name": "Team Lead Name",
      "evaluator_role": "team_lead",
      "related_task_id": null,
      "related_task_code": null,
      "related_task_title": null,
      "category": "collaboration",
      "rating": "neutral",
      "note": "Need to improve a lot in the selection of the tech stack and please do review the code changes manually.",
      "observation_date": "2026-01-01",
      "created_at": "2026-01-01T11:48:00Z"
    },
    {
      "id": "uuid2",
      "observation_code": "OBS00000002",
      "user_id": "uuid2",
      "user_code": "USER00000003",
      "user_name": "Another Member",
      "evaluator_id": "uuid",
      "evaluator_name": "Team Lead Name",
      "evaluator_role": "team_lead",
      "related_task_id": null,
      "related_task_code": null,
      "related_task_title": null,
      "category": "technical",
      "rating": "positive",
      "note": "Great work on the new feature implementation!",
      "observation_date": "2026-01-02",
      "created_at": "2026-01-02T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "total_pages": 3
  },
  "team": {
    "team_id": "uuid",
    "team_code": "TEAM00000001",
    "team_name": "Development Team"
  },
  "summary": {
    "total": 25,
    "by_category": {
      "technical": 8,
      "communication": 5,
      "leadership": 3,
      "delivery": 4,
      "quality": 3,
      "collaboration": 2
    },
    "by_rating": {
      "positive": 15,
      "neutral": 7,
      "negative": 3
    }
  }
}
```

**Example Requests:**

1. Get all observations for a team:
```bash
curl -X GET \
  http://localhost:3000/api/team-lead/teams/TEAM00000001/observations \
  -H "Authorization: Bearer $TOKEN"
```

2. Filter by category:
```bash
curl -X GET \
  http://localhost:3000/api/team-lead/teams/TEAM00000001/observations?category=technical \
  -H "Authorization: Bearer $TOKEN"
```

3. Filter by rating:
```bash
curl -X GET \
  http://localhost:3000/api/team-lead/teams/TEAM00000001/observations?rating=positive \
  -H "Authorization: Bearer $TOKEN"
```

4. Pagination:
```bash
curl -X GET \
  http://localhost:3000/api/team-lead/teams/TEAM00000001/observations?page=2&limit=20 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Backend Implementation Notes

### Database Query
```sql
SELECT 
  o.*,
  u.user_code,
  u.full_name as user_name,
  e.full_name as evaluator_name,
  e.role as evaluator_role,
  t.task_code as related_task_code,
  t.title as related_task_title
FROM observations o
JOIN users u ON o.user_id = u.id
JOIN users e ON o.evaluator_id = e.id
LEFT JOIN tasks t ON o.related_task_id = t.id
JOIN team_members tm ON o.user_id = tm.user_id
WHERE tm.team_id = (SELECT id FROM teams WHERE team_code = $1)
  AND tm.left_at IS NULL  -- Only active members
  AND ($2::text IS NULL OR o.category = $2)  -- Optional category filter
  AND ($3::text IS NULL OR o.rating = $3)    -- Optional rating filter
  AND ($4::text IS NULL OR u.user_code = $4) -- Optional user filter
ORDER BY o.observation_date DESC, o.created_at DESC
LIMIT $5 OFFSET $6;
```

### Authorization
- Verify JWT token
- Verify user has `team_lead` role
- Verify team lead owns the team (team.lead_id === user_id)

### Response Building
1. Fetch observations with filters
2. Get total count for pagination
3. Calculate summary statistics (by_category, by_rating)
4. Return formatted response

---

## Current Workaround

Until this endpoint is implemented, the frontend will:
1. Fetch team members list
2. Fetch observations for each member individually
3. Combine and filter on the frontend

This is not optimal for performance but will work temporarily.
