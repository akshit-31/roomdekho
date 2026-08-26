import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import clsx from "clsx";
import { storage } from "../../utils/storage";

const KEY = "favorite_rooms";

function readFavorites() {
  return storage.get(KEY, []);
}

/**
 * Client-side favorites for now (localStorage) — swap the two handlers
 * below for propertyApi.favorite()/unfavorite() once that backend
 * endpoint exists, without changing the component's public API.
 */
export default function FavoriteButton({ roomId, size = 18, className }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(readFavorites().includes(roomId));
  }, [roomId]);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const favs = readFavorites();
    const next = isFav ? favs.filter((id) => id !== roomId) : [...favs, roomId];
    storage.set(KEY, next);
    setIsFav(!isFav);
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={isFav}
      aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
      className={clsx(
        "rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition-colors hover:bg-white",
        className
      )}
    >
      <Heart
        size={size}
        className={isFav ? "fill-red-500 text-red-500" : "text-gray-500"}
      />
    </button>
  );
}
