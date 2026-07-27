"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeFormValues, employeeSchema } from "@/lib/validations/employee";
import { createEmployee, updateEmployee } from "@/app/actions/employee";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface DepartmentOption {
    id: string;
    name: string;
}

export interface EmployeeData {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "EMPLOYEE";
    position?: string | null;
    phoneNumber?: string | null;
    employmentStatus?: "TETAP" | "KONTRAK" | "MAGANG" | null;
    departmentId?: string | null;
    joinDate?: Date | null;
}

interface EmployeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee?: EmployeeData | null;
    departments: DepartmentOption[];
}

export function EmployeeDialog({ open, onOpenChange, employee, departments }: EmployeeDialogProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isEdit = !!employee;

    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "EMPLOYEE",
            position: "",
            phoneNumber: "",
            employmentStatus: "TETAP",
            departmentId: "none",
            joinDate: "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: employee?.name || "",
                email: employee?.email || "",
                role: employee?.role || "EMPLOYEE",
                position: employee?.position || "",
                phoneNumber: employee?.phoneNumber || "",
                employmentStatus: employee?.employmentStatus || "TETAP",
                departmentId: employee?.departmentId || "none",
                joinDate: employee?.joinDate ? new Date(employee.joinDate).toISOString().split('T')[0] : "",
            });
            setError("");
        }
    }, [open, employee, form]);

    const onSubmit = async (data: EmployeeFormValues) => {
        setLoading(true);
        setError("");

        // Handle "none" value for departmentId
        const payload = {
            ...data,
            departmentId: data.departmentId === "none" ? null : data.departmentId
        };

        try {
            let res;
            if (isEdit && employee) {
                res = await updateEmployee(employee.id, payload);
            } else {
                res = await createEmployee(payload);
            }

            if (res.error) {
                setError(res.error);
            } else {
                onOpenChange(false);
                form.reset();
            }
        } catch (err: any) {
            setError("Terjadi kesalahan sistem.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Karyawan" : "Tambah Karyawan"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Ubah detail profil karyawan." : "Buat akun baru untuk karyawan. Password default adalah 'perusahaan123'."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {error && <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Lengkap</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john@perusahaan.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Peran (Role)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih peran" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="EMPLOYEE">Karyawan</SelectItem>
                                                <SelectItem value="ADMIN">Administrator</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="departmentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Departemen</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || "none"}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih departemen" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">-- Belum Ada --</SelectItem>
                                                {departments.map(dept => (
                                                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Posisi / Jabatan</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contoh: Staff HR" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="employmentStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status Pekerjaan</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value || "TETAP"}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="TETAP">Tetap</SelectItem>
                                                <SelectItem value="KONTRAK">Kontrak</SelectItem>
                                                <SelectItem value="MAGANG">Magang</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nomor HP</FormLabel>
                                        <FormControl>
                                            <Input placeholder="08123456789" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="joinDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tanggal Bergabung</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
