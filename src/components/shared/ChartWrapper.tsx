import { ReactNode } from "react";
import { type LucideIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChartWrapperProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  headerActions?: ReactNode;
}

/**
 * ChartWrapper Component
 *
 * Consistent wrapper for all chart components across dashboards.
 * Provides title, icon, loading state, and optional actions.
 *
 * @example
 * ```tsx
 * <ChartWrapper
 *   title="Performance Trends"
 *   description="Last 30 days"
 *   icon={TrendingUp}
 *   isLoading={isLoading}
 *   headerActions={<Button size="sm">Export</Button>}
 * >
 *   <LineChart data={data}>...</LineChart>
 * </ChartWrapper>
 * ```
 */
export const ChartWrapper = ({
  title,
  description,
  icon: Icon,
  children,
  isLoading = false,
  className,
  headerActions,
}: ChartWrapperProps) => {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl p-6",
        "shadow-sm hover:shadow-md transition-shadow duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {headerActions && !isLoading && (
          <div>{headerActions}</div>
        )}
      </div>

      {/* Chart Content */}
      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

/**
 * ChartWrapperSkeleton - Loading skeleton
 */
export const ChartWrapperSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-muted animate-pulse rounded-lg" />
          <div>
            <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
      <div className="h-64 bg-muted animate-pulse rounded" />
    </div>
  );
};
