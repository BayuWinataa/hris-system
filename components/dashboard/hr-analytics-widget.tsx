"use client";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { PieChart, TrendingUp, CalendarCheck, BarChart3 } from "lucide-react";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

interface HRAnalyticsWidgetProps {
    data: {
        totalEmployees: number;
        totalDepartments: number;
        attendanceRate: number;
        onTimeRate: number;
        totalTodayCheckIns: number;
        totalOnTimeToday: number;
        totalLateToday: number;
        leaveStats: {
            total: number;
            pending: number;
            approved: number;
            rejected: number;
        };
        departmentDistribution: Array<{
            name: string;
            count: number;
            percentage: number;
        }>;
        isAdmin: boolean;
    } | null;
}

export function HRAnalyticsWidget({ data }: HRAnalyticsWidgetProps) {
    if (!data) return null;

    const {
        totalEmployees,
        attendanceRate,
        totalTodayCheckIns,
        totalOnTimeToday,
        totalLateToday,
        leaveStats,
        departmentDistribution
    } = data;

    const absentToday = Math.max(0, totalEmployees - totalTodayCheckIns);

    // Chart.js Data for Attendance Doughnut
    const attendanceDoughnutData = {
        labels: ["Tepat Waktu", "Terlambat", "Belum Absen"],
        datasets: [
            {
                data: [totalOnTimeToday, totalLateToday, absentToday],
                backgroundColor: [
                    "#10B981", // Emerald-500
                    "#F59E0B", // Amber-500
                    "#64748B", // Slate-500
                ],
                borderColor: ["#ffffff", "#ffffff", "#ffffff"],
                borderWidth: 2,
                hoverOffset: 6,
            },
        ],
    };

    // Chart.js Data for Leave Doughnut
    const leaveDoughnutData = {
        labels: ["Pending", "Disetujui", "Ditolak"],
        datasets: [
            {
                data: [leaveStats.pending, leaveStats.approved, leaveStats.rejected],
                backgroundColor: [
                    "#F59E0B", // Amber-500
                    "#10B981", // Emerald-500
                    "#F43F5E", // Rose-500
                ],
                borderColor: ["#ffffff", "#ffffff", "#ffffff"],
                borderWidth: 2,
                hoverOffset: 6,
            },
        ],
    };

    // Chart.js Options for Doughnuts
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    boxWidth: 12,
                    padding: 14,
                    font: {
                        size: 11,
                        weight: "bold" as const,
                    },
                },
            },
            tooltip: {
                cornerRadius: 8,
                padding: 10,
            },
        },
        cutout: "68%",
    };

    // Chart.js Data for Department Bar Chart
    const deptBarData = {
        labels: departmentDistribution.map((d) => d.name),
        datasets: [
            {
                label: "Jumlah Karyawan",
                data: departmentDistribution.map((d) => d.count),
                backgroundColor: "#DCDCC6",
                borderRadius: 6,
                hoverBackgroundColor: "#F0F0E0",
            },
        ],
    };

    const deptBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y" as const,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                cornerRadius: 8,
                padding: 10,
            },
        },
        scales: {
            x: {
                grid: {
                    color: "rgba(220, 220, 198, 0.1)",
                },
                ticks: {
                    color: "#DCDCC6",
                    font: { size: 10 },
                    stepSize: 1,
                },
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#DCDCC6",
                    font: { size: 11, weight: "bold" as const },
                },
            },
        },
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#1C2016] text-[#DCDCC6]">
                        <PieChart className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 leading-none">
                            Analitik HR
                        </h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart.js Doughnut - Attendance */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <TrendingUp className="h-4 w-4 text-emerald-600" /> Rasio Kehadiran Hari Ini
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                            {attendanceRate}% Hadir
                        </span>
                    </div>

                    <div className="h-56 relative flex items-center justify-center">
                        <Doughnut data={attendanceDoughnutData} options={doughnutOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                            <span className="text-2xl font-extrabold font-mono text-slate-800 dark:text-slate-100">
                                {attendanceRate}%
                            </span>
                            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider">
                                Total Hadir
                            </span>
                        </div>
                    </div>
                </div>

                {/* Chart.js Doughnut - Leaves */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <CalendarCheck className="h-4 w-4 text-blue-600" /> Rasio Pengajuan Cuti
                        </span>
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                            Total {leaveStats.total} Cuti
                        </span>
                    </div>

                    <div className="h-56 relative flex items-center justify-center">
                        <Doughnut data={leaveDoughnutData} options={doughnutOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                            <span className="text-2xl font-extrabold font-mono text-slate-800 dark:text-slate-100">
                                {leaveStats.total}
                            </span>
                            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider">
                                Pengajuan
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart.js Horizontal Bar Chart - Department Distribution */}
            {departmentDistribution.length > 0 && (
                <div className="p-5 rounded-2xl bg-[#1C2016] text-[#DCDCC6] border border-[#DCDCC6]/20 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-[#DCDCC6]/15 pb-3">
                        <span className="text-xs font-bold text-[#DCDCC6] flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-[#DCDCC6]" />  Distribusi Departemen
                        </span>
                        <span className="text-[11px] font-mono text-[#DCDCC6]/70">
                            {departmentDistribution.length} Departemen
                        </span>
                    </div>

                    <div className="h-48 pt-2">
                        <Bar data={deptBarData} options={deptBarOptions} />
                    </div>
                </div>
            )}
        </div>
    );
}
