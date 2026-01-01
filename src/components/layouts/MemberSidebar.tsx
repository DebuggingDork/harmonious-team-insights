import { User, CheckSquare, Clock, TrendingUp, MessageSquare, BarChart3 } from "lucide-react";
import { CollapsibleSidebar, useCollapsibleSidebar, type NavItem } from "./CollapsibleSidebar";

interface MemberSidebarProps {
  onLogout: () => void;
  children?: React.ReactNode;
}

const memberNavItems: NavItem[] = [
  {
    path: "/dashboard/member",
    label: "Overview",
    icon: BarChart3,
  },
  {
    path: "/dashboard/member/tasks",
    label: "Tasks",
    icon: CheckSquare,
  },
  {
    path: "/dashboard/member/time-tracking",
    label: "Time Tracking",
    icon: Clock,
  },
  {
    path: "/dashboard/member/progress",
    label: "My Progress",
    icon: TrendingUp,
  },
  {
    path: "/dashboard/member/feedback",
    label: "Feedback",
    icon: MessageSquare,
  },
];

export const MemberSidebar = ({ onLogout, children }: MemberSidebarProps) => {
  return (
    <CollapsibleSidebar
      navItems={memberNavItems}
      onLogout={onLogout}
      userAvatar={
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
          <User className="h-5 w-5 text-primary-foreground" />
        </div>
      }
    >
      {children}
    </CollapsibleSidebar>
  );
};

// Re-export the hook for convenience
export const useMemberSidebar = useCollapsibleSidebar;

