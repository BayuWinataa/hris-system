"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { clockIn, clockOut } from "@/app/actions/attendance";
import { LogIn, LogOut, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

interface AttendanceData {
    id: string;
    checkIn: Date | null;
    checkOut: Date | null;
    status: string;
}

export function AttendanceWidget({ initialData }: { initialData: AttendanceData | null }) {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = currentTime ? currentTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }) : "--:--:--";

    const dateString = currentTime ? currentTime.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }) : "Loading...";

    const handleClockIn = async () => {
        setLoading(true);
        setError("");
        const res = await clockIn();
        if (res.error) {
            setError(res.error);
            toast.error(res.error);
        } else {
            toast.success("Berhasil melakukan Absen Masuk (Clock In)!");
        }
        setLoading(false);
    };

    const handleClockOut = async () => {
        setLoading(true);
        setError("");
        const res = await clockOut();
        if (res.error) {
            setError(res.error);
            toast.error(res.error);
        } else {
            toast.success("Berhasil melakukan Absen Pulang (Clock Out)!");
        }
        setLoading(false);
    };

    if (initialData?.checkOut) {
        return (
            <div className="flex flex-col items-center space-y-4 text-center py-2 w-full">
                <div className="h-16 w-16 rounded-full bg-[#DCDCC6]/15 border border-[#DCDCC6]/30 flex items-center justify-center mb-1 text-[#DCDCC6]">
                    <CheckCircle2 className="h-8 w-8 text-[#DCDCC6]" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-[#DCDCC6] mt-0.5">Tugas Selesai Hari Ini!</h3>
                    <p className="text-xs text-[#DCDCC6]/70 max-w-xs mt-1">
                        Anda telah menyelesaikan absensi masuk dan pulang untuk hari ini.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full mt-2 bg-[#DCDCC6]/5 border border-[#DCDCC6]/15 p-3.5 rounded-[8px]">
                    <div className="text-center border-r border-[#DCDCC6]/15 pr-2">
                        <span className="font-mono text-[9px] text-[#DCDCC6]/50 uppercase tracking-wider">Jam Masuk</span>
                        <p className="font-mono text-base font-bold text-[#DCDCC6] mt-0.5">
                            {new Date(initialData.checkIn!).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                    </div>
                    <div className="text-center pl-2">
                        <span className="font-mono text-[9px] text-[#DCDCC6]/50 uppercase tracking-wider">Jam Pulang</span>
                        <p className="font-mono text-base font-bold text-[#DCDCC6] mt-0.5">
                            {new Date(initialData.checkOut).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full select-none">

            {/* Digital Clock */}
            <div className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tight text-[#DCDCC6] mb-1">
                {timeString}
            </div>
            <div className="text-xs text-[#DCDCC6]/60 font-medium mb-6">
                {dateString}
            </div>

            {error && (
                <div className="w-full text-xs text-red-300 bg-red-950/40 border border-red-800/40 px-3 py-2 rounded-[6px] mb-4 text-center">
                    {error}
                </div>
            )}

            {!initialData ? (
                <Button
                    size="lg"
                    className="w-full h-14 bg-[#DCDCC6] hover:bg-[#c8c8b0] text-[#1C2016] font-bold text-base rounded-[8px] shadow-lg transition-all duration-200"
                    onClick={handleClockIn}
                    disabled={loading}
                >
                    <LogIn className="mr-2 h-5 w-5" />
                    {loading ? "Memproses..." : "Clock In (Absen Masuk)"}
                </Button>
            ) : (
                <div className="w-full flex flex-col items-center space-y-3">
                    <div className="w-full bg-[#DCDCC6]/10 border border-[#DCDCC6]/20 p-2.5 rounded-[8px] text-center">
                        <span className="font-mono text-[10px] text-[#DCDCC6]/60 uppercase tracking-wider block">Waktu Masuk</span>
                        <span className="font-mono text-sm font-bold text-[#DCDCC6]">
                            {new Date(initialData.checkIn!).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                        </span>
                    </div>

                    <Button
                        size="lg"
                        variant="destructive"
                        className="w-full h-14 text-base font-bold rounded-[8px] shadow-lg transition-all duration-200"
                        onClick={handleClockOut}
                        disabled={loading}
                    >
                        <LogOut className="mr-2 h-5 w-5" />
                        {loading ? "Memproses..." : "Clock Out (Absen Pulang)"}
                    </Button>
                </div>
            )}
        </div>
    );
}

