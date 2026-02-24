import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "おくすり管理",
  description: "毎日の服薬管理をかんたんに",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        <div className="mx-auto min-h-screen max-w-md pb-20">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
