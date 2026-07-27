"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { announcementSchema, type AnnouncementFormValues } from "@/lib/validations/announcement";

export async function getAnnouncements() {
    try {
        return await (prisma as any).announcement.findMany({
            include: {
                author: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: "desc" },
            take: 5
        });
    } catch (error) {
        console.error("Failed to fetch announcements:", error);
        return [];
    }
}

export async function createAnnouncement(data: AnnouncementFormValues) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user || (session.user as any).role !== "ADMIN") {
            throw new Error("Hanya Admin yang berhak membuat pengumuman!");
        }

        const parsed = announcementSchema.parse(data);

        await (prisma as any).announcement.create({
            data: {
                title: parsed.title,
                content: parsed.content,
                authorId: session.user.id
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/announcements");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Gagal membuat pengumuman." };
    }
}

export async function updateAnnouncement(id: string, data: AnnouncementFormValues) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user || (session.user as any).role !== "ADMIN") {
            throw new Error("Hanya Admin yang berhak memperbarui pengumuman!");
        }

        const parsed = announcementSchema.parse(data);

        await (prisma as any).announcement.update({
            where: { id },
            data: {
                title: parsed.title,
                content: parsed.content,
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/announcements");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Gagal memperbarui pengumuman." };
    }
}

export async function deleteAnnouncement(id: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user || (session.user as any).role !== "ADMIN") {
            throw new Error("Hanya Admin yang berhak menghapus pengumuman!");
        }

        await (prisma as any).announcement.delete({
            where: { id }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/announcements");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Gagal menghapus pengumuman." };
    }
}
