import { useState, useMemo } from "react";

export function usePagination(total, limit = 20) {
  const [page, setPage] = useState(1);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);
  return {
    page,
    totalPages,
    next: () => setPage((p) => Math.min(totalPages, p + 1)),
    prev: () => setPage((p) => Math.max(1, p - 1)),
    goTo: (p) => setPage(Math.min(totalPages, Math.max(1, p))),
  };
}
