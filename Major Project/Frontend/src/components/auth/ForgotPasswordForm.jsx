import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { api } from "../../services/api/axios";
import { getErrorMessage } from "../../utils/errorHandler";
import { isEmail } from "../../utils/validators";

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "" } });

  const onSubmit = async ({ email }) => {
    setServerError(null);
    try {
      // Backend endpoint to be added: POST /auth/forgot-password { email }
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <CheckCircle2 className="mx-auto mb-3 text-green-500" size={40} />
        <h1 className="text-xl font-semibold text-gray-900">Check your inbox</h1>
        <p className="mt-2 text-sm text-gray-500">
          If an account exists for that email, we've sent a link to reset your password.
        </p>
        <Link to="/login" className="mt-6 inline-block text-sm font-medium text-brand-600 hover:underline">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Forgot your password?</h1>
      <p className="mt-1 text-sm text-gray-500">
        Enter your email and we'll send you a link to reset it.
      </p>

      {serverError && (
        <div className="mt-4">
          <ErrorMessage message={serverError} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            validate: (v) => isEmail(v) || "Enter a valid email address",
          })}
        />
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
