import type { Metadata, Viewport } from "next";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "JoharSetu (जोहारसेतु) - Smart HEI & Citizen Bridge",
  description: "Progressive Web Application bridging citizen challenges across Jharkhand with Higher Education Institutions under NEP 2020 experiential learning mandates (SIH 2026).",
  manifest: "/manifest.json",
  applicationName: "JoharSetu",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JoharSetu",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#D87A53",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="JoharSetu" />
      </head>
      <body className="bg-canvas text-charcoal min-h-screen flex flex-col antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
