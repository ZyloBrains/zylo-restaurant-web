import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}