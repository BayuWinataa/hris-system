import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTodayAttendance } from "@/app/actions/attendance";
import { getAnnouncements } from "@/app/actions/announcement";
import { AttendanceWidget } from "@/components/attendance/attendance-widget";
import { AnnouncementList } from "@/components/announcements/announcement-list";
import { Clock, Users, Building2, CalendarDays, ArrowUpRight, Bell, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

import { getHRAnalytics } from "@/app/actions/analytics";
import { HRAnalyticsWidget } from "@/components/dashboard/hr-analytics-widget";

import { AnimatedContainer } from "@/components/ui/animated-container";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return null;
    }

    const isAdmin = (session.user as any).role === "ADMIN";

    // Fetch employee dashboard data
    const todayAttendance = await getTodayAttendance();
    const announcements = await getAnnouncements();
    const analyticsData = await getHRAnalytics();

    // Fetch admin dashboard data
    let totalEmployees = 0;
    let totalDepartments = 0;
    let todayPresent = 0;
    let pendingLeaves = 0;

    if (isAdmin) {
        totalEmployees = await prisma.user.count({ where: { role: "EMPLOYEE" } });
        totalDepartments = await prisma.department.count();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        todayPresent = await prisma.attendance.count({
            where: { date: today, status: "HADIR" }
        });
        pendingLeaves = await prisma.leaveRequest.count({
            where: { status: "PENDING" }
        });
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-4 select-none">
            {/* Header Banner */}
            <AnimatedContainer delay={0.05}>
                <div className="bg-[#1C2016] border border-[#DCDCC6]/20 rounded-2xl p-6 sm:p-8 text-[#DCDCC6] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Sparkles className="h-48 w-48 text-[#DCDCC6]" />
                    </div>
                    <div className="relative z-10 space-y-2">
                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#DCDCC6]">
                            Selamat Datang kembali, {session.user.name} 👋
                        </h1>
                        <p className="text-xs sm:text-sm text-[#DCDCC6]/70 max-w-xl">
                            Pantau aktivitas presensi, pengelolaan tim, dan permohonan cuti dalam satu sistem terintegrasi.
                        </p>
                    </div>
                </div>
            </AnimatedContainer>

            {/* Stat Bento Cards (Admin Mode) */}
            {isAdmin && (
                <AnimatedContainer delay={0.1}>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-[#1C2016] border border-[#DCDCC6]/15 rounded-xl p-5 text-[#DCDCC6] shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-[#DCDCC6]/70 font-medium">Total Pegawai Active</p>
                                <div className="h-8 w-8 rounded-lg bg-[#DCDCC6]/10 flex items-center justify-center text-[#DCDCC6]">
                                    <Users className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-3xl font-extrabold font-mono tracking-tight text-[#DCDCC6]">
                                    {totalEmployees}
                                </span>
                            </div>
                        </div>

                        <div className="bg-[#1C2016] border border-[#DCDCC6]/15 rounded-xl p-5 text-[#DCDCC6] shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-[#DCDCC6]/70 font-medium">Departemen Terdaftar</p>
                                <div className="h-8 w-8 rounded-lg bg-[#DCDCC6]/10 flex items-center justify-center text-[#DCDCC6]">
                                    <Building2 className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-3xl font-extrabold font-mono tracking-tight text-[#DCDCC6]">
                                    {totalDepartments}
                                </span>
                            </div>
                        </div>

                        <div className="bg-[#1C2016] border border-[#DCDCC6]/15 rounded-xl p-5 text-[#DCDCC6] shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-[#DCDCC6]/70 font-medium">Hadir Hari Ini</p>
                                <div className="h-8 w-8 rounded-lg bg-[#DCDCC6]/10 flex items-center justify-center text-[#DCDCC6]">
                                    <Clock className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-3xl font-extrabold font-mono tracking-tight text-[#DCDCC6]">
                                    {todayPresent}
                                </span>
                            </div>
                        </div>

                        <div className="bg-[#1C2016] border border-[#DCDCC6]/15 rounded-xl p-5 text-[#DCDCC6] shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-[#DCDCC6]/70 font-medium">Permohonan Cuti Pending</p>
                                <div className="h-8 w-8 rounded-lg bg-[#DCDCC6]/10 flex items-center justify-center text-[#DCDCC6]">
                                    <CalendarDays className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-3xl font-extrabold font-mono tracking-tight text-[#DCDCC6]">
                                    {pendingLeaves}
                                </span>
                            </div>
                        </div>
                    </div>
                </AnimatedContainer>
            )}

            {/* HR Analytics & Visual Charts Section */}
            <AnimatedContainer delay={0.15}>
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <HRAnalyticsWidget data={analyticsData} />
                </div>
            </AnimatedContainer>

            {/* Main Content Grid */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
                {/* Announcements Bento Card */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <AnnouncementList announcements={announcements} isAdmin={isAdmin} />
                </div>

                {/* Attendance Widget Bento Card */}
                <div className="lg:col-span-5 bg-[#1C2016] border border-[#DCDCC6]/20 rounded-2xl p-6 text-[#DCDCC6] shadow-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-[#DCDCC6]/15 pb-4 mb-6">
                        <div>
                            <h2 className="font-bold text-lg text-[#DCDCC6] mt-0.5">Kehadiran Hari Ini</h2>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <AttendanceWidget initialData={todayAttendance} />
                    </div>
                </div>
            </div>
        </div>
    );
}

