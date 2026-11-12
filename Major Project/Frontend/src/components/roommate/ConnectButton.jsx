import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, UserPlus, MessageCircle } from "lucide-react";
import Button from "../common/Button";
import { matchApi } from "../../services/api/match.api";

const NEXT_STATUS = { suggested: "interested", interested: "connected" };

/**
 * Advances a Match's status (see server/src/modules/matching/match.model.js
 * status enum: suggested -> interested -> connected) and, once connected,
 * jumps straight into a chat with that roommate.
 */
export default function ConnectButton({ matchId, userId, status = "suggested", onStatusChange }) {
  const [current, setCurrent] = useState(status);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    if (current === "connected" || !matchId) {
      navigate(`/chat?userId=${userId}`);
      return;
    }
    setLoading(true);
    try {
      const nextStatus = NEXT_STATUS[current] || "interested";
      await matchApi.updateStatus(matchId, nextStatus);
      setCurrent(nextStatus);
      onStatusChange?.(nextStatus);
    } finally {
      setLoading(false);
    }
  };

  const config = {
    suggested: { icon: UserPlus, label: "I'm interested" },
    interested: { icon: UserCheck, label: "Interest sent" },
    connected: { icon: MessageCircle, label: "Message" },
    dismissed: { icon: UserPlus, label: "I'm interested" },
  }[current];

  return (
    <Button
      onClick={handleClick}
      loading={loading}
      icon={config.icon}
      variant={current === "connected" ? "primary" : "secondary"}
      disabled={current === "interested"}
      size="sm"
    >
      {config.label}
    </Button>
  );
}
