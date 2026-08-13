import { create } from "zustand";

type QuickCheckoutStore = {
  openCheckout: (() => void) | null;
  register: (open: (() => void) | null) => void;
};

export const useQuickCheckoutStore = create<QuickCheckoutStore>((set) => ({
  openCheckout: null,
  register: (open) => set({ openCheckout: open }),
}));
