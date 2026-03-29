import { cn } from "@/lib/utils/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow" | "full";
};

export function Container({
                            children,
                            className,
                            size = "default",
                          }: ContainerProps) {
  const sizeClass =
      size === "wide"
          ? "max-w-7xl"
          : size === "narrow"
              ? "max-w-4xl"
              : size === "full"
                  ? "max-w-none"
                  : "max-w-6xl";

  return (
      <div
          className={cn(
              "mx-auto w-full px-4 sm:px-6 lg:px-8",
              sizeClass,
              className
          )}
      >
        {children}
      </div>
  );
}