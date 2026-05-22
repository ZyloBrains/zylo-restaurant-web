"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { LoginModal } from "@/components/auth/login-modal";

type UserType = {
    email: string;
};

export function AuthButton({ tokens }: { tokens?: any }) {
    const [user, setUser] = useState<UserType | null>(null);
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
                    onSuccess={(email) => setUser({ email })}
                    tokens={tokens}
                />
            )}
        </>
    );
}