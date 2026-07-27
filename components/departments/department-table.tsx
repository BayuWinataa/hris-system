"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DepartmentDialog } from "./department-dialog";
import { deleteDepartment } from "@/app/actions/department";

interface DepartmentData {
    id: string;
    name: string;
    createdAt: Date;
    _count: { employees: number };
}

export function DepartmentTable({ data }: { data: DepartmentData[] }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState<DepartmentData | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleEdit = (dept: DepartmentData) => {
        setSelectedDept(dept);
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus departemen ini? Karyawan di dalamnya akan kehilangan departemennya.")) {
            setIsDeleting(id);
            await deleteDepartment(id);
            setIsDeleting(null);
        }
    };

    const openCreateDialog = () => {
        setSelectedDept(null);
        setDialogOpen(true);
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={openCreateDialog}>Tambah Departemen</Button>
            </div>

            <div className="rounded-md border bg-white dark:bg-slate-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Departemen</TableHead>
                            <TableHead>Jumlah Karyawan</TableHead>
                            <TableHead>Dibuat Pada</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    Belum ada departemen.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((dept) => (
                                <TableRow key={dept.id}>
                                    <TableCell className="font-medium">{dept.name}</TableCell>
                                    <TableCell>{dept._count.employees} Orang</TableCell>
                                    <TableCell>{dept.createdAt.toLocaleDateString("id-ID")}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => handleEdit(dept)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            size="icon" 
                                            onClick={() => handleDelete(dept.id)}
                                            disabled={isDeleting === dept.id}
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

            <DepartmentDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen} 
                department={selectedDept} 
            />
        </div>
    );
}
