import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import customLogo from "../../image copy 3.png";

const COLUMNS = [
  {
    title: "Discover",
    links: [
      { to: "/rooms", label: "Find a Room" },
      { to: "/roommates", label: "Find a Roommate" },
      { to: "/rooms?propertyType=pg", label: "PGs near you" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About us" },
      { to: "/contact", label: "Contact" },
      { to: "/help", label: "Help Center" },
    ],
  },
  {
    title: "For Owners",
    links: [
      { to: "/owner/listings/new", label: "List your property" },
      { to: "/owner", label: "Owner dashboard" },
    ],
  },
];

export default function Footer() {
  const { user } = useAuth();

  if (user?.role === "admin") return null;

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img src={customLogo} alt="RoomDekho Logo" className="h-8 w-8 object-contain" />
              <span className="text-base font-extrabold tracking-tight text-slate-900">RoomDekho</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Find your room and your roommate — together, with AI-matched compatibility.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-gray-900">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-gray-500 hover:text-brand-600">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Room Searcher & Roommate. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link to="/help" className="hover:text-gray-600">Privacy</Link>
            <Link to="/help" className="hover:text-gray-600">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
