"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DepartmentFormValues, departmentSchema } from "@/lib/validations/department";
import { createDepartment, updateDepartment } from "@/app/actions/department";

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

interface Department {
    id: string;
    name: string;
}

interface DepartmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    department?: Department | null;
}

export function DepartmentDialog({ open, onOpenChange, department }: DepartmentDialogProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isEdit = !!department;

    const form = useForm<DepartmentFormValues>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: department?.name || "",
            });
            setError("");
        }
    }, [open, department, form]);

    const onSubmit = async (data: DepartmentFormValues) => {
        setLoading(true);
        setError("");

        try {
            let res;
            if (isEdit && department) {
                res = await updateDepartment(department.id, data);
            } else {
                res = await createDepartment(data);
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Departemen" : "Tambah Departemen"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Ubah nama departemen di bawah ini." : "Masukkan nama departemen baru."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {error && <div className="text-sm font-medium text-destructive">{error}</div>}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Departemen</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: IT, HR, Finance" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
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
