import { X } from 'lucide-react';

interface SheetSelectionModalProps {
    isOpen: boolean;
    worksheets: string[];
    onConfirm: (sheetName: string) => void;
    onCancel: () => void;
}

export default function SheetSelectionModal({
    isOpen,
    worksheets,
    onConfirm,
    onCancel
}: SheetSelectionModalProps) {
    if (!isOpen) return null;

    // Only show the last 10 sheets, but keep original indices in mind? 
    // The user just needs to pick a name. The parent component knows the full list index.
    // If we only show the last 10, we should probably reverse them so the latest is top?
    // User request: "工作表只出現最後10個選擇"
    const displaySheets = worksheets.slice(-10);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            選擇起始工作表
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            請選擇設定檔的第一個規則要套用在哪個工作表
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body - Sheet List */}
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    <div className="flex flex-col gap-2">
                        {displaySheets.map((sheet) => (
                            <button
                                key={sheet}
                                onClick={() => onConfirm(sheet)}
                                className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all group"
                            >
                                <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                                    {sheet}
                                </span>
                            </button>
                        ))}
                    </div>
                    {worksheets.length > 10 && (
                        <p className="text-center text-xs text-slate-400 mt-4">
                            (僅顯示最後 10 個工作表)
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        取消
                    </button>
                </div>
            </div>
        </div>
    );
}
