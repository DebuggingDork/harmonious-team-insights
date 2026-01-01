import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ProjectManagerSidebar } from "./ProjectManagerSidebar";
import { BaseLayout } from "./BaseLayout";

interface ProjectManagerLayoutProps {
  children: ReactNode;
  headerTitle?: string;
  headerDescription?: string;
  headerActions?: ReactNode;
}

/**
 * ProjectManagerLayout Component
 *
 * Layout wrapper for Project Manager dashboard pages.
 * Uses BaseLayout for consistent structure and ProjectManagerSidebar for navigation.
 *
 * @example
 * ```tsx
 * <ProjectManagerLayout headerTitle="Projects" headerDescription="Manage your projects">
 *   <ProjectsList />
 * </ProjectManagerLayout>
 * ```
 */
export const ProjectManagerLayout = ({
  children,
  headerTitle,
  headerDescription,
  headerActions,
}: ProjectManagerLayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <ProjectManagerSidebar onLogout={handleLogout}>
      <BaseLayout
        role="project-manager"
        onLogout={handleLogout}
        headerTitle={headerTitle}
        headerDescription={headerDescription}
        headerActions={headerActions}
      >
        {children}
      </BaseLayout>
    </ProjectManagerSidebar>
  );
};
