"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToCSV } from "@/lib/export";

interface LeaveRecord {
    id: string;
    startDate: Date;
    endDate: Date;
    reason: string;
    status: string;
    user?: {
        name: string;
        email: string;
    };
}

interface LeaveExportControlsProps {
    data: LeaveRecord[];
    isAdmin: boolean;
}

export function LeaveExportControls({ data, isAdmin }: LeaveExportControlsProps) {
    const handleExportCSV = () => {
        const formattedData = data.map((record) => {
            const startDateStr = new Date(record.startDate).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            const endDateStr = new Date(record.endDate).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });

            if (isAdmin) {
                return {
                    Nama: record.user?.name || "-",
                    Email: record.user?.email || "-",
                    TanggalMulai: startDateStr,
                    TanggalSelesai: endDateStr,
                    Alasan: record.reason,
                    Status: record.status,
                };
            }

            return {
                TanggalMulai: startDateStr,
                TanggalSelesai: endDateStr,
                Alasan: record.reason,
                Status: record.status,
            };
        });

        exportToCSV(formattedData, "Laporan_Cuti_Izin_HRIS");
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
