import {
  Bell,
  Search,
  Sun,
  Moon,
  Menu,
  ChevronDown,
} from "lucide-react";

import { useLayout } from "../contexts/LayoutContext";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const {
    darkMode,
    toggleTheme,
    openMobileSidebar,
  } = useLayout();

  const { user, loading } = useUser();

  const navigate = useNavigate();

  const name = user?.name || "Guest";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">

      <div className="h-20 px-8 flex items-center justify-between">

        {/* LEFT */}

        <div className="flex items-center gap-5">

          <button
            onClick={openMobileSidebar}
            className="md:hidden w-11 h-11 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
          >
            <Menu size={22} />
          </button>

          <div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard
            </h1>

            <p className="text-sm text-slate-500">
              Welcome back to ShiftGrid
            </p>

          </div>

        </div>

        {/* CENTER */}

        <div className="hidden lg:flex flex-1 justify-center">

          <div className="relative w-full max-w-xl">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search shifts, locations..."
              className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4">

          {/* Theme */}

          <button
            onClick={toggleTheme}
            className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center"
          >
            {darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* Notifications */}

          <button className="relative w-11 h-11 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center">

            <Bell size={20} />

            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500"></span>

          </button>

          {/* Profile */}

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition">

            {loading ? (
              <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                {initials}
              </div>
            )}

            <div className="hidden lg:block text-left">

              <h3 className="font-semibold text-slate-900 dark:text-white">
                {loading ? "..." : name}
              </h3>

              <p className="text-xs text-slate-500">
                {loading ? "" : (user?.role || "Guest")}
              </p>

            </div>

            <ChevronDown
              size={18}
              className="hidden lg:block text-slate-500"
            />

          </button>

        </div>

      </div>

    </header>
  );
};

export default Topbar;