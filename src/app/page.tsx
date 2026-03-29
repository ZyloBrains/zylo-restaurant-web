import { MenuClientShell } from "@/components/sections/menu-client-shell";
import { fishStationMenu } from "@/features/menu/menu.mock";
import { fishStationTenant } from "@/features/tenant/tenant.mock";
import { buildThemeStyle } from "@/lib/theme/theme.tokens";

export default function HomePage() {
    const tenant = fishStationTenant;
    const menu = fishStationMenu;
    const themeStyle = buildThemeStyle(tenant.theme);

    return (
        <div
            className="min-h-screen pb-24 md:pb-0"
            style={{
                ...themeStyle,
                fontFamily: "var(--font-body, Inter, sans-serif)",
                backgroundColor: "var(--color-background)",
                color: "var(--color-text)",
            }}
        >
            <MenuClientShell tenant={tenant} menu={menu} />
        </div>
    );
}