import type { TenantThemeTokens } from "@/features/tenant/tenant.types";
import React from "react";

export function buildThemeStyle(
  tokens?: TenantThemeTokens
): React.CSSProperties {
  if (!tokens) return {};

  return {
    "--color-primary": tokens.colorPrimary || "#0A2540",
    "--color-secondary": tokens.colorSecondary || "#1E40AF",
    "--color-accent": tokens.colorAccent || "#F59E0B",
    "--color-background": tokens.colorBackground || "#FFFFFF",
    "--color-surface": tokens.colorSurface || "#F8FAFC",
    "--color-text": tokens.colorText || "#0F172A",
    "--color-text-muted": tokens.colorTextMuted || "#64748B",
    "--radius-button": tokens.radiusButton || "8px",
    "--radius-card": tokens.radiusCard || "12px",
    "--shadow-card": tokens.shadowCard || "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  } as React.CSSProperties;
}