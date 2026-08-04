import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron, Rajdhani, Share_Tech_Mono } from "next/font/google";
import { PHProvider } from "./providers";
import { NeuralCursor } from "@/components/os/NeuralCursor";
import { NeuralBackground } from "@/components/os/NeuralBackground";
import { KonamiObserver } from "@/components/os/KonamiObserver";
import { NeuralToolbar } from "@/components/os/NeuralToolbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const shareTech = Share_Tech_Mono({
  variable: "--font-sharetech",
  subsets: ["latin"],
  weight: ["400"],
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
      className={`${inter.variable} ${jetbrains.variable} ${orbitron.variable} ${rajdhani.variable} ${shareTech.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col relative overflow-x-hidden" suppressHydrationWarning>
        <NeuralBackground />
        <NeuralCursor />
        <KonamiObserver />
        <PHProvider>
          {children}
        </PHProvider>
        <NeuralToolbar />
      </body>
    </html>
  );
}
