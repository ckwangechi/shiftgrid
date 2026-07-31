import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Shield, Briefcase, Check, AlertCircle } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { useSkills } from "../../skills/hooks/useSkills";

const ROLES = [
  { value: "volunteer", label: "Volunteer", icon: Users, color: "from-emerald-500 to-teal-500", desc: "Browse and claim shifts" },
  { value: "job_creator", label: "Job Creator", icon: Briefcase, color: "from-purple-500 to-indigo-500", desc: "Post and manage shifts" },
  { value: "admin", label: "Admin", icon: Shield, color: "from-red-500 to-rose-500", desc: "Full platform access" },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { data: skillsData } = useSkills();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "volunteer",
    skills: [],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const availableSkills = (skillsData?.data ?? skillsData ?? []).map(
    (s) => s.name
  );

  const handleSkillChange = (skill) => {
    if (formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s !== skill),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      return setError("Passwords do not match.");
    }

    try {
      const user = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        skills: formData.role === "volunteer" ? formData.skills : [],
      });

      navigate(
        user?.role === "admin"
          ? "/admin/dashboard"
          : user?.role === "job_creator"
            ? "/creator"
            : "/dashboard"
      );
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-black text-slate-900">ShiftGrid</h1>
            </div>
            <p className="text-slate-500 text-lg">Create your account to get started</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-2xl mb-6">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Choose your role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const isSelected = formData.role === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, role: role.value }))
                      }
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-r ${role.color} flex items-center justify-center ${
                          isSelected ? "ring-2 ring-blue-600 ring-offset-2" : ""
                        }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-slate-900 text-sm">
                        {role.label}
                      </span>
                      <span className="text-xs text-slate-500 text-center">
                        {role.desc}
                      </span>
                      {isSelected && (
                        <Check
                          className="absolute top-2 right-2 w-4 h-4 text-blue-600"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {formData.role === "volunteer" && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Skills (optional)
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  Select skills that match your experience
                </p>

                {availableSkills.length === 0 ? (
                  <p className="text-sm text-slate-400 mb-6">
                    Loading available skills...
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSkills.map((skill) => (
                      <label
                        key={skill}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={formData.skills.includes(skill)}
                          onChange={() => handleSkillChange(skill)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {skill}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
