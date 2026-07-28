import { useState } from "react";
import api from "../../../shared/services/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/auth/forgot-password", {
        email,
      });

      setMessage("Password reset instructions sent.");
    } catch {
      setMessage("Unable to process request.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6">
          Forgot Password
        </h1>

        <input
          type="email"
          className="w-full border p-3 rounded mb-4"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white rounded p-3">
          Send Reset Link
        </button>

        {message && (
          <p className="mt-5 text-green-600">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;