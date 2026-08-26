import { useState } from "react";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import placeholder from "../../assets/images/placeholder-room.jpg";

export default function PropertyGallery({ media = [] }) {
  const [active, setActive] = useState(0);
  const items = media.length ? media : [{ url: placeholder, type: "image" }];
  const current = items[active];

  const prev = () => setActive((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setActive((i) => (i === items.length - 1 ? 0 : i + 1));

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100">
        {current.type === "video" ? (
          <video src={current.url} controls className="h-full w-full object-cover" />
        ) : (
          <img src={current.url} alt="" className="h-full w-full object-cover" />
        )}

        {items.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <button
              key={item.url + i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === active ? "border-brand-500" : "border-transparent"
              }`}
            >
              {item.type === "video" ? (
                <div className="flex h-full w-full items-center justify-center bg-gray-800">
                  <PlayCircle className="text-white" size={20} />
                </div>
              ) : (
                <img src={item.url} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
