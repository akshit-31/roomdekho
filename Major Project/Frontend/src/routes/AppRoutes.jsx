import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import OwnerRoutes from "./OwnerRoutes";
import AdminRoutes from "./AdminRoutes";
import NotFound from "../pages/public/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {PublicRoutes()}
      {PrivateRoutes()}
      {OwnerRoutes()}
      {AdminRoutes()}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
