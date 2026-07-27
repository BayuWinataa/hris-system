"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Megaphone, Plus, Search, Trash2, Pencil, Calendar, User } from "lucide-react";
import { AnnouncementDialog } from "./announcement-dialog";
import { deleteAnnouncement } from "@/app/actions/announcement";

interface AnnouncementItem {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    author?: {
        name: string;
    } | null;
}

interface AnnouncementManagementProps {
    initialAnnouncements: AnnouncementItem[];
    isAdmin: boolean;
}

export function AnnouncementManagement({ initialAnnouncements, isAdmin }: AnnouncementManagementProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementItem | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const filtered = initialAnnouncements.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
            item.title.toLowerCase().includes(query) ||
            item.content.toLowerCase().includes(query) ||
            (item.author?.name && item.author.name.toLowerCase().includes(query))
        );
    });

    const handleCreateNew = () => {
        setEditingAnnouncement(null);
        setDialogOpen(true);
    };

    const handleEdit = (item: AnnouncementItem) => {
        setEditingAnnouncement(item);
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus pengumuman ini secara permanen?")) {
            setDeletingId(id);
            await deleteAnnouncement(id);
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Controls Bar */}
            <div className="flex items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1 max-w-md flex items-center">
                    <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                    <Input
                        placeholder="Cari pengumuman..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                </div>

                {isAdmin && (
                    <Button
                        onClick={handleCreateNew}
                        className="h-10 px-4 gap-2 font-semibold text-xs sm:text-sm bg-[#1C2016] text-[#DCDCC6] hover:bg-[#2A3022] rounded-xl shadow-md"
                    >
                        <Plus className="h-4 w-4" />
                        Buat Pengumuman Baru
                    </Button>
                )}
            </div>

            {/* Content List */}
            {filtered.length === 0 ? (
                <div className="py-16 text-center flex flex-col items-center justify-center space-y-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 p-8 shadow-sm">
                    <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 mb-1">
                        <Megaphone className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                            {searchQuery ? "Pengumuman tidak ditemukan" : "Belum ada pengumuman resmi"}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm">
                            {searchQuery
                                ? `Tidak ada pengumuman yang cocok dengan kata kunci "${searchQuery}".`
                                : "Pengumuman resmi dari manajemen perusahaan akan ditampilkan di sini."}
                        </p>
                    </div>

                    {searchQuery && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchQuery("")}
                            className="mt-2 text-xs rounded-lg"
                        >
                            Reset Pencarian
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filtered.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 group"
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                                        {item.title}
                                    </h3>

                                    {isAdmin && (
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(item)}
                                                title="Edit Pengumuman"
                                                className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deletingId === item.id}
                                                title="Hapus Pengumuman"
                                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {item.content}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                                <div className="flex items-center gap-1.5 font-medium">
                                    <User className="h-3.5 w-3.5" />
                                    <span>{item.author?.name || "Admin HRIS"}</span>
                                </div>
                                <div className="flex items-center gap-1.5 font-mono">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{new Date(item.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isAdmin && (
                <AnnouncementDialog
                    open={dialogOpen}
                    onOpenChange={(openState) => {
                        setDialogOpen(openState);
                        if (!openState) setEditingAnnouncement(null);
                    }}
                    announcementToEdit={editingAnnouncement}
                />
            )}
        </div>
    );
}
