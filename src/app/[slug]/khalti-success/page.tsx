"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 text-center shadow-[var(--shadow-card)]"
      >
        {status === "verifying" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 py-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
              <Loader2 className="h-12 w-12 text-[var(--color-primary)]" />
            </motion.div>
            <p className="text-sm text-[var(--color-text-muted)]">{message}</p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-4 py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950"
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-500 dark:text-emerald-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-[var(--color-text)]"
            >
              Payment Successful!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-[var(--color-text-muted)]"
            >
              {message}
            </motion.p>

            {searchParams.get("transaction_id") && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="text-xs text-[var(--color-text-muted)]"
              >
                Transaction: {searchParams.get("transaction_id")}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 w-full"
            >
              <Link
                href={`/${slug}`}
                className="btn-primary inline-flex w-full items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Restaurant
              </Link>
            </motion.div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-950"
            >
              <span className="text-4xl font-bold text-red-500 dark:text-red-400">
                !
              </span>
            </motion.div>
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
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
