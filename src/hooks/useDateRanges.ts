import { useMemo } from "react";

export interface DateRange {
  period_start: string;
  period_end: string;
  start_date: string;
  end_date: string;
}

/**
 * useDateRanges Hook
 *
 * Centralized date range calculation. Eliminates duplication found in:
 * - MemberDashboard.tsx (lines 46-57)
 * - TeamLeadDashboard.tsx (lines 74-85)
 *
 * @param days - Number of days to go back from today (default: 42 = 6 weeks)
 * @returns DateRange object with formatted dates
 *
 * @example
 * ```tsx
 * const dateRanges = useDateRanges(42); // Last 6 weeks
 * const lastMonth = useDateRanges(30);  // Last 30 days
 * const lastWeek = useDateRanges(7);    // Last week
 * ```
 */
export const useDateRanges = (days: number = 42): DateRange => {
  return useMemo(() => {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0];
    };

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    return {
      period_start: start,
      period_end: end,
      start_date: start,
      end_date: end,
    };
  }, [days]);
};

/**
 * useWeekRanges Hook
 *
 * Get date ranges for the last N weeks
 *
 * @param weeks - Number of weeks (default: 6)
 * @returns DateRange object
 */
export const useWeekRanges = (weeks: number = 6): DateRange => {
  return useDateRanges(weeks * 7);
};

/**
 * useMonthRange Hook
 *
 * Get date range for the last month (30 days)
 *
 * @returns DateRange object
 */
export const useMonthRange = (): DateRange => {
  return useDateRanges(30);
};
