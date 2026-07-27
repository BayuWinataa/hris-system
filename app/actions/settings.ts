"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProfileImage(imageUrl: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) throw new Error("Unauthorized");

        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: imageUrl }
        });

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Gagal memperbarui foto profil." };
    }
}

import bcrypt from "bcryptjs";

export async function changePassword(currentPassword: string, newPassword: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const account = await prisma.account.findFirst({
            where: { userId: session.user.id, providerId: "credential" }
        });

        if (!account || !account.password) {
            throw new Error("Akun ini tidak menggunakan otentikasi password.");
        }

        const isValid = await bcrypt.compare(currentPassword, account.password);

        if (!isValid) {
            return { error: "Password saat ini salah!" };
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.account.update({
            where: { id: account.id },
            data: { password: hashedNewPassword }
        });

        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Gagal mengubah password." };
    }
}
