import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "@/features/auth/auth.store";
import { authService } from "@/services/auth.service";

vi.mock("@/services/auth.service", () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

describe("auth.store", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null });
    localStorage.clear();
  });

  it("initial state has null user and token", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it("login sets user and token", async () => {
    const mockUser = { id: 1, email: "test@test.com" };
    (authService.login as any).mockResolvedValueOnce({
      userResponse: mockUser,
      accessToken: "abc123",
    });

    await useAuthStore.getState().login("test@test.com", "pass");

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser as any);
    expect(state.token).toBe("abc123");
  });

  it("logout clears user and token", () => {
    useAuthStore.setState({ user: { id: 1 } as any, token: "token" });
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it("register calls authService without setting store state", async () => {
    (authService.register as any).mockResolvedValueOnce({ id: 1 });

    const input = { name: "New", email: "new@test.com", password: "pass", phoneNumber: "123" };
    await useAuthStore.getState().register("slug", input as any);

    expect(authService.register).toHaveBeenCalledWith("slug", input);
    // register does not mutate store state
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
