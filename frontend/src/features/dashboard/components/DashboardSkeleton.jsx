import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 p-8">
      <section className="rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-4 flex-1">
            <Skeleton height={14} width={80} />
            <Skeleton height={40} width={200} />
            <Skeleton height={16} width={320} />
            <div className="flex gap-4 mt-6">
              <Skeleton height={48} width={120} />
              <Skeleton height={48} width={120} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Skeleton height={80} />
            <Skeleton height={80} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
          >
            <Skeleton height={14} width={100} />
            <Skeleton height={36} width={80} className="mt-3" />
            <Skeleton height={14} width={60} className="mt-4" />
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <Skeleton height={24} width={160} />
          <Skeleton height={48} width="100%" className="mt-4" />
          <Skeleton height={60} width="100%" className="mt-4" />
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
            <Skeleton height={20} width={100} />
            <Skeleton height={80} width="100%" className="mt-4" />
          </div>
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
            <Skeleton height={20} width={100} />
            <Skeleton height={80} width="100%" className="mt-4" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardSkeleton;