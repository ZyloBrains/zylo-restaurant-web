"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 text-center shadow-[var(--shadow-card)]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-950"
        >
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <XCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-2xl font-bold text-[var(--color-text)]"
        >
          Payment Failed
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-3 text-sm text-[var(--color-text-muted)]"
        >
          Your payment could not be processed. This may be due to insufficient
          balance, network issues, or a cancelled transaction.
        </motion.p>

        {searchParams.get("ref_id") && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-3 text-xs text-[var(--color-text-muted)]"
          >
            Reference: {searchParams.get("ref_id")}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-3"
        >
          <button
            onClick={() => window.history.back()}
            className="btn-primary inline-flex w-full items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            Try Again
          </button>

          <Link
            href="/"
            className="btn-secondary inline-flex w-full items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Restaurant
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
