import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import defaultAvatar from "/images/default-avatar.jpg";
import ConfirmDialog from "../common/ConfirmDialog";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import { adminApi } from "../../services/api/admin.api";
import { chatApi } from "../../services/api/chat.api";
import { formatDate } from "../../utils/formatDate";

const ROLE_STYLES = {
  seeker: "bg-gray-100 text-gray-700",
  roommate: "bg-blue-100 text-blue-700",
  owner: "bg-purple-100 text-purple-700",
  admin: "bg-amber-100 text-amber-800",
  both: "bg-emerald-100 text-emerald-800",
};

export default function UserTable({ users = [], onChanged }) {
  const navigate = useNavigate();
  const [target, setTarget] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStartChat = async (userId) => {
    try {
      const { data } = await chatApi.createConversation(userId);
      const convId = data.data?.id || data.data?._id;
      if (convId) {
        navigate(`/chat/${convId}`);
      } else {
        navigate(`/chat?userId=${userId}`);
      }
    } catch {
      navigate(`/chat?userId=${userId}`);
    }
  };

  if (!users.length) return <EmptyState title="No users found" />;

  const confirmBan = async () => {
    setLoading(true);
    try {
      await adminApi.banUser(target._id, reason || "Violation of platform policy");
      onChanged?.();
    } finally {
      setLoading(false);
      setTarget(null);
      setReason("");
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">KYC</th>
            <th className="px-4 py-3 font-medium">Joined</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <img src={u.avatarUrl || defaultAvatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col items-start gap-1">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${ROLE_STYLES[u.role] || "bg-gray-100 text-gray-700"}`}>
                    {u.role}
                  </span>
                  {u.role !== "admin" && u.role !== "owner" && (u.intent === "both" || u.lookingFor === "both") && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                      Both (Room & Flatmate)
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-xs capitalize text-gray-600">
                <div className="flex items-center gap-1.5">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.kyc?.status === "verified" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {u.kyc?.status?.replace("_", " ") || "not submitted"}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-gray-500">{formatDate(u.createdAt)}</td>
              <td className="px-4 py-3">
                {u.isBanned ? (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">Banned</span>
                ) : (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Active</span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartChat(u._id)}
                    className="flex items-center gap-1 rounded-xl bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 hover:bg-amber-100 transition-all border border-amber-200"
                  >
                    <MessageCircle size={14} />
                    <span>Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await adminApi.updateKyc(u._id, u.kyc?.status !== "verified");
                      onChanged?.();
                    }}
                    className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all border ${
                      u.kyc?.status === "verified"
                        ? "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                        : "bg-green-600 text-white border-green-600 hover:bg-green-700 shadow-sm"
                    }`}
                  >
                    {u.kyc?.status === "verified" ? "Unverify KYC" : "Verify Account"}
                  </button>

                  {!u.isBanned && (
                    <Button size="sm" variant="danger" onClick={() => setTarget(u)}>Ban</Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        open={!!target}
        title={`Ban ${target?.name}?`}
        message="They will lose access to the platform immediately."
        confirmLabel="Ban user"
        loading={loading}
        onConfirm={confirmBan}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}
