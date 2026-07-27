"use client";

import { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Banknote, FileText, CheckCircle2, Search, ArrowUpDown, ChevronLeft, ChevronRight, Download, RefreshCw } from "lucide-react";
import { generateMonthlyPayroll, markPayrollPaid } from "@/app/actions/payroll";
import { PayslipModal } from "./payslip-modal";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";
import { AnimatedContainer } from "@/components/ui/animated-container";

interface PayrollData {
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

interface PayrollManagementProps {
    data: PayrollData[];
    isAdmin: boolean;
    currentMonth: string;
}

const columnHelper = createColumnHelper<PayrollData>();

export function PayrollManagement({ data, isAdmin, currentMonth }: PayrollManagementProps) {
    const [selectedMonth, setSelectedMonth] = useState(currentMonth || new Date().toISOString().slice(0, 7));
    const [selectedPayroll, setSelectedPayroll] = useState<PayrollData | null>(null);
    const [payslipOpen, setPayslipOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(val);
    };

    const handleGenerate = async () => {
        setLoading(true);
        const res = await generateMonthlyPayroll(selectedMonth);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success(`Berhasil memproses gaji bulanan untuk ${res.count} karyawan!`);
        }
        setLoading(false);
    };

    const handleMarkPaid = async (id: string) => {
        const res = await markPayrollPaid(id);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Status pembayaran gaji berhasil ditandai LUNAS!");
        }
    };

    const handleExportExcel = () => {
        const formatted = data.map((item) => ({
            Bulan: item.month,
            Nama: item.user?.name || "-",
            Email: item.user?.email || "-",
            Jabatan: item.user?.position || "-",
            Departemen: item.user?.department?.name || "-",
            GajiPokok: item.basicSalary,
            Tunjangan: item.allowance,
            Potongan: item.deductions,
            GajiBersih: item.netSalary,
            Status: item.status === "PAID" ? "LUNAS (PAID)" : "DRAFT",
        }));

        const ok = exportToCSV(formatted, `Laporan_Penggajian_${selectedMonth}`, "Rekap Gaji");
        if (ok) toast.success("File Excel Laporan Penggajian berhasil diunduh!");
    };

    const columns = [
        columnHelper.accessor("month", {
            header: "Periode",
            cell: (info) => (
                <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {info.getValue()}
                </span>
            ),
        }),
        ...(isAdmin
            ? [
                  columnHelper.accessor((row) => row.user?.name || "", {
                      id: "employee",
                      header: ({ column }) => (
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                              className="h-8 -ml-3 gap-1 font-semibold text-xs"
                          >
                              Karyawan <ArrowUpDown className="h-3 w-3" />
                          </Button>
                      ),
                      cell: (info) => (
                          <div className="flex flex-col">
                              <span className="font-medium text-slate-800 dark:text-slate-200">{info.row.original.user?.name}</span>
                              <span className="text-xs text-slate-400 font-mono">{info.row.original.user?.email}</span>
                          </div>
                      ),
                  }),
              ]
            : []),
        columnHelper.accessor("basicSalary", {
            header: "Gaji Pokok",
            cell: (info) => formatCurrency(info.getValue()),
        }),
        columnHelper.accessor("allowance", {
            header: "Tunjangan",
            cell: (info) => formatCurrency(info.getValue()),
        }),
        columnHelper.accessor("deductions", {
            header: "Potongan",
            cell: (info) => (
                <span className="text-rose-600 dark:text-rose-400 font-medium">
                    {info.getValue() > 0 ? `- ${formatCurrency(info.getValue())}` : "Rp 0"}
                </span>
            ),
        }),
        columnHelper.accessor("netSalary", {
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 -ml-3 gap-1 font-bold text-xs"
                >
                    Take Home Pay <ArrowUpDown className="h-3 w-3" />
                </Button>
            ),
            cell: (info) => (
                <span className="font-mono font-extrabold text-slate-900 dark:text-slate-100">
                    {formatCurrency(info.getValue())}
                </span>
            ),
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: (info) => (
                <Badge
                    className={
                        info.getValue() === "PAID"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                    }
                >
                    {info.getValue() === "PAID" ? "LUNAS" : "DRAFT"}
                </Badge>
            ),
        }),
        columnHelper.display({
            id: "actions",
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => {
                const record = row.original;
                return (
                    <div className="flex justify-end gap-1.5">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs gap-1 border-slate-200 dark:border-slate-800"
                            onClick={() => {
                                setSelectedPayroll(record);
                                setPayslipOpen(true);
                            }}
                        >
                            <FileText className="h-3.5 w-3.5" /> Slip Gaji
                        </Button>
                        {isAdmin && record.status === "DRAFT" && (
                            <Button
                                size="sm"
                                className="h-8 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => handleMarkPaid(record.id)}
                            >
                                <CheckCircle2 className="h-3.5 w-3.5" /> Bayar
                            </Button>
                        )}
                    </div>
                );
            },
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            pagination: {
                pageSize: 7,
            },
        },
    });

    return (
        <div className="space-y-6">
            {/* Admin Controls Header Bar */}
            {isAdmin && (
                <AnimatedContainer delay={0.05}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pilih Bulan:</span>
                            <Input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="h-10 text-xs sm:text-sm w-44"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={handleExportExcel}
                                className="h-10 text-xs font-semibold gap-1.5 border-slate-200 dark:border-slate-800"
                            >
                                <Download className="h-4 w-4" /> Ekspor Excel (.xlsx)
                            </Button>

                            <Button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="h-10 px-4 gap-2 font-semibold text-xs sm:text-sm bg-[#1C2016] text-[#DCDCC6] hover:bg-[#2A3022] rounded-xl shadow-md"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                                {loading ? "Memproses..." : "Proses Gaji Bulanan"}
                            </Button>
                        </div>
                    </div>
                </AnimatedContainer>
            )}

            {/* Table Search & View */}
            <AnimatedContainer delay={0.1}>
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm flex items-center">
                            <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
                            <Input
                                placeholder="Cari rekap gaji..."
                                value={globalFilter ?? ""}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-9 h-9 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-x-auto shadow-sm">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={isAdmin ? 8 : 7} className="h-24 text-center text-muted-foreground">
                                            Belum ada data penggajian untuk periode ini. Klik "Proses Gaji Bulanan" untuk menggenerasi gaji karyawan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    {table.getPageCount() > 1 && (
                        <div className="flex items-center justify-between pt-1">
                            <span className="text-xs text-slate-500">
                                Halaman <strong className="text-slate-800 dark:text-slate-200">{table.getState().pagination.pageIndex + 1}</strong> dari {table.getPageCount()}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="h-8 text-xs gap-1"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" /> Prev
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="h-8 text-xs gap-1"
                                >
                                    Next <ChevronRight className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </AnimatedContainer>

            <PayslipModal
                open={payslipOpen}
                onOpenChange={setPayslipOpen}
                payroll={selectedPayroll}
            />
        </div>
    );
}
