import type { TenantThemeTokens } from "@/features/tenant/tenant.types";
import React from "react";

export const THEME_DEFAULTS: TenantThemeTokens = {
  colorPrimary: "#000F22",
  colorSecondary: "#00696E",
  colorAccent: "#6FF6FF",
  colorBackground: "#F7F9FB",
  colorSurface: "#FFFFFF",
  colorText: "#191C1E",
  colorTextMuted: "#6B7280",
  radiusButton: "12",
  radiusCard: "20",
  shadowCard: "md",
  defaultDarkMode: "light",
};

const SHADOW_MAP: Record<string, string> = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
};

function normalizeRadius(value: string): string {
  return /^\d+$/.test(value) ? `${value}px` : value;
}

function normalizeShadow(value: string): string {
  return SHADOW_MAP[value] || value;
}

function normalizeDarkMode(value: string): "true" | "false" {
  return value === "true" || value === "dark" ? "true" : "false";
}

export function normalizeThemeTokens(
  tokens?: Partial<TenantThemeTokens>
): TenantThemeTokens {
  const merged = { ...THEME_DEFAULTS, ...tokens };
  return {
    ...merged,
    radiusButton: normalizeRadius(merged.radiusButton),
    radiusCard: normalizeRadius(merged.radiusCard),
    shadowCard: normalizeShadow(merged.shadowCard),
    defaultDarkMode: normalizeDarkMode(merged.defaultDarkMode),
  };
}

export function buildThemeStyle(
  tokens?: Partial<TenantThemeTokens>
): React.CSSProperties {
  const t = normalizeThemeTokens(tokens);

  return {
    "--color-primary": t.colorPrimary,
    "--color-secondary": t.colorSecondary,
    "--color-accent": t.colorAccent,
    "--color-background": t.colorBackground,
    "--color-surface": t.colorSurface,
    "--color-text": t.colorText,
    "--color-text-muted": t.colorTextMuted,
    "--radius-button": t.radiusButton,
    "--radius-card": t.radiusCard,
    "--shadow-card": t.shadowCard,
    "--default-dark-mode": t.defaultDarkMode,
  } as React.CSSProperties;
}

export function isDarkModeEnabled(tokens?: Partial<TenantThemeTokens>): boolean {
  return normalizeDarkMode(tokens?.defaultDarkMode ?? THEME_DEFAULTS.defaultDarkMode) === "true";
}
