import DashboardLayout from "../../../shared/layouts/DashboardLayout";

import { useDashboardStats, useWeeklyAnalytics, useUpcomingShifts, useNotifications, useRecommendedShifts, useRecentActivity } from "../hooks/useDashboard";
import { useUser } from "../../../shared/contexts/UserContext";

import StatsGrid from "../components/StatsGrid";
import WeeklyAnalytics from "../components/WeeklyAnalytics";
import UpcomingShifts from "../components/UpcomingShifts";
import RecommendedShifts from "../components/RecommendedShifts";
import NotificationCard from "../components/NotificationCard";
import RecentActivity from "../components/RecentActivity";
import WelcomeCard from "../components/WelcomeCard";

import DashboardSkeleton from "../components/DashboardSkeleton";
import { motion } from "framer-motion";

const DashboardPage = () => {
  const { user } = useUser();
  const userName = user?.name;

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useWeeklyAnalytics();

  const {
    data: upcomingData,
    isLoading: upcomingLoading,
    error: upcomingError,
  } = useUpcomingShifts();

  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    error: notificationsError,
  } = useNotifications();

  const {
    data: recommendedData,
    isLoading: recommendedLoading,
    error: recommendedError,
  } = useRecommendedShifts();

  const {
    data: activityData,
    isLoading: activityLoading,
    error: activityError,
  } = useRecentActivity();

  const isLoading =
    statsLoading || analyticsLoading || upcomingLoading || notificationsLoading || recommendedLoading || activityLoading;

  if (isLoading && !statsData) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <WelcomeCard userName={userName} />

        <StatsGrid
          stats={statsData?.data ?? []}
          isLoading={statsLoading}
          error={statsError}
        />

        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8 space-y-6">
            <WeeklyAnalytics
              data={analyticsData?.data}
              isLoading={analyticsLoading}
              error={analyticsError}
            />

            <UpcomingShifts
              shifts={upcomingData?.data ?? []}
              isLoading={upcomingLoading}
              error={upcomingError}
            />

            <RecentActivity
              activities={activityData?.data ?? []}
              isLoading={activityLoading}
              error={activityError}
            />
          </div>

          <div className="col-span-12 xl:col-span-4 space-y-6">
            <NotificationCard
              notifications={notificationsData?.data ?? []}
              isLoading={notificationsLoading}
              error={notificationsError}
            />

            <RecommendedShifts
              shifts={recommendedData?.data ?? []}
              isLoading={recommendedLoading}
              error={recommendedError}
            />
          </div>
        </section>

        <button
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl hover:scale-110 hover:rotate-90 transition-all duration-300 flex items-center justify-center"
          aria-label="Add new shift"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={30}
            height={30}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </motion.div>
    </DashboardLayout>
  );
};

export default DashboardPage;