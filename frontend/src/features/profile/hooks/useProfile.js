import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, changePassword, getPreferences, updatePreferences } from "../services/profileService";
import toast from "react-hot-toast";

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to change password");
    },
  });
};

export const usePreferences = () =>
  useQuery({
    queryKey: ["preferences"],
    queryFn: getPreferences,
    staleTime: 5 * 60 * 1000,
  });

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      toast.success("Preferences updated");
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update preferences");
    },
  });
};
