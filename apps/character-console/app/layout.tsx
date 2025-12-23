import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BaddieLand Character Console",
  description: "Character editor for BaddieLand RPG",
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
