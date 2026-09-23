import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Frenzone | Creator & Agency", template: "%s | Frenzone" },
  description: "Frenzone Creator and Agency platform.",
  icons: {
    icon: [
      { url: "/assets/frenzone-mark.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/assets/frenzone-mark.png",
    apple: "/assets/frenzone-mark.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
