import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gnose — Dashboard de Estudos",
  description:
    "Dashboard de estudos autodidata sobre Gnosticismo e Esoterismo: mapa dos 10 prompts, índice cruzado de conceitos, glossário técnico, rotas de leitura e expansão 5.x — com progresso e notas.",
  keywords: [
    "Gnose",
    "Gnosticismo",
    "Esoterismo",
    "dashboard de estudos",
    "Kabbalah",
    "Hermetismo",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cormorant.variable} ${geistMono.variable} antialiased bg-background font-sans text-foreground`}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
