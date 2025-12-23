import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BaddieLand Character Console',
  description: 'Admin console for managing BaddieLand characters',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="nav-bar">
          <h1>BaddieLand Character Console</h1>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/character-editor">Character Editor</a>
          </div>
        </nav>
        <main className="main-content">{children}</main>
      </body>
    </html>
  )
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
