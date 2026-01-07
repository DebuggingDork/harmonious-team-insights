import {
  Users,
  MessageSquare,
  CheckSquare,
  BarChart3,
  Calendar,
  Clock,
  UserCog,
  Megaphone
} from "lucide-react";
import { CollapsibleSidebar, useCollapsibleSidebar, type NavItem } from "./CollapsibleSidebar";

interface TeamLeadSidebarProps {
  onLogout: () => void;
  children?: React.ReactNode;
}

const teamLeadNavItems: NavItem[] = [
  {
    path: "/dashboard/team-lead",
    label: "Overview",
    icon: BarChart3,
  },
  {
    path: "/dashboard/team-lead/tasks",
    label: "Tasks",
    icon: CheckSquare,
  },
  {
    path: "/dashboard/team-lead/sprints",
    label: "Sprints",
    icon: Calendar,
  },
  {
    path: "/dashboard/team-lead/time-approval",
    label: "Time Approval",
    icon: Clock,
  },
  {
    path: "/dashboard/team-lead/feedback",
    label: "Feedback",
    icon: MessageSquare,
  },
  {
    path: "/dashboard/team-lead/team",
    label: "Team",
    icon: Users,
  },
  {
    path: "/dashboard/team-lead/communications",
    label: "Communications",
    icon: Megaphone,
  },
  {
    path: "/dashboard/team-lead/profile",
    label: "Profile",
    icon: UserCog,
  },
];

export const TeamLeadSidebar = ({ onLogout, children }: TeamLeadSidebarProps) => {
  return (
    <CollapsibleSidebar
      navItems={teamLeadNavItems}
      onLogout={onLogout}
      userRole="team-lead"
      userAvatar={
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
          <Users className="h-5 w-5 text-primary-foreground" />
        </div>
      }
    >
      {children}
    </CollapsibleSidebar>
  );
};

// Re-export the hook for convenience
export const useTeamLeadSidebar = useCollapsibleSidebar;



