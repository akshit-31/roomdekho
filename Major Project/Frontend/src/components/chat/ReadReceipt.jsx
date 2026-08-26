import { Check, CheckCheck } from "lucide-react";

/**
 * Simplified sent/read indicator. The backend does not yet persist
 * per-message read state (see server/src/modules/chat) — `status`
 * defaults to "sent" until a readBy/readAt field is added, at which
 * point this component's props stay the same.
 */
export default function ReadReceipt({ status = "sent" }) {
  if (status === "read") {
    return <CheckCheck size={14} className="text-brand-300" />;
  }
  if (status === "delivered") {
    return <CheckCheck size={14} className="text-white/70" />;
  }
  return <Check size={14} className="text-white/70" />;
}
