import { useState } from "react";

import { usePreferences, useUpdatePreferences } from "../hooks/useProfile";

import DashboardLayout from "../../../shared/layouts/DashboardLayout";

const PreferencesPage = () => {
  const { data: prefsData, isLoading, error } = usePreferences();
  const updatePrefsMutation = useUpdatePreferences();

  const prefs = prefsData?.data ?? prefsData ?? {};

  const [formData, setFormData] = useState({
    emailNotifications: prefs.emailNotifications ?? true,
    shiftReminders: prefs.shiftReminders ?? true,
    weeklySummary: prefs.weeklySummary ?? false,
    darkMode: prefs.darkMode ?? false,
    language: prefs.language ?? "en",
    timezone: prefs.timezone ?? "UTC",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePrefsMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8 p-8">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 animate-pulse" />
          <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="rounded-3xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-8 text-center">
            <p className="text-red-600 dark:text-red-400 font-semibold">
              Failed to load preferences
            </p>
            <p className="text-sm text-red-400 mt-2">
              {error.message || "Please try again"}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Preferences
        </h1>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-8"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Notifications
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300">
                Email Notifications
              </span>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300">
                Shift Reminders
              </span>
              <input
                type="checkbox"
                name="shiftReminders"
                checked={formData.shiftReminders}
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300">
                Weekly Summary
              </span>
              <input
                type="checkbox"
                name="weeklySummary"
                checked={formData.weeklySummary}
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4 border-t border-slate-200 dark:border-slate-800">
            Appearance
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="sw">Swahili</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Timezone
              </label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UTC">UTC</option>
                <option value="Africa/Nairobi">Africa/Nairobi</option>
                <option value="Africa/Johannesburg">Africa/Johannesburg</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={updatePrefsMutation.isPending}
            className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
          >
            {updatePrefsMutation.isPending ? "Saving..." : "Save Preferences"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PreferencesPage;
