import { useState } from "react";

export default function ImageMessage({ url, alt = "Shared image" }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button onClick={() => setExpanded(true)} className="block overflow-hidden rounded-xl">
        <img src={url} alt={alt} className="max-h-56 w-full object-cover" />
      </button>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setExpanded(false)}
        >
          <img src={url} alt={alt} className="max-h-full max-w-full rounded-lg" />
        </div>
      )}
    </>
  );
}
