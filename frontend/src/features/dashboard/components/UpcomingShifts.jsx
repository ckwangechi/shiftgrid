import { Search, Filter, Eye } from "lucide-react";

const statusBadge = {
  Claimed:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  Pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  Completed:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
};

const UpcomingShifts = ({ shifts = [], isLoading, error, onClaim }) => {
  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold dark:text-white">Upcoming Shifts</h2>
        </div>
        <p className="text-red-500 text-center py-8">
          Failed to load upcoming shifts
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-40" />
        </div>
        <div className="p-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!shifts || shifts.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold dark:text-white">Upcoming Shifts</h2>
          <p className="text-sm text-slate-500 mt-1">
            No upcoming shifts assigned
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Upcoming Shifts</h2>
          <p className="text-sm text-slate-500 mt-1">
            Your assigned event schedule
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-slate-400" />
            <input
              placeholder="Search..."
              className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-left">
              <th className="px-6 py-4 text-sm text-slate-500">Role</th>
              <th className="px-6 py-4 text-sm text-slate-500">Location</th>
              <th className="px-6 py-4 text-sm text-slate-500">Date</th>
              <th className="px-6 py-4 text-sm text-slate-500">Time</th>
              <th className="px-6 py-4 text-sm text-slate-500">Status</th>
              <th className="px-6 py-4 text-sm text-slate-500">Action</th>
            </tr>
          </thead>

          <tbody>
            {shifts.map((shift) => (
              <tr
                key={shift.id}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
              >
                <td className="px-6 py-5 font-semibold dark:text-white">
                  {shift.role}
                </td>
                <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
                  {shift.location}
                </td>
                <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
                  {shift.date}
                </td>
                <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
                  {shift.time}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge[shift.status] ?? "bg-slate-100 text-slate-700"}`}
                  >
                    {shift.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <button
                    onClick={() => onClaim?.(shift.id)}
                    className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing {shifts.length} shift{shifts.length !== 1 ? "s" : ""}
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl border border-slate-200 text-white dark:border-slate-700 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/30">
            Previous
          </button>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/30 text-white">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingShifts;