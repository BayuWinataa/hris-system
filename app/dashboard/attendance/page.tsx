import { Suspense } from "react";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAllAttendances, getPersonalAttendances } from "@/app/actions/attendance";
import { redirect } from "next/navigation";

import { AttendanceExportControls } from "@/components/attendance/attendance-export-controls";

export const metadata = {
    title: "Riwayat Kehadiran",
};

export default async function AttendancePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    const isAdmin = (session.user as any).role === "ADMIN";
    
    // Fetch data based on role
    const data = isAdmin ? await getAllAttendances() : await getPersonalAttendances();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Kehadiran</h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                        {isAdmin ? "Pantau dan ekspor laporan kehadiran seluruh karyawan." : "Daftar riwayat kehadiran Anda."}
                    </p>
                </div>
                <AttendanceExportControls data={data} isAdmin={isAdmin} />
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>{isAdmin ? "Semua Riwayat Kehadiran" : "Riwayat Kehadiran Saya"}</CardTitle>
                    <CardDescription>
                        {isAdmin 
                            ? "Pantau waktu kedatangan dan kepulangan semua pegawai." 
                            : "Daftar riwayat absensi Anda dari hari ke hari."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<TableSkeleton columns={isAdmin ? 5 : 4} rows={5} />}>
                        <AttendanceTable data={data} isAdmin={isAdmin} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
