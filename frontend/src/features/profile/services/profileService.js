import api from "../../../shared/services/api";

export const getProfile = () =>
  api.get("/auth/me");

export const updateProfile = (data) =>
  api.put("/auth/me", data);

export const changePassword = (data) =>
  api.put("/auth/password", data);

export const getPreferences = () =>
  api.get("/auth/preferences");

export const updatePreferences = (data) =>
  api.put("/auth/preferences", data);
