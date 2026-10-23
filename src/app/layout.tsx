import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Gnose — Atlas de Estudos",
  description:
    "Um atlas de navegação para estudar Gnosticismo e Esoterismo: cadernos, conceitos, glossário, rotas de leitura e progresso pessoal.",
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
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
