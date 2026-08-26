import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ShieldAlert, Building2, UserCheck } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import SocialLogin from "./SocialLogin";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/errorHandler";
import { isEmail } from "../../utils/validators";

const LOGIN_ROLES = [
  { id: "owner", label: "Room Owner", icon: Building2 },
  { id: "seeker", label: "User / Roommate", icon: UserCheck },
];

export default function LoginForm({ onSuccess, isModal = false }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState("owner");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const toggleAdminMode = () => {
    const nextState = !isAdminMode;
    setIsAdminMode(nextState);
    if (nextState) {
      // Auto-fill admin preset
      setValue("email", "admin1@roomdekho.com");
      setValue("password", "Password@123");
    } else {
      setValue("email", "");
      setValue("password", "");
    }
  };

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const res = await login(data).unwrap();
      if (onSuccess) {
        onSuccess();
      } else {
        const userRole = res?.data?.user?.role || res?.user?.role;
        if (userRole === "admin") {
          navigate("/admin", { replace: true });
        } else if (userRole === "owner") {
          navigate("/owner", { replace: true });
        } else if (selectedRole === "vendor" || userRole === "seeker" || userRole === "roommate") {
          navigate("/vendor", { replace: true });
        } else {
          const redirectTo = location.state?.from?.pathname || "/vendor";
          navigate(redirectTo, { replace: true });
        }
      }
    } catch (err) {
      setServerError(getErrorMessage(err) || err || "Unable to log in");
    }
  };

  return (
    <div className="w-full">
      {/* Role Selection Tabs */}
      {!isAdminMode ? (
        <div className="mb-5 flex rounded-2xl border border-white/20 bg-black/30 p-1">
          {LOGIN_ROLES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedRole(id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                selectedRole === id
                  ? "bg-amber-500 text-white shadow-md"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-5 flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-2 text-xs font-bold text-red-400">
          <ShieldAlert size={16} />
          <span>Admin Portal Login Mode</span>
        </div>
      )}

      <h1 className="text-xl font-bold text-white">
        {isAdminMode
          ? "Admin Gateway"
          : selectedRole === "owner"
          ? "Room Owner Login"
          : "User / Roommate Login"}
      </h1>
      <p className="mt-1 text-xs text-slate-300">
        {isAdminMode
          ? "Enter administrator credentials."
          : `Log in to manage your ${selectedRole === "owner" ? "properties" : "profile & room search"}.`}
      </p>

      {serverError && (
        <div className="mt-4">
          <ErrorMessage message={typeof serverError === "string" ? serverError : "Unable to log in"} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3.5" noValidate>
        <Input
          label="Email address"
          type="email"
          placeholder={isAdminMode ? "admin1@roomdekho.com" : "user@roomdekho.com"}
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            validate: (v) => isEmail(v) || "Enter a valid email address",
          })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-[11px] font-medium text-amber-400 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className={`w-full font-bold ${isAdminMode ? "!bg-red-600 hover:!bg-red-700" : "!bg-amber-500 hover:!bg-amber-600"}`}
          loading={isSubmitting}
        >
          {isAdminMode ? "Login as Admin" : `Login as ${selectedRole === "owner" ? "Room Owner" : "User / Roommate"}`}
        </Button>
      </form>

      {/* Secret Eye Icon for Admin Access at bottom */}
      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <p className="text-[11px] text-slate-400">
          Need an account?{" "}
          <Link to="/register" className="font-semibold text-amber-400 hover:underline">
            Register here
          </Link>
        </p>

        {/* Hidden Admin Eye Icon */}
        <button
          type="button"
          onClick={toggleAdminMode}
          className={`group flex items-center gap-1.5 rounded-full p-1.5 transition-all ${
            isAdminMode
              ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : "text-slate-400 hover:text-amber-400 hover:bg-white/10"
          }`}
          title={isAdminMode ? "Switch to Owner/Vendor Login" : "Admin Login Portal"}
        >
          {isAdminMode ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
