import { Grid2x2, Rows3 } from "lucide-react";

const ViewToggle = ({ view, setView }) => {
  return (
    <div className="flex rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden">

      <button
        onClick={() => setView("grid")}
        className={`w-12 h-12 flex items-center justify-center transition

        ${
          view === "grid"
            ? "bg-blue-600 text-white"
            : "bg-white dark:bg-slate-900"
        }`}
      >
        <Grid2x2 size={18} />
      </button>

      <button
        onClick={() => setView("list")}
        className={`w-12 h-12 flex items-center justify-center transition

        ${
          view === "list"
            ? "bg-blue-600 text-white"
            : "bg-white dark:bg-slate-900"
        }`}
      >
        <Rows3 size={18} />
      </button>

    </div>
  );
};

export default ViewToggle;