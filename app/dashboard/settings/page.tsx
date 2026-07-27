import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { ProfileImageUpload } from "@/components/settings/profile-image-upload";
import { WorkScheduleForm } from "@/components/settings/work-schedule-form";
import { getWorkSchedule } from "@/app/actions/schedule";

export const metadata = {
    title: "Pengaturan",
};

export default async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    const isAdmin = (session.user as any).role === "ADMIN";
    const workSchedule = isAdmin ? await getWorkSchedule() : null;

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Pengaturan</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Work Schedule Settings for Admin */}
                {isAdmin && workSchedule && (
                    <Card className="col-span-1 lg:col-span-3 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Pengaturan Jam Kerja & Shift Perusahaan</CardTitle>
                            <CardDescription>
                                Atur jam masuk, jam pulang, dan durasi toleransi keterlambatan presensi karyawan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <WorkScheduleForm initialSchedule={workSchedule} />
                        </CardContent>
                    </Card>
                )}

                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Keamanan Akun</CardTitle>
                        <CardDescription>
                            Ganti password Anda secara berkala untuk menjaga keamanan akun.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChangePasswordForm />
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Foto Profil</CardTitle>
                        <CardDescription>
                            Upload gambar untuk profil Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileImageUpload 
                            currentImage={session.user.image} 
                            userName={session.user.name} 
                        />
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Info Profil</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Nama</p>
                            <p className="font-semibold">{session.user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p className="font-semibold">{session.user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Peran</p>
                            <p className="font-semibold">{(session.user as any).role === "ADMIN" ? "Administrator" : "Karyawan"}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

