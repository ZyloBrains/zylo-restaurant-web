import { fishStationMenu } from "@/features/menu/menu.mock";
import { MenuItemView } from "@/components/menu/menu-item-view";
export default function MenuPage() {
  return <MenuItemView menu={fishStationMenu} />;
}