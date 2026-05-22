import type { TenantThemeTokens } from "@/features/tenant/tenant.types";
import React from "react";

export function buildThemeStyle(
  tokens?: TenantThemeTokens
): React.CSSProperties {
  if (!tokens) return {};

  return {
    "--color-primary": tokens.colorPrimary,
    "--color-secondary": tokens.colorSecondary,
    "--color-accent": tokens.colorAccent,
    "--color-background": tokens.colorBackground,
    "--color-surface": tokens.colorSurface,
    "--color-text": tokens.colorText,
    "--color-text-muted": tokens.colorTextMuted,
    "--radius-button": tokens.radiusButton,
    "--radius-card": tokens.radiusCard,
    "--shadow-card": tokens.shadowCard,
  } as React.CSSProperties;
}