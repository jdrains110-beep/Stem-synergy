import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stem Synergy - AI Housing Blueprint Platform",
  description: "AI-powered housing blueprint platform with Claude Vision, 3D visualization, and real estate integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
