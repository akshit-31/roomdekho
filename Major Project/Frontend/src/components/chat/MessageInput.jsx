import { useRef, useState } from "react";
import { Send, ImagePlus } from "lucide-react";
import { emitTyping } from "../../socket/chat.socket";

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

  return (
    <form onSubmit={submit} className="flex items-center gap-2 border-t border-gray-100 px-4 py-3">
      <label className="cursor-pointer rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-brand-600">
        <ImagePlus size={20} />
        <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
      </label>

      <input
        value={text}
        onChange={handleChange}
        placeholder="Type a message..."
        className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
      />

      <button
        type="submit"
        disabled={!text.trim()}
        className="rounded-full bg-brand-500 p-2.5 text-white hover:bg-brand-600 disabled:opacity-40"
        aria-label="Send message"
      >
        <Send size={18} />
      </button>
    </form>
  );
}
