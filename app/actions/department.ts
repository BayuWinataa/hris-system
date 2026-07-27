"use server";

import { prisma } from "@/lib/prisma";
import { departmentSchema, type DepartmentFormValues } from "@/lib/validations/department";
import { revalidatePath } from "next/cache";

export async function getDepartments() {
    try {
        const departments = await prisma.department.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                _count: {
                    select: { employees: true }
                }
            }
        });
        return departments;
    } catch (error) {
        console.error("Failed to fetch departments:", error);
        throw new Error("Gagal mengambil data departemen.");
    }
}

export async function createDepartment(data: DepartmentFormValues) {
    try {
        const parsed = departmentSchema.parse(data);

        // Check if name already exists
        const existing = await prisma.department.findUnique({
            where: { name: parsed.name }
        });

        if (existing) {
            return { error: "Nama departemen sudah digunakan!" };
        }

        await prisma.department.create({
            data: { name: parsed.name }
        });

        revalidatePath("/dashboard/departments");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Gagal membuat departemen." };
    }
}

export async function updateDepartment(id: string, data: DepartmentFormValues) {
    try {
        const parsed = departmentSchema.parse(data);

        // Check if name exists for OTHER departments
        const existing = await prisma.department.findFirst({
            where: {
                name: parsed.name,
                id: { not: id }
            }
        });

        if (existing) {
            return { error: "Nama departemen sudah digunakan!" };
        }

        await prisma.department.update({
            where: { id },
            data: { name: parsed.name }
        });

        revalidatePath("/dashboard/departments");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Gagal memperbarui departemen." };
    }
}

export async function deleteDepartment(id: string) {
    try {
        await prisma.department.delete({
            where: { id }
        });

        revalidatePath("/dashboard/departments");
        return { success: true };
    } catch (error: any) {
        return { error: "Gagal menghapus departemen." };
    }
}
