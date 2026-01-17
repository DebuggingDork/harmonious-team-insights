import { Bell } from "lucide-react";
import TeamTuneLogo from "@/components/TeamTuneLogo";
import { ThemeSelector } from "@/components/ThemeSelector";
import { LayoutHeaderProps } from "../types";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

/**
 * LayoutHeader Component
 *
 * Sticky header that appears at the top of all layouts.
 * Contains mobile menu trigger, theme toggle, and notifications.
 *
 * @example
 * ```tsx
 * <LayoutHeader
 *   onNotificationClick={() => setNotificationPanelOpen(true)}
 *   onMobileMenuClick={() => setMobileMenuOpen(true)}
 * />
 * ```
 */
export const LayoutHeader = ({
  onNotificationClick,
  onMobileMenuClick,
}: LayoutHeaderProps) => {
  const { unreadCount, unreadByPriority } = useNotificationContext();

  // Determine badge color based on priority
  const hasUrgent = unreadByPriority.urgent > 0;
  const hasHigh = unreadByPriority.high > 0;

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border/50 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Mobile Logo/Menu Trigger */}
        <div className="flex items-center gap-4">
          <div
            className="lg:hidden cursor-pointer"
            onClick={onMobileMenuClick}
          >
            <TeamTuneLogo showText={false} />
          </div>
        </div>

        {/* Right Section: Theme Toggle, Notifications */}
        <div className="flex items-center gap-4">

          {/* Theme Selector */}
          <ThemeSelector />

          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span
                className={cn(
                  "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-medium rounded-full px-1",
                  hasUrgent
                    ? "bg-red-500 text-white animate-pulse"
                    : hasHigh
                    ? "bg-orange-500 text-white"
                    : "bg-destructive text-destructive-foreground"
                )}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
