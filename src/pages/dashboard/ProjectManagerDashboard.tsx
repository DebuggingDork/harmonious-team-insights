import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  FolderKanban, 
  Calendar, 
  BarChart3, 
  Bell, 
  Search,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TeamTuneLogo from "@/components/TeamTuneLogo";

const ProjectManagerDashboard = () => {
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
              <BarChart3 className="h-4 w-4" />
              Overview
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <FolderKanban className="h-4 w-4" />
              Projects
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <Calendar className="h-4 w-4" />
              Timeline
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
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 bg-accent border-none rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
              </button>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">Project Manager</p>
                  <p className="text-xs text-muted-foreground">pm@teamtune.io</p>
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Project Manager Dashboard</h1>
            <p className="text-muted-foreground mb-8">Track project progress and manage team assignments.</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Active Projects", value: "12", change: "+2 this week" },
                { label: "Team Members", value: "48", change: "Across projects" },
                { label: "On Track", value: "83%", change: "Projects" },
                { label: "Deadlines", value: "3", change: "This week" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </motion.div>
              ))}
            </div>

            {/* Placeholder Content */}
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">Project Manager Dashboard</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enable Lovable Cloud to unlock full project management features including 
                Gantt charts, resource allocation, and progress tracking.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProjectManagerDashboard;
