import { createContext } from "react";

type User = {
  id: number;
  username: string;
  full_name: string;
  email: string;
  is_onboard: boolean;
};

type GlobalContextType = {
  user: User | null;

  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  isAuthenticated: boolean;

  setIsAuthenticated: (value: boolean) => void;

  loading: boolean;

  setLoading: (value: boolean) => void;
};

export const GlobalContext = createContext<GlobalContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  loading: true,
  setLoading: () => {},
});
