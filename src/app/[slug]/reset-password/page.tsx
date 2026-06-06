"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, KeyRound, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { authService } from "@/services/auth.service";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!otp || !newPassword || newPassword !== confirmPassword) return;
    setLoading(true);
    setError("");
    try {
      await authService.resetPassword(email, otp, newPassword);
      router.push("../");
    } catch {
      setError("Failed to reset password. Check your OTP and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-[var(--shadow-card)]">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
            <Lock className="h-8 w-8" style={{ color: "var(--color-primary)" }} />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-[var(--color-text)]">Set New Password</h1>
          {email && (
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{email}</p>
          )}
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Enter the OTP sent to your email and set a new password
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--color-text)]">OTP Code</label>
            <div className="relative mt-2">
              <KeyRound className="absolute left-3 top-3.5 text-[var(--color-text-muted)]" size={18} />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
                style={{ borderColor: submitted && !otp ? "#ef4444" : "var(--color-accent)", borderRadius: "var(--radius-button)" }}
              />
            </div>
            {submitted && !otp && <p className="mt-1 text-xs text-red-500">OTP is required</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-text)]">New Password</label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-3.5 text-[var(--color-text-muted)]" size={18} />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
                style={{ borderColor: submitted && !newPassword ? "#ef4444" : "var(--color-accent)", borderRadius: "var(--radius-button)" }}
              />
            </div>
            {submitted && !newPassword && <p className="mt-1 text-xs text-red-500">Password is required</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-text)]">Confirm Password</label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-3.5 text-[var(--color-text-muted)]" size={18} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
                style={{ borderColor: submitted && confirmPassword && newPassword !== confirmPassword ? "#ef4444" : "var(--color-accent)", borderRadius: "var(--radius-button)" }}
              />
            </div>
            {submitted && newPassword !== confirmPassword && <p className="mt-1 text-xs text-red-500">Passwords do not match</p>}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full py-3 rounded-xl font-semibold transition hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)", color: "white", borderRadius: "var(--radius-button)" }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Resetting...
            </span>
          ) : (
            "Reset Password"
          )}
        </button>

        <div className="mt-6 text-center">
          <Link
            href="../"
            className="inline-flex items-center gap-2 text-sm"
            style={{ color: "var(--color-primary)" }}
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
