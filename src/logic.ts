
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';
import Papa from 'papaparse';
import { CsvParseResult, ParsedData } from './types';

// Debug logging to verify import
console.log('XlsxPopulate loaded:', XlsxPopulate);

export const parseCsvContent = (content: string): CsvParseResult => {
    // 1. Parse CSV
    const result = Papa.parse(content, {
        header: false, // We handle headers manually to ensure we get line 1 as header
        skipEmptyLines: true,
    });

    const data = result.data as string[][];
    if (data.length < 2) return { headers: [], columns: {} };

    // 2. Extract Headers (Row 1)
    // Keep 'rawHeaders' with empty strings to preserve index mapping
    const rawHeaders = data[0].map(h => h.trim());

    // Valid headers for the UI (excluding empty ones)
    const headers = rawHeaders.filter(h => h);

    const columns: Record<string, string[]> = {};
    headers.forEach(h => columns[h] = []);

    // 3. Filter and Extract Rows
    for (let i = 1; i < data.length; i++) {
        const row = data[i];

        // Logic: "尋找第一欄中有數字的行" (Find lines where 1st col is number)
        // Check if first column exists and is a number
        const firstColVal = row[0]?.trim();
        if (!firstColVal || isNaN(Number(firstColVal))) {
            continue; // Skip lines that don't start with a number
        }

        // Logic: "提取數據" (Extract)
        // Map row values to headers by index
        row.forEach((val, idx) => {
            // Ensure we are within bounds of known headers and the header at this index is valid
            if (idx < rawHeaders.length) {
                const header = rawHeaders[idx];

                // Only process if this column has a valid header name
                if (header) {
                    const cleanVal = val.trim();

                    // Logic: "如果內容為空或只包含標點符號則停止或跳過"
                    // (Empty or just punctuation)
                    if (cleanVal && !/^[;:,.]+$/.test(cleanVal)) {
                        columns[header].push(cleanVal);
                    }
                }
            }
        });
    }

    return { headers, columns };
};

export const parseTxtContent = (content: string): string[] => {
    const txtData: string[] = [];
    const lines = content.split('\n');

    for (let line of lines) {
        if (line.includes('=')) {
            const parts = line.split('=');
            if (parts.length < 2) continue;
            const value = parts[1].trim();
            // Remove trailing commas, spaces, etc.
            const cleaned = value.replace(/[,\s]+$/, '');

            if (!cleaned || /^[;:,.]+$/.test(cleaned)) {
                // Original logic breaks on empty or just punctuation
                break;
            }
            txtData.push(cleaned);
        }
    }
    return txtData;
};

export const getExcelSheets = async (file: File): Promise<{ workbook: any, sheetNames: string[] }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                if (!arrayBuffer) {
                    reject(new Error("Empty file"));
                    return;
                }

                // Ensure XlsxPopulate is available
                if (!XlsxPopulate || typeof XlsxPopulate.fromDataAsync !== 'function') {
                    const msg = "Library XlsxPopulate not loaded correctly.";
                    console.error(msg, XlsxPopulate);
                    reject(new Error(msg));
                    return;
                }

                const workbook = await XlsxPopulate.fromDataAsync(arrayBuffer);
                const sheetNames = workbook.sheets().map((s: any) => s.name());
                resolve({ workbook, sheetNames });
            } catch (err: any) {
                console.error("Excel processing error:", err);
                // Clean up error message
                let msg = err.message || "Failed to parse Excel file";
                if (msg.includes("Encrypted")) msg += " (File is password protected)";
                reject(new Error(msg));
            }
        };
        reader.onerror = () => reject(new Error("File reading failed"));
        reader.readAsArrayBuffer(file);
    });
};

export const colLetterToNum = (letter: string): number => {
    let num = 0;
    for (let i = 0; i < letter.length; i++) {
        num = num * 26 + (letter.charCodeAt(i) - 64);
    }
    return num;
};

export const executeFill = async (
    workbook: any,
    dataSources: ParsedData,
    rules: any[],
    originalFileName: string,
    onProgress: (percent: number, current: number, total: number, status: string) => void
): Promise<void> => {

    if (!workbook) throw new Error("Workbook not loaded");

    // === BRANCH 1: TXT (Original Logic, Array) ===
    if (Array.isArray(dataSources)) {
        const data = dataSources;
        if (data.length === 0) throw new Error("無可用數據");

        let globalFilledCount = 0;
        let dataIndex = 0;
        const totalItems = data.length;

        for (const rule of rules) {
            // Check bounds
            if (dataIndex >= data.length) continue;

            const ws = workbook.sheet(rule.worksheet);
            if (!ws) continue;

            const match = rule.startCell.match(/^([A-Z]+)(\d+)$/);
            if (!match) continue;

            const startColName = match[1];
            const startRow = parseInt(match[2]);
            const startColIdx = colLetterToNum(startColName);

            // Update progress
            onProgress(
                Math.round((globalFilledCount / totalItems) * 100),
                globalFilledCount,
                totalItems,
                `填入中: ${rule.worksheet}`
            );

            let filled = 0;
            let loopSafety = 0;

            while (filled < rule.rowCount && dataIndex < data.length) {
                loopSafety++;
                if (loopSafety > 20000) break; // Infinite loop safety

                const targetColIdx = startColIdx + (filled * 2);

                // XlsxPopulate indexing
                const cell = ws.row(startRow).cell(targetColIdx);

                let value: string | number = data[dataIndex];
                if (/^-?\d+(\.\d+)?$/.test(value)) {
                    const num = Number(value);
                    if (!isNaN(num)) value = num;
                }

                // Write and apply Black color
                cell.value(value).style("fontColor", "000000");

                dataIndex++;
                filled++;
                globalFilledCount++;
            }
        }
        onProgress(100, globalFilledCount, totalItems, '正在封裝檔案（保護原始格式）...');
    }

    // === BRANCH 2: CSV (Multi-Source Logic, Record) ===
    else {
        // Initialize cursors for each data source
        const cursors: Record<string, number> = {};
        const sourceKeys = Object.keys(dataSources);

        // Safety check
        if (sourceKeys.length === 0) throw new Error("無可用數據");

        // Calculate total items for progress
        const totalItems = Object.values(dataSources).reduce((acc, val) => acc + val.length, 0);
        let globalFilledCount = 0;

        for (const rule of rules) {
            // Determine which source to use
            const sourceKey = (rule.source && dataSources[rule.source]) ? rule.source : sourceKeys[0];
            const data = dataSources[sourceKey];

            if (!cursors[sourceKey]) cursors[sourceKey] = 0;
            let dataIndex = cursors[sourceKey];

            // If this source is exhausted, skip
            if (dataIndex >= data.length) continue;

            const ws = workbook.sheet(rule.worksheet);
            if (!ws) continue;

            const match = rule.startCell.match(/^([A-Z]+)(\d+)$/);
            if (!match) continue;

            const startColName = match[1];
            const startRow = parseInt(match[2]);
            const startColIdx = colLetterToNum(startColName);

            // Update progress
            onProgress(
                Math.round((globalFilledCount / totalItems) * 100),
                globalFilledCount,
                totalItems,
                `填入中: ${rule.worksheet} (${sourceKey})`
            );

            let filled = 0;
            let loopSafety = 0;

            while (filled < rule.rowCount && dataIndex < data.length) {
                loopSafety++;
                if (loopSafety > 10000) {
                    console.warn("Infinite loop protection triggered");
                    break;
                }

                const targetColIdx = startColIdx + (filled * 2);

                // XlsxPopulate indexing
                const cell = ws.row(startRow).cell(targetColIdx);

                let value: string | number = data[dataIndex];
                if (/^-?\d+(\.\d+)?$/.test(value)) {
                    const num = Number(value);
                    if (!isNaN(num)) value = num;
                }

                // Write and apply Black color
                cell.value(value).style("fontColor", "000000");

                dataIndex++;
                filled++;
                globalFilledCount++;
            }

            // Update cursor for this source
            cursors[sourceKey] = dataIndex;
        }
        onProgress(100, globalFilledCount, totalItems, '正在封裝檔案（保護原始格式）...');
    }

    // Output
    const blob = await workbook.outputAsync();

    // Try to use File System Access API for "Save As" dialog
    try {
        if ('showSaveFilePicker' in window) {
            const handle = await (window as any).showSaveFilePicker({
                suggestedName: originalFileName.replace(/\.[^.]+$/, '_REPORTS.xlsx'),
                types: [{
                    description: 'Excel File',
                    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
                }],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            return; // Exit if successful
        }
    } catch (err: any) {
        if (err.name !== 'AbortError') {
            console.error('Save File Picker failed, falling back to download:', err);
        } else {
            // User cancelled the picker, we might stop here or fallback?
            // Usually if user cancels save, they mean to cancel save.
            return;
        }
    }

    // Fallback behavior (Auto Download)
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalFileName.replace(/\.[^.]+$/, '_REPORTS.xlsx');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
