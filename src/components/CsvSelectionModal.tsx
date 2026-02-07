
import { FileUp } from 'lucide-react';
import { CsvParseResult } from '../types';

interface CsvSelectionModalProps {
    isOpen: boolean;
    csvResult: CsvParseResult | null;
    selectedHeaders: Set<string>;
    onToggleHeader: (header: string) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onConfirm: () => void;
    onCancel: () => void;
    onLoadProfile: () => void;
}

export default function CsvSelectionModal({
    isOpen,
    csvResult,
    selectedHeaders,
    onToggleHeader,
    onSelectAll,
    onDeselectAll,
    onConfirm,
    onCancel,
    onLoadProfile
}: CsvSelectionModalProps) {
    if (!isOpen || !csvResult) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="flex w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[80vh] dark:bg-slate-800">
                <div className="border-b border-slate-100 px-8 py-6 dark:border-slate-700 flex justify-between items-center animate-in slide-in-from-top-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">選擇匯入欄位</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            偵測到 CSV 格式，請選擇您要匯入的資料欄位 (共 {csvResult.headers.length} 欄)。
                        </p>
                    </div>
                    {/* Quick Profile Load Button */}
                    <button
                        onClick={onLoadProfile}
                        className="flex items-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-200 transition-colors shadow-sm"
                        title="直接載入設定檔以套用欄位與規則"
                    >
                        <FileUp className="w-4 h-4" />
                        <span>載入設定檔</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-6">
                    <div className="mb-4 flex items-center gap-4">
                        <button
                            onClick={onSelectAll}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            全選
                        </button>
                        <button
                            onClick={onDeselectAll}
                            className="text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                        >
                            取消全選
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {csvResult.headers.map((header) => {
                            const isSelected = selectedHeaders.has(header);
                            const count = csvResult.columns[header]?.length || 0;
                            return (
                                <div
                                    key={header}
                                    onClick={() => onToggleHeader(header)}
                                    className={`cursor-pointer rounded-xl border px-4 py-3 transition-all ${isSelected
                                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500 dark:bg-blue-900/20 dark:text-blue-300'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`flex h-4 w-4 items-center justify-center rounded border ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700'}`}>
                                            {isSelected && <div className="h-2 w-2 rounded-sm bg-white dark:bg-slate-900" />}
                                        </div>
                                        <span className="truncate font-semibold text-sm dark:text-slate-100" title={header}>{header}</span>
                                    </div>
                                    <div className="mt-1 pl-6 text-xs text-slate-400 dark:text-slate-500">
                                        {count} 筆資料
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-8 py-5 rounded-b-3xl dark:border-slate-700 dark:bg-slate-800">
                    <button
                        onClick={onCancel}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        取消
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={selectedHeaders.size === 0}
                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        確認匯入 ({selectedHeaders.size})
                    </button>
                </div>
            </div>
        </div>
    );
}
