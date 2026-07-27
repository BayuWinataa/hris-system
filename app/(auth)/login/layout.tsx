import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Sistem",
  description: "Masuk ke sistem manajemen karyawan HRIS untuk mengelola presensi, cuti, dan penggajian.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
