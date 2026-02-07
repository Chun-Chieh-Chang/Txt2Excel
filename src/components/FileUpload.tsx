
import { FileText, Upload, Trash2, FileSpreadsheet } from 'lucide-react';
import { ParsedData } from '../types';

interface FileUploadProps {
    dataFile: File | null;
    excelFile: File | null;
    parsedData: ParsedData;
    onDataUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onExcelUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearData: () => void;
    onClearExcel: () => void;
}

export default function FileUpload({
    dataFile,
    excelFile,
    parsedData,
    onDataUpload,
    onExcelUpload,
    onClearData,
    onClearExcel
}: FileUploadProps) {
    return (
        <>
            {/* 1. Data Upload (TXT/CSV) */}
            <div className={`group relative overflow-hidden rounded-2xl border bg-white/60 p-1 transition-all duration-300 backdrop-blur-sm ${!dataFile ? 'border-dashed border-slate-300 hover:border-rose-400' : 'border-solid border-rose-200 shadow-xl shadow-rose-100/20'} dark:bg-slate-800/60 dark:border-slate-700 dark:hover:border-emerald-500/50`}>
                {dataFile ? (
                    <div className="flex items-center justify-between gap-4 p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 line-clamp-1 dark:text-slate-100">{dataFile.name}</h3>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {Array.isArray(parsedData) ? `${parsedData.length} 筆資料` : `${Object.keys(parsedData).length} 個資料欄位`}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClearData} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:text-slate-300 dark:hover:bg-red-900/20 dark:hover:text-red-400">
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-4 py-12 transition-colors relative overflow-hidden">
                        {/* Illustrative Background Icons */}
                        <FileText className="absolute top-4 left-4 h-12 w-12 text-slate-100 dark:text-slate-700/50 -rotate-12" />
                        <FileText className="absolute bottom-4 right-4 h-16 w-16 text-slate-100 dark:text-slate-700/50 rotate-12" />

                        {/* Main Interaction Area */}
                        <div className="relative group-hover:scale-110 transition-transform duration-300">
                            <div className="absolute inset-0 bg-rose-200/50 rounded-full blur-xl group-hover:bg-rose-300/60 dark:bg-emerald-900/40" />
                            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-white to-slate-50 shadow-2xl shadow-rose-100 border-4 border-white dark:from-slate-700 dark:to-slate-800 dark:border-slate-600">
                                <Upload className="h-10 w-10 text-rose-500 dark:text-emerald-400" />
                            </div>
                        </div>

                        <div className="text-center relative z-10">
                            <p className="text-lg font-bold text-slate-800 dark:text-slate-100">上傳資料檔</p>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">支援 .txt (工顯) / .csv (Keyence)</p>
                        </div>
                        <input type="file" className="hidden" accept=".txt,.csv" onChange={onDataUpload} />
                    </label>
                )}
            </div>

            {/* 2. Excel Upload */}
            <div className={`group relative overflow-hidden rounded-2xl border bg-white/60 p-1 transition-all duration-300 backdrop-blur-sm ${!excelFile ? 'border-dashed border-slate-300 hover:border-emerald-400' : 'border-solid border-emerald-200 shadow-xl shadow-emerald-100/20'} dark:bg-slate-800/60 dark:border-slate-700 dark:hover:border-emerald-500/50`}>
                {excelFile ? (
                    <div className="flex items-center justify-between gap-4 p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                                <FileSpreadsheet className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 line-clamp-1 dark:text-slate-100">{excelFile.name}</h3>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{(excelFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>
                        <button onClick={onClearExcel} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:text-slate-300 dark:hover:bg-red-900/20 dark:hover:text-red-400">
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-4 py-12 transition-colors relative overflow-hidden">
                        {/* Illustrative Background Icons */}
                        <FileSpreadsheet className="absolute top-8 left-8 h-10 w-10 text-slate-100 dark:text-slate-700/50 rotate-6" />
                        <div className="absolute top-4 right-10 h-16 w-24 bg-slate-100 dark:bg-slate-700/30 rounded-lg -rotate-6 transform skew-x-6" />

                        {/* Main Interaction Area */}
                        <div className={`relative group-hover:scale-110 transition-transform duration-300 ${!dataFile ? 'opacity-50 grayscale' : ''}`}>
                            <div className="absolute inset-0 bg-emerald-200/50 rounded-full blur-xl group-hover:bg-emerald-300/60 dark:bg-emerald-900/40" />
                            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-white to-slate-50 shadow-2xl shadow-emerald-100 border-4 border-white dark:from-slate-700 dark:to-slate-800 dark:border-slate-600">
                                <FileSpreadsheet className="h-10 w-10 text-emerald-500 dark:text-emerald-400" />
                            </div>
                        </div>

                        <div className={`text-center relative z-10 ${!dataFile ? 'opacity-50' : ''}`}>
                            <p className="text-lg font-bold text-slate-800 dark:text-slate-100">上傳 Excel 模板</p>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">支援 .xlsx 格式</p>
                        </div>
                        <input type="file" className="hidden" accept=".xlsx" onChange={onExcelUpload} disabled={!dataFile} />
                    </label>
                )}
            </div>
        </>
    );
}
