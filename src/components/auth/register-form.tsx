"use client";

import { useState, type FormEvent } from "react";
import { User, Mail, Phone, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/features/auth/auth.store";
import { useTenantStore } from "@/features/tenant/tenant.store";

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "password", string>>;

function validate(field: string, value: string): string {
  switch (field) {
    case "name":
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 3) return "Name must be at least 3 characters";
      if (value.trim().length > 50) return "Name must be at most 50 characters";
      return "";
    case "email":
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
      return "";
    case "phone":
      if (!value.trim()) return "Phone is required";
      if (!/^[0-9]{10}$/.test(value)) return "Phone must be 10 digits";
      return "";
    case "password":
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      if (value.length > 50) return "Password must be at most 50 characters";
      return "";
    default:
      return "";
  }
}

export function RegisterForm({
  onSuccess,
  onSwitch,
}: {
  onSuccess: () => void;
  onSwitch: () => void;
}) {
  const slug=useTenantStore((s)=>s.tenantSlug) as string;
  const register = useAuthStore((s) => s.register);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<"name" | "email" | "phone" | "password", boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const set = (field: typeof form, cb?: () => void) =>
    (value: string) => {
      const updated = { ...form, ...field };
      setForm(updated);
      if (cb) cb();
    };

  const handleBlur = (field: keyof typeof form) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(field, form[field]) }));
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
    }
  };

  const isValid =
    !validate("name", form.name) &&
    !validate("email", form.email) &&
    !validate("phone", form.phone) &&
    !validate("password", form.password);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    const allErrors: FieldErrors = {};
    for (const f of ["name", "email", "phone", "password"] as const) {
      allErrors[f] = validate(f, form[f]);
    }
    setErrors(allErrors);
    setTouched({ name: true, email: true, phone: true, password: true });
    if (Object.values(allErrors).some(Boolean)) return;

    setLoading(true);
    setError("");
    try {
      await register(slug,{
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: "OTHER",
        userType: "NORMAL",
      });
      onSuccess();
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-5 sm:space-y-6" noValidate>
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
          Full Name
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="Full Name"
            autoComplete="name"
            className={`w-full py-3.5 pl-11 pr-4 text-sm border-2 rounded-xl outline-none transition-colors bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] ${
              touched.name && errors.name
                ? "border-red-400 dark:border-red-500"
                : "border-[var(--color-accent)] focus:border-[var(--color-primary)]"
            }`}
          />
        </div>
        {touched.name && errors.name && (
          <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Email & Phone — side by side on md+ */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="Email"
              autoComplete="email"
              className={`w-full py-3.5 pl-11 pr-4 text-sm border-2 rounded-xl outline-none transition-colors bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] ${
                touched.email && errors.email
                  ? "border-red-400 dark:border-red-500"
                  : "border-[var(--color-accent)] focus:border-[var(--color-primary)]"
              }`}
            />
          </div>
          {touched.email && errors.email && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
            Phone
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              onBlur={() => handleBlur("phone")}
              placeholder="Phone"
              autoComplete="tel"
              className={`w-full py-3.5 pl-11 pr-4 text-sm border-2 rounded-xl outline-none transition-colors bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] ${
                touched.phone && errors.phone
                  ? "border-red-400 dark:border-red-500"
                  : "border-[var(--color-accent)] focus:border-[var(--color-primary)]"
              }`}
            />
          </div>
          {touched.phone && errors.phone && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() => handleBlur("password")}
            placeholder="Password"
            autoComplete="new-password"
            className={`w-full py-3.5 pl-11 pr-12 text-sm border-2 rounded-xl outline-none transition-colors bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] ${
              touched.password && errors.password
                ? "border-red-400 dark:border-red-500"
                : "border-[var(--color-accent)] focus:border-[var(--color-primary)]"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {touched.password && errors.password && (
          <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !isValid}
        className="w-full py-3.5 rounded-xl font-semibold text-sm sm:text-base transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: "var(--color-primary)", color: "white", borderRadius: "var(--radius-button)" }}
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Account...
          </span>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="font-medium hover:underline" style={{ color: "var(--color-primary)" }}>
          Login
        </button>
      </p>
    </form>
  );
}
