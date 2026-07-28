import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./features/dashboard/pages/DashboardPage";
import ShiftsPage from "./features/shifts/pages/ShiftsPage";
import BrowseShiftsPage from "./features/browse-shifts/pages/BrowseShiftsPage";
import LocationsPage from "./features/locations/pages/LocationsPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import PreferencesPage from "./features/profile/pages/PreferencesPage";
import AdminPage from "./features/admin/pages/AdminPage";

import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";

import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import AdminRoute from "./features/auth/components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/shifts" element={<ShiftsPage />} />
        <Route path="/browse-shifts" element={<BrowseShiftsPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen">
              <p className="text-xl text-slate-500">Page not found</p>
            </div>
          }
        />

{/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
{/* Admin */}
        <Route path="/admin" element={ <AdminRoute> <Admin /> </AdminRoute> } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;