"use client";

import { useState } from "react";
import { User, Lock, Loader2 } from "lucide-react";
import { useAuthStore } from "@/features/auth/auth.store";

export function LoginForm({
    onSuccess,
    onSwitch,
}: {
    onSuccess: () => void;
    onSwitch: () => void;
}) {
    const login = useAuthStore((s) => s.login);
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!form.email || !form.password) return;
        setLoading(true);
        setError("");
        try {
            await login(form.email, form.password);
            onSuccess();
        } catch (e: unknown) {
            setError(
                e instanceof Error ? e.message : "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            <div>
                <label className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Email or Phone
                </label>
                <div className="relative mt-2">
                    <User className="absolute left-3 top-4 text-[var(--color-text-muted)]" size={18} />
                    <input
                        type="text"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Username/Email"
                        className="w-full pl-10 pr-4 py-4 border rounded-xl outline-none bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
                        style={{ borderColor: "var(--color-accent)", borderRadius: "var(--radius-button)" }}
                    />
                </div>
            </div>

            <div>
                <label className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Password
                </label>
                <div className="relative mt-2">
                    <Lock className="absolute left-3 top-4 text-[var(--color-text-muted)]" size={18} />
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="password"
                        className="w-full pl-10 pr-4 py-4 border rounded-xl outline-none bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
                        style={{ borderColor: "var(--color-accent)", borderRadius: "var(--radius-button)" }}
                    />
                </div>
            </div>

            <div className="text-right text-sm">
                <button style={{ color: "var(--color-text-muted)" }}>
                    Forgot Password?
                </button>
            </div>

            <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-4 rounded-xl font-semibold transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--color-primary)", color: "white", borderRadius: "var(--radius-button)" }}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Logging in...
                    </span>
                ) : (
                    "Login"
                )}
            </button>

            <p className="text-center text-sm">
                Don&rsquo;t have an account?{" "}
                <span onClick={onSwitch} className="cursor-pointer" style={{ color: "var(--color-primary)" }}>
                    Sign Up
                </span>
            </p>
        </div>
    );
}
