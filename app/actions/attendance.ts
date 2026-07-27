"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getTodayAttendance() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await prisma.attendance.findFirst({
            where: {
                userId: session.user.id,
                date: today
            }
        });

        return attendance;
    } catch (error) {
        console.error("Failed to fetch today's attendance:", error);
        return null;
    }
}

export async function clockIn() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) throw new Error("Unauthorized");

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already clocked in
        const existing = await prisma.attendance.findFirst({
            where: {
                userId: session.user.id,
                date: today
            }
        });

        if (existing) {
            throw new Error("Anda sudah melakukan absen masuk hari ini.");
        }

        const now = new Date();
        
        // Evaluate work schedule & tolerance
        let status: "HADIR" | "TERLAMBAT" = "HADIR";
        try {
            const schedule = await (prisma as any).workSchedule.findFirst();
            const startTimeStr = schedule?.startTime || "08:00";
            const tolerance = schedule?.lateToleranceMinutes ?? 15;

            const [startHour, startMinute] = startTimeStr.split(":").map(Number);
            const lateThreshold = new Date(now);
            lateThreshold.setHours(startHour, startMinute + tolerance, 0, 0);

            if (now > lateThreshold) {
                status = "TERLAMBAT";
            }
        } catch (e) {
            console.error("Failed to evaluate work schedule:", e);
        }
        
        await prisma.attendance.create({
            data: {
                userId: session.user.id,
                date: today,
                checkIn: now,
                status: status
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/attendance");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Gagal absen masuk." };
    }
}

export async function clockOut() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) throw new Error("Unauthorized");

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existing = await prisma.attendance.findFirst({
            where: {
                userId: session.user.id,
                date: today
            }
        });

        if (!existing) {
            throw new Error("Anda belum melakukan absen masuk hari ini.");
        }

        if (existing.checkOut) {
            throw new Error("Anda sudah melakukan absen pulang hari ini.");
        }

        const now = new Date();

        await prisma.attendance.update({
            where: { id: existing.id },
            data: { checkOut: now }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/attendance");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Gagal absen pulang." };
    }
}

export async function getPersonalAttendances() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) return [];

        return await prisma.attendance.findMany({
            where: { userId: session.user.id },
            orderBy: { date: "desc" }
        });
    } catch (error) {
        return [];
    }
}

export async function getAllAttendances() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user || session.user.role !== "ADMIN") return [];

        return await prisma.attendance.findMany({
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { date: "desc" }
        });
    } catch (error) {
        return [];
    }
}
