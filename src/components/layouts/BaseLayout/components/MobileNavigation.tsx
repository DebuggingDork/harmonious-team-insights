import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import TeamTuneLogo from "@/components/TeamTuneLogo";
import { cn } from "@/lib/utils";
import { MobileNavigationProps } from "../types";
import { useIsActiveRoute } from "../hooks";

/**
 * MobileNavigation Component
 *
 * Mobile sidebar navigation that appears as a Sheet (drawer) on small screens.
 * Displays logo, navigation items, and logout button.
 *
 * @example
 * ```tsx
 * <MobileNavigation
 *   isOpen={isMobileMenuOpen}
 *   onClose={() => setIsMobileMenuOpen(false)}
 *   navItems={navItems}
 *   onLogout={handleLogout}
 * />
 * ```
 */
export const MobileNavigation = ({
  isOpen,
  onClose,
  navItems,
  onLogout,
}: MobileNavigationProps) => {
  const isActive = useIsActiveRoute();

  const handleLogout = async () => {
    await onLogout();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="text-left">
            <Link to="/" onClick={onClose}>
              <TeamTuneLogo />
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 p-6">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              // Handle button-type nav items (if any)
              if (item.isButton && item.onClick) {
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      item.onClick?.();
                      onClose();
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm rounded-lg w-full text-left transition-colors",
                      active
                        ? "font-medium text-foreground bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              }

              // Regular link nav items
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-lg w-full text-left transition-colors",
                    active
                      ? "font-medium text-foreground bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-border p-6">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
