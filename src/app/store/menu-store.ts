import { create } from "zustand";
import type { MenuItem } from "@/features/menu/menu.types";

type MenuStore = {
  selectedItem: MenuItem | null;
  setSelectedItem: (item: MenuItem) => void;
  clearSelectedItem: () => void;
};

export const useMenuStore = create<MenuStore>((set) => ({
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
  clearSelectedItem: () => set({ selectedItem: null }),
}));