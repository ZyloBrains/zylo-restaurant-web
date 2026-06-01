import { MapPin, PhoneCall, Clock, XCircle } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

import { Container } from "@/components/ui/container";
import { useTenantStore } from "@/features/tenant/tenant.store";

export function Footer() {
  const tenant = useTenantStore((s) => s.tenant);
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
              {tenant?.restaurantName}
            </h3>

            <div className="mt-4 space-y-3 text-sm text-[var(--color-text-muted)]">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--color-accent)]" />
                <span>{`${tenant?.addressLine1},${tenant?.addressLine2},${tenant?.area},${tenant?.city},${tenant?.country}`}</span>
              </div>

              <div className="flex items-center gap-3">
                <PhoneCall className="h-4 w-4 text-[var(--color-accent)]" />
                <span>{tenant?.phone}</span>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-[var(--color-accent)]" />

                <div className="text-sm text-[var(--color-text-muted)]">
                  {tenant?.openingHours?.days ? (
                    Object.entries(tenant.openingHours.days).map(
                      ([day, time]) => (
                        <div
                          key={day}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="font-medium">{day}</span>
                          <span>{time}</span>
                        </div>
                      ),
                    )
                  ) : (
                    <div className="flex items-center gap-2 text-red-500">
                      <XCircle className="h-4 w-4" />
                      <span>Closed</span>
                    </div>
                  )}
                </div>
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
              © {new Date().getFullYear()} {tenant?.restaurantName}
            </p>

            <p className="mt-2 text-xs">
              Built for fast ordering, local convenience, and premium dining
              experience.
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
