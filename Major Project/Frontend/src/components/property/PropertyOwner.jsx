import { Link } from "react-router-dom";
import { MessageCircle, ShieldCheck } from "lucide-react";
import defaultAvatar from "/images/default-avatar.jpg";
import Button from "../common/Button";

export default function PropertyOwner({ owner, roomId }) {
  if (!owner) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">Listed by</h2>
      <div className="flex items-center gap-3">
        <img
          src={owner.avatarUrl || defaultAvatar}
          alt={owner.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 truncate text-sm font-medium text-gray-900">
            {owner.name}
            {owner.kyc?.status === "verified" && (
              <ShieldCheck size={14} className="shrink-0 text-brand-500" />
            )}
          </p>
          {owner.reputationScore != null && (
            <p className="text-xs text-gray-500">{owner.reputationScore.toFixed(1)} reputation score</p>
          )}
        </div>
      </div>

      <Link to={`/chat?roomId=${roomId}&ownerId=${owner._id}`} className="mt-4 block">
        <Button variant="secondary" className="w-full" icon={MessageCircle}>
          Message owner
        </Button>
      </Link>
    </div>
  );
}
