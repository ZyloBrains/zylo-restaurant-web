import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthButton } from "@/components/auth/auth-buttton";
import { useAuthStore } from "@/features/auth/auth.store";

vi.mock("@/components/auth/login-modal", () => ({
  LoginModal: () => <div data-testid="login-modal" />,
}));

vi.mock("@/components/auth/user-dropdown", () => ({
  UserDropdown: () => <div data-testid="user-dropdown" />,
}));

beforeEach(() => {
  useAuthStore.setState({ user: null, token: null });
});

describe("AuthButton", () => {
  it("renders login/register button when not authenticated (after hydration)", async () => {
    render(<AuthButton />);

    // Before hydration it shows the placeholder
    expect(screen.getByText("Login / Register")).toBeDefined();

    // Wait for hydration to complete
    const btn = await screen.findByRole("button", { name: /login/i });
    expect(btn).toBeDefined();
  });

  it("renders UserDropdown when authenticated (after hydration)", async () => {
    useAuthStore.setState({
      user: { id: 1, email: "test@test.com", name: "Test" } as any,
      token: "t",
    });

    render(<AuthButton />);

    // After hydration UserDropdown appears
    const dd = await screen.findByTestId("user-dropdown");
    expect(dd).toBeDefined();
  });
});
