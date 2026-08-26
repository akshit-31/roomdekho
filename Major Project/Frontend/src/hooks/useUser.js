import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchMe, updateProfile } from "../store/user/user.store";

export function useUser() {
  const dispatch = useDispatch();
  const { profile, status } = useSelector((s) => s.user);

  useEffect(() => {
    if (!profile) dispatch(fetchMe());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { profile, status, update: (payload) => dispatch(updateProfile(payload)) };
}
