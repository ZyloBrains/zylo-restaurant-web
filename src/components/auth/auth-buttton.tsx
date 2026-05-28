"use client";

import { User } from "lucide-react";
import { LoginModal } from "@/components/auth/login-modal";
import { useState } from "react";

type UserType = {
  email: string;
};

type Props = {
  user: UserType | null;
  onLoginSuccess: (user: UserType) => void;
};

export function AuthButton({ user, onLoginSuccess }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!user ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium"
          style={{
            borderColor: "var(--color-primary)",
          }}
        >
          <User size={18} />
          Login / Register
        </button>
      ) : (
        <div
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "white",
          }}
        >
          <User size={18} />
          {user.email}
        </div>
      )}

      {open && (
        <LoginModal
          onClose={() => setOpen(false)}
          onSuccess={(email) => {
            onLoginSuccess({ email });
            setOpen(false);
          }}
        />
      )}
    </>
  );
}