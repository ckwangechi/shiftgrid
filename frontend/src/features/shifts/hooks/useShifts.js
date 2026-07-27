import { useQuery } from "@tanstack/react-query";
import { getMyShifts, getMyShiftsStats } from "../services/shiftsService";

export const useMyShifts = (params = {}) =>
  useQuery({
    queryKey: ["my-shifts", params],
    queryFn: () => getMyShifts(params),
    staleTime: 2 * 60 * 1000,
  });

export const useMyShiftsStats = () =>
  useQuery({
    queryKey: ["my-shifts-stats"],
    queryFn: getMyShiftsStats,
    staleTime: 5 * 60 * 1000,
  });