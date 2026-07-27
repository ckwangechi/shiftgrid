import api from "../../../shared/services/api";

export const getAdminShifts = (params = {}) =>
  api.get("/admin/shifts", { params });

export const updateShift = (id, data) =>
  api.put(`/admin/shifts/${id}`, data);

export const deleteShift = (id) =>
  api.delete(`/admin/shifts/${id}`);

export const getAdminLocations = (params = {}) =>
  api.get("/admin/locations", { params });

export const createLocation = (data) =>
  api.post("/admin/locations", data);

export const updateLocation = (id, data) =>
  api.put(`/admin/locations/${id}`, data);

export const deleteLocation = (id) =>
  api.delete(`/admin/locations/${id}`);

export const getAdminUsers = (params = {}) =>
  api.get("/admin/users", { params });

export const updateUser = (id, data) =>
  api.put(`/admin/users/${id}`, data);

export const deleteUser = (id) =>
  api.delete(`/admin/users/${id}`);

export const getAdminStats = () =>
  api.get("/admin/stats");
