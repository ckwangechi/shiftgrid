import api from "../../../shared/services/api";

export const getDashboardStats = () =>
  api.get("/dashboard/stats");

export const getWeeklyAnalytics = () =>
  api.get("/dashboard/weekly-analytics");

export const getUpcomingShifts = (params) =>
  api.get("/dashboard/upcoming-shifts", { params });

export const getNotifications = () =>
  api.get("/dashboard/notifications");

export const getRecommendedShifts = () =>
  api.get("/dashboard/recommended-shifts");

export const getRecentActivity = () =>
  api.get("/dashboard/recent-activity");

export const claimShift = (shiftId) =>
  api.post(`/shifts/${shiftId}/claim`);

export const getDashboardSummary = () =>
  api.get("/dashboard/summary");