"use client";

import { Megaphone, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface AnnouncementItem {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    author?: {
        name: string;
    } | null;
}

interface AnnouncementListProps {
    announcements: AnnouncementItem[];
    isAdmin: boolean;
}

export function AnnouncementList({ announcements }: AnnouncementListProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-slate-500" />
                    <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">Pengumuman Internal</h2>
                </div>
            </div>

            {announcements.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center justify-center space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-1">
                        <Megaphone className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Belum ada pengumuman baru</p>
                    <p className="text-xs text-slate-400 max-w-xs">
                        Pengumuman resmi dari perusahaan akan ditampilkan di sini.
                    </p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {announcements.map((item) => (
                        <div 
                            key={item.id} 
                            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-2 relative group"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
                                        <span>{new Date(item.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        {item.author?.name && (
                                            <>
                                                <span>•</span>
                                                <span>Oleh {item.author.name}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                {item.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-900 flex justify-end">
                <Link href="/dashboard/announcements" className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1">
                    Lihat Semua Pengumuman <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
            </div>
        </div>
    );
}
