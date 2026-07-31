import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getIcon } from "../../../shared/utils/icons";

const NotificationCard = ({ notifications = [], isLoading, error }) => {
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Bell className="text-blue-600" />
            <h2 className="text-xl font-bold dark:text-white">Notifications</h2>
          </div>
        </div>
        <p className="text-red-500 text-center py-6">
          Failed to load notifications
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-24" />
          </div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-14" />
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Bell className="text-blue-600" />
            <h2 className="text-xl font-bold dark:text-white">Notifications</h2>
          </div>
        </div>
        <p className="text-slate-400 text-center py-6">No notifications</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Bell className="text-blue-600" />
          <h2 className="text-xl font-bold dark:text-white">Notifications</h2>
        </div>
        <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
          {notifications.length} New
        </span>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {notifications.map((item) => {
          const Icon = getIcon(item.icon);

          return (
            <div
              key={item.id}
              onClick={() => item.link && navigate(item.link)}
              className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer"
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
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationCard;