import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/footer";
import { useTenantStore } from "@/features/tenant/tenant.store";

vi.mock("lucide-react", () => ({
  MapPin: () => <span data-testid="icon-map-pin" />,
  PhoneCall: () => <span data-testid="icon-phone" />,
  Clock: () => <span data-testid="icon-clock" />,
  XCircle: () => <span data-testid="icon-xcircle" />,
}));

vi.mock("react-icons/fa", () => ({
  FaFacebookF: () => <span data-testid="icon-facebook" />,
  FaInstagram: () => <span data-testid="icon-instagram" />,
  FaTwitter: () => <span data-testid="icon-twitter" />,
  FaTiktok: () => <span data-testid="icon-tiktok" />,
}));

vi.mock("@/components/ui/container", () => ({
  Container: ({ children }: { children: React.ReactNode }) => <div data-testid="container">{children}</div>,
}));

describe("Footer", () => {
  beforeEach(() => {
    useTenantStore.setState({ tenant: null });
  });

  it("renders without tenant data", () => {
    render(<Footer />);
    expect(screen.getByText("Closed")).toBeDefined();
    expect(screen.getByText(/Built for fast ordering/)).toBeDefined();
  });

  it("renders tenant info when data exists", () => {
    useTenantStore.setState({
      tenant: {
        restaurantName: "Test Restaurant",
        addressLine1: "123 Main St",
        area: "Downtown",
        city: "NYC",
        country: "USA",
        phone: "555-0100",
        openingHours: { days: { Mon: "9-5", Tue: "9-5" } },
        facebookUrl: "https://facebook.com/test",
        instagramUrl: "https://instagram.com/test",
      } as any,
    });

    render(<Footer />);
    expect(screen.getByText("Test Restaurant")).toBeDefined();
    expect(screen.getByText("123 Main St, Downtown, NYC, USA")).toBeDefined();
    expect(screen.getByText("555-0100")).toBeDefined();
    expect(screen.getByText("Mon")).toBeDefined();
    expect(screen.getByText("Tue")).toBeDefined();
    expect(screen.getAllByText("9-5")).toHaveLength(2);
    expect(screen.getByText("Follow Us")).toBeDefined();
    expect(screen.getByTestId("icon-facebook")).toBeDefined();
    expect(screen.getByTestId("icon-instagram")).toBeDefined();
  });

  it("hides social section when no links", () => {
    useTenantStore.setState({ tenant: { restaurantName: "N" } as any });

    render(<Footer />);
    expect(screen.queryByText("Follow Us")).toBeNull();
  });
});
