import { useState } from "react";
import { Star } from "lucide-react";
import clsx from "clsx";

const SIZES = { sm: 14, md: 18, lg: 24 };

/**
 * Dual-purpose: read-only display (`readOnly`) or an interactive 1-5
 * picker used by ReviewForm. `value` may be fractional for display
 * (e.g. 4.3) — interactive mode always reports whole numbers.
 */
export default function RatingStars({ value = 0, onChange, readOnly = false, size = "md" }) {
  const [hovered, setHovered] = useState(null);
  const px = SIZES[size] || SIZES.md;
  const display = hovered ?? value;

  return (
    <div className="inline-flex items-center gap-0.5" role={readOnly ? undefined : "radiogroup"} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = display >= star;
        const partial = !filled && display >= star - 1 && display < star;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(null)}
            className={clsx(readOnly ? "cursor-default" : "cursor-pointer")}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              size={px}
              className={clsx(
                filled || partial ? "fill-amber-400 text-amber-400" : "fill-transparent text-gray-300"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
