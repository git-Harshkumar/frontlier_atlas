import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frontier Atlas",
  description: "The open platform for discovering and advancing frontier AI research.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
