import { Container } from "@/components/ui/container";

type FooterProps = {
    restaurantName: string;
    address: string;
    phone: string;
};

export function Footer({ restaurantName, address, phone }: FooterProps) {
    return (
        <footer className="border-t border-slate-200 bg-[var(--color-surface)] py-10">
            <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h3
                        className="text-lg font-semibold text-[var(--color-primary)]"
                        style={{ fontFamily: "var(--font-heading, Poppins)" }}
                    >
                        {restaurantName}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">{address}</p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">{phone}</p>
                </div>

                <div className="text-sm text-[var(--color-text-muted)]">
                    © {new Date().getFullYear()} {restaurantName}. All rights reserved.
                </div>
            </Container>
        </footer>
    );
}