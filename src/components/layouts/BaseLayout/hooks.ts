import { useLocation } from "react-router-dom";

/**
 * Extract user name from email for display
 * Used when user.full_name is not available
 */
export const getUserNameFromEmail = (email: string): string => {
  if (!email) return "User";

  const namePart = email.split('@')[0];
  const nameParts = namePart.split(/[._-]/).map(part =>
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  );

  return nameParts.join(' ');
};

/**
 * Hook to check if a route is active
 * Handles exact matching for root dashboard paths
 */
export const useIsActiveRoute = () => {
  const location = useLocation();

  return (path: string) => {
    // Handle root dashboard paths specially - exact match required
    const rootPaths = [
      "/dashboard/admin",
      "/dashboard/member",
      "/dashboard/team-lead",
      "/dashboard/project-manager"
    ];

    if (rootPaths.includes(path)) {
      return location.pathname === path;
    }

    // For other paths, check if current path starts with it
    return location.pathname.startsWith(path);
  };
};
