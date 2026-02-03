import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// We will use Google Fonts via CDN or next/font/google.
// The user requests Inter and Material Symbols. 
// Standard Next.js way is next/font/google but for Material Symbols CDN is often easier for the icon font.
// Let's use the exact links provided in HTML code.

export const metadata: Metadata = {
  title: "Catálogo Stitch",
  description: "Catálogo de productos exclusivos de Stitch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen bg-background-light font-sans text-gray-900">
        {children}
      </body>
    </html>
  );
}
