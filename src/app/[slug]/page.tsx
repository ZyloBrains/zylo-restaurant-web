"use client";

import { MenuClientShell } from "@/components/sections/menu-client-shell";
import { useTenantStore } from "@/features/tenant/tenant.store";
import { buildThemeStyle } from "@/lib/theme/theme.tokens";
import { TenantTheme } from "@/types/tenant.types";

export default function TenantHome() {
  const tenantTheme = useTenantStore((s) => s.tenantTheme);

  const themeStyle = buildThemeStyle(tenantTheme as TenantTheme);

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
      <MenuClientShell />
    </div>
  );
}
