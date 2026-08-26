import { useDispatch, useSelector } from "react-redux";
import { login, register, logoutAsync } from "../store/auth/auth.store";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, accessToken, status, error } = useSelector((s) => s.auth);

  return {
    user,
    isAuthenticated: !!accessToken,
    status,
    error,
    login: (payload) => dispatch(login(payload)),
    register: (payload) => dispatch(register(payload)),
    logout: () => dispatch(logoutAsync()),
  };
}
