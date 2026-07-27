import api from "../../../shared/services/api";

export const getBrowseShifts = (params = {}) =>
  api.get("/shifts/browse", { params });

export const getShiftById = (id) =>
  api.get(`/shifts/${id}`);

export const claimShift = (shiftId) =>
  api.post(`/shifts/${shiftId}/claim`);

export const getApplications = () =>
  api.get("/shifts/applications");