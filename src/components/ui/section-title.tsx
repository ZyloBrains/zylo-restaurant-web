import { cn } from "@/lib/utils/cn";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
          {eyebrow}
        </p>
      ) : null}

      <h2
        className="text-2xl font-bold tracking-tight md:text-3xl"
        style={{ fontFamily: "var(--font-heading, Poppins)" }}
      >
        {title}
      </h2>

      {description ? (
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}