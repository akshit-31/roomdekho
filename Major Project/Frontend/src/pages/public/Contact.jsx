import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, CheckCircle2 } from "lucide-react";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";
import { api } from "../../services/api/axios";
import { getErrorMessage } from "../../utils/errorHandler";
import { isEmail } from "../../utils/validators";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: "", email: "", message: "" } });

  const onSubmit = async (data) => {
    setError(null);
    try {
      // Backend endpoint to be added: POST /support/contact
      await api.post("/support/contact", data);
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Contact us</h1>
      <p className="mt-2 text-sm text-gray-500">
        Questions, feedback, or something not working right? Send us a note.
      </p>

      {sent ? (
        <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-6 text-center">
          <CheckCircle2 className="mx-auto mb-2 text-green-600" size={32} />
          <p className="text-sm font-medium text-green-800">Message sent — we'll get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          {error && <ErrorMessage message={error} />}

          <Input label="Your name" error={errors.name?.message} {...register("name", { required: "Name is required" })} />
          <Input
            label="Email address"
            type="email"
            error={errors.email?.message}
            {...register("email", { required: "Email is required", validate: (v) => isEmail(v) || "Enter a valid email" })}
          />
          <Textarea
            label="Message"
            rows={5}
            error={errors.message?.message}
            {...register("message", { required: "Please write a message" })}
          />

          <Button type="submit" loading={isSubmitting} icon={Mail} className="w-full">
            Send message
          </Button>
        </form>
      )}
    </div>
  );
}
