import { MapPin, PhoneCall, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

import { Container } from "@/components/ui/container";

type FooterProps = {
  restaurantName: string;
  address: string;
  phone: string;
};

export function Footer({ restaurantName, address, phone }: FooterProps) {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-12">

      <Container className="relative max-w-[1540px] px-3 lg:px-4 xl:px-6">

        <div className="grid gap-10 md:grid-cols-3">

          {/* LEFT - INFO */}
          <div>
            <h3
              className="text-lg font-semibold text-[var(--color-primary)]"
              style={{ fontFamily: "var(--font-heading, Poppins)" }}
            >
              {restaurantName}
            </h3>

            <div className="mt-4 space-y-3 text-sm text-[var(--color-text-muted)]">

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--color-accent)]" />
                <span>{address}</span>
              </div>

              <div className="flex items-center gap-3">
                <PhoneCall className="h-4 w-4 text-[var(--color-accent)]" />
                <span>{phone}</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-[var(--color-accent)]" />
                <span>Open Daily: 10:00 AM – 10:00 PM</span>
              </div>

            </div>
          </div>

          {/* MIDDLE - SOCIAL */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text)] mb-4">
              Follow Us
            </h4>

            <div className="flex gap-4">

              {/* Facebook */}
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white hover:scale-110 transition"
              >
                <FaFacebookF size={16} />
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white hover:scale-110 transition"
              >
                <FaInstagram size={16} />
              </a>

              {/* Twitter */}
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white hover:scale-110 transition"
              >
                <FaTwitter size={16} />
              </a>

            </div>

            <p className="mt-4 text-xs text-[var(--color-text-muted)]">
              Stay connected for offers & updates
            </p>
          </div>

          {/* RIGHT - COPYRIGHT */}
          <div className="text-sm text-[var(--color-text-muted)] md:text-right">

            <p className="text-[var(--color-text)] font-medium">
              © {new Date().getFullYear()} {restaurantName}
            </p>

            <p className="mt-2 text-xs">
              Built for fast ordering, local convenience, and premium dining experience.
            </p>

            <div className="mt-4 flex md:justify-end gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-[var(--color-background)] border border-[var(--color-border)]">
                Fast Delivery
              </span>
              <span className="px-2 py-1 rounded bg-[var(--color-background)] border border-[var(--color-border)]">
                Fresh Food
              </span>
              <span className="px-2 py-1 rounded bg-[var(--color-background)] border border-[var(--color-border)]">
                Easy Order
              </span>
            </div>

          </div>

        </div>
      </Container>
    </footer>
  );
}