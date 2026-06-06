"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { authService } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      setError("Failed to send OTP. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-[var(--shadow-card)]">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
            <Mail className="h-8 w-8" style={{ color: "var(--color-primary)" }} />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-[var(--color-text)]">Reset Password</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Enter your email to receive a reset OTP
          </p>
        </div>

        {sent ? (
          <div className="mt-8 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
            <p className="mt-4 font-semibold text-emerald-700 dark:text-emerald-400">OTP Sent!</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Check your email for the OTP code</p>
            <button
              onClick={() => router.push(`reset-password?email=${encodeURIComponent(email)}`)}
              className="mt-6 w-full py-3 rounded-xl font-semibold transition hover:opacity-90"
              style={{ backgroundColor: "var(--color-primary)", color: "white", borderRadius: "var(--radius-button)" }}
            >
              Enter OTP
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="mt-6">
              <label className="text-sm font-medium text-[var(--color-text)]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full px-4 py-3 border rounded-xl outline-none bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
                style={{ borderColor: "var(--color-accent)", borderRadius: "var(--radius-button)" }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !email}
              className="mt-6 w-full py-3 rounded-xl font-semibold transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--color-primary)", color: "white", borderRadius: "var(--radius-button)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                "Send OTP"
              )}
            </button>
          </>
        )}

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
