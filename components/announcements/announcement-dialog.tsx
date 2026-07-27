"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnnouncementFormValues, announcementSchema } from "@/lib/validations/announcement";
import { createAnnouncement, updateAnnouncement } from "@/app/actions/announcement";

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
import { Megaphone } from "lucide-react";

interface AnnouncementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    announcementToEdit?: {
        id: string;
        title: string;
        content: string;
    } | null;
}

export function AnnouncementDialog({ open, onOpenChange, announcementToEdit }: AnnouncementDialogProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isEditMode = !!announcementToEdit;

    const form = useForm<AnnouncementFormValues>({
        resolver: zodResolver(announcementSchema),
        defaultValues: {
            title: "",
            content: "",
        },
    });

    useEffect(() => {
        if (announcementToEdit) {
            form.reset({
                title: announcementToEdit.title,
                content: announcementToEdit.content,
            });
        } else if (open) {
            form.reset({
                title: "",
                content: "",
            });
        }
    }, [announcementToEdit, open, form]);

    const onSubmit = async (data: AnnouncementFormValues) => {
        setLoading(true);
        setError("");

        try {
            const res = isEditMode
                ? await updateAnnouncement(announcementToEdit.id, data)
                : await createAnnouncement(data);

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
                    <DialogTitle className="text-lg sm:text-xl font-bold">
                        {isEditMode ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                        {isEditMode
                            ? "Ubah judul atau isi pengumuman resmi di bawah ini."
                            : "Tulis pengumuman resmi perusahaan untuk ditampilkan kepada seluruh karyawan."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                        {error && (
                            <div className="p-3 text-xs sm:text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                {error}
                            </div>
                        )}
                        
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm font-medium">Judul Pengumuman</FormLabel>
                                    <FormControl>
                                        <div className="relative flex items-center">
                                            <Megaphone className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                                            <Input 
                                                placeholder="Contoh: Libur Nasional / Pembaruan Jam Kerja" 
                                                className="w-full text-xs sm:text-sm h-10 pl-9 pr-3" 
                                                {...field} 
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm font-medium">Isi Pengumuman</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Tuliskan detail pengumuman di sini..." 
                                            className="resize-none text-xs sm:text-sm min-h-[120px]" 
                                            rows={5}
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
                                {isEditMode
                                    ? (loading ? "Menyimpan..." : "Simpan Perubahan")
                                    : (loading ? "Menerbitkan..." : "Terbitkan Pengumuman")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

