import { useState, useEffect } from "react";
import axios from "axios";
import { GlobalContext } from "./globalContext";
import { useNavigate } from "@remix-run/react";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Add axios interceptor
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }, []);

  useEffect(() => {
    if (user && !(user.is_onboard == 1)) {
      navigate("/onboarding");
    }
  }, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:8000/api/user", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem("token", data.access_token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.access_token}`;
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        setLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
