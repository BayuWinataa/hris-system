import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistHeading = Geist({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL || "https://hris-system.vercel.app"),
  title: {
    default: "HRIS - Sistem Informasi & Manajemen Karyawan Modern",
    template: "%s | HRIS Neuform"
  },
  description: "Platform Sistem Informasi Sumber Daya Manusia (HRIS) modern untuk mengelola data karyawan, presensi harian, pengajuan cuti, penggajian (payroll), dan analitik HR secara terpadu.",
  keywords: [
    "HRIS",
    "Employee Management System",
    "Manajemen Karyawan",
    "Presensi Online",
    "Penggajian",
    "Payroll",
    "Slip Gaji",
    "Pengajuan Cuti",
    "HR Analytics",
    "Next.js HRIS"
  ],
  authors: [{ name: "Bayu Winata" }],
  creator: "Bayu Winata",
  publisher: "HRIS Neuform",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    title: "HRIS - Sistem Informasi & Manajemen Karyawan Modern",
    description: "Solusi terpadu manajemen karyawan, presensi realtime, pengajuan cuti, dan penggajian otomatis.",
    siteName: "HRIS Neuform",
  },
  twitter: {
    card: "summary_large_image",
    title: "HRIS - Sistem Informasi & Manajemen Karyawan Modern",
    description: "Solusi terpadu manajemen karyawan, presensi realtime, pengajuan cuti, dan penggajian otomatis.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable, geistHeading.variable)}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
