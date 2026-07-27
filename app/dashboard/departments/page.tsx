import { Suspense } from "react";
import { DepartmentList } from "@/components/departments/department-list";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Manajemen Departemen",
};

export default async function DepartmentsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Departemen</h2>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Departemen</CardTitle>
                    <CardDescription>
                        Kelola divisi atau departemen di perusahaan Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<TableSkeleton columns={4} rows={3} />}>
                        <DepartmentList />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
