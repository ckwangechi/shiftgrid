import {
  MapPin,
  Clock3,
  CalendarDays,
  Banknote,
  Building2,
  Bookmark,
  ChevronRight,
  Hand,
} from "lucide-react";

const statusColors = {
  Open: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  Claimed: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
};

const BrowseCard = ({ shift, onView, isClaiming }) => {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between p-6">
        <div className="flex gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <Building2 size={30} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {shift.title}
            </h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              {shift.company}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold">
          {shift.status ? (
            <span
              className={
                statusColors[shift.status] ??
                "bg-slate-100 text-slate-700"
              }
            >
              {shift.status}
            </span>
          ) : null}
        </span>

        <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bookmark size={20} />
        </button>
      </div>

      <div className="mt-6 space-y-4 px-6">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <MapPin size={18} />
          {shift.location}
        </div>

        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <CalendarDays size={18} />
          {shift.date}
        </div>

        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <Clock3 size={18} />
          {shift.time}
        </div>

        {shift.pay && (
          <div className="flex items-center gap-3 font-semibold text-emerald-600">
            <Banknote size={18} />
            KES {shift.pay}
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 p-6">
        <button
          onClick={() => onView(shift)}
          className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          View Details
          <ChevronRight size={18} />
        </button>

        <button
          onClick={() => onView(shift)}
          disabled={shift.claimed}
          className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-600 disabled:hover:text-white disabled:hover:shadow-none disabled:active:scale-100"
        >
          <Hand size={18} />
          {shift.claimed ? "Claimed" : isClaiming ? "Claiming..." : "Claim"}
        </button>
      </div>
    </article>
  );
};

export default BrowseCard;
