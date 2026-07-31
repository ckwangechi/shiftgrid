import BrowseCard from "./BrowseCard";

const BrowseGrid = ({ shifts = [], isLoading, error, search, filters, view, onClaim, claimingId, onView }) => {
  if (error) {
    return (
      <div id="browse-grid" className="rounded-3xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-8 text-center">
        <p className="text-red-600 dark:text-red-400 font-semibold">
          Failed to load shifts
        </p>
        <p className="text-sm text-red-400 mt-2">
          {error.message || "Please try again later"}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div id="browse-grid" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="flex gap-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24" />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!shifts || shifts.length === 0) {
    return (
      <div id="browse-grid" className="rounded-3xl border border-dashed border-slate-300 p-16 text-center text-slate-400 dark:border-slate-700">
        <p className="text-lg font-semibold">No shifts found</p>
        <p className="text-sm mt-2">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div id="browse-grid" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {shifts.map((shift) => (
        <BrowseCard
          key={shift.id}
          shift={shift}
          onView={onView}
          onClaim={onClaim}
          isClaiming={claimingId === shift.id}
        />
      ))}
    </div>
  );
};

export default BrowseGrid;