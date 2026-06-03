export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[var(--color-background)]">

            {/* SPINNER */}
            <div className="relative h-14 w-14">
                <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
            </div>

            {/* TEXT */}
            <p className="text-lg font-semibold text-[var(--color-primary)]">
                Loading Fish Station...
            </p>

            {/* SUBTEXT */}
            <p className="text-sm text-[var(--color-text-muted)]">
                Preparing fresh seafood experience 🍽️
            </p>
        </div>
    );
}