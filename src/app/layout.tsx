import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Restaurant SaaS",
  description: "Multi-tenant restaurant system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] antialiased">
        {children}
      </body>
    </html>
  );
}