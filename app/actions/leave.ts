"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { leaveSchema, type LeaveFormValues } from "@/lib/validations/leave";

export async function getPersonalLeaves() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) return [];

        return await prisma.leaveRequest.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        console.error("Failed to fetch personal leaves:", error);
        return [];
    }
}

export async function getAllLeaves() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user || session.user.role !== "ADMIN") return [];

        return await prisma.leaveRequest.findMany({
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        console.error("Failed to fetch all leaves:", error);
        return [];
    }
}

export async function applyLeave(data: LeaveFormValues) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) throw new Error("Unauthorized");

        const parsed = leaveSchema.parse(data);
        const startDate = new Date(parsed.startDate);
        const endDate = new Date(parsed.endDate);

        if (endDate < startDate) {
            throw new Error("Tanggal selesai tidak boleh sebelum tanggal mulai!");
        }

        await prisma.leaveRequest.create({
            data: {
                userId: session.user.id,
                startDate,
                endDate,
                reason: parsed.reason,
                status: "PENDING"
            }
        });

        revalidatePath("/dashboard/leaves");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Gagal mengajukan cuti." };
    }
}

export async function updateLeaveStatus(id: string, status: "DISETUJUI" | "DITOLAK") {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user || session.user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        await prisma.leaveRequest.update({
            where: { id },
            data: { status }
        });

        revalidatePath("/dashboard/leaves");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Gagal memperbarui status cuti." };
    }
}
