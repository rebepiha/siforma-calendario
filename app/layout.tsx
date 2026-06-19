import type { Metadata, Viewport } from "next";
import { Mulish } from "next/font/google";
import TopNav from "@/components/TopNav";
import RegistrarServiceWorker from "@/components/RegistrarServiceWorker";
import "./globals.css";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Siforma — Calendário de Marketing",
  description: "Calendário editorial, tarefas e metas de marketing da Siforma.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Siforma Calendário",
  },
};

export const viewport: Viewport = {
  themeColor: "#68a04a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${mulish.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <RegistrarServiceWorker />
        <TopNav />
        <main className="w-full flex-1 px-4 py-6 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
