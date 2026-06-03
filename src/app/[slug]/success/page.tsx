"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { paymentService } from "@/services/payment.service";

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
      const transaction_uuid = searchParams.get("transaction_uuid");
      const total_amount = searchParams.get("total_amount");

      if (!transaction_uuid || !total_amount) {
        setStatus("error");
        setMessage("Invalid payment response. Missing transaction details.");
        return;
      }

      try {
        await paymentService.verifyEsewa(
          slug,
          transaction_uuid,
          total_amount
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
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <CheckCircle2 className="h-10 w-10 text-emerald-500 dark:text-emerald-400" />
              </motion.div>
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

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 w-full space-y-3"
            >
              {searchParams.get("ref_id") && (
                <p className="text-xs text-[var(--color-text-muted)]">
                  Reference: {searchParams.get("ref_id")}
                </p>
              )}
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
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-950">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <span className="text-4xl">!</span>
              </motion.div>
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
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
