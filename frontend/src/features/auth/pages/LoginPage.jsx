import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const user = await login(formData.email, formData.password);
      navigate(
        user?.role === "admin"
          ? "/admin/dashboard"
          : user?.role === "job_creator"
            ? "/creator"
            : "/dashboard"
      );
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-lg shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          ShiftGrid Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border rounded p-3 mb-4"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border rounded p-3 mb-4"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded p-3 hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-between mt-5 text-sm">
          <Link to="/register" className="text-blue-600">
            Register
          </Link>

          <Link to="/forgot-password" className="text-blue-600">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;