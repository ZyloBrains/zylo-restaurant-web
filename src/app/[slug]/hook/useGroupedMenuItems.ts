
import { useMemo } from "react";
import type { ItemResponse } from "@/features/menu/menu.types";

export function useGroupedMenuItems(
  items: ItemResponse[]
) {
  return useMemo(() => {
    const map: Record<string, ItemResponse[]> = {};
    items.forEach((item) => {
      const key = item.menuId?.toString() ?? "unknown";
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map;
  }, [items]);
}