import {
  Briefcase,
  CheckCircle2,
  Clock3,
  MapPin,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    id: 1,
    title: "Open Shifts",
    value: 128,
    trend: "+12%",
    icon: Briefcase,
    color: "from-blue-600 to-cyan-500",
  },
  {
    id: 2,
    title: "My Shifts",
    value: 14,
    trend: "+2",
    icon: Clock3,
    color: "from-violet-600 to-indigo-500",
  },
  {
    id: 3,
    title: "Completed",
    value: 86,
    trend: "+8%",
    icon: CheckCircle2,
    color: "from-emerald-600 to-green-500",
  },
  {
    id: 4,
    title: "Locations",
    value: 18,
    trend: "Live",
    icon: MapPin,
    color: "from-orange-500 to-red-500",
  },
];

const ShiftStats = () => {
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