import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchMe, updateProfile } from "../store/user/user.store";

export function useUser() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((s) => s.auth);
  const { profile, status } = useSelector((s) => s.user);

  useEffect(() => {
    if (accessToken && !profile && status !== "loading") {
      dispatch(fetchMe());
    }
  }, [accessToken, profile, status, dispatch]);

  return { profile, status, update: (payload) => dispatch(updateProfile(payload)) };
}
