import { Search, MapPin, SlidersHorizontal, RefreshCw, LayoutGrid, List } from "lucide-react";

const BrowseToolbar = ({ search, setSearch, view, setView }) => {
  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">

      <div className="flex flex-col xl:flex-row gap-4 xl:items-center">

        {/* Search */}

        <div className="relative flex-1">

          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>

          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search jobs, companies, skills..."
            className="w-full h-12 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Location */}

        <div className="relative min-w-[220px]">

          <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>

          <input
            value={search}
            onChange={(e) => {}}
            placeholder="Any location"
            className="w-full h-12 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Filters */}

        <button className="h-12 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition">

          <SlidersHorizontal size={18}/>
          Filters

        </button>

        {/* Refresh */}

        <button className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition">

          <RefreshCw size={18}/>

        </button>

        {/* View Toggle */}

        <div className="flex rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">

          <button
            onClick={()=>setView("grid")}
            className={`w-12 h-12 flex items-center justify-center ${view==="grid"?"bg-blue-600 text-white":"bg-white dark:bg-slate-800 text-slate-700 dark:text-white"}`}
          >
            <LayoutGrid size={18}/>
          </button>

          <button
            onClick={()=>setView("list")}
            className={`w-12 h-12 flex items-center justify-center ${view==="list"?"bg-blue-600 text-white":"bg-white dark:bg-slate-800 text-slate-700 dark:text-white"}`}
          >
            <List size={18}/>
          </button>

        </div>

      </div>

    </section>
  );
};

export default BrowseToolbar;