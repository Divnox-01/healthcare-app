import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Chatbot from "../components/ui/Chatbot";
import { I18nProvider } from "../components/providers/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HealthCare+ | Premium Healthcare Platform",
  description: "Reimagining healthcare with intelligent, accessible, and empathetic digital solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50">
        <I18nProvider>
          <Navbar />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Chatbot />
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
