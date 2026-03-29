import { MapPin, PhoneCall } from "lucide-react";
import { Container } from "@/components/ui/container";

type FooterProps = {
    restaurantName: string;
    address: string;
    phone: string;
};

export function Footer({ restaurantName, address, phone }: FooterProps) {
    return (
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-12">
            <Container>
                <div className="grid gap-8 md:grid-cols-2 md:items-center">

                    {/* LEFT */}
                    <div>
                        <h3
                            className="text-lg font-semibold text-[var(--color-primary)]"
                            style={{ fontFamily: "var(--font-heading, Poppins)" }}
                        >
                            {restaurantName}
                        </h3>

                        <div className="mt-4 space-y-3 text-sm text-[var(--color-text-muted)]">

                            {/* ADDRESS */}
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 text-[var(--color-accent)]" />
                                <span>{address}</span>
                            </div>

                            {/* PHONE */}
                            <div className="flex items-center gap-3">
                                <PhoneCall className="h-4 w-4 text-[var(--color-accent)]" />
                                <span>{phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="text-sm text-[var(--color-text-muted)] md:text-right">
                        <p>
                            © {new Date().getFullYear()} {restaurantName}. All rights reserved.
                        </p>

                        <p className="mt-2 text-xs">
                            Built for fast ordering, local convenience, and premium seafood experience.
                        </p>
                    </div>
                </div>
            </Container>
        </footer>
    );
}