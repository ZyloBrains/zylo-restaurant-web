import { cn } from "@/lib/utils/cn";

type SectionTitleProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    className?: string;
    align?: "left" | "center";
};

export function SectionTitle({
                                 eyebrow,
                                 title,
                                 description,
                                 className,
                                 align = "left",
                             }: SectionTitleProps) {
    const isCenter = align === "center";

    return (
        <div
            className={cn(
                "max-w-2xl",
                isCenter && "mx-auto text-center",
                className
            )}
        >
            {/* EYEBROW */}
            {eyebrow && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                    {eyebrow}
                </p>
            )}

            {/* TITLE */}
            <h2
                className="text-2xl font-bold tracking-tight text-[var(--color-text)] md:text-3xl"
                style={{ fontFamily: "var(--font-heading, Poppins)" }}
            >
                {title}
            </h2>

            {/* DESCRIPTION */}
            {description && (
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
                    {description}
                </p>
            )}

            {/* OPTIONAL DECORATIVE LINE */}
            <div
                className={cn(
                    "mt-5 h-1 w-12 rounded-full bg-[var(--color-accent)]",
                    isCenter && "mx-auto"
                )}
            />
        </div>
    );
}