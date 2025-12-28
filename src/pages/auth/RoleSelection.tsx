import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Briefcase, Users, User, ArrowRight } from "lucide-react";
import TeamTuneLogo from "@/components/TeamTuneLogo";

const roles = [
  {
    id: "admin",
    title: "Admin",
    description: "Full system access and configuration",
    icon: Shield,
    path: "/auth/admin",
  },
  {
    id: "project-manager",
    title: "Project Manager",
    description: "Manage projects and team assignments",
    icon: Briefcase,
    path: "/auth/project-manager",
  },
  {
    id: "team-lead",
    title: "Team Lead",
    description: "Lead your team and track performance",
    icon: Users,
    path: "/auth/team-lead",
  },
  {
    id: "member",
    title: "Member",
    description: "Access your tasks and collaborate",
    icon: User,
    path: "/auth/member",
  },
];

const RoleSelection = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--muted))_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link to="/">
          <TeamTuneLogo />
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-lg">
              Select your role to continue
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={role.path}>
                  <div className="group relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-primary/50 hover:bg-card transition-all duration-300 cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent rounded-lg group-hover:bg-primary/10 transition-colors">
                        <role.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                          {role.title}
                          <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            Don't have an account?{" "}
            <Link to="/auth/signup" className="text-primary hover:underline">
              Contact your administrator
            </Link>
          </motion.p>
        </div>
      </main>
    </div>
  );
};

export default RoleSelection;
