export const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const },
};

export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};