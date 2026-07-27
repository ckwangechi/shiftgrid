import { useMyShiftsStats } from "../hooks/useShifts";
import {
  Briefcase,
  CheckCircle2,
  Clock3,
  MapPin,
  TrendingUp,
} from "lucide-react";

const ShiftStats = () => {
  const { data: statsData, isLoading, error } = useMyShiftsStats();

  if (error) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="rounded-3xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold">
            Failed to load stats
          </p>
        </div>
      </section>
    );
  }

  if (isLoading || !statsData) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 mb-3" />
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
          </div>
        ))}
      </section>
    );
  }

  const { openShifts, myShifts, completed, locations } = statsData.data ?? {};

  const stats = [
    {
      id: 1,
      title: "Open Shifts",
      value: openShifts ?? 0,
      trend: "+12%",
      icon: Briefcase,
      color: "from-blue-600 to-cyan-500",
    },
    {
      id: 2,
      title: "My Shifts",
      value: myShifts ?? 0,
      trend: "+2",
      icon: Clock3,
      color: "from-violet-600 to-indigo-500",
    },
    {
      id: 3,
      title: "Completed",
      value: completed ?? 0,
      trend: "+8%",
      icon: CheckCircle2,
      color: "from-emerald-600 to-green-500",
    },
    {
      id: 4,
      title: "Locations",
      value: locations ?? 0,
      trend: "Live",
      icon: MapPin,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.title}
                </p>
                <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
                  {item.value}
                </h2>
                <div className="mt-4 flex items-center gap-2 text-green-600 font-medium">
                  <TrendingUp size={16} />
                  {item.trend}
                </div>
              </div>
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white shadow-lg`}
              >
                <Icon size={30} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ShiftStats;