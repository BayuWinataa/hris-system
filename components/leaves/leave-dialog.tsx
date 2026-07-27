"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeaveFormValues, leaveSchema } from "@/lib/validations/leave";
import { applyLeave } from "@/app/actions/leave";

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
import { Textarea } from "@/components/ui/textarea";

interface LeaveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LeaveDialog({ open, onOpenChange }: LeaveDialogProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const form = useForm<LeaveFormValues>({
        resolver: zodResolver(leaveSchema),
        defaultValues: {
            startDate: "",
            endDate: "",
            reason: "",
        },
    });

    const onSubmit = async (data: LeaveFormValues) => {
        setLoading(true);
        setError("");

        try {
            const res = await applyLeave(data);
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
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) form.reset();
            onOpenChange(val);
        }}>
            <DialogContent className="w-full max-w-[480px] p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
                <DialogHeader className="space-y-1 text-left">
                    <DialogTitle className="text-lg sm:text-xl font-bold">Ajukan Cuti / Izin</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                        Isi form di bawah ini untuk mengajukan permohonan cuti atau izin.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                        {error && (
                            <div className="p-3 text-xs sm:text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs sm:text-sm font-medium">Mulai Tanggal</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                className="w-full text-xs sm:text-sm h-10 px-3"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs sm:text-sm font-medium">Sampai Tanggal</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                className="w-full text-xs sm:text-sm h-10 px-3"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm font-medium">Alasan Cuti / Izin</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Jelaskan alasan cuti/izin Anda dengan detail..."
                                            className="resize-none text-xs sm:text-sm min-h-[100px]"
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-2 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto h-10 text-xs sm:text-sm"
                                onClick={() => onOpenChange(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="w-full sm:w-auto h-10 text-xs sm:text-sm font-semibold"
                                disabled={loading}
                            >
                                {loading ? "Mengirim..." : "Kirim Pengajuan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

