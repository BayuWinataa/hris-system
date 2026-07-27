import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAnnouncements } from "@/app/actions/announcement";
import { AnnouncementManagement } from "@/components/announcements/announcement-management";

export default async function AnnouncementsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return null;
    }

    const isAdmin = (session.user as any).role === "ADMIN";
    const announcements = await getAnnouncements();

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-4 select-none">
            {/* Page Header */}
            <div className="flex flex-col space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    Pengumuman Perusahaan
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Pantau informasi penting dan pengumuman resmi yang diterbitkan oleh manajemen HRIS.
                </p>
            </div>

            {/* Management Component */}
            <AnnouncementManagement initialAnnouncements={announcements} isAdmin={isAdmin} />
        </div>
    );
}
