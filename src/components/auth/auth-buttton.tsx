"use client";

import { User } from "lucide-react";
import { LoginModal } from "@/components/auth/login-modal";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/auth.store";

export function AuthButton() {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  if (!hydrated) {
    return (
      <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium text-[var(--color-primary)]"
        style={{ borderColor: "var(--color-primary)" }}>
        <User size={18} />
        Login / Register
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium text-[var(--color-primary)]"
          style={{ borderColor: "var(--color-primary)" }}
        >
          <User size={18} />
          Login / Register
        </button>
      ) : (
        <div
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
          style={{ backgroundColor: "var(--color-primary)", color: "white" }}
        >
          <User size={18} />
          {user.email}
        </div>
      )}

      {open && (
        <LoginModal onClose={() => setOpen(false)} onSuccess={() => {}} />
      )}
    </>
  );
}
