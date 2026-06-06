"use client";

import { useState, type FormEvent } from "react";
import { Mail, Lock, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/auth.service";

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      await authService.forgotPassword(email.trim());
      setStep("otp");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset code."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!token.trim() || !newPassword) return;
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authService.resetPassword(email, token.trim(), newPassword);
      setStep("success");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {step === "email" && (
        <form onSubmit={handleSendCode} className="space-y-5">
          <p className="text-sm text-[var(--color-text-muted)]">
            Enter your email address and we&rsquo;ll send you a password reset code.
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                autoComplete="email"
                className="w-full py-3.5 pl-11 pr-4 text-sm border-2 rounded-xl outline-none bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] border-[var(--color-accent)] focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-primary)", color: "white", borderRadius: "var(--radius-button)" }}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </span>
            ) : (
              "Send Reset Code"
            )}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleReset} className="space-y-5">
          <p className="text-sm text-[var(--color-text-muted)]">
            Enter the reset code sent to <strong>{email}</strong> and choose a new password.
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
              Reset Code
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter reset code"
                className="w-full py-3.5 pl-11 pr-4 text-sm border-2 rounded-xl outline-none bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] border-[var(--color-accent)] focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
              New Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                autoComplete="new-password"
                className="w-full py-3.5 pl-11 pr-4 text-sm border-2 rounded-xl outline-none bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] border-[var(--color-accent)] focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !token.trim() || !newPassword}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-primary)", color: "white", borderRadius: "var(--radius-button)" }}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      )}

      {step === "success" && (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 dark:text-emerald-400" strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text)]">Password Updated!</h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            Your password has been reset successfully. Please login with your new password.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-full items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition hover:opacity-80"
        style={{ color: "var(--color-primary)", border: "1px solid var(--color-primary)", borderRadius: "var(--radius-button)" }}
      >
        <ArrowLeft size={16} />
        {step === "success" ? "Back to Login" : "Back to Login"}
      </button>
    </div>
  );
}
