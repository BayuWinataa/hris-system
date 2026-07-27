"use server";

import { prisma } from "@/lib/prisma";
import { employeeSchema, type EmployeeFormValues } from "@/lib/validations/employee";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getEmployees() {
    try {
        const employees = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                department: true,
            }
        });
        return employees;
    } catch (error) {
        console.error("Failed to fetch employees:", error);
        throw new Error("Gagal mengambil data karyawan.");
    }
}

export async function createEmployee(data: EmployeeFormValues) {
    try {
        const parsed = employeeSchema.parse(data);

        // Check if email already exists
        const existing = await prisma.user.findUnique({
            where: { email: parsed.email }
        });

        if (existing) {
            return { error: "Email sudah terdaftar!" };
        }

        const hashedPassword = await bcrypt.hash("perusahaan123", 10);

        const newEmployee = await prisma.user.create({
            data: {
                name: parsed.name,
                email: parsed.email,
                role: parsed.role,
                position: parsed.position || null,
                phoneNumber: parsed.phoneNumber || null,
                employmentStatus: parsed.employmentStatus || "TETAP",
                departmentId: parsed.departmentId || null,
                joinDate: parsed.joinDate ? new Date(parsed.joinDate) : null,
                emailVerified: true,
            }
        });

        // Create Account for Better Auth
        await prisma.account.create({
            data: {
                userId: newEmployee.id,
                accountId: newEmployee.email,
                providerId: "credential",
                password: hashedPassword,
            }
        });

        revalidatePath("/dashboard/employees");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Gagal membuat karyawan." };
    }
}

export async function updateEmployee(id: string, data: EmployeeFormValues) {
    try {
        const parsed = employeeSchema.parse(data);

        // Check if email already exists for OTHER employees
        const existing = await prisma.user.findFirst({
            where: {
                email: parsed.email,
                id: { not: id }
            }
        });

        if (existing) {
            return { error: "Email sudah digunakan oleh akun lain!" };
        }

        await prisma.user.update({
            where: { id },
            data: {
                name: parsed.name,
                email: parsed.email,
                role: parsed.role,
                position: parsed.position || null,
                phoneNumber: parsed.phoneNumber || null,
                employmentStatus: parsed.employmentStatus || "TETAP",
                departmentId: parsed.departmentId || null,
                joinDate: parsed.joinDate ? new Date(parsed.joinDate) : null,
            }
        });

        // Update email in Account if changed
        await prisma.account.updateMany({
            where: { userId: id, providerId: "credential" },
            data: { accountId: parsed.email }
        });

        revalidatePath("/dashboard/employees");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Gagal memperbarui karyawan." };
    }
}

export async function deleteEmployee(id: string) {
    try {
        await prisma.user.delete({
            where: { id }
        });

        revalidatePath("/dashboard/employees");
        return { success: true };
    } catch (error: any) {
        return { error: "Gagal menghapus karyawan." };
    }
}
