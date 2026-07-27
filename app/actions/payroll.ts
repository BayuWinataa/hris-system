"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getPayrolls(month?: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) return [];

        const isAdmin = (session.user as any).role === "ADMIN";
        const currentMonth = month || new Date().toISOString().slice(0, 7); // e.g. "2026-07"
        const payrollModel = (prisma as any).payroll;

        if (!payrollModel) return [];

        if (isAdmin) {
            return await payrollModel.findMany({
                where: { month: currentMonth },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            position: true,
                            department: { select: { name: true } }
                        }
                    }
                },
                orderBy: { createdAt: "desc" }
            });
        }

        return await payrollModel.findMany({
            where: { userId: session.user.id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        position: true,
                        department: { select: { name: true } }
                    }
                }
            },
            orderBy: { month: "desc" }
        });
    } catch (error) {
        console.error("Failed to fetch payrolls:", error);
        return [];
    }
}

export async function generateMonthlyPayroll(month: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user || (session.user as any).role !== "ADMIN") {
            throw new Error("Hanya Admin yang berhak memproses gaji karyawan.");
        }

        if (!month) throw new Error("Bulan penggajian tidak valid.");

        // Fetch all active employees
        const employees = await prisma.user.findMany({
            where: { role: "EMPLOYEE" }
        });

        if (employees.length === 0) {
            throw new Error("Belum ada karyawan aktif untuk diproses.");
        }

        for (const emp of employees) {
            // Count late check-ins for the selected month to calculate deduction
            const startDate = new Date(`${month}-01T00:00:00.000Z`);
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);

            const lateCount = await prisma.attendance.count({
                where: {
                    userId: emp.id,
                    date: { gte: startDate, lte: endDate },
                    status: "TERLAMBAT"
                }
            });

            const basicSalary = 5000000; // Rp 5.000.000
            const allowance = 1000000;   // Rp 1.000.000 (Tunjangan Transport & Makan)
            const deductions = lateCount * 50000; // Rp 50.000 per keterlambatan
            const netSalary = Math.max(0, basicSalary + allowance - deductions);

            const existing = await (prisma as any).payroll.findFirst({
                where: {
                    userId: emp.id,
                    month: month
                }
            });

            if (existing) {
                await (prisma as any).payroll.update({
                    where: { id: existing.id },
                    data: {
                        basicSalary,
                        allowance,
                        deductions,
                        netSalary,
                    }
                });
            } else {
                await (prisma as any).payroll.create({
                    data: {
                        userId: emp.id,
                        month: month,
                        basicSalary,
                        allowance,
                        deductions,
                        netSalary,
                        status: "DRAFT"
                    }
                });
            }
        }

        revalidatePath("/dashboard/payroll");
        return { success: true, count: employees.length };
    } catch (error: any) {
        return { error: error.message || "Gagal memproses gaji bulanan." };
    }
}

export async function markPayrollPaid(id: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user || (session.user as any).role !== "ADMIN") {
            throw new Error("Hanya Admin yang berhak mengubah status pembayaran gaji.");
        }

        await (prisma as any).payroll.update({
            where: { id },
            data: {
                status: "PAID",
                paidAt: new Date()
            }
        });

        revalidatePath("/dashboard/payroll");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Gagal mengupdate status gaji." };
    }
}
