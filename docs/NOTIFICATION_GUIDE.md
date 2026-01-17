# Notification System - Frontend Integration Guide

## 🎯 Overview

The UPEA backend provides a comprehensive notification system for all user roles. This guide covers all notification endpoints, data structures, and integration examples.

**Base URL**: `https://upea.onrender.com/api`

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Endpoints Summary](#endpoints-summary)
3. [Data Types](#data-types)
4. [API Endpoints](#api-endpoints)
5. [Integration Examples](#integration-examples)
6. [Real-Time Updates](#real-time-updates)
7. [Best Practices](#best-practices)

---

## 🔐 Authentication

All notification endpoints require authentication via JWT token in the Authorization header:

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 📊 Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/{role}/notifications` | GET | List notifications with filters |
| `/api/{role}/notifications/unread-count` | GET | Get unread count (for badge) |
| `/api/{role}/notifications/:id` | GET | Get single notification |
| `/api/{role}/notifications/:id/read` | PUT | Mark as read |
| `/api/{role}/notifications/read-all` | PUT | Mark all as read |
| `/api/{role}/notifications/read` | DELETE | Delete all read |
| `/api/{role}/notifications/:id` | DELETE | Delete single notification |

**Note**: Replace `{role}` with: `employee`, `team-lead`, `project-manager`, or `admin`

---

## 📦 Data Types

### Notification Object

```typescript
interface Notification {
  id: string;                          // UUID
  type: NotificationType;              // See types below
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;                       // Short title
  message: string;                     // Full message
  related_entity_type: string | null;  // 'task', 'project', 'team', 'pull_request', etc.
  related_entity_id: string | null;    // UUID of related entity
  action_url: string | null;           // Deep link URL (e.g., "/employee/tasks/TASK123")
  actor: {                             // Who triggered this notification
    id: string;
    full_name: string;
    avatar_url?: string;
  } | null;
  metadata: Record<string, any>;       // Additional data
  is_read: boolean;
  read_at: string | null;              // ISO 8601 timestamp
  created_at: string;                  // ISO 8601 timestamp
}
```

### Notification Types

```typescript
type NotificationType =
  // Task notifications
  | 'task_assigned'
  | 'task_completed'
  | 'task_blocked'
  | 'task_overdue'
  | 'task_status_changed'
  | 'task_comment'
  
  // Team notifications
  | 'team_added'
  | 'team_removed'
  | 'team_role_changed'
  
  // Project notifications
  | 'project_created'
  | 'project_updated'
  | 'sprint_started'
  | 'sprint_ended'
  
  // Evaluation notifications
  | 'evaluation_available'
  | 'evaluation_acknowledged'
  
  // GitHub notifications
  | 'pr_review_requested'
  | 'pr_changes_requested'
  | 'pr_approved'
  | 'pr_merged'
  | 'pr_closed'
  | 'pr_comment_added'
  | 'pr_ready_for_review'
  | 'repository_access_granted'
  | 'repository_access_revoked'
  | 'branch_created'
  | 'branch_deleted'
  | 'collaborator_invited'
  | 'collaborator_added'
  
  // System notifications
  | 'account_approved'
  | 'account_blocked'
  | 'account_unblocked'
  | 'system_announcement'
  | 'mention'
  | 'comment';
```

### Categories

Notifications are grouped into categories:

- **task**: Task-related notifications
- **team**: Team membership changes
- **project**: Project and sprint updates
- **evaluation**: Performance evaluations
- **github**: GitHub/code-related notifications
- **system**: System announcements and account changes

---

## 🔌 API Endpoints

### 1. List Notifications

Get paginated list of notifications with optional filters.

```http
GET /api/{role}/notifications
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20, max: 100) |
| `is_read` | boolean | No | Filter by read status |
| `type` | string | No | Filter by notification type |
| `priority` | string | No | Filter by priority (low, medium, high, urgent) |
| `category` | string | No | Filter by category (task, team, github, etc.) |
| `from_date` | string | No | Filter from date (ISO 8601) |
| `to_date` | string | No | Filter to date (ISO 8601) |

**Example Request:**

```javascript
const response = await fetch(
  'https://upea.onrender.com/api/employee/notifications?page=1&limit=20&is_read=false',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
const data = await response.json();
```

**Response (200 OK):**

```json
{
  "notifications": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "task_assigned",
      "priority": "high",
      "title": "New Task Assigned: Fix login bug",
      "message": "John Doe assigned you the task \"Fix login bug\" in team Backend.",
      "related_entity_type": "task",
      "related_entity_id": "660e8400-e29b-41d4-a716-446655440001",
      "action_url": "/employee/tasks/TASK00000123",
      "actor": {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "full_name": "John Doe",
        "avatar_url": "https://example.com/avatar.jpg"
      },
      "metadata": {
        "task_code": "TASK00000123",
        "team_name": "Backend",
        "due_date": "2024-01-20T00:00:00Z"
      },
      "is_read": false,
      "read_at": null,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3
  },
  "summary": {
    "total_unread": 12,
    "by_priority": {
      "urgent": 1,
      "high": 3,
      "medium": 5,
      "low": 3
    }
  }
}
```

---

### 2. Get Unread Count

Get the count of unread notifications (perfect for notification badges).

```http
GET /api/{role}/notifications/unread-count
```

**Example Request:**

```javascript
const response = await fetch(
  'https://upea.onrender.com/api/employee/notifications/unread-count',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
const data = await response.json();
```

**Response (200 OK):**

```json
{
  "unread_count": 12,
  "by_priority": {
    "urgent": 1,
    "high": 3,
    "medium": 5,
    "low": 3
  }
}
```

---

### 3. Get Single Notification

Get details of a specific notification.

```http
GET /api/{role}/notifications/:notificationId
```

**Example Request:**

```javascript
const notificationId = '550e8400-e29b-41d4-a716-446655440000';
const response = await fetch(
  `https://upea.onrender.com/api/employee/notifications/${notificationId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
const notification = await response.json();
```

**Response (200 OK):** Returns single `Notification` object

---

### 4. Mark as Read

Mark a single notification as read.

```http
PUT /api/{role}/notifications/:notificationId/read
```

**Example Request:**

```javascript
const notificationId = '550e8400-e29b-41d4-a716-446655440000';
const response = await fetch(
  `https://upea.onrender.com/api/employee/notifications/${notificationId}/read`,
  {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
const data = await response.json();
```

**Response (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "is_read": true,
  "read_at": "2024-01-15T11:00:00Z"
}
```

---

### 5. Mark All as Read

Mark all notifications as read (optionally filtered).

```http
PUT /api/{role}/notifications/read-all
```

**Request Body (Optional):**

```json
{
  "type": "task_assigned",              // Optional: only mark this type
  "before": "2024-01-15T12:00:00Z"      // Optional: only before this date
}
```

**Example Request:**

```javascript
const response = await fetch(
  'https://upea.onrender.com/api/employee/notifications/read-all',
  {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'task_assigned'  // Optional filter
    })
  }
);
const data = await response.json();
```

**Response (200 OK):**

```json
{
  "marked_count": 12
}
```

---

### 6. Delete Notification

Delete a single notification.

```http
DELETE /api/{role}/notifications/:notificationId
```

**Example Request:**

```javascript
const notificationId = '550e8400-e29b-41d4-a716-446655440000';
const response = await fetch(
  `https://upea.onrender.com/api/employee/notifications/${notificationId}`,
  {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
// Response: 204 No Content
```

---

### 7. Delete All Read Notifications

Delete all read notifications (cleanup).

```http
DELETE /api/{role}/notifications/read
```

**Example Request:**

```javascript
const response = await fetch(
  'https://upea.onrender.com/api/employee/notifications/read',
  {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
const data = await response.json();
```

**Response (200 OK):**

```json
{
  "deleted_count": 25
}
```

---

## 💻 Integration Examples

### React Example - Complete Notification Component

```jsx
import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';

const API_BASE = 'https://upea.onrender.com/api';

function NotificationCenter({ userRole, token }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'task', 'github', etc.

  // Fetch unread count (for badge)
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications when panel opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, filter]);

  async function fetchUnreadCount() {
    try {
      const response = await fetch(
        `${API_BASE}/${userRole}/notifications/unread-count`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await response.json();
      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }

  async function fetchNotifications() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '50',
        ...(filter === 'unread' && { is_read: 'false' }),
        ...(filter !== 'all' && filter !== 'unread' && { category: filter })
      });

      const response = await fetch(
        `${API_BASE}/${userRole}/notifications?${params}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notificationId) {
    try {
      await fetch(
        `${API_BASE}/${userRole}/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }

  async function markAllAsRead() {
    try {
      const response = await fetch(
        `${API_BASE}/${userRole}/notifications/read-all`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await response.json();
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
      alert(`Marked ${data.marked_count} notifications as read`);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }

  async function deleteNotification(notificationId) {
    try {
      await fetch(
        `${API_BASE}/${userRole}/notifications/${notificationId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }

  function handleNotificationClick(notification) {
    // Mark as read
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    
    // Navigate to action URL if available
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  }

  function getPriorityColor(priority) {
    const colors = {
      urgent: 'bg-red-100 border-red-500',
      high: 'bg-orange-100 border-orange-500',
      medium: 'bg-blue-100 border-blue-500',
      low: 'bg-gray-100 border-gray-500'
    };
    return colors[priority] || colors.medium;
  }

  function getTypeIcon(type) {
    if (type.startsWith('task_')) return '📋';
    if (type.startsWith('pr_')) return '🔀';
    if (type.startsWith('team_')) return '👥';
    if (type.startsWith('project_')) return '📁';
    if (type.startsWith('evaluation_')) return '📊';
    return '🔔';
  }

  return (
    <div className="notification-center">
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:underline"
                disabled={unreadCount === 0}
              >
                Mark all read
              </button>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-2 border-b flex gap-2 overflow-x-auto">
            {['all', 'unread', 'task', 'github', 'team', 'project'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getPriorityColor(
                            notification.priority
                          )}`}
                        >
                          {notification.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.actor && (
                        <p className="text-xs text-gray-500 mt-1">
                          By {notification.actor.full_name}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!notification.is_read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
```

---

### Vue Example - Notification Badge

```vue
<template>
  <div class="notification-badge">
    <button @click="togglePanel" class="bell-button">
      <BellIcon />
      <span v-if="unreadCount > 0" class="badge">
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'NotificationBadge',
  props: {
    userRole: String,
    token: String
  },
  data() {
    return {
      unreadCount: 0,
      pollInterval: null
    };
  },
  mounted() {
    this.fetchUnreadCount();
    this.pollInterval = setInterval(this.fetchUnreadCount, 30000);
  },
  beforeUnmount() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  },
  methods: {
    async fetchUnreadCount() {
      try {
        const response = await fetch(
          `https://upea.onrender.com/api/${this.userRole}/notifications/unread-count`,
          {
            headers: { 'Authorization': `Bearer ${this.token}` }
          }
        );
        const data = await response.json();
        this.unreadCount = data.unread_count;
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    },
    togglePanel() {
      this.$emit('toggle-panel');
    }
  }
};
</script>
```

---

## 🔄 Real-Time Updates

### Polling Strategy (Current)

Poll the unread count endpoint every 30 seconds:

```javascript
// Poll for new notifications
setInterval(async () => {
  const response = await fetch(
    `${API_BASE}/${userRole}/notifications/unread-count`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  const data = await response.json();
  updateBadge(data.unread_count);
}, 30000); // Every 30 seconds
```

### Future: Server-Sent Events (SSE)

The backend will support real-time notifications via SSE in the future:

```javascript
// Future implementation
const eventSource = new EventSource(
  `${API_BASE}/${userRole}/notifications/stream?token=${token}`
);

eventSource.addEventListener('notification', (event) => {
  const notification = JSON.parse(event.data);
  showToast(notification);
  incrementBadge();
});

eventSource.addEventListener('read', (event) => {
  const { notification_id } = JSON.parse(event.data);
  markNotificationAsRead(notification_id);
});
```

---

## ✅ Best Practices

### 1. Badge Display

```javascript
// Show unread count in navigation
function NotificationBadge({ count }) {
  return (
    <div className="relative">
      <BellIcon />
      {count > 0 && (
        <span className="badge">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
}
```

### 2. Toast Notifications

Show toast for high-priority notifications:

```javascript
function showNotificationToast(notification) {
  if (notification.priority === 'urgent' || notification.priority === 'high') {
    toast.info(notification.title, {
      description: notification.message,
      action: notification.action_url ? {
        label: 'View',
        onClick: () => navigate(notification.action_url)
      } : undefined
    });
  }
}
```

### 3. Auto-Mark as Read

Mark notifications as read when user views them:

```javascript
function NotificationItem({ notification, onRead }) {
  useEffect(() => {
    // Mark as read after 2 seconds of viewing
    const timer = setTimeout(() => {
      if (!notification.is_read) {
        onRead(notification.id);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [notification]);
  
  return <div>{/* notification content */}</div>;
}
```

### 4. Grouping by Date

```javascript
function groupNotificationsByDate(notifications) {
  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: []
  };
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  notifications.forEach(notification => {
    const date = new Date(notification.created_at);
    
    if (date >= today) {
      groups.today.push(notification);
    } else if (date >= yesterday) {
      groups.yesterday.push(notification);
    } else if (date >= weekAgo) {
      groups.thisWeek.push(notification);
    } else {
      groups.older.push(notification);
    }
  });
  
  return groups;
}
```

### 5. Error Handling

```javascript
async function fetchNotifications() {
  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, redirect to login
        redirectToLogin();
        return;
      }
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    setNotifications(data.notifications);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    showError('Failed to load notifications. Please try again.');
  }
}
```

### 6. Optimistic Updates

```javascript
async function markAsRead(notificationId) {
  // Optimistically update UI
  setNotifications(prev =>
    prev.map(n =>
      n.id === notificationId
        ? { ...n, is_read: true, read_at: new Date().toISOString() }
        : n
    )
  );
  setUnreadCount(prev => Math.max(0, prev - 1));
  
  try {
    await fetch(`${API_BASE}/${userRole}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  } catch (error) {
    // Revert on error
    fetchNotifications();
    showError('Failed to mark as read');
  }
}
```

---

## 🎨 UI/UX Recommendations

### Priority Colors

```css
.priority-urgent { background: #fee2e2; border-left: 4px solid #dc2626; }
.priority-high { background: #fed7aa; border-left: 4px solid #ea580c; }
.priority-medium { background: #dbeafe; border-left: 4px solid #2563eb; }
.priority-low { background: #f3f4f6; border-left: 4px solid #6b7280; }
```

### Icons by Type

```javascript
const NOTIFICATION_ICONS = {
  task_assigned: '📋',
  task_completed: '✅',
  task_blocked: '🚫',
  pr_review_requested: '👀',
  pr_approved: '✅',
  pr_merged: '🔀',
  team_added: '👥',
  evaluation_available: '📊',
  system_announcement: '📢'
};
```

### Sound Notifications

```javascript
function playNotificationSound(priority) {
  if (priority === 'urgent' || priority === 'high') {
    const audio = new Audio('/sounds/notification.mp3');
    audio.play().catch(console.error);
  }
}
```

---

## 🐛 Troubleshooting

### No notifications appearing?

1. Check authentication token is valid
2. Verify user role in URL path
3. Check browser console for errors
4. Test with curl:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://upea.onrender.com/api/employee/notifications/unread-count
```

### Badge count not updating?

1. Verify polling interval is running
2. Check network tab for failed requests
3. Ensure token hasn't expired

### Notifications not marking as read?

1. Check PUT request is being sent
2. Verify notification ID is correct
3. Check response status code

---

## 📞 Support

For issues or questions:
1. Check backend logs on Render
2. Test endpoints with Postman/curl
3. Verify authentication token
4. Check CORS configuration

---

**Last Updated**: January 2024
**API Version**: 1.0
**Backend URL**: https://upea.onrender.com
