import { TrendingUp } from "lucide-react";

const StatCard = ({ stat }) => {
  if (!stat) return null;

  const { title, value, change, icon: Icon, color } = stat;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`}
      />

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <h2 className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
              {value}
            </h2>
          </div>

          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center text-white shadow-lg`}
          >
            <Icon size={28} />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <TrendingUp size={18} />
            {change}
          </div>
          <span className="text-sm text-slate-400">This week</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;