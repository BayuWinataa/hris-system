import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayrolls } from "@/app/actions/payroll";
import { PayrollManagement } from "@/components/payroll/payroll-management";

export const metadata = {
    title: "Penggajian & Slip Gaji",
};

export default async function PayrollPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    const isAdmin = (session.user as any).role === "ADMIN";
    const currentMonth = new Date().toISOString().slice(0, 7);
    const data = await getPayrolls(currentMonth);

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Penggajian & Slip Gaji</h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                        {isAdmin
                            ? "Kelola proses gaji bulanan karyawan, slip gaji digital, dan status pembayaran."
                            : "Lihat dan cetak riwayat slip gaji bulanan Anda."}
                    </p>
                </div>
            </div>

            <PayrollManagement data={data} isAdmin={isAdmin} currentMonth={currentMonth} />
        </div>
    );
}
