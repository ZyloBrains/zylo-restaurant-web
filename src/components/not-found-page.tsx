"use client";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-6 text-center">
      <h1 className="text-7xl font-bold text-[var(--color-primary)]">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--color-text)]">Restaurant not found</h2>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        The restaurant you are looking for does not exist or has been removed.
      </p>
    </div>
  );
}
