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
import { formatIndonesianDate, formatTimeWIB } from "@/lib/date";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface AttendanceData {
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

interface AttendanceTableProps {
    data: AttendanceData[];
    isAdmin: boolean;
}

const columnHelper = createColumnHelper<AttendanceData>();

export function AttendanceTable({ data, isAdmin }: AttendanceTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case "HADIR":
                return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200">HADIR (Tepat Waktu)</Badge>;
            case "TERLAMBAT":
                return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200">TERLAMBAT</Badge>;
            case "ALFA":
                return <Badge variant="destructive">ALFA</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const formatCheckOut = (checkOutDate: Date | null, attendanceDate: Date) => {
        if (checkOutDate) {
            return formatTimeWIB(checkOutDate);
        }
        
        const recordDate = new Date(attendanceDate);
        recordDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (recordDate < today) {
            return (
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                    Tidak Clock Out
                </span>
            );
        }

        return (
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                Belum Pulang
            </span>
        );
    };

    const columns = [
        columnHelper.accessor("date", {
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 -ml-3 gap-1 font-semibold text-xs"
                >
                    Tanggal <ArrowUpDown className="h-3 w-3" />
                </Button>
            ),
            cell: (info) => (
                <span className="font-medium text-slate-800 dark:text-slate-200">
                    {formatIndonesianDate(info.getValue(), "EEEE, d MMM yyyy")}
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
        columnHelper.accessor("checkIn", {
            header: "Jam Masuk",
            cell: (info) => formatTimeWIB(info.getValue()),
        }),
        columnHelper.accessor("checkOut", {
            header: "Jam Pulang",
            cell: (info) => formatCheckOut(info.getValue(), info.row.original.date),
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: (info) => renderStatusBadge(info.getValue()),
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
        <div className="space-y-4">
            {/* Search & Filter Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input
                        placeholder="Cari absensi (nama/status)..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-9 h-9 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 rounded-xl"
                    />
                </div>
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
                                <TableCell colSpan={isAdmin ? 5 : 4} className="h-24 text-center text-muted-foreground">
                                    Tidak ada data absensi ditemukan.
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
    );
}
