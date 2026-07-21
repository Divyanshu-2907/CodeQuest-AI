import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PHProvider } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeQuest AI",
  description: "A GTA-style gamified AI/ML learning platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col relative overflow-x-hidden" suppressHydrationWarning>
        <div className="ambient-glow" />
        <PHProvider>
          {children}
        </PHProvider>
      </body>
    </html>
  );
}
