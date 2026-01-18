# Leave Request Validation Guide

**For:** Frontend Team  
**Purpose:** Understand and handle leave request validation errors

---

## 🎯 The Key Point

**Notifications are ONLY sent when a leave request is successfully created.**

If validation fails, the request is rejected immediately and:
- ❌ No leave request is created
- ❌ No notification is sent
- ❌ No database record is created
- ✅ Error is returned to frontend

---

## 🔄 Request Flow

### Successful Request
```
1. Employee submits form
2. Frontend validates (optional but recommended)
3. Backend receives request
4. Backend validates business rules ✅ PASS
5. Leave request created in database
6. Notification sent to team lead 📧
7. Return 201 success to frontend
```

### Failed Request (Validation Error)
```
1. Employee submits form
2. Frontend validates (optional but recommended)
3. Backend receives request
4. Backend validates business rules ❌ FAIL
5. Return 400 error immediately
6. NO request created
7. NO notification sent
```

---

## ⚠️ Common Validation Errors

### 1. Insufficient Advance Notice

**Error:**
```json
{
  "error": {
    "message": "Vacation Leave requires at least 7 days advance notice",
    "code": "VALIDATION_ERROR"
  },
  "statusCode": 400
}
```

**Why This Happens:**
- Employee tries to request vacation leave for next week
- Vacation leave requires 7 days advance notice
- Only 5 days until start date

**Solution:**
```javascript
// Get leave type requirements
const leaveType = await fetch('/api/employee/leave/types')
  .then(r => r.json())
  .then(types => types.find(t => t.code === 'VACATION'));

// Validate before submission
const today = new Date();
const startDate = new Date(formData.start_date);
const daysUntilStart = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));

if (daysUntilStart < leaveType.min_advance_notice_days) {
  alert(`${leaveType.name} requires at least ${leaveType.min_advance_notice_days} days advance notice`);
  return; // Don't submit
}
```

---

### 2. Insufficient Leave Balance

**Error:**
```json
{
  "error": {
    "message": "Insufficient leave balance. You have 2 days remaining but requested 5 days",
    "code": "VALIDATION_ERROR"
  },
  "statusCode": 400
}
```

**Why This Happens:**
- Employee has only 2 vacation days left
- Tries to request 5 days
- Not enough balance

**Solution:**
```javascript
// Fetch balance before showing form
const balances = await fetch('/api/employee/leave/balances')
  .then(r => r.json());

// Show balance in UI
const vacationBalance = balances.balances.find(b => b.leave_type.code === 'VACATION');
console.log(`You have ${vacationBalance.remaining_days} days remaining`);

// Validate before submission
const requestedDays = calculateWorkingDays(startDate, endDate);
if (requestedDays > vacationBalance.remaining_days) {
  alert(`Insufficient balance. You have ${vacationBalance.remaining_days} days but requested ${requestedDays}`);
  return;
}
```

---

### 3. Exceeds Maximum Consecutive Days

**Error:**
```json
{
  "error": {
    "message": "Vacation Leave allows maximum 10 consecutive days",
    "code": "VALIDATION_ERROR"
  },
  "statusCode": 400
}
```

**Why This Happens:**
- Employee requests 15 days vacation
- Vacation leave has max 10 consecutive days limit
- Request exceeds limit

**Solution:**
```javascript
// Check max consecutive days
const requestedDays = calculateWorkingDays(startDate, endDate);

if (leaveType.max_consecutive_days && requestedDays > leaveType.max_consecutive_days) {
  alert(`${leaveType.name} allows maximum ${leaveType.max_consecutive_days} consecutive days`);
  return;
}
```

---

### 4. Overlapping Leave Requests

**Error:**
```json
{
  "error": {
    "message": "You already have an approved leave request for these dates",
    "code": "CONFLICT_ERROR"
  },
  "statusCode": 409
}
```

**Why This Happens:**
- Employee already has approved leave for Feb 1-5
- Tries to request another leave for Feb 3-7
- Dates overlap

**Solution:**
```javascript
// Fetch existing requests
const existingRequests = await fetch('/api/employee/leave/requests?status=approved')
  .then(r => r.json());

// Check for overlaps
function hasOverlap(newStart, newEnd, existingRequests) {
  const start = new Date(newStart);
  const end = new Date(newEnd);
  
  return existingRequests.requests.some(req => {
    const reqStart = new Date(req.start_date);
    const reqEnd = new Date(req.end_date);
    return start <= reqEnd && end >= reqStart;
  });
}

if (hasOverlap(formData.start_date, formData.end_date, existingRequests)) {
  alert('You already have a leave request for these dates');
  return;
}
```

---

### 5. Start Date in the Past

**Error:**
```json
{
  "error": {
    "message": "Start date cannot be in the past",
    "code": "VALIDATION_ERROR"
  },
  "statusCode": 400
}
```

**Solution:**
```javascript
// Set min date on date input
<input 
  type="date" 
  min={new Date().toISOString().split('T')[0]}
  value={formData.start_date}
/>
```

---

### 6. End Date Before Start Date

**Error:**
```json
{
  "error": {
    "message": "End date must be after or equal to start date",
    "code": "VALIDATION_ERROR"
  },
  "statusCode": 400
}
```

**Solution:**
```javascript
// Set min on end date based on start date
<input 
  type="date" 
  min={formData.start_date}
  value={formData.end_date}
/>
```

---

## 📋 Leave Type Requirements

| Leave Type | Min Advance Notice | Max Consecutive Days | Requires Document |
|------------|-------------------|---------------------|-------------------|
| **Vacation** | 7 days | 10 days | No |
| **Sick** | 0 days (same day OK) | 5 days | Yes (if > 3 days) ⚠️ |
| **Personal** | 1 day | 3 days | No |
| **WFH** | 1 day | 5 days | No |
| **Unpaid** | 3 days | 30 days | No |
| **Maternity** | 30 days | 90 days | Yes |
| **Bereavement** | 0 days | 5 days | No |

**Note:** For **Sick Leave**, the document is only required for requests exceeding 3 days.

**Note:** Fetch these from `/api/employee/leave/types` - they can be customized by admins.

---

## 💡 Best Practices

### 1. Always Fetch Leave Types First
```javascript
useEffect(() => {
  fetchLeaveTypes();
  fetchBalances();
}, []);
```

### 2. Show Requirements in UI
```javascript
<select>
  <option value="VACATION">
    Vacation Leave (7 days notice, max 10 days)
  </option>
  <option value="SICK">
    Sick Leave (same day OK, requires medical cert)
  </option>
</select>
```

### 3. Validate Before Submission
```javascript
const validateForm = () => {
  // Check all rules
  // Return true/false
  // Show errors if invalid
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  // Submit to API
};
```

### 4. Show Balance Information
```javascript
<div className="balance-info">
  <p>Vacation Leave: {vacationBalance.remaining_days} days remaining</p>
  <p>Sick Leave: {sickBalance.remaining_days} days remaining</p>
</div>
```

### 5. Handle API Errors Gracefully
```javascript
try {
  const response = await fetch('/api/employee/leave/requests', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    showError(error.error.message); // Show user-friendly message
    return;
  }
  
  // Success!
} catch (error) {
  showError('Network error. Please try again.');
}
```

---

## 🎯 Complete Validation Function

```javascript
function validateLeaveRequest(formData, leaveType, balance, existingRequests) {
  const errors = [];
  const warnings = [];
  
  // 1. Check dates are provided
  if (!formData.start_date || !formData.end_date) {
    errors.push('Please select start and end dates');
    return { valid: false, errors, warnings };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(formData.start_date);
  const end = new Date(formData.end_date);
  
  // 2. Check start date is not in past
  if (start < today) {
    errors.push('Start date cannot be in the past');
  }
  
  // 3. Check end date is after start date
  if (end < start) {
    errors.push('End date must be after start date');
  }
  
  // 4. Check advance notice
  const daysUntilStart = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
  if (daysUntilStart < leaveType.min_advance_notice_days) {
    errors.push(
      `${leaveType.name} requires at least ${leaveType.min_advance_notice_days} days advance notice. ` +
      `You are requesting leave ${daysUntilStart} days in advance.`
    );
  }
  
  // 5. Calculate working days (exclude weekends)
  let workingDays = 0;
  let currentDate = new Date(start);
  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // 6. Check maximum consecutive days
  if (leaveType.max_consecutive_days && workingDays > leaveType.max_consecutive_days) {
    errors.push(
      `${leaveType.name} allows maximum ${leaveType.max_consecutive_days} consecutive days. ` +
      `You are requesting ${workingDays} days.`
    );
  }
  
  // 7. Check leave balance
  if (balance && workingDays > balance.remaining_days) {
    errors.push(
      `Insufficient leave balance. You have ${balance.remaining_days} days remaining ` +
      `but requested ${workingDays} days.`
    );
  } else if (balance && balance.remaining_days - workingDays < 2) {
    warnings.push(
      `After this request, you will have only ${balance.remaining_days - workingDays} days remaining.`
    );
  }
  
  // 8. Check for overlaps
  const hasOverlap = existingRequests.some(req => {
    const reqStart = new Date(req.start_date);
    const reqEnd = new Date(req.end_date);
    return start <= reqEnd && end >= reqStart;
  });
  
  if (hasOverlap) {
    errors.push('You already have a leave request for these dates');
  }
  
  // 9. Check reason
  if (!formData.reason || formData.reason.trim().length < 10) {
    errors.push('Please provide a detailed reason (at least 10 characters)');
  }
  
  // 10. Check document requirement
  if (leaveType.requires_document && !formData.supporting_document_url) {
    // Special rule for sick leave: only required if > 3 days
    const requiresDocumentForDuration = leaveType.code === 'SICK' ? workingDays > 3 : true;
    
    if (requiresDocumentForDuration) {
      errors.push(
        leaveType.code === 'SICK' 
          ? "Sick Leave requires a supporting document (medical certificate) for leave requests exceeding 3 days"
          : `${leaveType.name} requires a supporting document`
      );
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    workingDays
  };
}
```

---

## ⚙️ Backend Logic Reference

```javascript
// Backend validation (leave.service.ts)
if (leaveType.requires_document && !input.supporting_document_url) {
  // Special rule for sick leave: only required if > 3 days
  const requiresDocumentForDuration = leaveType.code === 'SICK' ? totalDays > 3 : true;
  
  if (requiresDocumentForDuration) {
    throw new ValidationError(
      leaveType.code === 'SICK' 
        ? "Sick Leave requires a supporting document (medical certificate) for leave requests exceeding 3 days"
        : `${leaveType.name} requires a supporting document`
    );
  }
}
```

---

## 🔍 Testing Validation

### Test Case 1: Insufficient Advance Notice
```javascript
// Try to request vacation for tomorrow
const formData = {
  leave_type_code: 'VACATION',
  start_date: '2026-01-19', // Tomorrow
  end_date: '2026-01-20',
  reason: 'Emergency trip'
};

// Expected: Error - "Vacation Leave requires at least 7 days advance notice"
```

### Test Case 2: Insufficient Balance
```javascript
// Try to request more days than available
const formData = {
  leave_type_code: 'VACATION',
  start_date: '2026-02-01',
  end_date: '2026-02-10', // 6 working days
  reason: 'Family vacation'
};

// If balance is only 2 days
// Expected: Error - "Insufficient leave balance"
```

### Test Case 3: Exceeds Maximum Days
```javascript
// Try to request 15 days vacation
const formData = {
  leave_type_code: 'VACATION',
  start_date: '2026-02-01',
  end_date: '2026-02-20', // 14 working days
  reason: 'Extended vacation'
};

// Expected: Error - "Vacation Leave allows maximum 10 consecutive days"
```

### Test Case 4: Sick Leave Document (Conditional)
```javascript
// Case A: 2 days - OK
const formDataA = { leave_type_code: 'SICK', start_date: '2026-01-20', end_date: '2026-01-21' };
// Expected: Success ✅

// Case B: 4 days - Document missing
const formDataB = { leave_type_code: 'SICK', start_date: '2026-01-20', end_date: '2026-01-23' };
// Expected: Error - "Sick Leave requires a supporting document... for requests exceeding 3 days" ❌
```

---

## ✅ Summary

1. **Validation happens BEFORE request creation**
2. **Failed validation = No notification sent**
3. **Always validate on frontend first** (better UX)
4. **Fetch leave types and balances** before showing form
5. **Show clear error messages** when validation fails
6. **Handle API errors gracefully**

---

**Remember:** Notifications are only sent when a leave request is successfully created. If validation fails, no request exists, so no notification is sent!
