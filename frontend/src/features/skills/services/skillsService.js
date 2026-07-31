import api from "../../../shared/services/api";

export const getSkills = (params = {}) =>
  api.get("/skills", { params });

export const createSkill = (data) =>
  api.post("/skills", data);
