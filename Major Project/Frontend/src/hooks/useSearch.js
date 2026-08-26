import { useDispatch, useSelector } from "react-redux";
import { runSearch, setFilters, resetFilters } from "../store/search/search.store";

export function useSearch() {
  const dispatch = useDispatch();
  const { filters, results, status } = useSelector((s) => s.search);

  return {
    filters,
    results,
    status,
    search: (params) => dispatch(runSearch(params)),
    setFilters: (f) => dispatch(setFilters(f)),
    resetFilters: () => dispatch(resetFilters()),
  };
}
