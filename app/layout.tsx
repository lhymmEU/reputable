import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import MiniKitProvider from "./components/minikit-provider";
import { ErudaProvider } from "./components/Eruda";
import React from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Reputable",
  description: "Authentic repuation for authenticated human.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <ErudaProvider>
        <MiniKitProvider>
          <body className="antialiased">{children}</body>
        </MiniKitProvider>
      </ErudaProvider>
    </html>
  );
}
