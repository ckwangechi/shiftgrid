import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAdminShifts, useUpdateShift, useDeleteShift } from "../hooks/useAdmin";
import { useAdminLocations, useCreateLocation, useDeleteLocation } from "../hooks/useAdmin";
import { useAdminUsers } from "../hooks/useAdmin";
import { useUser } from "../../../shared/contexts/UserContext";

import DashboardLayout from "../../../shared/layouts/DashboardLayout";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  if (user?.role !== "admin" && user?.role !== "job_creator") {
    navigate("/dashboard");
  }

  const [activeTab, setActiveTab] = useState("shifts");
  const [locationForm, setLocationForm] = useState({ name: "", address: "", city: "" });

  const { data: shiftsData, isLoading: shiftsLoading } = useAdminShifts();
  const { mutate: updateShift } = useUpdateShift();
  const { mutate: deleteShift } = useDeleteShift();

  const { data: locationsData, isLoading: locationsLoading } = useAdminLocations();
  const { mutate: createLocation } = useCreateLocation();
  const { mutate: deleteLocation } = useDeleteLocation();

  const { data: usersData, isLoading: usersLoading } = useAdminUsers();

  const shifts = shiftsData?.data ?? [];
  const locations = locationsData?.data ?? [];
  const users = usersData?.data ?? [];

  const tabs = [
    { key: "shifts", label: "Shifts" },
    { key: "locations", label: "Locations" },
    { key: "users", label: "Users" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Admin Panel
        </h1>

        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-2xl font-semibold transition ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "shifts" && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Manage Shifts
              </h2>
            </div>
            {shiftsLoading ? (
              <div className="p-8 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-left">
                      <th className="px-6 py-4 text-sm text-slate-500">Title</th>
                      <th className="px-6 py-4 text-sm text-slate-500">Location</th>
                      <th className="px-6 py-4 text-sm text-slate-500">Date</th>
                      <th className="px-6 py-4 text-sm text-slate-500">Status</th>
                      <th className="px-6 py-4 text-sm text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shifts.map((shift) => (
                      <tr key={shift.id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="px-6 py-4 font-semibold dark:text-white">{shift.title}</td>
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{shift.location}</td>
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{shift.date}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {shift.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => updateShift({ id: shift.id, data: { status: shift.status === "Open" ? "Closed" : "Open" } })}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                          >
                            Toggle
                          </button>
                          <button
                            onClick={() => deleteShift(shift.id)}
                            className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "locations" && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Add Location
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={locationForm.name}
                  onChange={(e) => setLocationForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={locationForm.address}
                  onChange={(e) => setLocationForm((prev) => ({ ...prev, address: e.target.value }))}
                  className="h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    createLocation(locationForm);
                    setLocationForm({ name: "", address: "", city: "" });
                  }}
                  className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
                >
                  Add Location
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Locations
                </h2>
              </div>
              {locationsLoading ? (
                <div className="p-8 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded mx-6 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {locations.map((loc) => (
                    <div key={loc.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{loc.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{loc.address}</p>
                      </div>
                      <button
                        onClick={() => deleteLocation(loc.id)}
                        className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Manage Users
              </h2>
            </div>
            {usersLoading ? (
              <div className="p-8 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded mx-6 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-left">
                      <th className="px-6 py-4 text-sm text-slate-500">Name</th>
                      <th className="px-6 py-4 text-sm text-slate-500">Email</th>
                      <th className="px-6 py-4 text-sm text-slate-500">Role</th>
                      <th className="px-6 py-4 text-sm text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="px-6 py-4 font-semibold dark:text-white">{user.name}</td>
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => updateUser({ id: user.id, data: { role: user.role === "admin" ? "volunteer" : "admin" } })}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                          >
                            Toggle Role
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminPage;
