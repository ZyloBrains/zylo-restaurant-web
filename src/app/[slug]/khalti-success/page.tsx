"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { paymentService } from "@/services/payment.service";
import { useAuthStore } from "@/features/auth/auth.store";

export default function KhaltiSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || "";
  const user = useAuthStore((s) => s.user);
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("Verifying your Khalti payment...");

  useEffect(() => {
    const verify = async () => {
      const pidx = searchParams.get("pidx");

      if (!pidx || !slug) {
        setStatus("error");
        setMessage("Invalid payment response. Missing transaction ID.");
        return;
      }

      try {
        await paymentService.verifyKhalti(slug, pidx);
        setStatus("success");
        setMessage("Khalti payment verified successfully!");
      } catch {
        setStatus("error");
        setMessage(
          "Payment verification failed. Please contact support."
        );
      }
    };

    verify();
  }, [slug, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 text-center shadow-[var(--shadow-card)] animate-scale-in">
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
            <div className="animate-spin">
              <Loader2 className="h-12 w-12 text-[var(--color-primary)]" />
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950 animate-scale-in">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 dark:text-emerald-400 animate-scale-check" />
            </div>

            <h1 className="text-2xl font-bold text-[var(--color-text)] animate-fade-up" style={{ animationDelay: "0.4s" }}>
              Payment Successful!
            </h1>

            <p className="text-sm text-[var(--color-text-muted)] animate-fade-up" style={{ animationDelay: "0.5s" }}>
              {message}
            </p>

            {searchParams.get("transaction_id") && (
              <p className="text-xs text-[var(--color-text-muted)] animate-fade-in" style={{ animationDelay: "0.55s" }}>
                Transaction: {searchParams.get("transaction_id")}
              </p>
            )}

            <div className="mt-4 w-full animate-fade-up" style={{ animationDelay: "0.6s" }}>
              <Link
                href={`/${slug}`}
                className="btn-primary inline-flex w-full items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Restaurant
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-950 animate-scale-in">
              <span className="text-4xl font-bold text-red-500 dark:text-red-400">
                !
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">
              Verification Failed
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">{message}</p>
            <Link
              href={`/${slug}`}
              className="btn-primary mt-4 inline-flex w-full items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Restaurant
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
