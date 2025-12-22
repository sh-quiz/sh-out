import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import GrainOverlay from "@/components/ui/GrainOverlay";
import CustomCursor from "@/components/ui/CustomCursor";

import AppLayout from "@/components/AppLayout";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

import localFont from 'next/font/local';

const michroma = localFont({
  src: '../public/font/Michroma/Michroma-Regular.ttf',
  variable: '--font-michroma',
});

const orbitron = localFont({
  src: [
    {
      path: '../public/font/Orbitron/static/Orbitron-Regular.ttf',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: "SHARKS | The Ultimate Predator Quiz",
  description: "How long will you survive the ultimate predator quiz?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#0B0E12] text-[#E8E9EA]`}
      >
        <Providers>
          <SmoothScroll>
            <GrainOverlay />
            <CustomCursor />
            <AppLayout>
              {children}
            </AppLayout>
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}

