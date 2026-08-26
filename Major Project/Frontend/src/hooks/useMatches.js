import { useDispatch, useSelector } from "react-redux";
import { fetchTopMatches } from "../store/match/match.store";

export function useMatches() {
  const dispatch = useDispatch();
  const { topMatches, status } = useSelector((s) => s.match);
  return { topMatches, status, load: (limit) => dispatch(fetchTopMatches(limit)) };
}
