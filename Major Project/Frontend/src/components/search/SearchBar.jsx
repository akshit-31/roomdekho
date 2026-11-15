import { useState } from "react";
import { Search } from "lucide-react";
import Button from "../common/Button";

/**
 * Top-of-page keyword search bar with dark glassmorphic styling.
 */
export default function SearchBar({ onSearch, initialQuery = "" }) {
  const [q, setQ] = useState(initialQuery);

  const submit = (e) => {
    e.preventDefault();
    onSearch(q);
  };

  return (
    <form onSubmit={submit} className="flex w-full items-center gap-2">
      <div className="relative flex-1">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, locality, or landmark..."
          className="w-full rounded-2xl border border-white/15 bg-slate-900/80 backdrop-blur-xl py-3 pl-11 pr-4 text-xs sm:text-sm text-white placeholder-slate-400 shadow-xl focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="!bg-gradient-to-r !from-amber-500 !to-orange-500 hover:!from-amber-600 hover:!to-orange-600 !text-white font-black shadow-lg shadow-amber-500/25 px-5 sm:px-7 rounded-2xl transition-all hover:scale-105 active:scale-95 border border-amber-400/40"
      >
        Search
      </Button>
    </form>
  );
}
