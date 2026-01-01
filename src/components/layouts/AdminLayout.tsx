import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AdminSidebar } from "./AdminSidebar";
import { BaseLayout } from "./BaseLayout";

interface AdminLayoutProps {
  children: ReactNode;
  headerTitle?: string;
  headerDescription?: string;
  headerActions?: ReactNode;
}

/**
 * AdminLayout Component
 *
 * Layout wrapper for Admin dashboard pages.
 * Uses BaseLayout for consistent structure and AdminSidebar for navigation.
 *
 * @example
 * ```tsx
 * <AdminLayout headerTitle="Users" headerDescription="Manage system users">
 *   <UsersList />
 * </AdminLayout>
 * ```
 */
export const AdminLayout = ({
  children,
  headerTitle,
  headerDescription,
  headerActions,
}: AdminLayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <AdminSidebar onLogout={handleLogout}>
      <BaseLayout
        role="admin"
        onLogout={handleLogout}
        headerTitle={headerTitle}
        headerDescription={headerDescription}
        headerActions={headerActions}
      >
        {children}
      </BaseLayout>
    </AdminSidebar>
  );
};
