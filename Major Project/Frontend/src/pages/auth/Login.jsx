import { Link } from "react-router-dom";
import customLogo from "../../image copy 3.png";
import LoginForm from "../../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="auth-page flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="auth-card w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <img src={customLogo} alt="RoomDekho Logo" className="h-9 w-9 object-contain" />
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            RoomDekho
          </span>
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
