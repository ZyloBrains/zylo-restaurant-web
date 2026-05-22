"use client";

import { useState } from "react";
import { User, Lock, Phone } from "lucide-react";

export function RegisterForm({
    onSuccess,
    onSwitch,
}: {
    onSuccess: (email: string) => void;
    onSwitch: () => void;
}) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    const handleRegister = () => {
        if (!form.email || !form.password || !form.name) return;
        onSuccess(form.email);
    };

    return (
        <div className="space-y-6">

            {/* NAME */}
            <div>
                <label className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Full Name
                </label>

                <div className="relative mt-2">
                    <User className="absolute left-3 top-4" size={18} />
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                         placeholder="Full Name"
                        className="w-full pl-10 pr-4 py-4 border rounded-xl outline-none"
                        style={{
                            borderColor: "var(--color-accent)",
                            borderRadius: "var(--radius-button)",
                        }}
                    />
                </div>
            </div>

            {/* EMAIL */}
            <div>
                <label className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Email
                </label>

                <div className="relative mt-2">
                    <User className="absolute left-3 top-4" size={18} />
                    <input
                        type="text"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                         placeholder="Email"
                        className="w-full pl-10 pr-4 py-4 border rounded-xl outline-none"
                        style={{
                            borderColor: "var(--color-accent)",
                            borderRadius: "var(--radius-button)",
                        }}
                    />
                </div>
            </div>

            {/* PHONE */}
            <div>
                <label className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Phone
                </label>

                <div className="relative mt-2">
                    <Phone className="absolute left-3 top-4" size={18} />
                    <input
                        type="text"
                        value={form.phone}
                        onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-4 border rounded-xl outline-none"
                         placeholder="Phone"
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

            {/* REGISTER BUTTON */}
            <button
                onClick={handleRegister}
                className="w-full py-4 rounded-xl font-semibold transition hover:opacity-90"
                style={{
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                    borderRadius: "var(--radius-button)",
                }}
            >
                Create Account
            </button>

            {/* SWITCH TO LOGIN */}
            <p className="text-center text-sm">
                Already have an account?{" "}
                <span
                    onClick={onSwitch}
                    className="cursor-pointer"
                    style={{ color: "var(--color-primary)" }}
                >
                    Login
                </span>
            </p>
        </div>
    );
}