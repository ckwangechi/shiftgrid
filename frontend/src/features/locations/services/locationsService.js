import api from "../../../shared/services/api";

export const getLocations = (params = {}) =>
  api.get("/locations", { params });

export const getLocationById = (id) =>
  api.get(`/locations/${id}`);

export const getNearbyLocations = (params = {}) =>
  api.get("/locations/nearby", { params });

export const getLocationStats = () =>
  api.get("/locations/stats");
