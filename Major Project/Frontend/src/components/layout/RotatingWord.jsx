import { useEffect, useState } from "react";

/**
 * Cycles through `words`, swapping one every `interval` ms with a short
 * slide + fade transition. Used in the hero headline so it reads
 * "Find your room." then "Find your roommate." instead of showing both
 * lines at once.
 */
export default function RotatingWord({ words, interval = 2000 }) {
  const [index, setIndex] = useState(0);
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setEntering(false);
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setEntering(true);
      }, 220);
      return () => clearTimeout(swap);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  return (
    <span className="hero-rotator">
      <span className={entering ? "hero-rotator-word hero-rotator-in" : "hero-rotator-word hero-rotator-out"}>
        {words[index]}
      </span>
    </span>
  );
}
