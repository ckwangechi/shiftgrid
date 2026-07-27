import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-10 flex flex-col lg:flex-row items-center justify-between gap-6">

      <div className="text-sm text-slate-500 dark:text-slate-400">
        Page{" "}
        <span className="font-semibold text-slate-900 dark:text-white">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-900 dark:text-white">
          {totalPages}
        </span>
      </div>

      <div className="flex items-center gap-2">

        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ChevronsLeft className="mx-auto" size={18} />
        </button>

        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ChevronLeft className="mx-auto" size={18} />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl transition font-medium ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ChevronRight className="mx-auto" size={18} />
        </button>

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ChevronsRight className="mx-auto" size={18} />
        </button>

      </div>

    </div>
  );
};

export default Pagination;