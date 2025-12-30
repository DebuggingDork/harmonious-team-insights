import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FolderKanban,
  Download,
  Loader2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ProjectManagerLayout } from "@/components/layouts/ProjectManagerLayout";
import { useProjects, useEmployees } from "@/hooks/useProjectManager";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, AreaChart, Area } from "recharts";
import { toast } from "@/hooks/use-toast";

const ReportsPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Get projects and employees
  const { data: projectsData, isLoading: isLoadingProjects } = useProjects();
  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployees();

  const projects = projectsData?.projects || [];
  const employees = employeesData?.employees || [];

  // Calculate statistics
  const stats = useMemo(() => {
    const activeProjects = projects.filter((p: any) => p.status === "active").length;
    const completedProjects = projects.filter((p: any) => p.status === "completed").length;
    const onHoldProjects = projects.filter((p: any) => p.status === "on_hold").length;
    const totalTeamMembers = employees.length;

    // Project health distribution
    const healthDistribution = {
      healthy: projects.filter((p: any) => {
        // Simplified health calculation
        return p.status === "active";
      }).length,
      atRisk: projects.filter((p: any) => p.status === "on_hold").length,
      completed: completedProjects,
    };

    return {
      activeProjects,
      completedProjects,
      onHoldProjects,
      totalProjects: projects.length,
      totalTeamMembers,
      healthDistribution,
    };
  }, [projects, employees]);

  // Project status chart data
  const statusChartData = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    projects.forEach((p: any) => {
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([status, count]) => ({
      status: status.replace('_', ' '),
      count,
    }));
  }, [projects]);

  // Resource utilization (simplified)
  const resourceUtilization = useMemo(() => {
    // This would typically come from time tracking data
    // For now, we'll create a simplified representation
    return [
      { week: "Week 1", utilization: 75 },
      { week: "Week 2", utilization: 82 },
      { week: "Week 3", utilization: 68 },
      { week: "Week 4", utilization: 90 },
    ];
  }, []);

  const handleExportReport = (format: "csv" | "pdf") => {
    toast({
      title: "Export Started",
      description: `Exporting report as ${format.toUpperCase()}. This feature will be available soon.`,
    });
  };

  const chartConfig = {
    count: { label: "Count", color: "hsl(var(--primary))" },
    utilization: { label: "Utilization %", color: "hsl(var(--chart-2))" },
  };

  return (
    <ProjectManagerLayout
      headerTitle="Reports & Analytics"
      headerDescription="View project health, team performance, and resource utilization"
      headerActions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExportReport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExportReport("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.activeProjects} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTeamMembers}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedProjects}</div>
              <p className="text-xs text-muted-foreground mt-1">Projects finished</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                At Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.onHoldProjects}</div>
              <p className="text-xs text-muted-foreground mt-1">Projects on hold</p>
            </CardContent>
          </Card>
        </div>

        {/* Project Health Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Project Health Overview
            </CardTitle>
            <CardDescription>Distribution of projects by status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProjects ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : statusChartData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No project data available</p>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={statusChartData}>
                  <XAxis dataKey="status" axisLine={false} tickLine={false} className="text-xs" />
                  <YAxis axisLine={false} tickLine={false} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Resource Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Resource Utilization
            </CardTitle>
            <CardDescription>Team member utilization over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={resourceUtilization}>
                <defs>
                  <linearGradient id="utilizationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="utilization"
                  stroke="hsl(var(--chart-2))"
                  fill="url(#utilizationGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Project List Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />
              Projects Summary
            </CardTitle>
            <CardDescription>Overview of all projects</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProjects ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : projects.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No projects found</p>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 10).map((project: any) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{project.name}</h4>
                        <Badge
                          variant={
                            project.status === "active"
                              ? "default"
                              : project.status === "completed"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{project.project_code}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {project.end_date
                        ? new Date(project.end_date).toLocaleDateString()
                        : "No end date"}
                    </div>
                  </div>
                ))}
                {projects.length > 10 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Showing 10 of {projects.length} projects
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProjectManagerLayout>
  );
};

export default ReportsPage;

