import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "Slack Clone - Team Communication",
  description: "A modern Slack clone built with Next.js, featuring real-time messaging, channels, and team collaboration tools.",
  keywords: ["slack", "chat", "messaging", "team", "collaboration", "communication"],
  authors: [{ name: "Slack Clone Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} font-sans antialiased`}>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          {children}
        </div>
      </body>
    </html>
  );
}