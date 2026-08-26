import { createContext, useContext } from "react";
import { useSelector } from "react-redux";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { user, accessToken, status } = useSelector((s) => s.auth);
  const value = { user, isAuthenticated: !!accessToken, status };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
