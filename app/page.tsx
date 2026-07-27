import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
    Clock,
    Users,
    Building2,
    CalendarDays,
    Banknote,
    Sparkles,
    ArrowRight,
    ShieldCheck,
    BarChart3,
    CheckCircle2,
} from "lucide-react";
import { AnimatedContainer, AnimatedStaggerGroup } from "@/components/ui/animated-container";

export default async function LandingPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const isLoggedIn = !!session?.user;

    return (
        <div className="min-h-screen bg-[#DCDCC6] text-[#111827] flex flex-col font-sans selection:bg-[#1C2016] selection:text-[#DCDCC6]">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 bg-[#DCDCC6]/90 backdrop-blur-md border-b border-[#1C2016]/10 px-6 sm:px-12 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#1C2016] text-[#DCDCC6] flex items-center justify-center font-black text-lg shadow-md">
                        HR
                    </div>
                    <div>
                        <span className="font-bold text-lg text-[#1C2016] tracking-tight block leading-none">
                            HRIS Neuform
                        </span>
                        <span className="font-mono text-[10px] text-[#4B5563] uppercase tracking-widest">
                            Series 01 • Enterprise
                        </span>
                    </div>
                </div>

                <nav className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <Link href="/dashboard">
                            <Button className="h-11 px-6 bg-[#1C2016] text-[#DCDCC6] hover:bg-[#2A3022] font-bold text-xs sm:text-sm rounded-xl shadow-lg gap-2">
                                Buka Dashboard <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" className="h-11 px-5 text-[#1C2016] font-bold text-xs sm:text-sm hover:bg-[#1C2016]/10 rounded-xl">
                                    Masuk
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button className="h-11 px-6 bg-[#1C2016] text-[#DCDCC6] hover:bg-[#2A3022] font-bold text-xs sm:text-sm rounded-xl shadow-lg gap-2">
                                    Mulai Sekarang <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            {/* Hero Section - Neuform Aesthetic */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-12 sm:py-20 space-y-16">
                <AnimatedContainer delay={0.05} className="text-center space-y-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-[#1C2016] text-[#DCDCC6] px-4 py-1.5 rounded-full shadow-md">
                        <Sparkles className="h-4 w-4 text-[#DCDCC6]" />
                        <span className="font-mono text-xs font-semibold tracking-wider uppercase">
                            Aesthetic Synthesis • HR Management 2026
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#1C2016] leading-[1.08]">
                        Kelola Presensi & Penggajian Karyawan dengan <span className="underline decoration-[#1C2016]/30 underline-offset-8">Kemurnian Struktur</span>
                    </h1>

                    <p className="text-base sm:text-xl text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
                        Platform HRIS terpadu yang memadukan otomatisasi presensi, toleransi keterlambatan, pengajuan cuti, analitik Chart.js, dan slip gaji digital.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                            <Button size="lg" className="h-14 px-8 bg-[#1C2016] text-[#DCDCC6] hover:bg-[#2A3022] font-bold text-base rounded-xl shadow-2xl gap-2">
                                {isLoggedIn ? "Masuk ke Dashboard" : "Coba Sekarang"} <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </AnimatedContainer>

                {/* Neuform Feature Bento Grid Showcase */}
                <AnimatedStaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                    {/* Card 1: Presensi Realtime */}
                    <div className="bg-[#1C2016] text-[#DCDCC6] p-8 rounded-2xl border border-[#DCDCC6]/20 shadow-xl flex flex-col justify-between space-y-6 hover:border-[#DCDCC6]/40 transition-all">
                        <div className="space-y-4">
                            <div className="p-3 w-fit rounded-xl bg-[#DCDCC6]/10 text-[#DCDCC6]">
                                <Clock className="h-6 w-6" />
                            </div>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[#DCDCC6]/60 block">
                                FEATURE 01 • REALTIME ATTENDANCE
                            </span>
                            <h3 className="text-xl font-bold text-[#DCDCC6]">
                                Presensi Digit & Toleransi Terlambat
                            </h3>
                            <p className="text-xs text-[#DCDCC6]/70 leading-relaxed">
                                Pencatatan Clock In / Clock Out presisi dengan evaluasi otomatis toleransi keterlambatan dan indikator lupa absen pulang.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-[#DCDCC6]/15 flex items-center justify-between text-xs font-mono">
                            <span className="text-[#DCDCC6]/60">Auto Status</span>
                            <span className="text-emerald-400 font-bold">Hadir / Terlambat</span>
                        </div>
                    </div>

                    {/* Card 2: Chart.js HR Analytics */}
                    <div className="bg-[#1C2016] text-[#DCDCC6] p-8 rounded-2xl border border-[#DCDCC6]/20 shadow-xl flex flex-col justify-between space-y-6 hover:border-[#DCDCC6]/40 transition-all">
                        <div className="space-y-4">
                            <div className="p-3 w-fit rounded-xl bg-[#DCDCC6]/10 text-[#DCDCC6]">
                                <BarChart3 className="h-6 w-6" />
                            </div>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[#DCDCC6]/60 block">
                                FEATURE 02 • VISUAL ANALYTICS
                            </span>
                            <h3 className="text-xl font-bold text-[#DCDCC6]">
                                Grafik Analitik Chart.js Interaktif
                            </h3>
                            <p className="text-xs text-[#DCDCC6]/70 leading-relaxed">
                                Visualisasi data rasio kehadiran, pengajuan cuti, dan distribusi anggota departemen dalam grafik Donut & Bar interaktif.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-[#DCDCC6]/15 flex items-center justify-between text-xs font-mono">
                            <span className="text-[#DCDCC6]/60">Engine</span>
                            <span className="text-[#DCDCC6] font-bold">Chart.js 4.5</span>
                        </div>
                    </div>

                    {/* Card 3: Slip Gaji Digital & Excel */}
                    <div className="bg-[#1C2016] text-[#DCDCC6] p-8 rounded-2xl border border-[#DCDCC6]/20 shadow-xl flex flex-col justify-between space-y-6 hover:border-[#DCDCC6]/40 transition-all">
                        <div className="space-y-4">
                            <div className="p-3 w-fit rounded-xl bg-[#DCDCC6]/10 text-[#DCDCC6]">
                                <Banknote className="h-6 w-6" />
                            </div>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[#DCDCC6]/60 block">
                                FEATURE 03 • PAYROLL & EXCEL
                            </span>
                            <h3 className="text-xl font-bold text-[#DCDCC6]">
                                Penggajian & Slip Gaji PDF Cetak
                            </h3>
                            <p className="text-xs text-[#DCDCC6]/70 leading-relaxed">
                                Kalkulasi otomatis Take Home Pay berdasarkan kehadiran, generasi dokumen Slip Gaji resmi, dan ekspor spreadsheet .xlsx.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-[#DCDCC6]/15 flex items-center justify-between text-xs font-mono">
                            <span className="text-[#DCDCC6]/60">Output Format</span>
                            <span className="text-amber-400 font-bold">PDF & XLSX Native</span>
                        </div>
                    </div>
                </AnimatedStaggerGroup>
            </main>

            {/* Neuform Minimal Footer */}
            <footer className="border-t border-[#1C2016]/10 px-6 sm:px-12 py-8 bg-[#DCDCC6]">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#4B5563]">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1C2016]">HRIS Neuform</span>
                        <span>•</span>
                        <span>© 2026 All Rights Reserved.</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span>Neuform Staff Featured Architecture</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
