import { useMutation, useQueryClient } from "@tanstack/react-query";
import { releaseShift as releaseShiftApi } from "../services/shiftsService";
import toast from "react-hot-toast";

export const useCancelShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shiftId) => releaseShiftApi(shiftId),
    onSuccess: () => {
      toast.success("Shift cancelled — it's back on the board");
      queryClient.invalidateQueries({ queryKey: ["my-shifts"] });
      queryClient.invalidateQueries({ queryKey: ["browse-shifts"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-shifts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["recommended-shifts"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to cancel shift");
    },
  });
};
