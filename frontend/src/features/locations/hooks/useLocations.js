import { useQuery } from "@tanstack/react-query";
import { getLocations, getLocationStats } from "../services/locationsService";

export const useLocations = (params = {}) =>
  useQuery({
    queryKey: ["locations", params],
    queryFn: () => getLocations(params),
    staleTime: 5 * 60 * 1000,
  });

export const useLocationStats = () =>
  useQuery({
    queryKey: ["location-stats"],
    queryFn: getLocationStats,
    staleTime: 5 * 60 * 1000,
  });
