import { z } from "zod";

export const employeeSchema = z.object({
    name: z.string().min(2, "Nama karyawan minimal 2 karakter!"),
    email: z.string().email("Format email tidak valid!"),
    role: z.enum(["ADMIN", "EMPLOYEE"]),
    position: z.string().optional(),
    phoneNumber: z.string().optional(),
    employmentStatus: z.enum(["TETAP", "KONTRAK", "MAGANG"]).optional(),
    departmentId: z.string().optional().nullable(),
    joinDate: z.string().optional(), // Using string for date input "YYYY-MM-DD"
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
