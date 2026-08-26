import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import roomIcon from "../../assets/icons/room.svg";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <img src={roomIcon} alt="" className="h-16 w-16 opacity-30" />
      <h1 className="mt-4 text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-sm text-gray-500">
        This page doesn't exist — it may have been moved, or the link is incorrect.
      </p>
      <Link
        to="/"
        className="mt-6 flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
      >
        <Home size={16} /> Back to home
      </Link>
    </div>
  );
}
