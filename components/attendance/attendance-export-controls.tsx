"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToCSV } from "@/lib/export";

interface AttendanceRecord {
    id: string;
    date: Date;
    checkIn: Date | null;
    checkOut: Date | null;
    status: string;
    user?: {
        name: string;
        email: string;
    };
}

interface AttendanceExportControlsProps {
    data: AttendanceRecord[];
    isAdmin: boolean;
}

export function AttendanceExportControls({ data, isAdmin }: AttendanceExportControlsProps) {
    const handleExportCSV = () => {
        const formattedData = data.map((record) => {
            const dateStr = new Date(record.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            const checkInStr = record.checkIn
                ? new Date(record.checkIn).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
                : "-";
            const checkOutStr = record.checkOut
                ? new Date(record.checkOut).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
                : "Belum/Tidak Clock Out";

            if (isAdmin) {
                return {
                    Tanggal: dateStr,
                    Nama: record.user?.name || "-",
                    Email: record.user?.email || "-",
                    JamMasuk: checkInStr,
                    JamPulang: checkOutStr,
                    Status: record.status === "HADIR" ? "HADIR (Tepat Waktu)" : record.status,
                };
            }

            return {
                Tanggal: dateStr,
                JamMasuk: checkInStr,
                JamPulang: checkOutStr,
                Status: record.status === "HADIR" ? "HADIR (Tepat Waktu)" : record.status,
            };
        });

        exportToCSV(formattedData, "Laporan_Presensi_HRIS");
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex items-center gap-2 print:hidden">
            <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="h-9 text-xs gap-1.5 font-medium border-slate-200 dark:border-slate-800 shadow-sm"
            >
                <Download className="h-3.5 w-3.5" />
                <span>Ekspor CSV</span>
            </Button>
        </div>
    );
}
