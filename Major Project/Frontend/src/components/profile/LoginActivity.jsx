import { useEffect, useState } from "react";
import { Laptop, Smartphone, X } from "lucide-react";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import { userApi } from "../../services/api/user.api";
import { timeAgo } from "../../utils/formatDate";

function guessDeviceIcon(userAgent = "") {
  return /mobile|android|iphone/i.test(userAgent) ? Smartphone : Laptop;
}

/**
 * Session/device management — GET /users/me/devices, revoke via
 * DELETE /users/me/devices/:deviceId (server/src/modules/users).
 */
export default function LoginActivity() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await userApi.listDevices();
      setDevices(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const revoke = async (deviceId) => {
    setRevokingId(deviceId);
    try {
      await userApi.revokeDevice(deviceId);
      setDevices((d) => d.filter((x) => x.deviceId !== deviceId));
    } finally {
      setRevokingId(null);
    }
  };

  if (loading) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">Login activity &amp; devices</h2>

      {!devices.length ? (
        <EmptyState title="No other active sessions" />
      ) : (
        <div className="space-y-2">
          {devices.map((d) => {
            const Icon = guessDeviceIcon(d.userAgent);
            return (
              <div key={d.deviceId} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                <Icon size={18} className="text-gray-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-800">{d.userAgent || "Unknown device"}</p>
                  <p className="text-xs text-gray-400">{d.ip} · Active {timeAgo(d.lastActiveAt)}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={X}
                  loading={revokingId === d.deviceId}
                  onClick={() => revoke(d.deviceId)}
                >
                  Revoke
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
