import { Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import RoommateDetails from "../pages/roommates/RoommateDetails";
import MyRoommateProfile from "../pages/roommates/MyRoommateProfile";
import VisitDetails from "../pages/booking/VisitDetails";
import Notifications from "../pages/notifications/Notifications";
import Expenses from "../pages/expenses/Expenses";
import Reviews from "../pages/reviews/Reviews";
import EditProfile from "../pages/profile/EditProfile";
import Preferences from "../pages/profile/Preferences";
import Privacy from "../pages/profile/Privacy";
import Security from "../pages/profile/Security";

export default function PrivateRoutes() {
  return (
    <Route element={<ProtectedRoute />}>
      <Route path="/roommates/:id" element={<RoommateDetails />} />
      <Route path="/roommates/me" element={<MyRoommateProfile />} />
      <Route path="/visits/:id" element={<VisitDetails />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/profile/preferences" element={<Preferences />} />
      <Route path="/profile/privacy" element={<Privacy />} />
      <Route path="/profile/security" element={<Security />} />
    </Route>
  );
}
