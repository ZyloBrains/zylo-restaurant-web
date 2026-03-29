import { cn } from "@/lib/utils/cn";

type SectionShellProps = {
    id?: string;
    children: React.ReactNode;
    tone?: "default" | "surface" | "dark";
    className?: string;
};

export function SectionShell({
                                 id,
                                 children,
                                 tone = "default",
                                 className,
                             }: SectionShellProps) {
    const toneClass =
        tone === "surface"
            ? "bg-[var(--color-surface)]"
            : tone === "dark"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white";

    return (
        <section id={id} className={cn("py-16 md:py-20", toneClass, className)}>
            {children}
        </section>
    );
}