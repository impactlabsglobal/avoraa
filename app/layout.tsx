import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avoraa — Designed to move",
  description: "Performance essentials for your everyday rhythm.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
