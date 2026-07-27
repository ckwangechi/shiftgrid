import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useLocations, useLocationStats } from "../hooks/useLocations";

import DashboardLayout from "../../../shared/layouts/DashboardLayout";

const LocationsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const { data: locationsData, isLoading, error } = useLocations({
    search,
  });

  const { data: statsData, isLoading: statsLoading } = useLocationStats();

  const locations = locationsData?.data ?? [];
  const stats = statsData?.data ?? {};

  const filteredLocations = locations
    .filter((loc) => {
      if (search) {
        const keyword = search.toLowerCase();
        return (
          loc.name?.toLowerCase().includes(keyword) ||
          loc.address?.toLowerCase().includes(keyword) ||
          loc.city?.toLowerCase().includes(keyword)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return (a.name ?? "").localeCompare(b.name ?? "");
      if (sortBy === "shifts") return (b.shiftCount ?? 0) - (a.shiftCount ?? 0);
      if (sortBy === "distance") return (a.distance ?? 999) - (b.distance ?? 999);
      return 0;
    });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-10 text-white shadow-xl">
          <h1 className="text-4xl font-black leading-tight">Locations</h1>
          <p className="mt-3 text-blue-100 text-lg">
            Browse available venues and find shifts near you.
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white/10 backdrop-blur p-4">
              <h3 className="text-2xl font-bold">
                {statsLoading ? "—" : stats.total ?? "—"}
              </h3>
              <p className="text-sm text-blue-100">Total Locations</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur p-4">
              <h3 className="text-2xl font-bold">
                {statsLoading ? "—" : stats.openShifts ?? "—"}
              </h3>
              <p className="text-sm text-blue-100">Open Shifts</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur p-4">
              <h3 className="text-2xl font-bold">
                {statsLoading ? "—" : stats.cities ?? "—"}
              </h3>
              <p className="text-sm text-blue-100">Cities</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur p-4">
              <h3 className="text-2xl font-bold">
                {statsLoading ? "—" : stats.nearby ?? "—"}
              </h3>
              <p className="text-sm text-blue-100">Nearby You</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, address, or city..."
                className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full lg:w-auto h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 outline-none cursor-pointer"
            >
              <option value="name">Sort by Name</option>
              <option value="shifts">Sort by Shifts</option>
              <option value="distance">Sort by Distance</option>
            </select>
          </div>
        </section>

        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
              >
                <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-8 text-center">
            <p className="text-red-600 dark:text-red-400 font-semibold">
              Failed to load locations
            </p>
            <p className="text-sm text-red-400 mt-2">
              {error.message || "Please try again later"}
            </p>
          </div>
        )}

        {!isLoading && !error && filteredLocations.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-16 text-center text-slate-400">
            <p className="text-lg font-semibold">No locations found</p>
            <p className="text-sm mt-2">Try adjusting your search</p>
          </div>
        )}

        {!isLoading && !error && filteredLocations.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="h-28 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                  <span className="text-5xl text-white/30"></span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {location.name}
                  </h3>

                  <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
                    {location.address}
                    {location.city && `, ${location.city}`}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                    {location.distance && (
                      <span>{location.distance} km away</span>
                    )}
                    <span>
                       {location.shiftCount ?? 0} shifts available
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        `/browse-shifts?location=${encodeURIComponent(location.name ?? "")}`
                      )
                    }
                    className="mt-6 w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold transition"
                  >
                    View Shifts
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LocationsPage;
