import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { TeamLeadSidebar } from "./TeamLeadSidebar";
import { BaseLayout } from "./BaseLayout";

interface TeamLeadLayoutProps {
  children: ReactNode;
  headerTitle?: string;
  headerDescription?: string;
  headerActions?: ReactNode;
}

/**
 * TeamLeadLayout Component
 *
 * Layout wrapper for Team Lead dashboard pages.
 * Uses BaseLayout for consistent structure and TeamLeadSidebar for navigation.
 *
 * @example
 * ```tsx
 * <TeamLeadLayout headerTitle="Team" headerDescription="Manage your team">
 *   <TeamOverview />
 * </TeamLeadLayout>
 * ```
 */
export const TeamLeadLayout = ({
  children,
  headerTitle,
  headerDescription,
  headerActions,
}: TeamLeadLayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <TeamLeadSidebar onLogout={handleLogout}>
      <BaseLayout
        role="team-lead"
        onLogout={handleLogout}
        headerTitle={headerTitle}
        headerDescription={headerDescription}
        headerActions={headerActions}
      >
        {children}
      </BaseLayout>
    </TeamLeadSidebar>
  );
};
