import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import api from "../../../shared/services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/api/auth/me");

        setUser(data);
        setToken(storedToken);
      } catch (err) {
        console.error(err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", data.access_token);

    setToken(data.access_token);

    const profile = await api.get("/api/auth/me");

    setUser(profile.data);

    return profile.data;
  };

  const register = async (payload) => {
    return await api.post("/api/auth/register", payload);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);