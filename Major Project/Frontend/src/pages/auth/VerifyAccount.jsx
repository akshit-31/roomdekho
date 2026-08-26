import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import OTPVerification from "../../components/auth/OTPVerification";

/**
 * Expects navigation state { contact, purpose } set by Register.jsx or
 * a "verify phone/email" action elsewhere. Falls back to a generic
 * message if the page is opened directly without that context.
 */
export default function VerifyAccount() {
  const location = useLocation();
  const navigate = useNavigate();
  const { contact, purpose = "email" } = location.state || {};

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <img src={logo} alt="Room Searcher & Roommate" className="h-9 w-9 rounded-lg" />
          <span className="text-base font-semibold text-gray-900">Room Searcher</span>
        </Link>

        {contact ? (
          <OTPVerification
            contact={contact}
            purpose={purpose}
            onVerified={() => navigate("/", { replace: true })}
          />
        ) : (
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900">Nothing to verify</h1>
            <p className="mt-2 text-sm text-gray-500">
              Please start from the registration or profile page to verify your email or phone.
            </p>
            <Link to="/login" className="mt-4 inline-block text-sm font-medium text-brand-600 hover:underline">
              Back to log in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
