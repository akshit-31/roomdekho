import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

export default function ResetPassword() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <img src={logo} alt="Room Searcher & Roommate" className="h-9 w-9 rounded-lg" />
          <span className="text-base font-semibold text-gray-900">Room Searcher</span>
        </Link>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
