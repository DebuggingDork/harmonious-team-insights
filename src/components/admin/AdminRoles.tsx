import { motion } from "framer-motion";
import { 
  Shield, 
  FolderKanban, 
  UsersRound, 
  Users,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Settings
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminRoles = () => {
  const roles = [
    {
      id: "admin",
      name: "Administrator",
      description: "Full system access with user management and configuration capabilities",
      permissions: [
        "Manage all users and roles",
        "Configure system settings", 
        "View all projects and data",
        "Approve/reject user registrations",
        "Access admin dashboard"
      ],
      userCount: 3,
      icon: Shield,
      color: "text-primary"
    },
    {
      id: "project_manager", 
      name: "Project Manager",
      description: "Manages projects, teams, and oversees project delivery",
      permissions: [
        "Create and manage projects",
        "Assign team members to projects",
        "View project analytics and reports",
        "Manage project timelines",
        "Access project management tools"
      ],
      userCount: 8,
      icon: FolderKanban,
      color: "text-blue-500"
    },
    {
      id: "team_lead",
      name: "Team Lead", 
      description: "Leads development teams and manages team member activities",
      permissions: [
        "Manage assigned team members",
        "View team performance metrics",
        "Assign tasks to team members",
        "Review team deliverables",
        "Access team collaboration tools"
      ],
      userCount: 15,
      icon: UsersRound,
      color: "text-purple-500"
    },
    {
      id: "employee",
      name: "Employee",
      description: "Standard team member with access to assigned projects and tasks",
      permissions: [
        "View assigned projects and tasks",
        "Update task status and progress",
        "Collaborate with team members",
        "Access personal dashboard",
        "Submit time tracking data"
      ],
      userCount: 124,
      icon: Users,
      color: "text-muted-foreground"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Role Management</h2>
        <p className="text-muted-foreground">
          Overview of system roles and their permissions. Role configuration is managed at the system level.
        </p>
      </div>

      {/* Role Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <div key={role.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className={`h-4 w-4 ${role.color}`} />
                </div>
                <Badge variant="secondary">{role.userCount} users</Badge>
              </div>
              <p className="text-lg font-bold text-foreground">{role.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {role.userCount} active users
              </p>
            </div>
          );
        })}
      </div>

      {/* Roles List */}
      <div className="space-y-4">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className={`h-6 w-6 ${role.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{role.name}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{role.userCount} users</Badge>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                    Active
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Permissions & Capabilities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {role.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                      <span>{permission}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Role configuration is managed at the system level and cannot be modified here.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">View Only</span>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Information Note */}
      <div className="bg-accent/50 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Role Management Information</h4>
            <p className="text-sm text-muted-foreground">
              This page provides an overview of system roles and their permissions. 
              Role creation, modification, and permission management are handled at the system configuration level. 
              For role changes, please contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminRoles;