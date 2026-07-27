import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminShifts,
  updateShift,
  deleteShift,
  getAdminLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getAdminUsers,
  updateUser,
  deleteUser,
  getAdminStats,
} from "../services/adminService";
import toast from "react-hot-toast";

export const useAdminShifts = (params = {}) =>
  useQuery({
    queryKey: ["admin-shifts", params],
    queryFn: () => getAdminShifts(params),
    staleTime: 2 * 60 * 1000,
  });

export const useUpdateShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateShift(id, data),
    onSuccess: () => {
      toast.success("Shift updated");
      queryClient.invalidateQueries({ queryKey: ["admin-shifts"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update shift");
    },
  });
};

export const useDeleteShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteShift,
    onSuccess: () => {
      toast.success("Shift deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-shifts"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete shift");
    },
  });
};

export const useAdminLocations = (params = {}) =>
  useQuery({
    queryKey: ["admin-locations", params],
    queryFn: () => getAdminLocations(params),
    staleTime: 2 * 60 * 1000,
  });

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      toast.success("Location created");
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create location");
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateLocation(id, data),
    onSuccess: () => {
      toast.success("Location updated");
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update location");
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      toast.success("Location deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete location");
    },
  });
};

export const useAdminUsers = (params = {}) =>
  useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => getAdminUsers(params),
    staleTime: 2 * 60 * 1000,
  });

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      toast.success("User updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user");
    },
  });
};

export const useAdminStats = () =>
  useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
    staleTime: 5 * 60 * 1000,
  });
