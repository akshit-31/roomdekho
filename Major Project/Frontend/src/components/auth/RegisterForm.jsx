import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import SocialLogin from "./SocialLogin";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/errorHandler";
import { isEmail, isStrongPassword } from "../../utils/validators";

const ROLE_OPTIONS = [
  { value: "seeker", label: "I'm looking for a room" },
  { value: "roommate", label: "I'm looking for a roommate" },
  { value: "owner", label: "I'm an owner listing a property" },
];

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: "", email: "", password: "", role: "seeker" } });

  const password = watch("password");

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await registerUser(data).unwrap();
      navigate("/login", { state: { justRegistered: true } });
    } catch (err) {
      setServerError(getErrorMessage(err) || err || "Unable to create account");
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
      <p className="mt-1 text-sm text-gray-500">Find a room, a roommate, or both — in one place.</p>

      {serverError && (
        <div className="mt-4">
          <ErrorMessage message={typeof serverError === "string" ? serverError : "Unable to create account"} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <Input
          label="Full name"
          placeholder="Priya Sharma"
          error={errors.name?.message}
          {...register("name", { required: "Name is required", minLength: { value: 2, message: "Too short" } })}
        />
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
        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            validate: (v) => isStrongPassword(v) || "Use at least 8 characters",
          })}
        />
        <Select
          label="I am here to..."
          options={ROLE_OPTIONS}
          error={errors.role?.message}
          {...register("role", { required: true })}
        />

        <Button type="submit" className="w-full" loading={isSubmitting} disabled={!password}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
