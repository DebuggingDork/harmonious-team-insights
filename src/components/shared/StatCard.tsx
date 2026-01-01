import { motion } from "framer-motion";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  gradient?: string;
  iconColor?: string;
  isLoading?: boolean;
  className?: string;
  trend?: {
    value: number;
    label: string;
  };
  index?: number;
}

/**
 * StatCard Component
 *
 * Reusable stats display card with animated entry, gradient background,
 * and optional trend indicator. Used across all dashboards.
 *
 * @example
 * ```tsx
 * <StatCard
 *   label="Total Users"
 *   value={152}
 *   icon={Users}
 *   gradient="from-blue-500/20 to-blue-600/10"
 *   iconColor="text-blue-500"
 *   trend={{ value: 12, label: "vs last month" }}
 * />
 * ```
 */
export const StatCard = ({
  label,
  value,
  icon: Icon,
  gradient = "from-blue-500/20 to-blue-600/10",
  iconColor = "text-blue-500",
  isLoading = false,
  className,
  trend,
  index = 0,
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "group relative bg-gradient-to-br from-card to-card/50",
        "border border-border/50 rounded-2xl p-6 shadow-sm",
        "hover:shadow-lg hover:border-border transition-all duration-300",
        className
      )}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"
           style={{ background: `linear-gradient(to bottom right, var(--primary), var(--primary))` }}
      />

      <div className="relative">
        {/* Header: Label + Icon */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className={cn(
            "p-3 rounded-xl bg-gradient-to-br",
            "group-hover:scale-110 transition-transform duration-300",
            gradient
          )}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <Icon className={cn("h-5 w-5", iconColor)} />
            )}
          </div>
        </div>

        {/* Value */}
        <div className="space-y-1">
          <p className="text-3xl font-bold text-foreground">
            {isLoading ? (
              <span className="inline-block w-20 h-8 bg-muted animate-pulse rounded" />
            ) : (
              value
            )}
          </p>

          {/* Optional Trend Indicator */}
          {trend && !isLoading && (
            <p className={cn(
              "text-xs font-medium",
              trend.value >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * StatCardSkeleton - Loading skeleton for StatCard
 */
export const StatCardSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        <div className="h-12 w-12 bg-muted animate-pulse rounded-xl" />
      </div>
      <div className="h-8 w-16 bg-muted animate-pulse rounded" />
    </div>
  );
};
