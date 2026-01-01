// Main component
export { BaseLayout } from "./BaseLayout";

// Types
export type {
  UserRole,
  NavItem,
  BaseLayoutProps,
  LayoutHeaderProps,
  MobileNavigationProps,
  LayoutPageContentProps,
  UserAvatarProps,
} from "./types";

// Utilities and hooks
export { getUserNameFromEmail, useIsActiveRoute } from "./hooks";

// Configuration
export {
  navigationConfig,
  getNavItemsForRole,
  getProfileRouteForRole,
  getRoleDisplayName,
} from "./config";

// Individual components (for custom usage if needed)
export {
  UserAvatar,
  LayoutPageContent,
  MobileNavigation,
  LayoutHeader,
} from "./components";
