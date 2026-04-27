import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToastContainer from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Confera",
  description: "Next-generation communication platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-[#08080a]">
      <body className={`${inter.variable} font-sans antialiased bg-[#08080a] text-white overflow-x-hidden min-h-screen`}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
