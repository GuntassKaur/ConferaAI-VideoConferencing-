import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Confera AI | Enterprise Video Conferencing",
  description: "Next-generation AI-powered video conferencing for modern enterprises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="antialiased bg-background text-foreground min-h-screen">
        <div className="fixed inset-0 -z-10 bg-hero-glow opacity-50" />
        {children}
      </body>
    </html>
  );
}
