import { useState } from "react";

import { useProfile, useUpdateProfile, useChangePassword, usePreferences } from "../hooks/useProfile";
import { useMyShifts } from "../../shifts/hooks/useShifts";

import DashboardLayout from "../../../shared/layouts/DashboardLayout";

const ProfilePage = () => {
  const { data: userData, isLoading, error } = useProfile();
  const { data: prefsData } = usePreferences();
  const { data: shiftsData } = useMyShifts();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const user = userData?.data ?? userData ?? null;
  const prefs = prefsData?.data ?? prefsData ?? {};
  const shifts = shiftsData?.data ?? [];

  const [formData, setFormData] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [skills, setSkills] = useState(user?.skills ?? []);
  const [preferredLocations, setPreferredLocations] = useState(
    prefs.preferredLocations ?? []
  );
  const [preferredTimes, setPreferredTimes] = useState(
    prefs.preferredTimes ?? []
  );
  const [preferredEventTypes, setPreferredEventTypes] = useState(
    prefs.preferredEventTypes ?? []
  );

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (e) => {
    const { value } = e.target;
    if (value && !skills.includes(value)) {
      setSkills((prev) => [...prev, value]);
    }
    e.target.value = "";
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const toggleArrayItem = (setter, item) => {
    setter((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      ...formData,
      skills,
      preferredLocations,
      preferredTimes,
      preferredEventTypes,
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8 p-8">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
            <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
          </div>
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
              Failed to load profile
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
          Profile Settings
        </h1>

        {/* Personal Info */}
        <form
          onSubmit={handleProfileSubmit}
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Personal Info
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleProfileChange}
              className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleProfileChange}
              className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Role
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              readOnly
              className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 px-4"
            />
          </div>

          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Verified Skills */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Verified Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-blue-400 hover:text-red-500 transition"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a skill..."
              className="flex-1 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const value = e.target.value.trim();
                  if (value && !skills.includes(value)) {
                    setSkills((prev) => [...prev, value]);
                  }
                  e.target.value = "";
                }
              }}
            />
          </div>
        </section>

        {/* Claimed Shifts */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Claimed Shifts
          </h2>

          {shifts.length === 0 ? (
            <p className="text-slate-400">No shifts claimed yet</p>
          ) : (
            <div className="space-y-4">
              {shifts.map((shift) => (
                <div
                  key={shift.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50"
                >
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {shift.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {shift.location} — {shift.date} — {shift.time}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {shift.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Preferences */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Preferences
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Preferred Locations
            </label>
            <div className="flex flex-wrap gap-2">
              {preferredLocations.map((loc) => (
                <span
                  key={loc}
                  className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-sm cursor-pointer"
                  onClick={() =>
                    toggleArrayItem(setPreferredLocations, loc)
                  }
                >
                  {loc} ×
                </span>
              ))}
              <input
                type="text"
                placeholder="Add location..."
                className="h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const value = e.target.value.trim();
                    if (value && !preferredLocations.includes(value)) {
                      setPreferredLocations((prev) => [...prev, value]);
                    }
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Preferred Shift Times
            </label>
            <div className="flex flex-wrap gap-2">
              {["Morning", "Afternoon", "Evening", "Night"].map((time) => (
                <span
                  key={time}
                  onClick={() => toggleArrayItem(setPreferredTimes, time)}
                  className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition ${
                    preferredTimes.includes(time)
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {time}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Preferred Event Types
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "Conference",
                "Workshop",
                "Training",
                "Event",
                "Cleanup",
              ].map((type) => (
                <span
                  key={type}
                  onClick={() =>
                    toggleArrayItem(setPreferredEventTypes, type)
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition ${
                    preferredEventTypes.includes(type)
                      ? "bg-purple-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Change Password */}
        <form
          onSubmit={handlePasswordSubmit}
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Change Password
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50"
          >
            {changePasswordMutation.isPending
              ? "Updating..."
              : "Change Password"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
