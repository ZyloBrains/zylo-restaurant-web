import { useMemo } from "react";
import type { MenuData } from "@/features/menu/menu.types";

export function useGroupedMenuItems(menu: MenuData) {
  return useMemo(() => {
    const map: Record<string, typeof menu.items> = {};

    menu.categories.forEach((cat) => {
      map[cat.id] = menu.items.filter(
        (item) => item.categoryId === cat.id
      );
    });

    return map;
  }, [menu.categories, menu.items]);
}