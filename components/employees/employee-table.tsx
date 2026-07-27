"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmployeeDialog, DepartmentOption, EmployeeData } from "./employee-dialog";
import { deleteEmployee } from "@/app/actions/employee";
import { Badge } from "@/components/ui/badge";

interface EmployeeTableData extends EmployeeData {
    department: { name: string } | null;
}

interface EmployeeTableProps {
    data: EmployeeTableData[];
    departments: DepartmentOption[];
}

export function EmployeeTable({ data, departments }: EmployeeTableProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeTableData | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleEdit = (emp: EmployeeTableData) => {
        setSelectedEmployee(emp);
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus karyawan ini secara permanen?")) {
            setIsDeleting(id);
            await deleteEmployee(id);
            setIsDeleting(null);
        }
    };

    const openCreateDialog = () => {
        setSelectedEmployee(null);
        setDialogOpen(true);
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={openCreateDialog}>Tambah Karyawan</Button>
            </div>

            <div className="rounded-md border bg-white dark:bg-slate-950 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Posisi</TableHead>
                            <TableHead>Departemen</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Belum ada karyawan terdaftar.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((emp) => (
                                <TableRow key={emp.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{emp.name}</span>
                                            {emp.role === "ADMIN" && (
                                                <Badge variant="outline" className="w-fit text-[10px] h-4 mt-1 px-1">Admin</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{emp.email}</TableCell>
                                    <TableCell>{emp.position || "-"}</TableCell>
                                    <TableCell>{emp.department?.name || "-"}</TableCell>
                                    <TableCell>
                                        <Badge variant={emp.employmentStatus === "TETAP" ? "default" : "secondary"}>
                                            {emp.employmentStatus || "TETAP"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => handleEdit(emp)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            size="icon" 
                                            onClick={() => handleDelete(emp.id)}
                                            disabled={isDeleting === emp.id}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <EmployeeDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen} 
                employee={selectedEmployee} 
                departments={departments}
            />
        </div>
    );
}
