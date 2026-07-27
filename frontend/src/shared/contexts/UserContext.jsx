import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.get("/auth/me");
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const isAdmin = user?.role === "admin" || user?.role === "job_creator";

  return (
    <UserContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;