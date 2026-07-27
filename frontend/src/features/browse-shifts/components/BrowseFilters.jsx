import { RotateCcw, MapPin, BriefcaseBusiness, Clock3, CalendarDays, DollarSign, Star } from "lucide-react";

const BrowseFilters = ({ filters, setFilters }) => {

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      category: "",
      schedule: "",
      pay: "",
      rating: "",
      date: "",
    });
  };

  return (
    <aside className="sticky top-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">

      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Filters
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Refine your search
          </p>
        </div>

        <button
          onClick={clearFilters}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <RotateCcw size={18}/>
        </button>
      </div>

      <div className="space-y-6 p-6">

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <MapPin size={16}/> Location
          </label>

          <select
            value={filters.location}
            onChange={(e)=>updateFilter("location",e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white"
          >
            <option value="">All Locations</option>
            <option>Nairobi CBD</option>
            <option>Westlands</option>
            <option>Karen</option>
            <option>Kasarani</option>
          </select>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <BriefcaseBusiness size={16}/> Category
          </label>

          <select
            value={filters.category}
            onChange={(e)=>updateFilter("category",e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white"
          >
            <option value="">All Categories</option>
            <option>Security</option>
            <option>Registration</option>
            <option>Hospitality</option>
            <option>Logistics</option>
            <option>Cleaning</option>
            <option>Customer Service</option>
          </select>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Clock3 size={16}/> Schedule
          </label>

          <select
            value={filters.schedule}
            onChange={(e)=>updateFilter("schedule",e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white"
          >
            <option value="">Any Time</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
            <option>Night</option>
          </select>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <DollarSign size={16}/> Pay
          </label>

          <select
            value={filters.pay}
            onChange={(e)=>updateFilter("pay",e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white"
          >
            <option value="">Any Pay</option>
            <option>Below KES 1,000</option>
            <option>KES 1,000 - 2,000</option>
            <option>KES 2,000 - 3,000</option>
            <option>Above KES 3,000</option>
          </select>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Star size={16}/> Employer Rating
          </label>

          <select
            value={filters.rating}
            onChange={(e)=>updateFilter("rating",e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white"
          >
            <option value="">Any Rating</option>
            <option>5 Stars</option>
            <option>4+ Stars</option>
            <option>3+ Stars</option>
          </select>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <CalendarDays size={16}/> Date
          </label>

          <input
            type="date"
            value={filters.date}
            onChange={(e)=>updateFilter("date",e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white"
          />
        </div>

      </div>

    </aside>
  );
};

export default BrowseFilters;