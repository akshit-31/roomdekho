import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ShieldAlert, Building2, UserCheck } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/errorHandler";
import { isEmail } from "../../utils/validators";

const LOGIN_ROLES = [
  { id: "seeker", label: "User", icon: UserCheck },
  { id: "owner", label: "Room Owner", icon: Building2 },
];

export default function LoginForm({ onSuccess, isModal = false }) {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState("seeker"); // "seeker" (User) | "owner"
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [roleMismatchTarget, setRoleMismatchTarget] = useState(null); // "owner" | "seeker"

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const toggleAdminMode = () => {
    const nextState = !isAdminMode;
    setIsAdminMode(nextState);
    setServerError(null);
    setRoleMismatchTarget(null);
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
    setRoleMismatchTarget(null);
    const expectedRole = isAdminMode ? "admin" : selectedRole;

    try {
      const payload = {
        email: data.email,
        password: data.password,
        role: expectedRole,
      };

      const res = await login(payload).unwrap();
      const userRole = res?.data?.user?.role || res?.user?.role;

      // Strict client-side verification to guarantee no role crossover
      if (expectedRole === "owner" && userRole !== "owner") {
        await logout();
        setServerError("Yeh account User (Room Seeker) ke roop mein registered hai. Kripya 'User' tab select karke login karein.");
        setRoleMismatchTarget("seeker");
        return;
      }
      if (expectedRole === "seeker" && userRole === "owner") {
        await logout();
        setServerError("Yeh account Room Owner ke roop mein registered hai. Kripya 'Room Owner' tab select karke login karein.");
        setRoleMismatchTarget("owner");
        return;
      }
      if (expectedRole === "admin" && userRole !== "admin") {
        await logout();
        setServerError("Access Denied: Is account ke paas administrator privileges nahi hain.");
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            localStorage.setItem("user_gps", JSON.stringify(coords));
          },
          () => {},
          { timeout: 8000, enableHighAccuracy: true }
        );
      }

      if (onSuccess) {
        onSuccess();
      } else {
        if (userRole === "admin") {
          navigate("/admin", { replace: true });
        } else if (userRole === "owner") {
          navigate("/owner", { replace: true });
        } else {
          const redirectTo = location.state?.from?.pathname || "/profile";
          navigate(redirectTo, { replace: true });
        }
      }
    } catch (err) {
      const errMsg = getErrorMessage(err) || err || "Unable to log in";
      setServerError(errMsg);
      if (String(errMsg).includes("Room Owner") || String(errMsg).toLowerCase().includes("owner")) {
        setRoleMismatchTarget("owner");
      } else if (String(errMsg).includes("Seeker") || String(errMsg).includes("User") || String(errMsg).toLowerCase().includes("seeker")) {
        setRoleMismatchTarget("seeker");
      } else {
        setRoleMismatchTarget(null);
      }
    }
  };

  return (
    <div className="w-full">
      {/* Role Selection Tabs - User vs Room Owner */}
      {!isAdminMode ? (
        <div className="mb-4 flex rounded-2xl border border-white/20 bg-black/30 p-1">
          {LOGIN_ROLES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSelectedRole(id);
                setServerError(null);
                setRoleMismatchTarget(null);
              }}
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
        <div className="mb-4 flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-2.5 text-xs font-bold text-red-400">
          <ShieldAlert size={16} />
          <span>Admin Portal Login Mode</span>
        </div>
      )}

      <h1 className="text-xl font-bold text-white">
        {isAdminMode
          ? "Admin Gateway"
          : selectedRole === "owner"
          ? "Room Owner Login"
          : "User Login"}
      </h1>
      <p className="mt-1 text-xs text-slate-300">
        {isAdminMode
          ? "Enter administrator credentials."
          : `Log in to manage your ${selectedRole === "owner" ? "properties and listings" : "profile, rooms & roommates"}.`}
      </p>

      {serverError && (
        <div className="mt-4">
          {String(serverError).toLowerCase().includes("approval") || String(serverError).toLowerCase().includes("review") ? (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/15 p-3.5 text-xs text-amber-200 shadow-lg animate-fade-in">
              <p className="font-bold flex items-center gap-1.5 text-amber-300 mb-1">
                <ShieldAlert size={16} /> Account Under Admin Review
              </p>
              <p className="text-[11px] leading-relaxed text-amber-100">{serverError}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/15 p-3.5 text-xs text-rose-200 shadow-md animate-fade-in">
              <p className="font-bold flex items-center gap-1.5 text-rose-300 mb-1">
                <ShieldAlert size={15} /> Role Validation Error
              </p>
              <p className="text-[11px] leading-relaxed text-rose-100">{typeof serverError === "string" ? serverError : "Unable to log in"}</p>
              {roleMismatchTarget === "owner" && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("owner");
                    setIsAdminMode(false);
                    setServerError(null);
                    setRoleMismatchTarget(null);
                  }}
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
                >
                  <Building2 size={13} /> Switch to Room Owner Login
                </button>
              )}
              {roleMismatchTarget === "seeker" && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("seeker");
                    setIsAdminMode(false);
                    setServerError(null);
                    setRoleMismatchTarget(null);
                  }}
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
                >
                  <UserCheck size={13} /> Switch to User Login
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3.5" noValidate>
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
          {isAdminMode ? "Login as Admin" : `Login as ${selectedRole === "owner" ? "Room Owner" : "User"}`}
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
          title={isAdminMode ? "Switch to User/Owner Login" : "Admin Login Portal"}
        >
          {isAdminMode ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
