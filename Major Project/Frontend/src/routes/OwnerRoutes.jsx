import { Route } from "react-router-dom";
import RoleRoute from "../components/common/RoleRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

import OwnerDashboard from "../pages/owner/OwnerDashboard";
import Listings from "../pages/owner/Listings";
import AddListing from "../pages/owner/AddListing";
import EditListing from "../pages/owner/EditListing";
import Enquiries from "../pages/owner/Enquiries";
import Visits from "../pages/owner/Visits";
import Bookings from "../pages/owner/Bookings";
import Earnings from "../pages/owner/Earnings";
import OwnerReviews from "../pages/owner/Reviews";

/**
 * RoleRoute gates access; DashboardLayout supplies the Navbar+Sidebar
 * chrome shared by every /owner/* screen (App.jsx skips the public
 * Navbar/Footer for these paths — see isDashboardRoute).
 */
export default function OwnerRoutes() {
  return (
    <Route element={<RoleRoute allow={["owner", "admin"]} />}>
      <Route element={<DashboardLayout />}>
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/owner/listings" element={<Listings />} />
        <Route path="/owner/listings/new" element={<AddListing />} />
        <Route path="/owner/listings/:id/edit" element={<EditListing />} />
        <Route path="/owner/enquiries" element={<Enquiries />} />
        <Route path="/owner/visits" element={<Visits />} />
        <Route path="/owner/bookings" element={<Bookings />} />
        <Route path="/owner/earnings" element={<Earnings />} />
        <Route path="/owner/reviews" element={<OwnerReviews />} />
      </Route>
    </Route>
  );
}
