import { useState } from "react";

import { useProfile, useUpdateProfile, useChangePassword } from "../hooks/useProfile";

import DashboardLayout from "../../../shared/layouts/DashboardLayout";

const ProfilePage = () => {
  const { data: userData, isLoading, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const user = userData?.data ?? userData ?? null;

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

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
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
            <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
            <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                onChange={handleProfileChange}
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
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
