import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import ShiftCard from "./ShiftCard";
import ShiftDetailsDrawer from "./ShiftDetailsDrawer";
import ClaimShiftModal from "./ClaimShiftModal";
import Pagination from "./Pagination";

const ShiftGrid = ({
  shifts,
  search,
  filters,
  sortBy,
  view,
}) => {
  const [selectedShift, setSelectedShift] = useState(null);
  const [claimShift, setClaimShift] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter shifts
  let filteredShifts = [...shifts];

  // Search
  if (search) {
    const keyword = search.toLowerCase();

    filteredShifts = filteredShifts.filter(
      (shift) =>
        shift.title.toLowerCase().includes(keyword) ||
        shift.event.toLowerCase().includes(keyword) ||
        shift.skill.toLowerCase().includes(keyword) ||
        shift.status.toLowerCase().includes(keyword) ||
        shift.location.toLowerCase().includes(keyword) ||
        shift.displayDate.toLowerCase().includes(keyword)
    );
  }

  // Location
  if (filters.location) {
    filteredShifts = filteredShifts.filter(
      (shift) => shift.location === filters.location
    );
  }

  // Skill
  if (filters.skill) {
    filteredShifts = filteredShifts.filter(
      (shift) => shift.skill === filters.skill
    );
  }

  // Status
  if (filters.status) {
    filteredShifts = filteredShifts.filter(
      (shift) => shift.status === filters.status
    );
  }

  // Time
  if (filters.time) {
    filteredShifts = filteredShifts.filter(
      (shift) => shift.period === filters.time
    );
  }

  // Date
  if (filters.date) {
    filteredShifts = filteredShifts.filter(
      (shift) => shift.date === filters.date
    );
  }

  // Sort
  switch (sortBy) {
    case "slots":
      filteredShifts.sort((a, b) => b.slots - a.slots);
      break;

    case "date":
      filteredShifts.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      break;

    default:
      filteredShifts.sort((a, b) => b.match - a.match);
  }

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters, sortBy]);

  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(filteredShifts.length / itemsPerPage)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentShifts = filteredShifts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      {/* Results */}

      <div className="mb-6 flex items-center justify-between">

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {currentShifts.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {filteredShifts.length}
          </span>{" "}
          shifts
        </p>

      </div>

      {/* Grid */}

      <section
        className={
          view === "grid"
            ? "grid gap-6 md:grid-cols-2 2xl:grid-cols-3"
            : "space-y-5"
        }
      >
        {currentShifts.map((shift) => (
          <ShiftCard
            key={shift.id}
            shift={shift}
            onView={() => setSelectedShift(shift)}
            onClaim={() => {
              setClaimShift(shift);
              setSelectedShift(null);
            }}
          />
        ))}
      </section>

      {/* Empty State */}

      {currentShifts.length === 0 && (
        <div className="py-20 text-center">

          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">
            No shifts found
          </h2>

          <p className="mt-2 text-slate-500">
            Try changing your filters or search.
          </p>

        </div>
      )}

      {/* Pagination */}

      {filteredShifts.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Drawer */}

      <ShiftDetailsDrawer
        shift={selectedShift}
        isOpen={!!selectedShift}
        onClose={() => setSelectedShift(null)}
        onClaim={() => {
          setClaimShift(selectedShift);
          setSelectedShift(null);
        }}
      />

      {/* Claim Modal */}

      <ClaimShiftModal
        open={!!claimShift}
        shift={claimShift}
        onClose={() => setClaimShift(null)}
        onConfirm={(shift) => {
          toast.success(`Successfully claimed "${shift.title}"`);
          setClaimShift(null);
        }}
      />
    </>
  );
};

export default ShiftGrid;