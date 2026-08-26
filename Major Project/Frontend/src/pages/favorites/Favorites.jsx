import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import PropertyGrid from "../../components/property/PropertyGrid";
import Button from "../../components/common/Button";
import { propertyApi } from "../../services/api/property.api";
import { storage } from "../../utils/storage";

const FAVORITES_KEY = "favorite_rooms";

/**
 * Favorites are currently stored client-side (see
 * components/property/FavoriteButton.jsx) since the backend doesn't
 * expose a favorites endpoint yet. This page resolves each saved room
 * id to its full listing via GET /rooms/:id.
 */
export default function Favorites() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const ids = storage.get(FAVORITES_KEY, []);
    try {
      const results = await Promise.all(
        ids.map((id) => propertyApi.getOne(id).then((r) => r.data.data).catch(() => null))
      );
      setRooms(results.filter(Boolean));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const clearAll = () => {
    storage.set(FAVORITES_KEY, []);
    setRooms([]);
  };

  return (
    <PageContainer
      title="Favorites"
      subtitle={`${rooms.length} saved room${rooms.length === 1 ? "" : "s"}`}
      action={
        rooms.length > 0 && (
          <Button variant="ghost" icon={Trash2} onClick={clearAll}>Clear all</Button>
        )
      }
    >
      <PropertyGrid
        rooms={rooms}
        loading={loading}
        emptyTitle="No favorites yet"
        emptyDescription="Tap the heart icon on any room to save it here for later."
      />
    </PageContainer>
  );
}
