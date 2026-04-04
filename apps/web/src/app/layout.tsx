import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoPickup",
  description: "Monorepo foundation bootstrap"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
