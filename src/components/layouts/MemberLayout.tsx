import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MemberSidebar } from "./MemberSidebar";
import { BaseLayout } from "./BaseLayout";

interface MemberLayoutProps {
  children: ReactNode;
  headerTitle?: string;
  headerDescription?: string;
  headerActions?: ReactNode;
}

/**
 * MemberLayout Component
 *
 * Layout wrapper for Member dashboard pages.
 * Uses BaseLayout for consistent structure and MemberSidebar for navigation.
 *
 * @example
 * ```tsx
 * <MemberLayout headerTitle="My Tasks" headerDescription="View and manage your tasks">
 *   <TasksList />
 * </MemberLayout>
 * ```
 */
export const MemberLayout = ({
  children,
  headerTitle,
  headerDescription,
  headerActions,
}: MemberLayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <MemberSidebar onLogout={handleLogout}>
      <BaseLayout
        role="member"
        onLogout={handleLogout}
        headerTitle={headerTitle}
        headerDescription={headerDescription}
        headerActions={headerActions}
      >
        {children}
      </BaseLayout>
    </MemberSidebar>
  );
};
