import { Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatarProps } from "../types";

/**
 * UserAvatar Component
 *
 * Renders a user avatar with role-specific styling.
 * Admin users get a special gradient avatar with Shield icon,
 * while other roles get a simple primary-colored avatar with User icon.
 *
 * @example
 * ```tsx
 * <UserAvatar role="admin" size="md" />
 * <UserAvatar role="member" size="sm" />
 * ```
 */
export const UserAvatar = ({ role, size = "md", className }: UserAvatarProps) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const sizeClass = sizes[size];
  const iconSize = iconSizes[size];

  // Admin gets special gradient avatar
  if (role === "admin") {
    return (
      <div className={cn("relative flex items-center justify-center", sizeClass, className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 rounded-full opacity-70 blur-[3px]"></div>
        <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 rounded-full flex items-center justify-center p-[1.5px] h-full w-full">
          <div className="h-full w-full bg-background rounded-full flex items-center justify-center">
            <Shield className={cn(iconSize, "text-orange-500 drop-shadow-[0_0_3px_rgba(251,146,60,0.6)]")} />
          </div>
        </div>
      </div>
    );
  }

  // Other roles get simple primary-colored avatar
  return (
    <div className={cn("bg-primary rounded-full flex items-center justify-center", sizeClass, className)}>
      <User className={cn(iconSize, "text-primary-foreground")} />
    </div>
  );
};
