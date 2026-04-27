import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-plus-jakarta'
});

export const metadata: Metadata = {
  title: "Sehat & Service - Pakistani Local Services Marketplace",
  description: "Connect with verified local service providers for AC repair, plumbing, electrician, carpenter, appliance repair, cleaning, moving, tutoring, beauty, tech help and more.",
  keywords: "Pakistani services, local services, AC repair, plumber, electrician, carpenter, home services, marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable}`}>
      <body className={`min-h-screen flex flex-col font-sans bg-slate-950 text-white selection:bg-secondary/30 selection:text-secondary`}>
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
