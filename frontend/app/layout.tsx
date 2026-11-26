import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Cabecalho from "@/components/Cabecalho";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// seo: título com template para as páginas filhas
export const metadata: Metadata = {
  title: {
    default: "Central de Chamados",
    template: "%s | Central de Chamados",
  },
  description: "Sistema de gestão de chamados: abra, acompanhe e resolva solicitações de suporte.",
  keywords: ["chamados", "suporte", "helpdesk", "tickets"],
  openGraph: {
    title: "Central de Chamados",
    description: "Abra, acompanhe e resolva solicitações de suporte.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}>
        <Cabecalho />
        <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
