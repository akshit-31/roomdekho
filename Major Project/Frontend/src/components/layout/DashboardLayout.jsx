import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

/**
 * Shell used by /owner/* and /admin/* routes.
 * The navigation is unified in the glassmorphism slide-out drawer on the hamburger menu,
 * keeping the dashboard interface full-width, clean, and fully responsive across mobile and desktop.
 */
export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full max-w-full overflow-x-hidden">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <main className="min-w-0 flex-1 w-full max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
