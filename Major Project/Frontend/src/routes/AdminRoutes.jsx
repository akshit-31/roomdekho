import { Route } from "react-router-dom";
import RoleRoute from "../components/common/RoleRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Users from "../pages/admin/Users";
import Listings from "../pages/admin/Listings";
import Kyc from "../pages/admin/Kyc";
import Reports from "../pages/admin/Reports";
import FraudDetection from "../pages/admin/FraudDetection";
import Complaints from "../pages/admin/Complaints";
import AdminReviews from "../pages/admin/Reviews";
import Payments from "../pages/admin/Payments";
import Analytics from "../pages/admin/Analytics";
import Settings from "../pages/admin/Settings";

export default function AdminRoutes() {
  return (
    <Route element={<RoleRoute allow={["admin"]} />}>
      <Route element={<DashboardLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/listings" element={<Listings />} />
        <Route path="/admin/kyc" element={<Kyc />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/fraud" element={<FraudDetection />} />
        <Route path="/admin/complaints" element={<Complaints />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/payments" element={<Payments />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>
    </Route>
  );
}
