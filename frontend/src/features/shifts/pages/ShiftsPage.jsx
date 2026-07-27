import { useState } from "react";

import { useMyShifts } from "../hooks/useShifts";
import { useClaimShift } from "../hooks/useClaimShift";

import DashboardLayout from "../../../shared/layouts/DashboardLayout";

import ShiftCommandBar from "../components/ShiftCommandBar";
import ShiftStats from "../components/ShiftStats";
import ShiftFilters from "../components/ShiftFilters";
import ShiftGrid from "../components/ShiftGrid";

const ShiftsPage = () => {
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    location: "",
    skill: "",
    status: "",
    time: "",
    date: "",
  });

  const [sortBy, setSortBy] = useState("match");
  const [view, setView] = useState("grid");

  const {
    data: shiftsData,
    isLoading,
    error,
  } = useMyShifts();

  const claimMutation = useClaimShift();

  const shifts = shiftsData?.data ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <ShiftCommandBar
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          view={view}
          setView={setView}
        />

        <ShiftStats />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-1">
            <ShiftFilters
              filters={filters}
              setFilters={setFilters}
            />
          </div>

          <div className="xl:col-span-3">
            <ShiftGrid
              shifts={shifts}
              search={search}
              filters={filters}
              sortBy={sortBy}
              view={view}
              isLoading={isLoading}
              error={error}
              onClaim={(shiftId) => claimMutation.mutate(shiftId)}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShiftsPage;