import { useDispatch, useSelector } from "react-redux";
import { fetchRoom, fetchMyListings } from "../store/property/property.store";

export function useProperties() {
  const dispatch = useDispatch();
  const { current, myListings, status } = useSelector((s) => s.property);

  return {
    current,
    myListings,
    status,
    loadRoom: (id) => dispatch(fetchRoom(id)),
    loadMyListings: (params) => dispatch(fetchMyListings(params)),
  };
}
