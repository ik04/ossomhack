import { useState, useEffect } from "react";
import axios from "axios";
import { GlobalContext } from "./globalContext";
import { useNavigate } from "@remix-run/react";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User state:", user);
    if (user && !(user.is_onboard == 1)) {
      navigate("/onboarding");
    }
  }, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/user", {
          withCredentials: true,
        });

        if (data) {
          setUser(data.user);
          setIsAuthenticated(true);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.access_token}`;
        }
      } catch (error) {
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
