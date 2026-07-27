"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getWorkSchedule() {
    try {
        let schedule = await (prisma as any).workSchedule.findFirst();
        if (!schedule) {
            schedule = await (prisma as any).workSchedule.create({
                data: {
                    startTime: "08:00",
                    endTime: "17:00",
                    lateToleranceMinutes: 15,
                }
            });
        }
        return schedule;
    } catch (error) {
        console.error("Error fetching work schedule:", error);
        return {
            id: "default",
            startTime: "08:00",
            endTime: "17:00",
            lateToleranceMinutes: 15,
        };
    }
}

export async function updateWorkSchedule(data: {
    startTime: string;
    endTime: string;
    lateToleranceMinutes: number;
}) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user || (session.user as any).role !== "ADMIN") {
            throw new Error("Hanya Admin yang berhak mengubah jam kerja perusahaan!");
        }

        const existing = await (prisma as any).workSchedule.findFirst();

        if (existing) {
            await (prisma as any).workSchedule.update({
                where: { id: existing.id },
                data: {
                    startTime: data.startTime,
                    endTime: data.endTime,
                    lateToleranceMinutes: Number(data.lateToleranceMinutes),
                }
            });
        } else {
            await (prisma as any).workSchedule.create({
                data: {
                    startTime: data.startTime,
                    endTime: data.endTime,
                    lateToleranceMinutes: Number(data.lateToleranceMinutes),
                }
            });
        }

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/settings");
        revalidatePath("/dashboard/attendance");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Gagal mengupdate jam kerja." };
    }
}
