import { useState } from "react";
import { Search } from "lucide-react";
import Button from "../common/Button";

/**
 * Top-of-page keyword + city search bar. On submit it hands `q` and
 * `city` straight to useSearch().search({...filters, q, city}).
 */
export default function SearchBar({ onSearch, initialQuery = "" }) {
  const [q, setQ] = useState(initialQuery);

  const submit = (e) => {
    e.preventDefault();
    onSearch(q);
  };

  return (
    <form onSubmit={submit} className="flex w-full max-w-2xl items-center gap-2">
      <div className="relative flex-1">
        <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, locality, or landmark..."
          className="w-full rounded-2xl border border-gray-300 py-3 pl-10 pr-4 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <Button type="submit" size="lg">Search</Button>
    </form>
  );
}
