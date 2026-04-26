import type { Metadata } from "next";
import "./globals.css";
import SessionProviderWrapper from "./SessionProviderWrapper";

export const metadata: Metadata = {
  title: "Sniplink — Ultra-Fast URL Shortener",
  description:
    "Create short, powerful links in seconds. Track clicks, analyze performance, and share with confidence. Built for speed.",
  keywords: ["url shortener", "link shortener", "short links", "analytics", "click tracking"],
  openGraph: {
    title: "Sniplink — Ultra-Fast URL Shortener",
    description: "Create short, powerful links in seconds. Track clicks, analyze performance, and share with confidence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SessionProviderWrapper>
          <div className="spotlight" />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
