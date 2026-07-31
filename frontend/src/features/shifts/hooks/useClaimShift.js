import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { claimShift as claimShiftApi } from "../services/shiftsService";
import toast from "react-hot-toast";

export const useClaimShift = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shiftId) => claimShiftApi(shiftId),
    onSuccess: () => {
      toast.success("Shift claimed successfully");
      queryClient.invalidateQueries({ queryKey: ["my-shifts"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-shifts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["recommended-shifts"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
      queryClient.invalidateQueries({ queryKey: ["browse-shifts"] });
      navigate("/shifts");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to claim shift");
    },
  });
};