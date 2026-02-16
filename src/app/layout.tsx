import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ConditionalGoogleAnalytics } from "@/components/ConditionalGoogleAnalytics";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://climode-front.vercel.app"),
  title: {
    default: "Climode - 体調管理アプリ",
    template: "%s - Climode",
  },
  description:
    "睡眠・気分・症状などの身体データと、天気・気圧・湿度などの環境データを統合して体調をスコア化する健康管理アプリ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Climode",
  },
  openGraph: {
    type: "website",
    siteName: "Climode",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#0070f3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors closeButton expand={true} />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <ConditionalGoogleAnalytics
            gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          />
        )}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
