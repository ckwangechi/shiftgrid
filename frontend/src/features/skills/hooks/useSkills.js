import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSkills, createSkill } from "../services/skillsService";
import toast from "react-hot-toast";

export const useSkills = (params = {}) =>
  useQuery({
    queryKey: ["skills", params],
    queryFn: () => getSkills(params),
    staleTime: 2 * 60 * 1000,
  });

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      toast.success("Skill added");
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add skill");
    },
  });
};
