import { ShieldCheck } from "lucide-react";
import { ArrowRight } from "lucide-react";

const RecommendedShifts = ({ shifts = [], isLoading, error, onClaim }) => {
  if (error) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recommended</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Based on your skills
            </p>
          </div>
          <ShieldCheck className="text-blue-600" />
        </div>
        <p className="text-red-500 text-center py-6">
          Failed to load recommendations
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-32" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-40 mt-2" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="p-5 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!shifts || shifts.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Recommended
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Based on your skills
          </p>
        </div>
        <ShieldCheck className="text-blue-600" />
      </div>

      <div className="p-5 space-y-4">
        {shifts.map((shift) => (
          <div
            key={shift.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg hover:border-blue-500 transition duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {shift.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {shift.location && (
                    <>
                      <span>{shift.location}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {shift.time && (
                    <>
                      <span>{shift.time}</span>
                    </>
                  )}
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${shift.color}`}
              >
                {shift.match}
              </span>
            </div>

            <button
              onClick={() => onClaim?.(shift.id)}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/30 text-white py-2.5 flex items-center justify-center gap-2 transition"
            >
              Claim Shift
              <ArrowRight size={17} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedShifts;