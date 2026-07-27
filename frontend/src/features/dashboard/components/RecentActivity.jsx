const defaultColorMap = {
  CheckCircle2: "bg-green-500",
  MapPin: "bg-blue-500",
  ShieldCheck: "bg-purple-500",
  CalendarClock: "bg-orange-500",
};

const RecentActivity = ({ activities = [], isLoading, error }) => {
  if (error) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Recent Activity
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your latest ShiftGrid actions
            </p>
          </div>
        </div>
        <p className="text-red-500 text-center py-6">
          Failed to load activity
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-36" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-44 mt-2" />
          </div>
        </div>
        <div className="p-6 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="flex-1 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-sm">
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Recent Activity
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your latest ShiftGrid actions
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

          <div className="space-y-8">
            {activities.map((activity) => {
              const Icon = activity.icon;
              const color = activity.color ?? defaultColorMap[Icon?.name] ?? "bg-slate-500";

              return (
                <div
                  key={activity.id}
                  className="relative flex gap-5 group"
                >
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg hover:border-blue-500 transition">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {activity.title}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {activity.time}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-6">
                      {activity.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;