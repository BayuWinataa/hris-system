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
import { Check, X, ArrowUpDown, ChevronLeft, ChevronRight, Search, Plus } from "lucide-react";
import { updateLeaveStatus } from "@/app/actions/leave";
import { LeaveDialog } from "./leave-dialog";
import { formatIndonesianDate } from "@/lib/date";
import { toast } from "sonner";

interface LeaveData {
    id: string;
    startDate: Date;
    endDate: Date;
    reason: string;
    status: string;
    createdAt: Date;
    user?: {
        name: string;
        email: string;
    };
}

interface LeaveTableProps {
    data: LeaveData[];
    isAdmin: boolean;
}

const columnHelper = createColumnHelper<LeaveData>();

export function LeaveTable({ data, isAdmin }: LeaveTableProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200">Pending</Badge>;
            case "DISETUJUI":
                return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200">Disetujui</Badge>;
            case "DITOLAK":
                return <Badge variant="destructive">Ditolak</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleAction = async (id: string, status: "DISETUJUI" | "DITOLAK") => {
        setProcessingId(id);
        const res = await updateLeaveStatus(id, status);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success(`Pengajuan cuti berhasil di-${status === "DISETUJUI" ? "setujui" : "tolak"}!`);
        }
        setProcessingId(null);
    };

    const columns = [
        columnHelper.accessor("createdAt", {
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 -ml-3 gap-1 font-semibold text-xs"
                >
                    Diajukan Pada <ArrowUpDown className="h-3 w-3" />
                </Button>
            ),
            cell: (info) => (
                <span className="text-xs text-slate-500 font-mono">
                    {formatIndonesianDate(info.getValue(), "d MMM yyyy")}
                </span>
            ),
        }),
        ...(isAdmin
            ? [
                  columnHelper.accessor((row) => row.user?.name || "", {
                      id: "employee",
                      header: "Karyawan",
                      cell: (info) => (
                          <div className="flex flex-col">
                              <span className="font-medium text-slate-800 dark:text-slate-200">{info.row.original.user?.name}</span>
                              <span className="text-xs text-slate-400 font-mono">{info.row.original.user?.email}</span>
                          </div>
                      ),
                  }),
              ]
            : []),
        columnHelper.accessor("startDate", {
            header: "Mulai",
            cell: (info) => formatIndonesianDate(info.getValue(), "d MMM yyyy"),
        }),
        columnHelper.accessor("endDate", {
            header: "Selesai",
            cell: (info) => formatIndonesianDate(info.getValue(), "d MMM yyyy"),
        }),
        columnHelper.accessor("reason", {
            header: "Alasan",
            cell: (info) => (
                <p className="text-xs text-slate-700 dark:text-slate-300 truncate max-w-[200px]" title={info.getValue()}>
                    {info.getValue()}
                </p>
            ),
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: (info) => renderStatusBadge(info.getValue()),
        }),
        ...(isAdmin
            ? [
                  columnHelper.display({
                      id: "actions",
                      header: () => <div className="text-right">Aksi</div>,
                      cell: ({ row }) => {
                          const record = row.original;
                          return (
                              <div className="flex justify-end gap-1.5">
                                  {record.status === "PENDING" ? (
                                      <>
                                          <Button
                                              variant="outline"
                                              size="sm"
                                              className="h-8 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                              onClick={() => handleAction(record.id, "DISETUJUI")}
                                              disabled={processingId === record.id}
                                          >
                                              <Check className="h-3.5 w-3.5 mr-1" /> Setujui
                                          </Button>
                                          <Button
                                              variant="outline"
                                              size="sm"
                                              className="h-8 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                                              onClick={() => handleAction(record.id, "DITOLAK")}
                                              disabled={processingId === record.id}
                                          >
                                              <X className="h-3.5 w-3.5 mr-1" /> Tolak
                                          </Button>
                                      </>
                                  ) : (
                                      <span className="text-xs text-slate-400 font-mono">Selesai</span>
                                  )}
                              </div>
                          );
                      },
                  }),
              ]
            : []),
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
        <div className="space-y-4">
            {/* Header Controls */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input
                        placeholder="Cari pengajuan cuti..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-9 h-9 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 rounded-xl"
                    />
                </div>

                <Button onClick={() => setDialogOpen(true)} className="h-9 gap-1.5 text-xs font-semibold">
                    <Plus className="h-4 w-4" /> Ajukan Cuti Baru
                </Button>
            </div>

            {/* TanStack Table View */}
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
                                <TableCell colSpan={isAdmin ? 7 : 5} className="h-24 text-center text-muted-foreground">
                                    Belum ada data pengajuan cuti.
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

            <LeaveDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>
    );
}
