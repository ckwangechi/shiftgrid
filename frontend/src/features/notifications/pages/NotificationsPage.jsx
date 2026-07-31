import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

import { useNotifications } from "../../dashboard/hooks/useDashboard";
import { getIcon } from "../../../shared/utils/icons";

import DashboardLayout from "../../../shared/layouts/DashboardLayout";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useNotifications();

  const notifications = data?.data ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-10 text-white shadow-xl">
          <h1 className="text-4xl font-black leading-tight">Notifications</h1>
          <p className="mt-3 text-blue-100 text-lg">
            Stay updated on your shifts, matches and profile.
          </p>
        </section>

        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Bell className="text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              All Notifications
            </h2>
          </div>

          {isLoading && (
            <div className="p-8 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          )}

          {error && (
            <p className="p-8 text-center text-red-500">
              Failed to load notifications
            </p>
          )}

          {!isLoading && !error && notifications.length === 0 && (
            <p className="p-8 text-center text-slate-400">
              No notifications yet
            </p>
          )}

          {!isLoading && !error && notifications.length > 0 && (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {notifications.map((item) => {
                const Icon = getIcon(item.icon);
                return (
                  <div
                    key={item.id}
                    onClick={() => item.link && navigate(item.link)}
                    className={`p-6 transition ${
                      item.link
                        ? "hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                        : ""
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}
                      >
                        <Icon size={22} />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {item.title}
                          </h3>
                          <span className="text-xs text-slate-400">
                            {item.time}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          {item.message}
                        </p>
                        {item.link && (
                          <p className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                            View →
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
