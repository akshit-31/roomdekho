import { useEffect, useRef, useState } from "react";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { api } from "../../services/api/axios";
import { getErrorMessage } from "../../utils/errorHandler";

const LENGTH = 6;
const RESEND_SECONDS = 30;

/**
 * Generic OTP box, used for both email and phone verification flows.
 * Backend endpoints to be added: POST /auth/otp/verify, POST /auth/otp/resend
 */
export default function OTPVerification({ contact, purpose = "email", onVerified }) {
  const [digits, setDigits] = useState(Array(LENGTH).fill(""));
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const verify = async () => {
    const code = digits.join("");
    if (code.length !== LENGTH) {
      setError("Enter the full 6-digit code");
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      await api.post("/auth/otp/verify", { contact, purpose, code });
      onVerified?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setVerifying(false);
    }
  };

  const resend = async () => {
    setSecondsLeft(RESEND_SECONDS);
    try {
      await api.post("/auth/otp/resend", { contact, purpose });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Verify your {purpose}</h1>
      <p className="mt-1 text-sm text-gray-500">
        Enter the 6-digit code we sent to <span className="font-medium text-gray-700">{contact}</span>
      </p>

      {error && (
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="mt-6 flex justify-between gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            className="h-12 w-11 rounded-xl border border-gray-300 text-center text-lg font-semibold focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        ))}
      </div>

      <Button className="mt-6 w-full" onClick={verify} loading={verifying}>
        Verify
      </Button>

      <p className="mt-4 text-center text-sm text-gray-500">
        {secondsLeft > 0 ? (
          <>Resend code in {secondsLeft}s</>
        ) : (
          <button onClick={resend} className="font-medium text-brand-600 hover:underline">
            Resend code
          </button>
        )}
      </p>
    </div>
  );
}
