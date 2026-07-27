"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { updateWorkSchedule } from "@/app/actions/schedule";

interface WorkScheduleFormProps {
    initialSchedule: {
        id?: string;
        startTime: string;
        endTime: string;
        lateToleranceMinutes: number;
    };
}

export function WorkScheduleForm({ initialSchedule }: WorkScheduleFormProps) {
    const [startTime, setStartTime] = useState(initialSchedule.startTime || "08:00");
    const [endTime, setEndTime] = useState(initialSchedule.endTime || "17:00");
    const [lateToleranceMinutes, setLateToleranceMinutes] = useState(
        initialSchedule.lateToleranceMinutes ?? 15
    );
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const res = await updateWorkSchedule({
            startTime,
            endTime,
            lateToleranceMinutes: Number(lateToleranceMinutes),
        });

        if (res.error) {
            setMessage({ type: "error", text: res.error });
        } else {
            setMessage({ type: "success", text: "Jam kerja & toleransi keterlambatan berhasil diperbarui!" });
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
                <div
                    className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                        message.type === "success"
                            ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300 border border-green-200 dark:border-green-800"
                            : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800"
                    }`}
                >
                    {message.type === "success" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Jam Masuk (Standard Start)
                    </label>
                    <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="h-10 text-xs sm:text-sm"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Jam Pulang (Standard End)
                    </label>
                    <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="h-10 text-xs sm:text-sm"
                        required
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Toleransi Keterlambatan (Menit)
                </label>
                <Input
                    type="number"
                    min={0}
                    max={120}
                    value={lateToleranceMinutes}
                    onChange={(e) => setLateToleranceMinutes(Number(e.target.value))}
                    className="h-10 text-xs sm:text-sm"
                    placeholder="Contoh: 15"
                    required
                />
                <p className="text-[11px] text-slate-400">
                    Clock In setelah jam <strong className="text-slate-600 dark:text-slate-300">{startTime}</strong> + {lateToleranceMinutes} menit (setelah <strong className="text-slate-600 dark:text-slate-300">{getThresholdString(startTime, lateToleranceMinutes)}</strong>) akan otomatis ditandai sebagai TERLAMBAT.
                </p>
            </div>

            <div className="pt-2 flex justify-end">
                <Button type="submit" disabled={loading} className="h-10 px-5 text-xs sm:text-sm font-semibold">
                    {loading ? "Menyimpan..." : "Simpan Pengaturan Jam Kerja"}
                </Button>
            </div>
        </form>
    );
}

function getThresholdString(startTime: string, tolerance: number) {
    if (!startTime) return "08:15";
    const [h, m] = startTime.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m + tolerance, 0, 0);
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
}
