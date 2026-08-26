import { Route } from "react-router-dom";
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Help from "../pages/public/Help";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyAccount from "../pages/auth/VerifyAccount";
import RoomSearch from "../pages/rooms/RoomSearch";
import RoomDetails from "../pages/rooms/RoomDetails";
import FindRoommate from "../pages/roommates/FindRoommate";
import MyMatches from "../pages/roommates/MyMatches";
import Chat from "../pages/chat/Chat";
import MyVisits from "../pages/booking/MyVisits";
import Favorites from "../pages/favorites/Favorites";
import Profile from "../pages/profile/Profile";

export default function PublicRoutes() {
  return (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/help" element={<Help />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-account" element={<VerifyAccount />} />
      <Route path="/rooms" element={<RoomSearch />} />
      <Route path="/rooms/:id" element={<RoomDetails />} />
      <Route path="/roommates" element={<FindRoommate />} />
      <Route path="/matches" element={<MyMatches />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:conversationId" element={<Chat />} />
      <Route path="/visits" element={<MyVisits />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/profile" element={<Profile />} />
    </>
  );
}
