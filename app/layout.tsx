import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./user-provider";
import { OrderProvider } from "./order-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "NomNom",
    template: "%s | NomNom",
  },
  description: "Swift food delivery — order your favorite dishes online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <UserProvider />
        <OrderProvider />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
