import * as XLSX from "xlsx";

/**
 * Export JSON array of objects to a native downloadable Excel (.xlsx) file.
 * Uses SheetJS (xlsx) for full Excel compatibility.
 */
export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string, sheetName: string = "Data Laporan") {
    if (!data || data.length === 0) {
        return false;
    }

    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        // Auto-width columns
        const keys = Object.keys(data[0]);
        const colWidths = keys.map((key) => {
            const maxLen = Math.max(
                key.length,
                ...data.map((row) => String(row[key] || "").length)
            );
            return { wch: Math.min(Math.max(maxLen + 4, 12), 40) };
        });
        worksheet["!cols"] = colWidths;

        const dateSuffix = new Date().toISOString().split("T")[0];
        XLSX.writeFile(workbook, `${filename}_${dateSuffix}.xlsx`);
        return true;
    } catch (error) {
        console.error("Export to Excel failed:", error);
        return false;
    }
}
