import { Container } from "@/components/ui/container";

type HeaderProps = {
    restaurantName: string;
};

export function Header({ restaurantName }: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
            <Container className="flex h-16 items-center justify-between">
                <a
                    href="#top"
                    className="text-lg font-bold tracking-tight text-[var(--color-primary)]"
                    style={{ fontFamily: "var(--font-heading, Poppins)" }}
                >
                    {restaurantName}
                </a>

                <nav className="hidden items-center gap-6 md:flex">
                    <a href="#about" className="text-sm font-medium text-slate-700 transition hover:text-[var(--color-primary)]">
                        About
                    </a>
                    <a href="#services" className="text-sm font-medium text-slate-700 transition hover:text-[var(--color-primary)]">
                        Services
                    </a>
                    <a href="#contact" className="text-sm font-medium text-slate-700 transition hover:text-[var(--color-primary)]">
                        Contact
                    </a>
                    <a
                        href="#menu"
                        className="rounded-[var(--radius-button)] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                    >
                        View Menu
                    </a>
                </nav>
            </Container>
        </header>
    );
}