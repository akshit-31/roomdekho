import { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import RoommateFilters from "../../components/roommate/RoommateFilters";
import RoommateGrid from "../../components/roommate/RoommateGrid";
import Pagination from "../../components/common/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { api } from "../../services/api/axios";
import { matchApi } from "../../services/api/match.api";

/**
 * No dedicated roommate.api.js in this build — GET /roommates
 * (server/src/modules/roommates/roommate.routes.js) is called directly
 * via the shared axios instance, same pattern used elsewhere for
 * endpoints without a wrapper yet.
 */
export default function FindRoommate() {
  const [filters, setFilters] = useState({});
  const [result, setResult] = useState({ items: [], total: 0 });
  const [matchesById, setMatchesById] = useState({});
  const [loading, setLoading] = useState(true);
  const { page, totalPages, goTo } = usePagination(result.total, 20);

  const load = async (p = 1, f = filters) => {
    setLoading(true);
    try {
      const { data } = await api.get("/roommates", { params: { ...f, page: p, limit: 20 } });
      setResult(data.data);

      // Overlay AI compatibility scores from the matching engine
      const { data: top } = await matchApi.topMatches(20).catch(() => ({ data: { data: [] } }));
      const map = {};
      (top.data || []).forEach((m) => { map[m.userId] = m; });
      setMatchesById(map);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageContainer title="Find a roommate" subtitle="Matched by budget, schedule, and lifestyle — not guesswork">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <RoommateFilters
          filters={filters}
          onChange={(f) => { setFilters(f); load(1, f); }}
          onReset={() => { setFilters({}); load(1, {}); }}
        />

        <div>
          <RoommateGrid roommates={result.items} matchesById={matchesById} loading={loading} />
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination page={page} totalPages={totalPages} onChange={(p) => { goTo(p); load(p); }} />
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
