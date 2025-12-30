# Team Lead Dashboard - Quick Integration Guide

## Quick Start

### 1. Import Required Hooks

```typescript
import {
  useTeamDashboard,
  useRecentAlerts,
  useActiveRisks,
  useTeamWorkload,
  useSprintDashboard,
  useAcknowledgeAlert,
  useResolveAlert,
  useCreateRisk,
  useCreatePerformanceGoal,
  useMemberPerformanceDashboard,
} from '@/hooks/useTeamLead';
```

### 2. Load Dashboard Data

```typescript
function TeamLeadDashboard() {
  const { user } = useAuth();
  const { data: teams } = useMyTeams();
  const teamCode = teams?.[0]?.team_code;

  // Load complete dashboard
  const { data: dashboard, isLoading, error } = useTeamDashboard(teamCode);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <TeamHealthCard health={dashboard.team_health} />
      <QuickStatsGrid stats={dashboard.quick_stats} />
      <TeamMembersList members={dashboard.team_members} />
      <ActiveSprintsList sprints={dashboard.active_sprints} />
      <RecentAlertsList alerts={dashboard.recent_alerts} />
      <ActiveRisksList risks={dashboard.active_risks} />
      <MilestonesList milestones={dashboard.upcoming_milestones} />
      <ActionItemsList items={dashboard.action_items} />
    </div>
  );
}
```

## Component Examples

### Team Health Score Card

```typescript
function TeamHealthCard({ health }: { health: TeamHealthMetrics }) {
  const getStatusColor = (status: TeamHealthStatus) => {
    switch (status) {
      case 'good': return '#28a745';
      case 'at_risk': return '#ffc107';
      case 'critical': return '#dc3545';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <CircularProgress 
            value={health.score} 
            color={getStatusColor(health.status)}
          />
          <div>
            <p className="text-2xl font-bold">{health.score}</p>
            <p className="text-sm text-muted-foreground capitalize">
              {health.status.replace('_', ' ')}
            </p>
          </div>
        </div>
        {health.factors.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Factors:</p>
            <ul className="text-sm text-muted-foreground">
              {health.factors.map((factor, i) => (
                <li key={i}>• {factor}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### Quick Stats Grid

```typescript
function QuickStatsGrid({ stats }: { stats: QuickStats }) {
  const statCards = [
    { 
      label: 'Active Tasks', 
      value: stats.active_tasks, 
      icon: CheckCircle2,
      color: 'blue' 
    },
    { 
      label: 'Overdue Tasks', 
      value: stats.overdue_tasks, 
      icon: AlertTriangle,
      color: 'red' 
    },
    { 
      label: 'Blocked Tasks', 
      value: stats.blocked_tasks, 
      icon: XCircle,
      color: 'orange' 
    },
    { 
      label: 'Active Sprints', 
      value: stats.active_sprints, 
      icon: Zap,
      color: 'green' 
    },
    { 
      label: 'Active Alerts', 
      value: stats.active_alerts, 
      icon: Bell,
      color: 'yellow' 
    },
    { 
      label: 'High Risk Items', 
      value: stats.high_risk_items, 
      icon: Shield,
      color: 'purple' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### Alerts Panel with Actions

```typescript
function AlertsPanel({ teamCode }: { teamCode: string }) {
  const { data: alertsData } = useRecentAlerts(teamCode, 7);
  const acknowledgeAlert = useAcknowledgeAlert();
  const resolveAlert = useResolveAlert();
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'all'>('all');

  const filteredAlerts = selectedSeverity === 'all'
    ? alertsData?.alerts
    : alertsData?.alerts.filter(a => a.severity === selectedSeverity);

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Alerts</CardTitle>
          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredAlerts?.map((alert) => (
            <div key={alert.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline">{alert.status}</Badge>
                  </div>
                  <h4 className="font-medium">{alert.title}</h4>
                  {alert.message && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {alert.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(alert.triggered_at), 'PPp')}
                  </p>
                </div>
                <div className="flex gap-2">
                  {alert.status === 'active' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert.mutate({ 
                          alertCode: alert.alert_code 
                        })}
                      >
                        Acknowledge
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          const notes = prompt('Resolution notes:');
                          if (notes) {
                            resolveAlert.mutate({
                              alertCode: alert.alert_code,
                              data: { resolution_notes: notes }
                            });
                          }
                        }}
                      >
                        Resolve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

### Workload Distribution

```typescript
function WorkloadDistribution({ teamCode }: { teamCode: string }) {
  const { data: workload } = useTeamWorkload(teamCode);

  const getWorkloadColor = (status: WorkloadStatus) => {
    switch (status) {
      case 'underutilized': return 'bg-blue-500';
      case 'normal': return 'bg-green-500';
      case 'optimal': return 'bg-emerald-500';
      case 'overloaded': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
    }
  };

  const getWorkloadLabel = (status: WorkloadStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Workload</CardTitle>
        <CardDescription>
          Average Utilization: {workload?.team_metrics.average_utilization.toFixed(1)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workload?.member_workloads.map((member) => (
            <div key={member.member.user_id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {member.member.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.member.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.member.team_role}
                    </p>
                  </div>
                </div>
                <Badge className={getWorkloadColor(member.workload.status)}>
                  {getWorkloadLabel(member.workload.status)}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Utilization</span>
                  <span>{member.workload.utilization_percentage}%</span>
                </div>
                <Progress value={member.workload.utilization_percentage} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Active Tasks</p>
                  <p className="font-medium">{member.workload.active_tasks_count}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Overdue</p>
                  <p className="font-medium text-red-600">
                    {member.workload.overdue_tasks_count}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Blocked</p>
                  <p className="font-medium text-orange-600">
                    {member.workload.blocked_tasks_count}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {workload?.recommendations.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="text-sm space-y-1">
              {workload.recommendations.map((rec, i) => (
                <li key={i}>• {rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### Sprint Dashboard

```typescript
function SprintDashboard({ sprintCode }: { sprintCode: string }) {
  const { data: sprint } = useSprintDashboard(sprintCode);

  if (!sprint) return null;

  return (
    <div className="space-y-6">
      {/* Sprint Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{sprint.sprint.name}</CardTitle>
              <CardDescription>
                {format(new Date(sprint.sprint.start_date), 'PP')} - 
                {format(new Date(sprint.sprint.end_date), 'PP')}
              </CardDescription>
            </div>
            <Badge>{sprint.sprint.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold">
                {sprint.metrics.progress_percentage.toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">
                {sprint.metrics.completed_tasks}/{sprint.metrics.total_tasks}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Story Points</p>
              <p className="text-2xl font-bold">
                {sprint.metrics.completed_story_points}/{sprint.metrics.total_story_points}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Days Remaining</p>
              <p className="text-2xl font-bold">{sprint.metrics.days_remaining}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Burndown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Burndown Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sprint.burndown_data.ideal_line.map((ideal, i) => ({
              day: i + 1,
              ideal,
              actual: sprint.burndown_data.actual_line[i] || null,
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Story Points', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ideal" stroke="#94a3b8" strokeDasharray="5 5" name="Ideal" />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} name="Actual" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Task Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">In Progress ({sprint.tasks.in_progress.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskList tasks={sprint.tasks.in_progress} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Blocked ({sprint.tasks.blocked.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskList tasks={sprint.tasks.blocked} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completed ({sprint.tasks.completed.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskList tasks={sprint.tasks.completed} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### Create Performance Goal Dialog

```typescript
function CreateGoalDialog({ userCode }: { userCode: string }) {
  const [open, setOpen] = useState(false);
  const createGoal = useCreatePerformanceGoal();
  const form = useForm<CreateGoalRequest>();

  const onSubmit = (data: CreateGoalRequest) => {
    createGoal.mutate(
      { userCode, data },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast({ title: 'Goal created successfully' });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Performance Goal</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Complete AWS certification" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="learning">Learning</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="period_end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createGoal.isPending}>
                {createGoal.isPending ? 'Creating...' : 'Create Goal'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

## Common Patterns

### Loading States

```typescript
const { data, isLoading, error } = useTeamDashboard(teamCode);

if (isLoading) {
  return <Skeleton className="h-96" />;
}

if (error) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
```

### Mutation with Toast

```typescript
const createRisk = useCreateRisk();

const handleCreateRisk = (data: CreateRiskRequest) => {
  createRisk.mutate(
    { teamCode, data },
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Risk created successfully',
        });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    }
  );
};
```

### Auto-refresh Data

```typescript
// Alerts auto-refresh every 2 minutes
const { data: alerts } = useRecentAlerts(teamCode, 7);

// Manual refresh
const queryClient = useQueryClient();
const refreshAlerts = () => {
  queryClient.invalidateQueries({ queryKey: teamLeadKeys.alerts(teamCode) });
};
```

## Best Practices

1. **Always check for teamCode** before making queries
2. **Use loading and error states** for better UX
3. **Invalidate related queries** after mutations
4. **Use optimistic updates** for instant feedback
5. **Implement proper error handling** with toast notifications
6. **Cache dashboard data** with appropriate stale times
7. **Use React Query devtools** for debugging
8. **Follow color coding standards** from documentation
9. **Implement pagination** for large lists
10. **Add confirmation dialogs** for destructive actions

## Environment Setup

Ensure your `.env` file has:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=30000
VITE_TOKEN_STORAGE_KEY=upea_token
```

For production:

```env
VITE_API_BASE_URL=https://api.yourapp.com
```

## Troubleshooting

### 401 Unauthorized
- Check if token is valid
- Verify token is being sent in headers
- Check if user has team_lead role

### 404 Not Found
- Verify teamCode is correct
- Check if endpoint URL is correct
- Ensure resource exists

### Network Errors
- Check API base URL in .env
- Verify backend is running
- Check CORS configuration

### Cache Issues
- Use React Query devtools
- Manually invalidate queries
- Check stale time settings
