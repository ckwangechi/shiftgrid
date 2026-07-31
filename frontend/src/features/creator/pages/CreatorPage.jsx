import { useState } from "react";

import { useLocations } from "../../locations/hooks/useLocations";
import { useCreateShift } from "../../admin/hooks/useAdmin";
import { useCreatedShifts } from "../../shifts/hooks/useShifts";
import { useSkills } from "../../skills/hooks/useSkills";

import DashboardLayout from "../../../shared/layouts/DashboardLayout";

const emptyForm = {
  title: "",
  role_title: "",
  required_skill: "",
  company: "",
  pay: "",
  max_volunteers: "",
  description: "",
  location_id: "",
  start_time: "",
  end_time: "",
};

const CreatorPage = () => {
  const [formData, setFormData] = useState(emptyForm);

  const { data: locationsData, isLoading: locationsLoading } = useLocations();
  const { data: skillsData } = useSkills();
  const createShiftMutation = useCreateShift();
  const { data: createdData, isLoading: createdLoading } = useCreatedShifts();

  const locations = locationsData?.data ?? [];
  const skills = (skillsData?.data ?? skillsData ?? []).map((s) => s.name);
  const createdShifts = createdData?.data ?? [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createShiftMutation.mutate(
      {
        title: formData.title,
        role_title: formData.role_title || formData.title,
        required_skill: formData.required_skill,
        company: formData.company,
        pay: formData.pay ? Number(formData.pay) : undefined,
        max_volunteers: formData.max_volunteers
          ? Number(formData.max_volunteers)
          : 10,
        description: formData.description,
        location_id: Number(formData.location_id),
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      },
      {
        onSuccess: () => setFormData(emptyForm),
      }
    );
  };

  const inputClass =
    "w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-10 text-white shadow-xl">
          <h1 className="text-4xl font-black leading-tight">Create Shift</h1>
          <p className="mt-3 text-blue-100 text-lg">
            Post a new shift for volunteers to browse and claim.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Shift Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Shift Title *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Event Registration"
                value={formData.title}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Role Title
              </label>
              <input
                type="text"
                name="role_title"
                placeholder="e.g. Registration Desk"
                value={formData.role_title}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Required Skill (for volunteers) *
              </label>
              <input
                type="text"
                name="required_skill"
                placeholder="Pick an existing skill or type a new one"
                value={formData.required_skill}
                onChange={handleChange}
                required
                list="creator-skills"
                className={inputClass}
              />
              <datalist id="creator-skills">
                {skills.map((skill) => (
                  <option key={skill} value={skill} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Company / Event
              </label>
              <input
                type="text"
                name="company"
                placeholder="e.g. Nairobi Marathon 2026"
                value={formData.company}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Pay (KSh)
              </label>
              <input
                type="number"
                name="pay"
                placeholder="e.g. 1500"
                value={formData.pay}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Max Volunteers
              </label>
              <input
                type="number"
                name="max_volunteers"
                placeholder="e.g. 10"
                value={formData.max_volunteers}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Location *
              </label>
              <select
                name="location_id"
                value={formData.location_id}
                onChange={handleChange}
                required
                disabled={locationsLoading}
                className={inputClass}
              >
                <option value="">Select a location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} {loc.city ? `(${loc.city})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Start Date &amp; Time *
              </label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                End Date &amp; Time *
              </label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe the role and responsibilities..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={createShiftMutation.isPending}
            className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50"
          >
            {createShiftMutation.isPending ? "Creating..." : "Create Shift"}
          </button>
        </form>

        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              My Created Shifts
            </h2>
          </div>

          {createdLoading ? (
            <div className="p-8 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"
                />
              ))}
            </div>
          ) : createdShifts.length === 0 ? (
            <p className="p-8 text-center text-slate-400">
              No shifts created yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-left">
                    <th className="px-6 py-4 text-sm text-slate-500">Title</th>
                    <th className="px-6 py-4 text-sm text-slate-500">Location</th>
                    <th className="px-6 py-4 text-sm text-slate-500">Date</th>
                    <th className="px-6 py-4 text-sm text-slate-500">Skill</th>
                    <th className="px-6 py-4 text-sm text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {createdShifts.map((shift) => (
                    <tr
                      key={shift.id}
                      className="border-b border-slate-100 dark:border-slate-800"
                    >
                      <td className="px-6 py-4 font-semibold dark:text-white">
                        {shift.title}
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {shift.location}
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {shift.date} · {shift.time}
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {shift.required_skill}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {shift.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default CreatorPage;
