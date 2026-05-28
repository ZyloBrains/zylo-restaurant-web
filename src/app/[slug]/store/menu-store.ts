import { ItemResponse } from "@/features/menu/menu.types";
import { create } from "zustand";

type MenuStore = {
  selectedItem: ItemResponse | null;
  setSelectedItem: (item: ItemResponse) => void;
  clearSelectedItem: () => void;
};

export const useMenuStore = create<MenuStore>((set) => ({
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
  clearSelectedItem: () => set({ selectedItem: null }),
}));