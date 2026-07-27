import { z } from "zod";

export const leaveSchema = z.object({
    startDate: z.string().min(1, "Tanggal mulai harus diisi!"),
    endDate: z.string().min(1, "Tanggal selesai harus diisi!"),
    reason: z.string().min(10, "Alasan cuti/izin harus lebih jelas (minimal 10 karakter)!"),
});

export type LeaveFormValues = z.infer<typeof leaveSchema>;
