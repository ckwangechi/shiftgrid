import api from "../../../shared/services/api";

export const getShifts = (params = {}) =>
  api.get("/shifts", { params });

export const getShiftById = (id) =>
  api.get(`/shifts/${id}`);

export const claimShift = (shiftId) =>
  api.post(`/shifts/${shiftId}/claim`);

export const getMyShifts = (params = {}) =>
  api.get("/shifts/my", { params });

export const getMyShiftsStats = () =>
  api.get("/shifts/my/stats");

export const getCreatedShifts = () =>
  api.get("/shifts/created");

export const releaseShift = (shiftId) =>
  api.post(`/shifts/${shiftId}/release`);