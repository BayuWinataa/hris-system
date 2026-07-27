import { format, formatDistanceToNow, parseISO } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format Date object or ISO string into clean Indonesian date string.
 * Example: "27 Juli 2026"
 */
export function formatIndonesianDate(date: Date | string | null | undefined, pattern: string = "d MMMM yyyy"): string {
    if (!date) return "-";
    const d = typeof date === "string" ? parseISO(date) : new Date(date);
    if (isNaN(d.getTime())) return "-";
    return format(d, pattern, { locale: id });
}

/**
 * Format Date object or ISO string into WIB time string.
 * Example: "08:15 WIB"
 */
export function formatTimeWIB(date: Date | string | null | undefined): string {
    if (!date) return "-";
    const d = typeof date === "string" ? parseISO(date) : new Date(date);
    if (isNaN(d.getTime())) return "-";
    return format(d, "HH:mm") + " WIB";
}

/**
 * Format Date relative to now in Indonesian.
 * Example: "2 jam yang lalu"
 */
export function formatRelativeIndonesian(date: Date | string | null | undefined): string {
    if (!date) return "-";
    const d = typeof date === "string" ? parseISO(date) : new Date(date);
    if (isNaN(d.getTime())) return "-";
    return formatDistanceToNow(d, { addSuffix: true, locale: id });
}
