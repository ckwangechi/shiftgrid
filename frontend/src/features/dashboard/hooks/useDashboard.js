import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getWeeklyAnalytics,
  getUpcomingShifts,
  getNotifications,
  getRecommendedShifts,
  getRecentActivity,
} from "../services/dashboardService";

export const useDashboardStats = () =>
  useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000,
  });

export const useWeeklyAnalytics = () =>
  useQuery({
    queryKey: ["weekly-analytics"],
    queryFn: getWeeklyAnalytics,
    staleTime: 5 * 60 * 1000,
  });

export const useUpcomingShifts = (params = {}) =>
  useQuery({
    queryKey: ["upcoming-shifts", params],
    queryFn: () => getUpcomingShifts(params),
    staleTime: 2 * 60 * 1000,
  });

export const useNotifications = () =>
  useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 1 * 60 * 1000,
  });

export const useRecommendedShifts = () =>
  useQuery({
    queryKey: ["recommended-shifts"],
    queryFn: getRecommendedShifts,
    staleTime: 5 * 60 * 1000,
  });

export const useRecentActivity = () =>
  useQuery({
    queryKey: ["recent-activity"],
    queryFn: getRecentActivity,
    staleTime: 2 * 60 * 1000,
  });