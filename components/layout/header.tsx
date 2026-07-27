"use client";

import { useState, useEffect } from "react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { navItems } from "./sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { ProfileAvatarDialog } from "@/components/ui/profile-avatar-dialog";

export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    
    const userRole = (mounted && (session?.user as any)?.role) || "EMPLOYEE";
    const userName = (mounted && session?.user?.name) || "Karyawan";
    const userEmail = (mounted && session?.user?.email) || "";
    
    const filteredNavItems = navItems.filter(item => {
        if (userRole === "EMPLOYEE") {
            return ["Dashboard", "Kehadiran", "Cuti & Izin", "Penggajian", "Pengumuman", "Pengaturan"].includes(item.name);
        }
        return true;
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
        <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="mobile-only-btn">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 bg-[#1C2016] text-[#DCDCC6] p-0 border-r-[#DCDCC6]/15 flex flex-col">
                        <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
                        <div className="h-20 px-6 flex flex-col justify-center border-b border-[#DCDCC6]/15 bg-[#1C2016]">
                            <div className="flex items-center gap-2 mt-1">
                                <h1 className="font-sans font-semibold text-lg tracking-tight text-[#DCDCC6]">
                                    HRIS System
                                </h1>
                            </div>
                        </div>
                        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                            {filteredNavItems.map((item) => {
                                const isActive = item.href === "/dashboard" 
                                    ? pathname === "/dashboard" 
                                    : (pathname === item.href || pathname.startsWith(`${item.href}/`));
                                return (
                                    <Link 
                                        key={item.href} 
                                        href={item.href} 
                                        onClick={() => setOpen(false)}
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
                                )
                            })}
                        </nav>

                        <div className="p-3 border-t border-[#DCDCC6]/15 bg-[#1C2016]">
                            <div className="bg-[#DCDCC6]/5 border border-[#DCDCC6]/15 rounded-[8px] p-3 flex items-center justify-between">
                                <div className="min-w-0 flex-1 flex items-center gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpen(false);
                                            setAvatarDialogOpen(true);
                                        }}
                                        className="h-8 w-8 rounded-full bg-[#DCDCC6]/15 border border-[#DCDCC6]/20 flex items-center justify-center text-[#DCDCC6] font-semibold shrink-0 text-xs hover:scale-105 transition-transform"
                                    >
                                        {session?.user?.image ? (
                                            <img src={session.user.image} alt={userName} className="h-full w-full rounded-full object-cover" />
                                        ) : (
                                            userName.charAt(0).toUpperCase()
                                        )}
                                    </button>
                                    <div>
                                        <p className="text-xs font-semibold text-[#DCDCC6] truncate">
                                            {userName}
                                        </p>
                                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[4px] bg-[#DCDCC6]/15 text-[#DCDCC6]">
                                            {userRole}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="p-1.5 text-[#DCDCC6]/60 hover:text-[#DCDCC6] hover:bg-[#DCDCC6]/15 rounded-[6px]"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
                <div className="font-semibold text-slate-800 dark:text-slate-200 hidden sm:block">
                    Dashboard Overview
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <Button 
                    variant="secondary" 
                    size="icon" 
                    onClick={() => setAvatarDialogOpen(true)}
                    className="rounded-full bg-slate-100 dark:bg-slate-900 hover:scale-105 transition-transform overflow-hidden border border-slate-200 dark:border-slate-800"
                >
                    {session?.user?.image ? (
                        <img src={session.user.image} alt={userName} className="h-full w-full object-cover" />
                    ) : (
                        <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    )}
                </Button>
                <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2 font-medium">
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Keluar</span>
                </Button>
            </div>

            <ProfileAvatarDialog
                open={avatarDialogOpen}
                onOpenChange={setAvatarDialogOpen}
                image={session?.user?.image}
                name={userName}
                email={userEmail}
                role={userRole}
            />
        </header>
    );
}
