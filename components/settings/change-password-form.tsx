"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@/app/actions/settings";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Password saat ini harus diisi!"),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter!"),
    confirmPassword: z.string().min(1, "Konfirmasi password harus diisi!")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok!",
    path: ["confirmPassword"]
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (data: PasswordFormValues) => {
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const res = await changePassword(data.currentPassword, data.newPassword);
            if (res.error) {
                setError(res.error);
            } else {
                setSuccess(true);
                form.reset();
            }
        } catch (err) {
            setError("Terjadi kesalahan sistem.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                {error && <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
                {success && <div className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded-md">Password berhasil diubah!</div>}
                
                <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password Saat Ini</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password Baru</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input type={showNew ? "text" : "password"} {...field} />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowNew(!showNew)}
                                    >
                                        {showNew ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Konfirmasi Password Baru</FormLabel>
                            <FormControl>
                                <Input type={showNew ? "text" : "password"} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Menyimpan..." : "Simpan Password"}
                </Button>
            </form>
        </Form>
    );
}
