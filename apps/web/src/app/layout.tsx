import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Confera AI",
  description: "Next-generation AI video conferencing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
