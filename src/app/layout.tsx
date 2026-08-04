import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import ClickSpark from "@/components/ClickSpark";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IUCEE-EWB HITAM | Engineering for Impact",
  description: "The official IUCEE Engineers Without Borders HITAM student chapter — building real-world, sustainable engineering solutions that serve communities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${nunito.variable} min-h-screen flex flex-col font-sans antialiased bg-white text-zinc-900 transition-colors duration-300 dark:bg-[#050505] dark:text-zinc-50`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClickSpark />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
