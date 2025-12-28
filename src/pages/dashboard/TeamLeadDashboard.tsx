import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Users, 
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  MessageSquare,
  Clock,
  Search,
  Bell,
  LogOut,
  User,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import TeamTuneLogo from "@/components/TeamTuneLogo";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, BarChart, Bar } from "recharts";

// Mock data
const teamData = {
  name: "Frontend Team",
  project: "TeamTune Platform",
  size: 6,
  status: "Active",
};

const memberActivityData = [
  { name: "Sarah Chen", trend: "up", consistency: "high", lastActive: "2 hours ago", avatar: "SC" },
  { name: "Mike Johnson", trend: "stable", consistency: "high", lastActive: "1 hour ago", avatar: "MJ" },
  { name: "Emily Davis", trend: "up", consistency: "medium", lastActive: "30 min ago", avatar: "ED" },
  { name: "James Wilson", trend: "down", consistency: "low", lastActive: "2 days ago", avatar: "JW" },
  { name: "Lisa Park", trend: "stable", consistency: "high", lastActive: "4 hours ago", avatar: "LP" },
  { name: "Tom Anderson", trend: "up", consistency: "medium", lastActive: "1 hour ago", avatar: "TA" },
];

const executionTrendData = [
  { week: "W1", contributions: 45, activeMembers: 5 },
  { week: "W2", contributions: 52, activeMembers: 6 },
  { week: "W3", contributions: 48, activeMembers: 5 },
  { week: "W4", contributions: 61, activeMembers: 6 },
  { week: "W5", contributions: 58, activeMembers: 6 },
  { week: "W6", contributions: 67, activeMembers: 6 },
];

const activityDistributionData = [
  { day: "Mon", active: 85, inactive: 15 },
  { day: "Tue", active: 92, inactive: 8 },
  { day: "Wed", active: 78, inactive: 22 },
  { day: "Thu", active: 88, inactive: 12 },
  { day: "Fri", active: 75, inactive: 25 },
];

const riskSignals = [
  { member: "James Wilson", signal: "Activity drop", description: "50% decrease in contributions this week", severity: "medium" },
  { member: "Emily Davis", signal: "Inconsistent pattern", description: "Irregular activity over past 2 weeks", severity: "low" },
];

const feedbackHistory = [
  { member: "Sarah Chen", date: "Dec 26", note: "Excellent work on the dashboard components. Keep up the great momentum." },
  { member: "Mike Johnson", date: "Dec 24", note: "Good progress on API integration. Consider documenting the edge cases." },
];

const chartConfig = {
  contributions: { label: "Contributions", color: "hsl(var(--primary))" },
  activeMembers: { label: "Active Members", color: "hsl(var(--chart-2))" },
  active: { label: "Active", color: "hsl(var(--chart-1))" },
  inactive: { label: "Inactive", color: "hsl(var(--muted))" },
};

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

const TeamLeadDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 hidden lg:flex flex-col">
        <Link to="/">
          <TeamTuneLogo />
        </Link>
        
        <nav className="mt-8 flex-1">
          <div className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground bg-accent rounded-lg">
              <Users className="h-4 w-4" />
              Team Overview
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <Activity className="h-4 w-4" />
              Execution Trends
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <MessageSquare className="h-4 w-4" />
              Feedback
            </a>
          </div>
        </nav>

        <div className="border-t border-border pt-4">
          <Link to="/auth">
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="lg:hidden">
                <TeamTuneLogo showText={false} />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search members..."
                  className="pl-10 pr-4 py-2 bg-accent border-none rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">Team Lead</p>
                  <p className="text-xs text-muted-foreground">lead@teamtune.io</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-2">Team Dashboard</h1>
            <p className="text-muted-foreground mb-8">Monitor your team's execution and support their growth.</p>

            {/* Team Overview */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Team Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Member Activity Snapshot */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Member Activity Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Execution Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Contribution Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <AreaChart data={executionTrendData}>
                      <defs>
                        <linearGradient id="contributionGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="week" axisLine={false} tickLine={false} className="text-xs" />
                      <YAxis axisLine={false} tickLine={false} className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="contributions"
                        stroke="hsl(var(--primary))"
                        fill="url(#contributionGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Active vs Inactive Periods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart data={activityDistributionData}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs" />
                      <YAxis axisLine={false} tickLine={false} className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="active" stackId="a" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="inactive" stackId="a" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Risk Signals */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-chart-4" />
                  Risk Signals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {riskSignals.length > 0 ? (
                  <div className="space-y-3">
                    {riskSignals.map((signal, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${
                          signal.severity === "medium" 
                            ? "bg-chart-4/10 border-chart-4/30" 
                            : "bg-chart-3/10 border-chart-3/30"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground">{signal.member}</p>
                            <p className="text-sm text-muted-foreground">{signal.signal}</p>
                            <p className="text-xs text-muted-foreground mt-1">{signal.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No risk signals detected</p>
                )}
              </CardContent>
            </Card>

            {/* Feedback & Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Feedback & Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">Add New Feedback</label>
                  <Textarea 
                    placeholder="Write supportive feedback for a team member..."
                    className="mb-2"
                  />
                  <Button size="sm">Save Feedback</Button>
                </div>
                
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-medium text-foreground mb-3">Recent Feedback</h4>
                  <div className="space-y-3">
                    {feedbackHistory.map((feedback, index) => (
                      <div key={index} className="p-3 bg-accent/50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-foreground text-sm">{feedback.member}</p>
                          <p className="text-xs text-muted-foreground">{feedback.date}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{feedback.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default TeamLeadDashboard;
