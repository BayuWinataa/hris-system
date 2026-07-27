"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Building2, CheckCircle2, ShieldCheck, Banknote } from "lucide-react";
import { formatIndonesianDate } from "@/lib/date";

interface PayslipData {
    id: string;
    month: string;
    basicSalary: number;
    allowance: number;
    deductions: number;
    netSalary: number;
    status: string;
    paidAt?: Date | null;
    createdAt: Date;
    user?: {
        name: string;
        email: string;
        position?: string | null;
        department?: { name: string } | null;
    };
}

interface PayslipModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    payroll: PayslipData | null;
}

export function PayslipModal({ open, onOpenChange, payroll }: PayslipModalProps) {
    if (!payroll) return null;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(val);
    };

    const handlePrint = () => {
        window.print();
    };

    const [year, monthNum] = payroll.month.split("-");
    const monthDate = new Date(Number(year), Number(monthNum) - 1, 1);
    const formattedMonth = formatIndonesianDate(monthDate, "MMMM yyyy");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-[560px] p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
                <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 text-left">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2.5 rounded-2xl bg-[#1C2016] text-[#DCDCC6]">
                                <Banknote className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                    SLIP GAJI KARYAWAN
                                </DialogTitle>
                                <p className="text-xs text-slate-400 font-mono">
                                    Periode: {formattedMonth}
                                </p>
                            </div>
                        </div>

                        <span
                            className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                                payroll.status === "PAID"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                            }`}
                        >
                            {payroll.status === "PAID" ? "LUNAS / PAID" : "DRAFT"}
                        </span>
                    </div>
                </DialogHeader>

                {/* Employee Details Grid */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
                    <div>
                        <span className="text-slate-400 block font-medium">Nama Karyawan</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">
                            {payroll.user?.name}
                        </span>
                        <span className="text-slate-400 text-[11px] font-mono">{payroll.user?.email}</span>
                    </div>
                    <div>
                        <span className="text-slate-400 block font-medium">Jabatan / Departemen</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                            {payroll.user?.position || "Staf"}
                        </span>
                        <span className="text-slate-500 font-medium">
                            {payroll.user?.department?.name || "Umum"}
                        </span>
                    </div>
                </div>

                {/* Income & Deduction Breakdown */}
                <div className="space-y-4 text-xs">
                    {/* Income Section */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-900 pb-1">
                            A. Pendapatan (Earnings)
                        </h4>
                        <div className="flex justify-between py-1 border-b border-dashed border-slate-200 dark:border-slate-800">
                            <span className="text-slate-600 dark:text-slate-400">Gaji Pokok</span>
                            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                                {formatCurrency(payroll.basicSalary)}
                            </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-dashed border-slate-200 dark:border-slate-800">
                            <span className="text-slate-600 dark:text-slate-400">Tunjangan Transport & Makan</span>
                            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                                {formatCurrency(payroll.allowance)}
                            </span>
                        </div>
                    </div>

                    {/* Deductions Section */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-900 pb-1">
                            B. Potongan (Deductions)
                        </h4>
                        <div className="flex justify-between py-1 border-b border-dashed border-slate-200 dark:border-slate-800">
                            <span className="text-slate-600 dark:text-slate-400">Potongan Keterlambatan</span>
                            <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                                - {formatCurrency(payroll.deductions)}
                            </span>
                        </div>
                    </div>

                    {/* Total Take Home Pay */}
                    <div className="p-4 rounded-2xl bg-[#1C2016] text-[#DCDCC6] flex items-center justify-between shadow-lg mt-4">
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#DCDCC6]/70 block">
                                TOTAL GAJI BERSIH (TAKE HOME PAY)
                            </span>
                            <span className="text-xl sm:text-2xl font-extrabold font-mono text-[#DCDCC6] mt-0.5 block">
                                {formatCurrency(payroll.netSalary)}
                            </span>
                        </div>
                        {payroll.paidAt && (
                            <div className="text-right">
                                <span className="text-[9px] font-mono text-[#DCDCC6]/50 uppercase block">Dibayar Pada</span>
                                <span className="text-xs font-mono font-semibold text-[#DCDCC6]">
                                    {formatIndonesianDate(payroll.paidAt, "d MMM yyyy")}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Print Control Footer */}
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-900 print:hidden">
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                        Tutup
                    </Button>
                    <Button size="sm" onClick={handlePrint} className="gap-1.5 font-semibold">
                        <Printer className="h-4 w-4" /> Cetak Slip Gaji (PDF)
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
