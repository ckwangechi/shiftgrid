import { useQuery } from "@tanstack/react-query";
import { getBrowseShifts } from "../services/browseService";

export const useBrowseShifts = (params = {}) =>
  useQuery({
    queryKey: ["browse-shifts", params],
    queryFn: () => getBrowseShifts(params),
    staleTime: 2 * 60 * 1000,
  });