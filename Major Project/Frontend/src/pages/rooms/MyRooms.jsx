import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import ListingTable from "../../components/owner/ListingTable";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { propertyApi } from "../../services/api/property.api";

export default function MyRooms() {
  const [rooms, setRooms] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const { page, totalPages, goTo } = usePagination(rooms.total, 20);

  const load = async (p = page) => {
    setLoading(true);
    const { data } = await propertyApi.mine({ page: p, limit: 20 });
    setRooms(data.data);
    setLoading(false);
  };

  useEffect(() => { load(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageContainer
      title="My listings"
      subtitle={`${rooms.total} listing${rooms.total === 1 ? "" : "s"}`}
      action={
        <Link to="/owner/listings/new">
          <Button icon={Plus}>Add listing</Button>
        </Link>
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <ListingTable rooms={rooms.items} onChanged={() => load(page)} />
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination page={page} totalPages={totalPages} onChange={(p) => { goTo(p); load(p); }} />
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
