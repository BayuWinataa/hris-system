"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "lucide-react";

interface ProfileAvatarDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    image?: string | null;
    name: string;
    email?: string | null;
    role?: string | null;
}

export function ProfileAvatarDialog({
    open,
    onOpenChange,
    image,
    name,
    email,
    role,
}: ProfileAvatarDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] max-w-[420px] p-6 rounded-3xl bg-[#1C2016] text-[#DCDCC6] border border-[#DCDCC6]/20 shadow-2xl flex flex-col items-center text-center">
                <DialogHeader className="w-full flex flex-col items-center space-y-1">
                    <DialogTitle className="text-xl font-bold text-[#DCDCC6]">
                        Foto Profil
                    </DialogTitle>
                </DialogHeader>

                {/* Enlarged Avatar Image */}
                <div className="my-6 relative group">
                    <div className="h-44 w-44 sm:h-52 sm:w-52 rounded-full border-4 border-[#DCDCC6]/30 bg-[#DCDCC6]/10 flex items-center justify-center overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-105">
                        {image ? (
                            <img
                                src={image}
                                alt={name}
                                className="h-full w-full object-cover rounded-full"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-[#DCDCC6]">
                                <User className="h-20 w-20 opacity-60" />
                                <span className="font-bold text-3xl mt-1 uppercase">
                                    {name ? name.charAt(0) : "U"}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Info Details */}
                <div className="space-y-1.5 w-full bg-[#DCDCC6]/5 border border-[#DCDCC6]/15 p-4 rounded-2xl text-center">
                    <h3 className="font-extrabold text-lg text-[#DCDCC6] tracking-tight">
                        {name}
                    </h3>
                    {email && (
                        <p className="text-xs text-[#DCDCC6]/70 font-mono">
                            {email}
                        </p>
                    )}
                    {role && (
                        <div className="pt-2 flex justify-center">
                            <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-[#DCDCC6]/15 text-[#DCDCC6] border border-[#DCDCC6]/20">
                                {role}
                            </span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
