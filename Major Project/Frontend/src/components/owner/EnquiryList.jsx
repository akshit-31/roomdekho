import { Link } from "react-router-dom";
import { MessageCircle, DoorOpen, Clock } from "lucide-react";
import defaultAvatar from "/images/default-avatar.jpg";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import { timeAgo } from "../../utils/formatDate";

export default function EnquiryList({ enquiries = [] }) {
  if (!enquiries.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <MessageCircle size={24} />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No Seeker Inquiries Yet</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          When seekers view your listings and message you, their direct chats and visit requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {enquiries.map((e) => {
        const seekerId = e.seeker_id || e.seeker?.id || e.seeker?._id || e.user?.id;
        const chatLink = e.conversationId
          ? `/chat/${e.conversationId}`
          : seekerId
          ? `/chat?userId=${seekerId}`
          : `/chat`;

        return (
          <div
            key={e._id || e.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-amber-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-[2px]">
                  <img
                    src={e.seeker?.avatarUrl || defaultAvatar}
                    alt={e.seeker?.name}
                    className="h-11 w-11 rounded-full object-cover border border-white"
                  />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {e.seeker?.name || "Room Seeker"}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                    <DoorOpen size={10} /> Inquiring Seeker
                  </span>
                </div>
                <p className="line-clamp-1 text-xs text-slate-500 mt-0.5">
                  <span className="font-semibold text-slate-700">{e.room?.title || "Your Property Listing"}:</span>{" "}
                  {e.message || "Hi, I am interested in this room! Can we connect?"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock size={12} /> {timeAgo(e.createdAt || e.created_at)}
              </span>

              <Link to={chatLink}>
                <Button
                  size="sm"
                  className="!bg-gradient-to-r !from-amber-500 !to-orange-500 hover:!from-amber-600 hover:!to-orange-600 !text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <MessageCircle size={14} />
                  Chat on DM
                </Button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
