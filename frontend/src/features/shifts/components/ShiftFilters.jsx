import {
  MapPin,
  Briefcase,
  Clock3,
  CalendarDays,
  RotateCcw,
} from "lucide-react";

const ShiftFilters = ({ filters, setFilters }) => {
  const updateFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      skill: "",
      status: "",
      time: "",
      date: "",
    });
  };

  return (
    <aside className="sticky top-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-6">

        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Filters
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Narrow available shifts
          </p>
        </div>

        <button
          onClick={clearFilters}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <RotateCcw size={18} />
        </button>

      </div>

      <div className="space-y-6 p-6">

        {/* Location */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <MapPin size={16} />
            Location
          </label>

          <select
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white"
          >
            <option value="">All Locations</option>
            <option value="Nairobi Convention Centre">
              Nairobi Convention Centre
            </option>
            <option value="KICC">KICC</option>
            <option value="Westlands">Westlands</option>
            <option value="Kasarani Stadium">Kasarani Stadium</option>
          </select>

        </div>

        {/* Skill */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Briefcase size={16} />
            Skill
          </label>

          <select
            value={filters.skill}
            onChange={(e) => updateFilter("skill", e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white"
          >
            <option value="">All Skills</option>
            <option value="Security">Security</option>
            <option value="Customer Service">Customer Service</option>
            <option value="First Aid">First Aid</option>
            <option value="Logistics">Logistics</option>
          </select>

        </div>

        {/* Status */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Briefcase size={16} />
            Status
          </label>

          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Almost Full">Almost Full</option>
          </select>

        </div>

        {/* Time */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Clock3 size={16} />
            Shift Time
          </label>

          <select
            value={filters.time}
            onChange={(e) => updateFilter("time", e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white"
          >
            <option value="">Any Time</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>

        </div>

        {/* Date */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <CalendarDays size={16} />
            Date
          </label>

          <input
            type="date"
            value={filters.date}
            onChange={(e) => updateFilter("date", e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white"
          />

        </div>

      </div>

    </aside>
  );
};

export default ShiftFilters;