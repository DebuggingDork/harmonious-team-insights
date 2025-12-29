import { motion } from "framer-motion";
import { useMemo } from "react";
import { 
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Loader2,
  FolderKanban,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, BarChart, Bar } from "recharts";
import { useMyTasks, useMyTimeEntries, useMyProjects } from "@/hooks/useEmployee";
import { format, subDays, startOfWeek, endOfWeek, eachWeekOfInterval } from "date-fns";
import type { Task } from "@/api/types";

const chartConfig = {
  completed: { label: "Completed", color: "hsl(var(--chart-1))" },
  hours: { label: "Hours", color: "hsl(var(--chart-2))" },
  tasks: { label: "Tasks", color: "hsl(var(--chart-3))" },
};

const MyProgress = () => {
  // Get data
  const { data: tasksData, isLoading: isLoadingTasks } = useMyTasks();
  const { data: timeEntriesData, isLoading: isLoadingTimeEntries } = useMyTimeEntries({
    start_date: format(subDays(new Date(), 42), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd'),
  });
  const { data: projectsData, isLoading: isLoadingProjects } = useMyProjects();

  const tasks = tasksData?.tasks || [];
  const timeEntries = timeEntriesData?.time_entries || [];
  const projects = projectsData?.projects || [];

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const upcoming = tasks.filter((task: Task) => task.status === 'todo');
    const inProgress = tasks.filter((task: Task) => task.status === 'in_progress');
    const completed = tasks.filter((task: Task) => task.status === 'done');
    
    return { upcoming, inProgress, completed };
  }, [tasks]);

  // Group tasks by project
  const tasksByProject = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    
    tasks.forEach((task: Task) => {
      const projectKey = task.team_name || 'Unassigned';
      if (!grouped[projectKey]) {
        grouped[projectKey] = [];
      }
      grouped[projectKey].push(task);
    });
    
    return grouped;
  }, [tasks]);

  // Create weekly progress data
  const weeklyProgress = useMemo(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, 42); // 6 weeks
    const weeks = eachWeekOfInterval({ start: startDate, end: endDate });
    
    return weeks.map((weekStart) => {
      const weekEnd = endOfWeek(weekStart);
      const weekTasks = tasks.filter((task: Task) => {
        if (!task.completed_at) return false;
        const completedDate = new Date(task.completed_at);
        return completedDate >= weekStart && completedDate <= weekEnd;
      });
      
      const weekHours = timeEntries
        .filter((entry) => {
          const entryDate = new Date(entry.work_date);
          return entryDate >= weekStart && entryDate <= weekEnd;
        })
        .reduce((sum, entry) => sum + entry.hours, 0);
      
      return {
        week: format(weekStart, 'MMM d'),
        completed: weekTasks.length,
        hours: Math.round(weekHours * 10) / 10,
      };
    });
  }, [tasks, timeEntries]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'done': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-blue-500/10 text-blue-500';
      case 'in_progress': return 'bg-yellow-500/10 text-yellow-500';
      case 'done': return 'bg-emerald-500/10 text-emerald-500';
      default: return 'bg-muted-foreground/10 text-muted-foreground';
    }
  };

  const isLoading = isLoadingTasks || isLoadingTimeEntries || isLoadingProjects;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Progress Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { 
            label: "Upcoming Tasks", 
            value: tasksByStatus.upcoming.length, 
            icon: Clock,
            color: "bg-blue-500/10 text-blue-500"
          },
          { 
            label: "In Progress", 
            value: tasksByStatus.inProgress.length, 
            icon: AlertCircle,
            color: "bg-yellow-500/10 text-yellow-500"
          },
          { 
            label: "Completed", 
            value: tasksByStatus.completed.length, 
            icon: CheckCircle,
            color: "bg-emerald-500/10 text-emerald-500"
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {isLoading ? "..." : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Progress Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : weeklyProgress.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">No progress data available</p>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={weeklyProgress}>
                <defs>
                  <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="hsl(var(--chart-1))"
                  fill="url(#completedGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Tasks by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <Card key={status}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {getStatusIcon(status)}
                {status === 'upcoming' ? 'Upcoming Tasks' : 
                 status === 'inProgress' ? 'In Progress' : 'Completed Tasks'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : statusTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No {status === 'upcoming' ? 'upcoming' : status === 'inProgress' ? 'in progress' : 'completed'} tasks
                </p>
              ) : (
                <div className="space-y-3">
                  {statusTasks.slice(0, 5).map((task: Task) => (
                    <div key={task.id} className="p-3 bg-accent/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {task.title}
                        </p>
                        <Badge variant="outline" className="text-xs ml-2">
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{task.team_name}</span>
                        {task.due_date && (
                          <span>{format(new Date(task.due_date), 'MMM d')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {statusTasks.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      +{statusTasks.length - 5} more tasks
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            Tasks by Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : Object.keys(tasksByProject).length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No project data available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(tasksByProject).map(([projectName, projectTasks]) => {
                const completedTasks = projectTasks.filter(t => t.status === 'done').length;
                const totalTasks = projectTasks.length;
                const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                
                return (
                  <div key={projectName} className="p-4 bg-accent/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">{projectName}</h4>
                      <Badge variant="secondary">{totalTasks} tasks</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{completionRate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{completedTasks} completed</span>
                        <span>{totalTasks - completedTasks} remaining</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MyProgress;