import { useState } from "react";
import { ArrowRight, PlusCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSkills } from "../hooks/useSkills";
import api from "../../../shared/services/api";
import DashboardLayout from "../../../shared/layouts/DashboardLayout";

const NewSkillsPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: skillsData } = useSkills();
  const allSkills = (skillsData?.data ?? skillsData ?? []).map(
    (s) => ({ id: s.id, name: s.name, description: s.description })
  );

  const [registeredIds, setRegisteredIds] = useState([]);

  const available = allSkills.filter((s) => !registeredIds.includes(s.id));

  const registerSkill = async (skillId) => {
    try {
      await api.post(`/skills/${skillId}/register`);
      setRegisteredIds((prev) => [...prev, skillId]);
    } catch (e) {
      console.error("Failed to register skill", e);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-10 text-white shadow-xl">
          <h1 className="text-3xl font-black leading-tight">New Skills</h1>
          <p className="mt-3 text-blue-100 text-lg">
            Skills recently available on the platform. Add them to your profile so you can claim matching shifts.
          </p>
        </section>

        {available.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-10 text-center">
            <CheckCircle2 className="mx-auto text-green-500" size={48} />
            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              You have registered all available skills!
            </h2>
            <p className="mt-2 text-slate-500">
              Browse shifts and find ones you can claim.
            </p>
            <button
              onClick={() => navigate("/browse-shifts")}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Browse Shifts
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {available.map((skill) => (
              <div
                key={skill.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                      <PlusCircle size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {skill.name}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {skill.description || "No description yet"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => registerSkill(skill.id)}
                    className="mt-6 w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition"
                  >
                    Register to Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NewSkillsPage;
