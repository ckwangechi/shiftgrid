import { useNavigate } from "react-router-dom";
import { Users, CalendarClock, Briefcase, MapPinned, ShieldCheck, ArrowRight, Building2 } from "lucide-react";
import { useAdminStats, useAdminShifts, useAdminLocations, useAdminUsers } from "../hooks/useAdmin";
import { useUser } from "../../../shared/contexts/UserContext";
import DashboardLayout from "../../../shared/layouts/DashboardLayout";

const statCards = (stats) => [
  {
    id: 1,
    title: "Total Users",
    value: stats.totalUsers ?? 0,
    change: `${stats.volunteers ?? 0} volunteers`,
    icon: "Users",
    color: "from-blue-600 to-cyan-500",
  },
  {
    id: 2,
    title: "Total Shifts",
    value: stats.totalShifts ?? 0,
    change: "Platform wide",
    icon: "CalendarClock",
    color: "from-violet-600 to-indigo-500",
  },
  {
    id: 3,
    title: "Open Shifts",
    value: stats.openShifts ?? 0,
    change: "Awaiting claims",
    icon: "Briefcase",
    color: "from-emerald-600 to-green-500",
  },
  {
    id: 4,
    title: "Claimed Shifts",
    value: stats.claimedShifts ?? 0,
    change: "Filled by volunteers",
    icon: "MapPin",
    color: "from-orange-500 to-red-500",
  },
];

const statusColors = {
  Open: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  Claimed: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  Closed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

const roleColors = {
  admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  job_creator: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  volunteer: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const { data: statsData, isLoading } = useAdminStats();
  const { data: shiftsData } = useAdminShifts();
  const { data: usersData } = useAdminUsers();
  const { data: locationsData } = useAdminLocations();

  const stats = statsData?.data ?? {};
  const shifts = shiftsData?.data ?? [];
  const users = usersData?.data ?? [];
  const locations = locationsData?.data ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black">Admin Dashboard</h1>
              <p className="mt-2 text-blue-100">
                Welcome back, {user?.name || "Admin"} — here's what's happening across ShiftGrid.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur px-5 py-3 font-semibold transition"
              >
                <ShieldCheck size={18} />
                Open Admin Panel
              </button>
              <button
                onClick={() => navigate("/browse-shifts")}
                className="flex items-center gap-2 rounded-2xl bg-white text-blue-700 px-5 py-3 font-semibold transition hover:bg-blue-50"
              >
                View Live Shifts
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {(isLoading ? [] : statCards(stats)).map((stat) => {
            if (isLoading) {
              return (
                <div
                  key={stat.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
                >
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 mb-3" />
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-2" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                </div>
              );
            }
            return (
              <div
                key={stat.id}
                className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.color}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
                      <h2 className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
                        {stat.value}
                      </h2>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                      <CalendarClock size={28} />
                    </div>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                    <span className="text-sm text-slate-400">Live</span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Shifts */}
          <div className="xl:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Shifts</h2>
                <p className="text-sm text-slate-500 mt-1">Latest activity across all events</p>
              </div>
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition"
              >
                Manage
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-left">
                    <th className="px-6 py-4 text-sm text-slate-500">Shift</th>
                    <th className="px-6 py-4 text-sm text-slate-500">Location</th>
                    <th className="px-6 py-4 text-sm text-slate-500">Date</th>
                    <th className="px-6 py-4 text-sm text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(shifts.length ? shifts.slice(0, 6) : []).map((shift) => (
                    <tr key={shift.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{shift.title}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{shift.location}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{shift.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[shift.status] ?? "bg-slate-100 text-slate-700"}`}>
                          {shift.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {shifts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                        No shifts yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side column */}
          <div className="space-y-8">
            {/* Locations */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Locations</h2>
                <p className="text-sm text-slate-500 mt-1">{locations.length} venue(s) on platform</p>
              </div>
              <div className="p-6 space-y-4">
                {locations.slice(0, 4).map((loc) => (
                  <div key={loc.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{loc.name}</h3>
                      <p className="text-xs text-slate-500">{loc.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Users */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Users</h2>
                <p className="text-sm text-slate-500 mt-1">Recently joined platform</p>
              </div>
              <div className="p-6 space-y-4">
                {users.slice(0, 4).map((u) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{u.name}</h3>
                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${roleColors[u.role] ?? "bg-slate-100 text-slate-700"}`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
