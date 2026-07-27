"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { LayoutDashboard, Users, Building2, Clock, CalendarDays, Settings, LogOut, ShieldCheck, User as UserIcon, Megaphone, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileAvatarDialog } from "@/components/ui/profile-avatar-dialog";

export const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Departemen", href: "/dashboard/departments", icon: Building2 },
    { name: "Karyawan", href: "/dashboard/employees", icon: Users },
    { name: "Kehadiran", href: "/dashboard/attendance", icon: Clock },
    { name: "Cuti & Izin", href: "/dashboard/leaves", icon: CalendarDays },
    { name: "Penggajian", href: "/dashboard/payroll", icon: Banknote },
    { name: "Pengumuman", href: "/dashboard/announcements", icon: Megaphone },
    { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [mounted, setMounted] = useState(false);
    const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Default as employee if session not fully loaded or not mounted yet
    const userRole = (mounted && (session?.user as any)?.role) || "EMPLOYEE";
    const userName = (mounted && session?.user?.name) || "Karyawan";
    const userEmail = (mounted && session?.user?.email) || "";

    const filteredNavItems = navItems.filter(item => {
        if (userRole === "EMPLOYEE") {
            // Employees see Dashboard, Kehadiran, Cuti, Pengumuman, and Pengaturan
            return ["Dashboard", "Kehadiran", "Cuti & Izin", "Penggajian", "Pengumuman", "Pengaturan"].includes(item.name);
        }
        return true; // Admins see everything
    });

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                    router.refresh();
                },
            },
        });
    };

    return (
        <aside className="w-64 bg-[#1C2016] text-[#DCDCC6] h-screen sticky top-0 desktop-sidebar flex-col shrink-0 border-r border-[#DCDCC6]/15 shadow-2xl select-none">
            {/* Header / Brand Section */}
            <div className="h-20 px-6 flex flex-col justify-center border-b border-[#DCDCC6]/15 bg-[#1C2016]">
                <div className="flex items-center gap-2 mt-1">
                    <h1 className="font-sans font-semibold text-lg tracking-tight text-[#DCDCC6]">
                        HRIS System
                    </h1>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">

                {filteredNavItems.map((item) => {
                    const isActive = item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : (pathname === item.href || pathname.startsWith(`${item.href}/`));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center justify-between px-3.5 py-2.5 rounded-[8px] transition-all duration-200 text-sm font-medium",
                                isActive
                                    ? "bg-[#DCDCC6] text-[#1C2016] font-semibold shadow-md shadow-black/20"
                                    : "text-[#DCDCC6]/75 hover:bg-[#DCDCC6]/10 hover:text-[#DCDCC6]"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon
                                    className={cn(
                                        "h-4 w-4 transition-colors",
                                        isActive ? "text-[#1C2016]" : "text-[#DCDCC6]/60 group-hover:text-[#DCDCC6]"
                                    )}
                                />
                                <span>{item.name}</span>
                            </div>
                            {isActive && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#1C2016]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User Profile Card */}
            <div className="p-3 border-t border-[#DCDCC6]/15 bg-[#1C2016]">
                <div className="bg-[#DCDCC6]/5 border border-[#DCDCC6]/15 rounded-[8px] p-3 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <button
                                type="button"
                                onClick={() => setAvatarDialogOpen(true)}
                                title="Lihat Foto Profil"
                                className="h-8 w-8 rounded-full bg-[#DCDCC6]/15 border border-[#DCDCC6]/20 flex items-center justify-center text-[#DCDCC6] font-semibold shrink-0 text-xs cursor-pointer hover:scale-110 hover:border-[#DCDCC6] transition-all duration-200"
                            >
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt={userName} className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    userName.charAt(0).toUpperCase()
                                )}
                            </button>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-[#DCDCC6] truncate leading-none mb-1">
                                    {userName}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[4px] bg-[#DCDCC6]/15 text-[#DCDCC6] font-medium tracking-wider">
                                        {userRole}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            title="Keluar"
                            className="p-1.5 text-[#DCDCC6]/60 hover:text-[#DCDCC6] hover:bg-[#DCDCC6]/15 rounded-[6px] transition-colors shrink-0"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <ProfileAvatarDialog
                open={avatarDialogOpen}
                onOpenChange={setAvatarDialogOpen}
                image={session?.user?.image}
                name={userName}
                email={userEmail}
                role={userRole}
            />
        </aside>
    );
}
