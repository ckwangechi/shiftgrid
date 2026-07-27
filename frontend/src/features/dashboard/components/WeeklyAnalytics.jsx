import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const WeeklyAnalytics = ({ data, isLoading, error }) => {
  if (error) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Weekly Activity
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Volunteer shift participation this week
            </p>
          </div>
        </div>
        <p className="text-red-500 text-center py-8">
          Failed to load analytics
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-40" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48 mt-2" />
          </div>
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-28" />
        </div>
        <div className="grid grid-cols-3 gap-5 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 mb-2" />
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-16" />
            </div>
          ))}
        </div>
        <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
    );
  }

  if (!data) return null;

  const { totalShifts, completionRate, avgPerDay, chartData } = data;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-sm p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Weekly Activity
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Volunteer shift participation this week
          </p>
        </div>

        <select className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        <div>
          <p className="text-sm text-slate-500">Total Shifts</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            {totalShifts ?? "——"}
          </h3>
        </div>

        <div>
          <p className="text-sm text-slate-500">Completion</p>
          <h3 className="text-3xl font-bold text-green-600">
            {completionRate ?? "——"}
          </h3>
        </div>

        <div>
          <p className="text-sm text-slate-500">Avg / Day</p>
          <h3 className="text-3xl font-bold text-blue-600">
            {avgPerDay ?? "——"}
          </h3>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData ?? []}>
            <defs>
              <linearGradient id="shiftGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="shifts"
              stroke="#2563EB"
              strokeWidth={4}
              fill="url(#shiftGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyAnalytics;