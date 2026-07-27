import {
  Plus,
  Search,
  MapPinned,
} from "lucide-react";

const QuickActions = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-200 dark:border-slate-800">

      <h2 className="text-xl font-semibold mb-6 dark:text-white">
        Quick Actions
      </h2>

      <div className="grid gap-4 md:grid-cols-3">

        <button className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white py-4 transition">
          <Search size={20} />
          Browse Shifts
        </button>

        <button className="flex items-center justify-center gap-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white py-4 transition">
          <MapPinned size={20} />
          Locations
        </button>

        <button className="flex items-center justify-center gap-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white py-4 transition">
          <Plus size={20} />
          Update Profile
        </button>

      </div>

    </div>
  );
};

export default QuickActions;