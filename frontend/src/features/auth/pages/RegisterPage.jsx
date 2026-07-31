import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useSkills } from "../../skills/hooks/useSkills";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { data: skillsData } = useSkills();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    skills: [],
  });

  const [error, setError] = useState("");

  const availableSkills = (skillsData?.data ?? skillsData ?? []).map(
    (s) => s.name
  );

  const handleSkillChange = (skill) => {
    if (formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter((s) => s !== skill),
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const user = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        skills: formData.skills,
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
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h1 className="text-3xl font-bold mb-6">Create Account</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          className="border p-3 rounded w-full mb-4"
          placeholder="Username"
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />

        <input
          className="border p-3 rounded w-full mb-4"
          placeholder="Email"
          type="email"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <input
          className="border p-3 rounded w-full mb-4"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <input
          className="border p-3 rounded w-full mb-6"
          type="password"
          placeholder="Confirm Password"
          onChange={(e) =>
            setFormData({
              ...formData,
              confirmPassword: e.target.value,
            })
          }
        />

        <h2 className="font-semibold mb-2">Select Your Skills</h2>

        {availableSkills.length === 0 ? (
          <p className="text-sm text-slate-400 mb-6">
            Loading available skills...
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 mb-6">
            {availableSkills.map((skill) => (
              <label key={skill}>
                <input
                  type="checkbox"
                  onChange={() => handleSkillChange(skill)}
                />
                <span className="ml-2">{skill}</span>
              </label>
            ))}
          </div>
        )}

        <button className="w-full bg-green-600 text-white p-3 rounded">
          Register
        </button>

        <div className="mt-5 text-center">
          <Link to="/login" className="text-blue-600">
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;