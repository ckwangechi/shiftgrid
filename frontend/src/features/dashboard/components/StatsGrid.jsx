import StatCard from "./StatCard";

const StatsGrid = ({ stats = [], isLoading, error }) => {
  if (error) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="rounded-3xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold">
            Failed to load stats
          </p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 mb-3" />
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
          </div>
        ))}
      </section>
    );
  }

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => (
        <StatCard key={item.id} stat={item} />
      ))}
    </section>
  );
};

export default StatsGrid;