import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Loader2,
  Link as LinkIcon,
  ExternalLink,
  Settings,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TeamLeadLayout } from "@/components/layouts/TeamLeadLayout";
import { useMyTeams } from "@/hooks/useEmployee";
import {
  useTeamMetrics,
  useTeamPerformance,
  useTeamGitActivity,
  useLinkRepository,
} from "@/hooks/useTeamLead";
import { toast } from "@/hooks/use-toast";
import type { LinkRepositoryRequest } from "@/api/types";

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-chart-1" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-destructive" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const ConsistencyIndicator = ({ level }: { level: string }) => {
  const colors = {
    high: "bg-chart-1",
    medium: "bg-chart-3",
    low: "bg-chart-4",
  };
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full ${
            (level === "high" && i <= 3) ||
            (level === "medium" && i <= 2) ||
            (level === "low" && i <= 1)
              ? colors[level as keyof typeof colors]
              : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
};

const TeamManagementPage = () => {
  const [isLinkRepoDialogOpen, setIsLinkRepoDialogOpen] = useState(false);
  const [repositoryUrl, setRepositoryUrl] = useState("");

  // Get teams
  const { data: teamsData, isLoading: isLoadingTeams } = useMyTeams();
  const teamCode = useMemo(() => {
    if (teamsData?.teams && teamsData.teams.length > 0) {
      return teamsData.teams[0].team_code;
    }
    return null;
  }, [teamsData]);

  // Get team data
  const team = useMemo(() => {
    if (teamsData?.teams && teamsData.teams.length > 0) {
      return teamsData.teams[0];
    }
    return null;
  }, [teamsData]);

  // Get team metrics
  const { data: teamMetrics, isLoading: isLoadingMetrics } = useTeamMetrics(teamCode || "");

  // Get team performance
  const dateRanges = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 42); // 6 weeks ago
    return {
      period_start: startDate.toISOString().split('T')[0],
      period_end: endDate.toISOString().split('T')[0],
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    };
  }, []);

  const { data: teamPerformance, isLoading: isLoadingPerformance } = useTeamPerformance(
    teamCode || "",
    dateRanges
  );

  // Get git activity
  const { data: gitActivity, isLoading: isLoadingGitActivity } = useTeamGitActivity(
    teamCode || "",
    dateRanges
  );

  // Link repository mutation
  const linkRepositoryMutation = useLinkRepository();

  // Transform team data
  const teamData = useMemo(() => {
    if (!team) return null;
    return {
      name: team.name || "Team",
      project: team.project_name || "Project",
      size: teamPerformance?.members_summary?.total_members || 0,
      status: "Active",
      repository: teamMetrics?.github_repository || null,
    };
  }, [team, teamPerformance, teamMetrics]);

  // Transform member activity data
  const memberActivityData = useMemo(() => {
    if (!teamPerformance?.members) return [];
    return teamPerformance.members.map((member) => {
      const trend =
        member.performance_score >= 80
          ? "up"
          : member.performance_score >= 60
          ? "stable"
          : "down";
      const consistency =
        member.performance_score >= 80
          ? "high"
          : member.performance_score >= 60
          ? "medium"
          : "low";
      const initials = member.user_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      return {
        name: member.user_name,
        trend,
        consistency,
        lastActive: "Recently",
        avatar: initials,
        userCode: member.user_code,
        performanceScore: member.performance_score,
      };
    });
  }, [teamPerformance]);

  const handleLinkRepository = async () => {
    if (!teamCode || !repositoryUrl.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a repository URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      const data: LinkRepositoryRequest = {
        repository_url: repositoryUrl,
      };
      await linkRepositoryMutation.mutateAsync({ teamCode, data });
      toast({
        title: "Success",
        description: "Repository linked successfully.",
      });
      setIsLinkRepoDialogOpen(false);
      setRepositoryUrl("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to link repository.",
        variant: "destructive",
      });
    }
  };

  const isLoading = isLoadingTeams || isLoadingMetrics || isLoadingPerformance || isLoadingGitActivity;

  return (
    <TeamLeadLayout
      headerTitle="Team Management"
      headerDescription="Manage your team members, performance, and settings"
    >
      <div className="space-y-6">
        {/* Team Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Team Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !teamCode ? (
              <p className="text-center text-muted-foreground py-4">No team assigned</p>
            ) : !teamData ? (
              <p className="text-center text-muted-foreground py-4">No team data available</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Team Name</p>
                  <p className="text-lg font-semibold text-foreground">{teamData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Project</p>
                  <p className="text-lg font-semibold text-foreground">{teamData.project}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Team Size</p>
                  <p className="text-lg font-semibold text-foreground">{teamData.size} members</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-chart-1/20 text-chart-1">
                    {teamData.status}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* GitHub Repository */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5 text-primary" />
                GitHub Repository
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLinkRepoDialogOpen(true)}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                {teamData?.repository ? "Update Repository" : "Link Repository"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {teamData?.repository ? (
              <div className="flex items-center gap-2">
                <a
                  href={teamData.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  {teamData.repository}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <p className="text-muted-foreground">No repository linked</p>
            )}
          </CardContent>
        </Card>

        {/* Team Metrics */}
        {teamMetrics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Team Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Commits</p>
                  <p className="text-2xl font-bold text-foreground">
                    {gitActivity?.total_commits || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                  <p className="text-2xl font-bold text-foreground">
                    {gitActivity?.activity_by_member?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Performance</p>
                  <p className="text-2xl font-bold text-foreground">
                    {teamPerformance?.members_summary?.average_performance_score
                      ? Math.round(teamPerformance.members_summary.average_performance_score)
                      : 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold text-foreground">
                    {teamPerformance?.members_summary?.total_members || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Member Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Member Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPerformance ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : memberActivityData.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No member data available</p>
            ) : (
              <div className="space-y-4">
                {memberActivityData.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-accent/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{member.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {member.lastActive}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Performance</p>
                        <p className="text-sm font-semibold text-foreground">
                          {member.performanceScore}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Trend</p>
                        <TrendIcon trend={member.trend} />
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Consistency</p>
                        <ConsistencyIndicator level={member.consistency} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Link Repository Dialog */}
      <Dialog open={isLinkRepoDialogOpen} onOpenChange={setIsLinkRepoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link GitHub Repository</DialogTitle>
            <DialogDescription>
              Link a GitHub repository to track your team's git activity.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="repository-url">Repository URL</Label>
              <Input
                id="repository-url"
                placeholder="https://github.com/username/repository"
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkRepoDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkRepository} disabled={linkRepositoryMutation.isPending}>
              {linkRepositoryMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Linking...
                </>
              ) : (
                "Link Repository"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TeamLeadLayout>
  );
};

export default TeamManagementPage;


