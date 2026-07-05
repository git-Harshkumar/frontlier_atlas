import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const runtime = "edge";
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: 'swap',
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Frontier Atlas - Discover AI Research",
  description: "Discover and track the latest breakthroughs in AI and machine learning research. Trending papers, SOTA benchmarks, GitHub stars, and more.",
  keywords: "AI research, machine learning, papers, SOTA, transformers, LLM, deep learning",
  openGraph: {
    title: "Frontier Atlas - Discover AI Research",
    description: "Discover and track the latest breakthroughs in AI and machine learning research.",
    type: "website",
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>{children}</body>
    </html>
  );
}
