"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getHRAnalytics() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) return null;

        const isAdmin = (session.user as any).role === "ADMIN";

        // Total Counts
        const totalEmployees = await prisma.user.count();
        const totalDepartments = await prisma.department.count();

        // Attendance Stats for Today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayAttendances = await prisma.attendance.findMany({
            where: { date: today }
        });

        const totalTodayCheckIns = todayAttendances.length;
        const totalOnTimeToday = todayAttendances.filter(a => a.status === "HADIR").length;
        const totalLateToday = todayAttendances.filter(a => a.status === "TERLAMBAT").length;

        // Leave Stats
        const totalLeaves = await prisma.leaveRequest.count();
        const pendingLeaves = await prisma.leaveRequest.count({ where: { status: "PENDING" } });
        const approvedLeaves = await prisma.leaveRequest.count({ where: { status: "DISETUJUI" } });
        const rejectedLeaves = await prisma.leaveRequest.count({ where: { status: "DITOLAK" } });

        // Department Distribution
        const departments = await prisma.department.findMany({
            include: {
                _count: {
                    select: { employees: true }
                }
            }
        });

        const departmentDistribution = departments.map(d => ({
            name: d.name,
            count: d._count.employees,
            percentage: totalEmployees > 0 ? Math.round((d._count.employees / totalEmployees) * 100) : 0
        }));

        const attendanceRate = totalEmployees > 0 ? Math.round((totalTodayCheckIns / totalEmployees) * 100) : 0;
        const onTimeRate = totalTodayCheckIns > 0 ? Math.round((totalOnTimeToday / totalTodayCheckIns) * 100) : 100;

        return {
            totalEmployees,
            totalDepartments,
            attendanceRate,
            onTimeRate,
            totalTodayCheckIns,
            totalOnTimeToday,
            totalLateToday,
            leaveStats: {
                total: totalLeaves,
                pending: pendingLeaves,
                approved: approvedLeaves,
                rejected: rejectedLeaves,
            },
            departmentDistribution,
            isAdmin
        };
    } catch (error) {
        console.error("Error generating HR Analytics:", error);
        return null;
    }
}
