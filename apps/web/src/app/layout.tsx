import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoPickup",
  description: "Frontend foundation bootstrap for EcoPickup"
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
