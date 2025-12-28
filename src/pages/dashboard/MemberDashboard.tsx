import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  User, 
  TrendingUp,
  Calendar,
  Clock,
  MessageSquare,
  Info,
  Search,
  Bell,
  LogOut,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TeamTuneLogo from "@/components/TeamTuneLogo";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, BarChart, Bar } from "recharts";

// Mock data
const personalData = {
  name: "Sarah Chen",
  email: "sarah.chen@teamtune.io",
  team: "Frontend Team",
  project: "TeamTune Platform",
  status: "Active",
  joinedDate: "March 2024",
};

const contributionTrendData = [
  { week: "W1", contributions: 12 },
  { week: "W2", contributions: 15 },
  { week: "W3", contributions: 11 },
  { week: "W4", contributions: 18 },
  { week: "W5", contributions: 16 },
  { week: "W6", contributions: 21 },
];

const activeDaysData = [
  { week: "W1", days: 4 },
  { week: "W2", days: 5 },
  { week: "W3", days: 4 },
  { week: "W4", days: 5 },
  { week: "W5", days: 5 },
  { week: "W6", days: 5 },
];

const timeLogData = [
  { week: "W1", hours: 38 },
  { week: "W2", hours: 42 },
  { week: "W3", hours: 36 },
  { week: "W4", hours: 40 },
  { week: "W5", hours: 41 },
  { week: "W6", hours: 39 },
];

const feedbackHistory = [
  { 
    date: "Dec 26, 2024", 
    from: "Alex Rivera (Team Lead)",
    note: "Excellent work on the dashboard components. Your attention to detail and code quality has been outstanding. Keep up the great momentum!",
    context: "Sprint 24 Review"
  },
  { 
    date: "Dec 19, 2024", 
    from: "Alex Rivera (Team Lead)",
    note: "Great collaboration with the backend team on the API integration. Your communication skills helped resolve blockers quickly.",
    context: "Cross-team Project"
  },
  { 
    date: "Dec 12, 2024", 
    from: "Alex Rivera (Team Lead)",
    note: "Strong performance during the feature release. Your proactive approach to testing helped catch issues early.",
    context: "Feature Launch"
  },
];

const chartConfig = {
  contributions: { label: "Contributions", color: "hsl(var(--primary))" },
  days: { label: "Active Days", color: "hsl(var(--chart-2))" },
  hours: { label: "Hours", color: "hsl(var(--chart-3))" },
};

const MemberDashboard = () => {
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
              <User className="h-4 w-4" />
              My Overview
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <TrendingUp className="h-4 w-4" />
              My Progress
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
                  placeholder="Search..."
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
                  <span className="text-sm font-medium text-primary-foreground">SC</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{personalData.name}</p>
                  <p className="text-xs text-muted-foreground">{personalData.email}</p>
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome, {personalData.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground mb-8">Your personal workspace and progress overview.</p>

            {/* Personal Overview */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-lg font-semibold text-foreground">{personalData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Team</p>
                    <p className="text-lg font-semibold text-foreground">{personalData.team}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Project</p>
                    <p className="text-lg font-semibold text-foreground">{personalData.project}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-chart-1/20 text-chart-1">
                      <CheckCircle className="h-3 w-3" />
                      {personalData.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contribution Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Contribution Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <AreaChart data={contributionTrendData}>
                      <defs>
                        <linearGradient id="memberContributionGradient" x1="0" y1="0" x2="0" y2="1">
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
                        fill="url(#memberContributionGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Active Days Pattern
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart data={activeDaysData}>
                      <XAxis dataKey="week" axisLine={false} tickLine={false} className="text-xs" />
                      <YAxis axisLine={false} tickLine={false} className="text-xs" domain={[0, 7]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="days" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Time & Effort Summary */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Time & Effort Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                  <AreaChart data={timeLogData}>
                    <defs>
                      <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="week" axisLine={false} tickLine={false} className="text-xs" />
                    <YAxis axisLine={false} tickLine={false} className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="hsl(var(--chart-3))"
                      fill="url(#timeGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  This shows your logged hours pattern over time, not a productivity measure.
                </p>
              </CardContent>
            </Card>

            {/* Feedback View */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Feedback from Your Team Lead
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedbackHistory.map((feedback, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-accent/50 rounded-lg border border-border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-foreground text-sm">{feedback.from}</p>
                          <p className="text-xs text-muted-foreground">{feedback.context}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{feedback.date}</p>
                      </div>
                      <p className="text-sm text-foreground">{feedback.note}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Guidance Panel */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Info className="h-5 w-5" />
                  About Your Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-foreground">
                  <p>
                    <strong>This dashboard shows trends, not ratings.</strong> The data here helps you understand 
                    your work patterns and provides visibility into your contributions.
                  </p>
                  <p>
                    <strong>Data is used for visibility and support.</strong> Your team lead uses this information 
                    to understand workload distribution and provide timely support when needed.
                  </p>
                  <p>
                    <strong>You are not being compared to others.</strong> This is your personal space. 
                    There are no rankings, scores, or comparisons with your teammates.
                  </p>
                  <p className="text-muted-foreground text-xs mt-4">
                    If you have questions about any data shown here, please reach out to your team lead.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;
