# Team Lead Dashboard - Quick Reference Guide

## 🎯 Overview

This guide provides quick access to all Team Lead Dashboard features and their usage.

---

## 📍 Navigation

Access the Team Lead Dashboard at: `/dashboard/team-lead`

### Sidebar Menu
1. **Overview** - Main dashboard with stats and alerts
2. **Tasks** - Manage team tasks
3. **Sprints** - Sprint planning and tracking
4. **Time Approval** - Review and approve time entries
5. **Feedback** - Team member observations
6. **Team** - Manage team members and settings
7. **Communications** - Announcements, decisions, and 1-on-1s
8. **Profile** - Your profile settings

---

## ⚡ Quick Actions

### Time Entry Approval
**Route:** `/dashboard/team-lead/time-approval`

**Common Actions:**
- Navigate weeks: Use arrow buttons
- Search: Type member name or task
- Approve single: Click ✓ button
- Reject: Click ✗ button, provide reason
- Bulk approve: Select multiple, click "Approve Selected"

**Keyboard Shortcuts:**
- `←` / `→` - Navigate weeks
- `Ctrl+F` - Focus search

---

### Sprint Management
**Route:** `/dashboard/team-lead/sprints`

**Common Actions:**
- Create sprint: Click "+ New Sprint"
- Edit sprint: Click "Edit" on sprint card
- Activate: Click "Activate" button
- Close: Click "Close Sprint", add retrospective notes

**Sprint Statuses:**
- 🔵 Planning - Not yet started
- 🟢 Active - Currently running
- ⚪ Completed - Finished
- 🔴 Cancelled - Terminated early

---

### Team Management
**Route:** `/dashboard/team-lead/team`

**Common Actions:**
- Add member: Click "+ Add Member", select from available
- Remove member: Click trash icon, confirm
- Update allocation: Click "Update Allocation", enter percentage
- Link repository: Click "Link Repository", enter GitHub URL

**Member Workload Colors:**
- 🟢 Green (0-80%) - Normal
- 🟡 Yellow (80-100%) - Optimal
- 🔴 Red (>100%) - Overloaded

---

### Communications
**Route:** `/dashboard/team-lead/communications`

**Tabs:**
1. **Announcements**
   - Create: Click "+ New Announcement"
   - Set priority: Low, Normal, High, Urgent
   - Pin important: Check "Pin to top"
   
2. **Decisions**
   - Log: Click "+ Log Decision"
   - Types: Technical, Architectural, Process, Resource
   - Search: Use search bar to find past decisions
   
3. **One-on-Ones**
   - Schedule: Click "Schedule" next to member
   - Set duration: 15, 30, 45, or 60 minutes
   - Add agenda: Default topics provided

---

## 📊 Dashboard Widgets

### Quick Stats
- **Active Tasks** - Total tasks in progress
- **Open Alerts** - Pending issues requiring attention
- **Team Risks** - Identified project risks
- **Health Score** - Overall team health (0-100%)

### Active Sprints
- View progress bars
- See days remaining
- Track capacity and completed tasks
- Click "View All" for details

### Pending Alerts
- **Acknowledge** - Mark as seen
- **Resolve** - Close the alert
- Color-coded by severity

### Project Risks
- View impact level
- See mitigation plans
- Track risk scores

---

## 🎨 Status Colors

### Health Status
- 🟢 **Good** - Everything on track
- 🟡 **At Risk** - Needs attention
- 🔴 **Critical** - Immediate action required

### Priority Levels
- 🔵 **Low** - Can wait
- 🟢 **Normal** - Standard priority
- 🟡 **High** - Important
- 🔴 **Urgent** - Immediate attention

---

## 🔔 Notifications

### Alert Types
- **Performance** - Team member performance issues
- **Deadline** - Approaching or missed deadlines
- **Capacity** - Workload imbalances
- **Quality** - Code quality concerns
- **Blocker** - Task blockers

### Actions
1. **Acknowledge** - Mark as seen (doesn't close)
2. **Resolve** - Close the alert permanently

---

## 📝 Forms & Validation

### Required Fields
All forms indicate required fields with `*`

### Common Validations
- **Dates** - Must be in future for scheduling
- **Allocation** - Must be 0-100%
- **Sprint Duration** - Typically 1-4 weeks
- **Time Entries** - Must have description

### Error Messages
- Red text below field indicates validation error
- Toast notifications for API errors
- Form won't submit until all errors resolved

---

## 🔍 Search & Filters

### Time Approval Filters
- **Member** - Filter by team member
- **Status** - Pending, Approved, Rejected
- **Date Range** - Weekly navigation

### Task Filters
- **Status** - Todo, In Progress, Done, Blocked
- **Priority** - 1-5 scale
- **Assignee** - Filter by team member
- **Search** - Task title or description

### Sprint Filters
- **Status** - Planning, Active, Completed, Cancelled
- **Date Range** - Start/End dates

---

## 💡 Tips & Best Practices

### Time Entry Approval
- Review entries daily to avoid backlog
- Use bulk approve for routine entries
- Always provide specific rejection reasons
- Check for unusual hours or patterns

### Sprint Management
- Set realistic capacity based on team availability
- Define clear sprint goals (3-5 max)
- Close sprints promptly with retrospective notes
- Review velocity trends

### Team Management
- Keep allocations updated
- Monitor workload indicators weekly
- Add members early in sprint planning
- Link repository for automatic metrics

### Communications
- Pin critical announcements
- Log all major decisions for reference
- Schedule regular 1-on-1s (bi-weekly recommended)
- Use appropriate priority levels

---

## 🐛 Troubleshooting

### Common Issues

**"No team assigned"**
- Contact admin to assign you to a team
- Check your role is "team_lead"

**Data not loading**
- Check internet connection
- Refresh the page (F5)
- Clear browser cache if persistent

**Can't approve time entry**
- Verify entry is in "pending" status
- Check you have team lead permissions
- Ensure entry belongs to your team

**Sprint won't activate**
- Check all required fields are filled
- Verify dates are valid (start < end)
- Ensure no other sprint is active

---

## ⌨️ Keyboard Shortcuts

### Global
- `Ctrl+K` - Quick search (if implemented)
- `Esc` - Close dialogs/modals
- `Tab` - Navigate form fields

### Navigation
- `Alt+1` - Overview
- `Alt+2` - Tasks
- `Alt+3` - Sprints
- `Alt+4` - Time Approval
- `Alt+5` - Feedback
- `Alt+6` - Team
- `Alt+7` - Communications
- `Alt+8` - Profile

---

## 📱 Mobile Usage

### Responsive Features
- Sidebar collapses to hamburger menu
- Tables scroll horizontally
- Cards stack vertically
- Touch-friendly buttons (44px min)

### Best Practices
- Use landscape for tables
- Portrait for forms and reading
- Pinch to zoom on charts

---

## 🔐 Permissions

### Team Lead Can:
✅ View all team data
✅ Approve/reject time entries
✅ Create and manage sprints
✅ Add/remove team members
✅ Create announcements
✅ Schedule 1-on-1s
✅ Log decisions
✅ View team metrics

### Team Lead Cannot:
❌ Access other teams' data
❌ Modify organization settings
❌ Delete historical data
❌ Change user roles

---

## 📞 Support

### Getting Help
1. Check this guide first
2. Review tooltips (hover over ⓘ icons)
3. Contact your admin
4. Submit bug report (if available)

### Reporting Issues
Include:
- What you were trying to do
- What happened instead
- Browser and version
- Screenshot if applicable

---

## 🔄 Data Refresh

### Auto-Refresh
- Dashboard: Every 5 minutes
- Alerts: Every 2 minutes
- Other data: On navigation

### Manual Refresh
- Click browser refresh (F5)
- Navigate away and back
- Pull to refresh on mobile

---

## 📚 Additional Resources

- **API Documentation:** `/docs/TEAM_LEAD_FRONTEND_INTEGRATION.md`
- **Implementation Details:** `/docs/TEAM_LEAD_IMPLEMENTATION_COMPLETE.md`
- **Feature Analysis:** `/docs/TEAM_LEAD_FEATURE_ANALYSIS.md`

---

**Last Updated:** January 7, 2026  
**Version:** 1.0.0
