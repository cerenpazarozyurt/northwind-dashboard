import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import { QueryProvider } from "@/components/query-provider";
import ClientLayout from "./clientLayout";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard - Northwind Traders",
  description: "Northwind Traders Analytics & Management Panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <Provider>
          <NuqsAdapter>
            <QueryProvider>
              <ClientLayout>{children}</ClientLayout>
            </QueryProvider>
          </NuqsAdapter>
        </Provider>
      </body>
    </html>
  );
}