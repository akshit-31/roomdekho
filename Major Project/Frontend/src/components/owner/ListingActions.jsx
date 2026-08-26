import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, CheckCircle2, Home, Trash2 } from "lucide-react";
import Button from "../common/Button";
import ConfirmDialog from "../common/ConfirmDialog";
import { propertyApi } from "../../services/api/property.api";

export default function ListingActions({ room, onChanged }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const run = async (fn) => {
    setLoading(true);
    try {
      await fn();
      onChanged?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Link to={`/owner/listings/${room._id}/edit`}>
        <Button size="sm" variant="ghost" icon={Pencil}>Edit</Button>
      </Link>

      {room.status === "draft" && (
        <Button size="sm" variant="secondary" icon={CheckCircle2} loading={loading} onClick={() => run(() => propertyApi.publish(room._id))}>
          Publish
        </Button>
      )}

      {room.status === "published" && (
        <Button size="sm" variant="secondary" icon={Home} loading={loading} onClick={() => run(() => propertyApi.markRented(room._id))}>
          Mark rented
        </Button>
      )}

      <Button size="sm" variant="danger" icon={Trash2} onClick={() => setConfirmDelete(true)}>
        Delete
      </Button>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this listing?"
        message="This can't be undone. The listing will be removed for all seekers."
        confirmLabel="Delete"
        loading={loading}
        onConfirm={() => run(() => propertyApi.remove(room._id)).then(() => setConfirmDelete(false))}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
