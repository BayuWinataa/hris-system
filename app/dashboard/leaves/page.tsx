import { Suspense } from "react";
import { LeaveTable } from "@/components/leaves/leave-table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAllLeaves, getPersonalLeaves } from "@/app/actions/leave";
import { redirect } from "next/navigation";

import { LeaveExportControls } from "@/components/leaves/leave-export-controls";

export const metadata = {
    title: "Manajemen Cuti & Izin",
};

export default async function LeavesPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    const isAdmin = (session.user as any).role === "ADMIN";
    
    // Fetch data based on role
    const data = isAdmin ? await getAllLeaves() : await getPersonalLeaves();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Cuti & Izin</h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                        {isAdmin ? "Kelola dan ekspor laporan pengajuan cuti seluruh karyawan." : "Daftar riwayat pengajuan cuti Anda."}
                    </p>
                </div>
                <LeaveExportControls data={data} isAdmin={isAdmin} />
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>{isAdmin ? "Daftar Pengajuan Cuti" : "Riwayat Pengajuan Cuti Anda"}</CardTitle>
                    <CardDescription>
                        {isAdmin 
                            ? "Kelola dan berikan persetujuan untuk permohonan cuti karyawan." 
                            : "Pantau status pengajuan cuti atau izin Anda di sini."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<TableSkeleton columns={isAdmin ? 6 : 5} rows={5} />}>
                        <LeaveTable data={data} isAdmin={isAdmin} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
