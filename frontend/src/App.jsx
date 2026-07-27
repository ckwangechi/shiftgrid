import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./features/dashboard/pages/DashboardPage";
import ShiftsPage from "./features/shifts/pages/ShiftsPage";
import BrowseShiftsPage from "./features/browse-shifts/pages/BrowseShiftsPage";
import LocationsPage from "./features/locations/pages/LocationsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/shifts" element={<ShiftsPage />} />
        <Route path="/browse-shifts" element={<BrowseShiftsPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen">
              <p className="text-xl text-slate-500">Page not found</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;