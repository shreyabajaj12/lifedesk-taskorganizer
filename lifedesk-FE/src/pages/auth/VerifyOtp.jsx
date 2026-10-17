import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MailCheck } from "lucide-react";
import { resendOtp, verifyRegistrationOtp } from "../../api/authApi";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setOtp(value);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email information is missing. Please register again.");
      return;
    }

    if (otp.length !== 5) {
      setError("Please enter the 5-digit OTP.");
      return;
    }

    try {
      setIsVerifying(true);
      setError("");
      setMessage("");

      await verifyRegistrationOtp(email, otp);

      navigate("/login");
    } catch (err) {
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
              "Invalid or expired OTP. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email information is missing. Please register again.");
      return;
    }

    try {
      setIsResending(true);
      setError("");
      setMessage("");

      const response = await resendOtp(email);

      setMessage(response);
      setOtp("");
    } catch (err) {
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
              "Unable to resend OTP. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <MailCheck size={22} />
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Verify your email
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            We've sent a verification code to
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {email || "your email"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Enter verification code
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the 6-digit code sent to your email.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-600">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={5}
              value={otp}
              onChange={handleChange}
              placeholder="00000"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl font-semibold tracking-[0.5em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:bg-white"
            />

            <button
              type="submit"
              disabled={isVerifying || otp.length !== 5}
              className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Didn't receive the code?
            </p>

            <button
              onClick={handleResend}
              disabled={isResending}
              className="mt-1 text-sm font-semibold text-slate-900 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          {/* Back */}
          <Link
            to="/signup"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            Back to signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

