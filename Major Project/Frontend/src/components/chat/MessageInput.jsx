import { useRef, useState } from "react";
import { Send, ImagePlus, Smile } from "lucide-react";
import { emitTyping } from "../../socket/chat.socket";

const QUICK_EMOJIS = ["❤️", "👍", "🏠", "🔑", "✨", "🙏"];

export default function MessageInput({ conversationId, currentUserId, onSend, onSendImage }) {
  const [text, setText] = useState("");
  const typingTimeout = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    emitTyping(conversationId, currentUserId, true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => emitTyping(conversationId, currentUserId, false), 1500);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
    emitTyping(conversationId, currentUserId, false);
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (file) onSendImage?.(file);
    e.target.value = "";
  };

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji);
  };

  return (
    <div className="border-t border-slate-100 bg-white p-3">
      {/* Quick emoji reaction strip */}
      <div className="mb-2 flex items-center gap-1.5 px-2">
        <span className="text-[10px] font-semibold text-slate-400">Quick:</span>
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => addEmoji(emoji)}
            className="hover:scale-125 transition-transform text-sm px-1"
          >
            {emoji}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="flex items-center gap-2">
        <label
          className="cursor-pointer rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-amber-500 transition-colors"
          title="Send photo"
        >
          <ImagePlus size={20} />
          <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
        </label>

        <div className="relative flex-1">
          <input
            value={text}
            onChange={handleChange}
            placeholder="Message..."
            className="w-full rounded-full border border-slate-200/80 bg-slate-50/60 px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={!text.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
