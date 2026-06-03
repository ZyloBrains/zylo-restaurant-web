"use client";

import { useState } from "react";
import { User, Lock, Phone, Loader2 } from "lucide-react";
import { useAuthStore } from "@/features/auth/auth.store";

export function RegisterForm({
    onSuccess,
    onSwitch,
}: {
    onSuccess: () => void;
    onSwitch: () => void;
}) {
    const register = useAuthStore((s) => s.register);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async () => {
        if (!form.email || !form.password || !form.name || !form.phone) return;
        setLoading(true);
        setError("");
        try {
            await register({
                name: form.name,
                email: form.email,
                phone: form.phone,
                password: form.password,
                role: "CUSTOMER",
                userType: "NORMAL",
            });
            onSuccess();
        } catch (e: unknown) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Registration failed. Please try again."
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
                    Full Name
                </label>
                <div className="relative mt-2">
                    <User className="absolute left-3 top-4 text-[var(--color-text-muted)]" size={18} />
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Full Name"
                        className="w-full pl-10 pr-4 py-4 border rounded-xl outline-none bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
                        style={{ borderColor: "var(--color-accent)", borderRadius: "var(--radius-button)" }}
                    />
                </div>
            </div>

            <div>
                <label className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Email
                </label>
                <div className="relative mt-2">
                    <User className="absolute left-3 top-4 text-[var(--color-text-muted)]" size={18} />
                    <input
                        type="text"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Email"
                        className="w-full pl-10 pr-4 py-4 border rounded-xl outline-none bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
                        style={{ borderColor: "var(--color-accent)", borderRadius: "var(--radius-button)" }}
                    />
                </div>
            </div>

            <div>
                <label className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Phone
                </label>
                <div className="relative mt-2">
                    <Phone className="absolute left-3 top-4 text-[var(--color-text-muted)]" size={18} />
                    <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Phone"
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

            <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-4 rounded-xl font-semibold transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--color-primary)", color: "white", borderRadius: "var(--radius-button)" }}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Account...
                    </span>
                ) : (
                    "Create Account"
                )}
            </button>

            <p className="text-center text-sm">
                Already have an account?{" "}
                <span onClick={onSwitch} className="cursor-pointer" style={{ color: "var(--color-primary)" }}>
                    Login
                </span>
            </p>
        </div>
    );
}
