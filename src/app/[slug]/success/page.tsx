"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { paymentService } from "@/services/payment.service";

type EsewaCallback = {
  transaction_code: string;
  status: string;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  signed_field_names: string;
  signature: string;
};

export default function PaymentSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || "";
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const verify = async () => {
      const dataParam = searchParams.get("data");

      if (!dataParam) {
        setStatus("error");
        setMessage("Invalid payment response. Missing transaction data.");
        return;
      }

      try {
        const decoded = atob(dataParam);
        const callback: EsewaCallback = JSON.parse(decoded);

        if (callback.status !== "COMPLETE") {
          setStatus("error");
          setMessage("Payment was not completed. Please try again.");
          return;
        }

        await paymentService.verifyEsewa(
          slug,
          callback.transaction_uuid,
          String(callback.total_amount)
        );
        setStatus("success");
        setMessage("Payment verified successfully!");
      } catch {
        setStatus("error");
        setMessage("Payment verification failed. Please contact support.");
      }
    };

    if (slug) verify();
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

            <div className="mt-4 w-full space-y-3 animate-fade-up" style={{ animationDelay: "0.6s" }}>
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
              <span className="text-4xl font-bold text-red-500 dark:text-red-400">!</span>
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
