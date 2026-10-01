import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lexis - Minimal Vocabulary",
  description: "Minimal Vocabulary App built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}