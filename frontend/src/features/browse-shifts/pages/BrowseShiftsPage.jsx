import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useBrowseShifts } from "../hooks/useBrowseShifts";
import { useClaimShift } from "../../shifts/hooks/useClaimShift";

import DashboardLayout from "../../../shared/layouts/DashboardLayout";

import BrowseHero from "../components/BrowseHero";
import BrowseToolbar from "../components/BrowseToolbar";
import BrowseFilters from "../components/BrowseFilters";
import BrowseGrid from "../components/BrowseGrid";

const BrowseShiftsPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    location: "",
    category: "",
    schedule: "",
    pay: "",
    rating: "",
    date: "",
  });

  const [view, setView] = useState("grid");

  const {
    data: shiftsData,
    isLoading,
    error,
  } = useBrowseShifts({
    search,
    location: filters.location,
    category: filters.category,
    schedule: filters.schedule,
    pay: filters.pay,
    rating: filters.rating,
    date: filters.date,
  });

  const claimMutation = useClaimShift();

  const shifts = shiftsData?.data ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <BrowseHero />

        <BrowseToolbar
          search={search}
          setSearch={setSearch}
          view={view}
          setView={setView}
        />

        <div className="grid gap-8 xl:grid-cols-4">
          <aside className="xl:col-span-1">
            <BrowseFilters
              filters={filters}
              setFilters={setFilters}
            />
          </aside>

          <main className="xl:col-span-3">
            <BrowseGrid
              shifts={shifts}
              isLoading={isLoading}
              error={error}
              search={search}
              filters={filters}
              view={view}
              onClaim={(shiftId) => claimMutation.mutate(shiftId)}
              claimingId={claimMutation.isPending ? claimMutation.variables : null}
            />
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BrowseShiftsPage;