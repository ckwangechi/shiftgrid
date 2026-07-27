export const uniqueLocations = (shifts) =>
  [...new Set(shifts.map((s) => s.location))];

export const uniqueSkills = (shifts) =>
  [...new Set(shifts.map((s) => s.skill))];

export const uniqueStatus = (shifts) =>
  [...new Set(shifts.map((s) => s.status))];