export default function TypingIndicator({ name = "Someone" }) {
  return (
    <div className="flex items-center gap-2 px-4 pb-1 text-xs text-gray-400">
      <span>{name} is typing</span>
      <span className="flex gap-0.5">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
      </span>
    </div>
  );
}
