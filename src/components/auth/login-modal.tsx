"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, ArrowLeft } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export function LoginModal({
    onClose,
    onSuccess,
}: {
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [mode, setMode] = useState<"login" | "register" | "forgot">("login");

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
                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-8">
                        {mode === "forgot" && (
                            <button
                                onClick={() => setMode("login")}
                                className="flex items-center gap-1 text-sm"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                <ArrowLeft size={16} />
                            </button>
                        )}
                        <h2 className="text-2xl font-bold text-center flex-1">
                            {mode === "login" && "Login To Your Account"}
                            {mode === "register" && "Create Your Account"}
                            {mode === "forgot" && "Reset Password"}
                        </h2>
                        <button
                            onClick={onClose}
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            <X size={22} />
                        </button>
                    </div>

                    {mode === "login" ? (
                        <LoginForm
                            onSuccess={() => {
                                onSuccess();
                                onClose();
                            }}
                            onSwitch={() => setMode("register")}
                            onForgot={() => setMode("forgot")}
                        />
                    ) : mode === "register" ? (
                        <RegisterForm
                            onSuccess={() => {
                                onSuccess();
                                onClose();
                            }}
                            onSwitch={() => setMode("login")}
                        />
                    ) : (
                        <ForgotPasswordForm onBack={() => setMode("login")} />
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
