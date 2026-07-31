import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./features/dashboard/pages/DashboardPage";
import ShiftsPage from "./features/shifts/pages/ShiftsPage";
import BrowseShiftsPage from "./features/browse-shifts/pages/BrowseShiftsPage";
import LocationsPage from "./features/locations/pages/LocationsPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import PreferencesPage from "./features/profile/pages/PreferencesPage";
import AdminPage from "./features/admin/pages/AdminPage";
import AdminDashboardPage from "./features/admin/pages/AdminDashboardPage";
import CreatorPage from "./features/creator/pages/CreatorPage";
import NewSkillsPage from "./features/skills/pages/NewSkillsPage";
import NotificationsPage from "./features/notifications/pages/NotificationsPage";

import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";

import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import AdminRoute from "./features/auth/components/AdminRoute";
import CreatorRoute from "./features/auth/components/CreatorRoute";
import { useUser } from "./shared/contexts/UserContext";

const HomeRedirect = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-xl font-semibold">Loading...</h1>
      </div>
    );
  }

  const path =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "job_creator"
        ? "/creator"
        : "/dashboard";

  return <Navigate to={path} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/browse-shifts"
          element={
            <ProtectedRoute>
              <BrowseShiftsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shifts"
          element={
            <ProtectedRoute>
              <ShiftsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/new-skills"
          element={
            <ProtectedRoute>
              <NewSkillsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/locations"
          element={
            <ProtectedRoute>
              <LocationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/creator"
          element={
            <CreatorRoute>
              <CreatorPage />
            </CreatorRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/preferences"
          element={
            <ProtectedRoute>
              <PreferencesPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex h-screen items-center justify-center">
              <h1 className="text-2xl font-semibold text-slate-500">
                404 - Page Not Found
              </h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;