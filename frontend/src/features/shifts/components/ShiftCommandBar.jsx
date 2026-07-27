import {
  CalendarDays,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";

import ViewToggle from "./ViewToggle";

const ShiftCommandBar = ({
  search,
  setSearch,
  sortBy,
  setSortBy,
  view,
  setView,
}) => {
  return (
    <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-8 border-b border-slate-200 dark:border-slate-800">

        <div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Shift Explorer
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Find, filter and claim available event shifts.
          </p>

        </div>

        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800">

          <CalendarDays
            size={18}
            className="text-blue-600"
          />

          <span className="font-medium text-slate-700 dark:text-slate-300">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>

        </div>

      </div>

      {/* Toolbar */}

      <div className="p-6 flex flex-wrap items-center gap-4">

        {/* Search */}

        <div className="relative flex-1 min-w-[280px]">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shifts..."
            className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Sort */}

        <div className="relative">

          <ArrowUpDown
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-white pl-10 pr-10 outline-none cursor-pointer"
          >
            <option value="match">Best Match</option>
            <option value="slots">Most Slots</option>
            <option value="date">Date</option>
          </select>

        </div>

        {/* View Toggle */}

        <ViewToggle
          view={view}
          setView={setView}
        />

        {/* Filter Button */}

        <button className="flex items-center gap-2 px-5 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition">

          <SlidersHorizontal size={18} />

          Filters

        </button>

        {/* Refresh */}

        <button
          onClick={() => window.location.reload()}
          className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >

          <RefreshCw size={18} />

        </button>

      </div>

    </section>
  );
};

export default ShiftCommandBar;