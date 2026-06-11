"use client";

import { useSearchParams, useParams } from "next/navigation";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const { slug } = useParams() as { slug: string };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 text-center shadow-[var(--shadow-card)] animate-scale-in">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-950 animate-scale-in">
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <XCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-[var(--color-text)] animate-fade-up" style={{ animationDelay: "0.4s" }}>
          Payment Failed
        </h1>

        <p className="mt-3 text-sm text-[var(--color-text-muted)] animate-fade-up" style={{ animationDelay: "0.5s" }}>
          Your payment could not be processed. This may be due to insufficient
          balance, network issues, or a cancelled transaction.
        </p>

        {searchParams.get("ref_id") && (
          <p className="mt-3 text-xs text-[var(--color-text-muted)] animate-fade-in" style={{ animationDelay: "0.55s" }}>
            Reference: {searchParams.get("ref_id")}
          </p>
        )}

        <div className="mt-8 space-y-3 animate-fade-up" style={{ animationDelay: "0.6s" }}>
          <button
            onClick={() => window.history.back()}
            className="btn-primary inline-flex w-full items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            Try Again
          </button>

          <Link
            href={`/${slug}`}
            className="btn-secondary inline-flex w-full items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Restaurant
          </Link>
        </div>
      </div>
    </div>
  );
}
