
import { useMemo } from "react";
import type { MenuData } from "@/features/menu/menu.types";

export function useGroupedMenuItems(
  menu: MenuData | null
) {
  return useMemo(() => {
    if(!menu){
      return{};
    }
    const map: Record<string, typeof menu.items> = {};

    menu.categories?.forEach((cat) => {
      map[cat.id] = menu.items?.filter(
        (item) => item.categoryId.toString() === cat.id.toString()
      ) || [];
    });

    return map;
  }, [menu]);
}