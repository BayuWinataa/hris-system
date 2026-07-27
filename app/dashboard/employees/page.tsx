import { Suspense } from "react";
import { EmployeeList } from "@/components/employees/employee-list";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Manajemen Karyawan",
};

export default async function EmployeesPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Karyawan</h2>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Karyawan</CardTitle>
                    <CardDescription>
                        Kelola data pegawai, peran, dan departemen mereka.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<TableSkeleton columns={6} rows={5} />}>
                        <EmployeeList />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
