import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { api } from "../../services/api/axios";
import { getErrorMessage } from "../../utils/errorHandler";
import { isStrongPassword } from "../../utils/validators";

export default function ResetPasswordForm() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { password: "", confirmPassword: "" } });

  const password = watch("password");

  const onSubmit = async ({ password }) => {
    setServerError(null);
    try {
      // Backend endpoint to be added: POST /auth/reset-password { token, password }
      await api.post("/auth/reset-password", { token, password });
      navigate("/login", { state: { passwordReset: true } });
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  if (!token) {
    return <ErrorMessage message="This reset link is invalid or has expired. Please request a new one." />;
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Set a new password</h1>
      <p className="mt-1 text-sm text-gray-500">Choose a strong password you haven't used before.</p>

      {serverError && (
        <div className="mt-4">
          <ErrorMessage message={serverError} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <Input
          label="New password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            validate: (v) => isStrongPassword(v) || "Use at least 8 characters",
          })}
        />
        <Input
          label="Confirm new password"
          type="password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (v) => v === password || "Passwords do not match",
          })}
        />
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Reset password
        </Button>
      </form>
    </div>
  );
}
