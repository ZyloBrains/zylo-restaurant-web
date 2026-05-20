"use client";

import { useState } from "react";
import { User, Lock } from "lucide-react";
import { redirect } from "next/dist/server/api-utils";

export function LoginForm({
    onSuccess,
    onSwitch,
}: {
    onSuccess: (email: string) => void;
    onSwitch: () => void;
}) {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleLogin = () => {
        if (!form.email || !form.password) return;
        onSuccess(form.email);
        
    };

    return (
        <div className="space-y-6">

            {/* EMAIL */}
            <div>
                <label className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Email or Phone
                </label>

                <div className="relative mt-2">
                    <User className="absolute left-3 top-4" size={18} />
                    <input
                        type="text"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                         placeholder="Username/Email"
                        className="w-full pl-10 pr-4 py-4 border rounded-xl outline-none"
                        style={{
                            borderColor: "var(--color-accent)",
                            borderRadius: "var(--radius-button)",
                        }}
                    />
                </div>
            </div>

            {/* PASSWORD */}
            <div>
                <label className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Password
                </label>

                <div className="relative mt-2">
                    <Lock className="absolute left-3 top-4" size={18} />
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        placeholder="password"
                        className="w-full pl-10 pr-4 py-4 border rounded-xl outline-none"
                        style={{
                            borderColor: "var(--color-accent)",
                            borderRadius: "var(--radius-button)",
                        }}
                    />
                </div>
            </div>

            {/* FORGOT */}
            <div className="text-right text-sm">
                <button style={{ color: "var(--color-text-muted)" }}>
                    Forgot Password?
                </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
                onClick={handleLogin}
                className="w-full py-4 rounded-xl font-semibold transition hover:opacity-90"
                style={{
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                    borderRadius: "var(--radius-button)",
                }}
            >
                Login
            </button>

            {/* SWITCH TO REGISTER */}
            <p className="text-center text-sm">
                Don’t have an account?{" "}
                <span
                    onClick={onSwitch}
                    className="cursor-pointer"
                    style={{ color: "var(--color-primary)" }}
                >
                    Sign Up
                </span>
            </p>
        </div>
    );
}