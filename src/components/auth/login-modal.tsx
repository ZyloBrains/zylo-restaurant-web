"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";

export function LoginModal({
    onClose,
    onSuccess,
}: {
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [mode, setMode] = useState<"login" | "register">("login");

    return createPortal(
        <div className="fixed inset-0 z-[9999]">
            <div className="absolute inset-0 backdrop-blur-2xl bg-black/30"></div>

            <div className="relative flex items-start justify-center pt-28 px-4">
                <div
                    className="relative w-full max-w-lg rounded-3xl shadow-2xl p-10"
                    style={{
                        backgroundColor: "var(--color-surface)",
                        borderRadius: "var(--radius-card)",
                        boxShadow: "var(--shadow-card)",
                        color: "var(--color-text)",
                    }}
                >
                    <button
                        onClick={onClose}
                        className="absolute right-5 top-5"
                        style={{ color: "var(--color-text-muted)" }}
                    >
                        <X size={22} />
                    </button>

                    <h2 className="text-2xl font-bold text-center mb-8">
                        {mode === "login"
                            ? "Login To Your Account"
                            : "Create Your Account"}
                    </h2>

                    {mode === "login" ? (
                        <LoginForm
                            onSuccess={() => {
                                onSuccess();
                                onClose();
                            }}
                            onSwitch={() => setMode("register")}
                        />
                    ) : (
                        <RegisterForm
                            onSuccess={() => {
                                onSuccess();
                                onClose();
                            }}
                            onSwitch={() => setMode("login")}
                        />
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
