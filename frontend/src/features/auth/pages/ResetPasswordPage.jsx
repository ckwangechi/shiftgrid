import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../shared/services/api";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    token: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setMessage("Passwords do not match.");
    }

    try {
      await api.post("/auth/reset-password", {
        token: formData.token,
        password: formData.password,
      });

      navigate("/login");
    } catch {
      setMessage("Password reset failed.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6">
          Reset Password
        </h1>

        {message && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {message}
          </div>
        )}

        <input
          className="border p-3 rounded w-full mb-4"
          placeholder="Reset Token"
          onChange={(e) =>
            setFormData({ ...formData, token: e.target.value })
          }
        />

        <input
          type="password"
          className="border p-3 rounded w-full mb-4"
          placeholder="New Password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <input
          type="password"
          className="border p-3 rounded w-full mb-6"
          placeholder="Confirm Password"
          onChange={(e) =>
            setFormData({
              ...formData,
              confirmPassword: e.target.value,
            })
          }
        />

        <button className="w-full bg-green-600 text-white rounded p-3">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;