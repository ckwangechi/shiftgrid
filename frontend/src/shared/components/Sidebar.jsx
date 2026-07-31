import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CalendarClock,
  Search,
  MapPinned,
  UserCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  PlusCircle,
  Bell,
} from "lucide-react";

import { useLayout } from "../contexts/LayoutContext";
import { useUser } from "../contexts/UserContext";

import useAuth from "../../features/auth/hooks/useAuth";

const seekerNavigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Browse Shifts",
    icon: Search,
    path: "/browse-shifts",
  },
  {
    title: "My Shifts",
    icon: CalendarClock,
    path: "/shifts",
  },
  {
    title: "Locations",
    icon: MapPinned,
    path: "/locations",
  },
  {
    title: "Notifications",
    icon: Bell,
    path: "/notifications",
  },
  {
    title: "Profile",
    icon: UserCircle,
    path: "/profile",
  },
  {
    title: "Preferences",
    icon: Settings,
    path: "/preferences",
  },
];

const creatorNavigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Create Shift",
    icon: PlusCircle,
    path: "/creator",
  },
  {
    title: "Locations",
    icon: MapPinned,
    path: "/locations",
  },
  {
    title: "Profile",
    icon: UserCircle,
    path: "/profile",
  },
  {
    title: "Preferences",
    icon: Settings,
    path: "/preferences",
  },
];

const adminNavigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    title: "Admin Panel",
    icon: Shield,
    path: "/admin",
  },
  {
    title: "Profile",
    icon: UserCircle,
    path: "/profile",
  },
];

const Sidebar = () => {
  const {
    sidebarCollapsed,
    toggleSidebar,
  } = useLayout();
  const { user } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role;
  const items =
    role === "admin"
      ? adminNavigation
      : role === "job_creator"
        ? creatorNavigation
        : seekerNavigation;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.aside
      animate={{
        width: sidebarCollapsed ? 95 : 285,
      }}
      transition={{
        duration: 0.25,
      }}
      className="flex flex-col bg-slate-950 border-r border-slate-800 text-white"
    >
      {/* Header */}

      <div className="h-24 px-6 flex items-center justify-between border-b border-slate-800">

        {!sidebarCollapsed && (

          <div>

            <h1 className="text-3xl font-black tracking-tight">

              <span className="text-blue-500">
                Shift
              </span>

              Grid

            </h1>

            <p className="text-xs text-slate-400 mt-1">

              Workforce Platform

            </p>

          </div>

        )}

        <button
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-xl hover:bg-slate-800 flex items-center justify-center transition"
        >
          {sidebarCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>

      </div>

      {/* Navigation */}

      <div className="flex-1 py-8 px-4">

        <h3
          className={`text-xs uppercase tracking-widest text-slate-500 mb-5 ${
            sidebarCollapsed && "hidden"
          }`}
        >
          Navigation
        </h3>

        <div className="space-y-3">

          {items.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center rounded-2xl transition-all duration-200 ${
                    sidebarCollapsed
                      ? "justify-center h-14"
                      : "px-5 h-14"
                  } ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "hover:bg-slate-900 text-slate-300"
                  }`
                }
              >

                <Icon size={22} />

                {!sidebarCollapsed && (

                  <span className="ml-4 font-medium">

                    {item.title}

                  </span>

                )}

              </NavLink>

            );

          })}

        </div>

      </div>

      {/* User Card */}

      <div className="border-t border-slate-800 p-5">
        <NavLink
          to="/profile"
          className="block hover:bg-slate-900 rounded-2xl transition"
        >
          <UserProfile />
        </NavLink>

        <button
          onClick={handleLogout}
          className={`mt-6 bg-red-600 hover:bg-red-700 rounded-2xl transition h-12 flex items-center ${
            sidebarCollapsed
              ? "justify-center"
              : "px-5"
          } w-full`}
        >

          <LogOut size={18} />

          {!sidebarCollapsed && (

            <span className="ml-3">

              Logout

            </span>

          )}

        </button>

      </div>

    </motion.aside>
  );
};

const UserProfile = () => {
  const { sidebarCollapsed } = useLayout();
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div
        className={`flex items-center ${
          sidebarCollapsed ? "justify-center" : ""
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-slate-700 animate-pulse" />
        {!sidebarCollapsed && (
          <div className="ml-4 space-y-2">
            <div className="h-4 bg-slate-700 rounded w-24 animate-pulse" />
            <div className="h-3 bg-slate-700 rounded w-16 animate-pulse" />
          </div>
        )}
      </div>
    );
  }

  const name = user?.name || "Guest";
  const role = user?.role || "Guest";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`flex items-center ${
        sidebarCollapsed ? "justify-center" : ""
      }`}
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg">
        {initials}
      </div>

      {!sidebarCollapsed && (
        <div className="ml-4">
          <h3 className="font-semibold">
            {name}
          </h3>
          <p className="text-sm text-slate-400">
            {role}
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;