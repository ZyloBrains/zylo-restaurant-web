import type { TenantThemeTokens } from "@/features/tenant/tenant.types";

export function buildThemeStyle(tokens: TenantThemeTokens): React.CSSProperties {
  return {
    ["--color-primary" as string]: tokens.colorPrimary,
    ["--color-secondary" as string]: tokens.colorSecondary,
    ["--color-accent" as string]: tokens.colorAccent,
    ["--color-background" as string]: tokens.colorBackground,
    ["--color-surface" as string]: tokens.colorSurface,
    ["--color-text" as string]: tokens.colorText,
    ["--color-text-muted" as string]: tokens.colorTextMuted,
    ["--radius-button" as string]: tokens.radiusButton,
    ["--radius-card" as string]: tokens.radiusCard,
    ["--shadow-card" as string]: tokens.shadowCard,
  };
}