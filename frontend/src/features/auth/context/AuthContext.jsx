import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import api from "../../../shared/services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");

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
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", data.access_token);

    setToken(data.access_token);

    const profile = await api.get("/auth/me");

    setUser(profile.data);

    window.dispatchEvent(new Event("auth-change"));

    return profile.data;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);

    const { data } = await api.post("/auth/login", {
      email: payload.email,
      password: payload.password,
    });

    localStorage.setItem("token", data.access_token);

    setToken(data.access_token);

    const profile = await api.get("/auth/me");

    setUser(profile.data);

    window.dispatchEvent(new Event("auth-change"));

    return profile.data;
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