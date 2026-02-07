
import { ParsedData } from '../types';

interface DataPreviewProps {
    parsedData: ParsedData;
}

export default function DataPreview({ parsedData }: DataPreviewProps) {
    const hasData = Array.isArray(parsedData) ? parsedData.length > 0 : Object.keys(parsedData).length > 0;

    if (!hasData) return null;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm duration-500 animate-in fade-in slide-in-from-bottom-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">資料預覽</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                    {Array.isArray(parsedData)
                        ? `${parsedData.length} 筆`
                        : `${Object.values(parsedData).reduce((a, b) => a + b.length, 0)} 筆`}
                </span>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                {Array.isArray(parsedData) ? (
                    // TXT Preview (Simple List)
                    <div>
                        {parsedData.slice(0, 100).map((row, i) => (
                            <div key={i} className="flex gap-3 px-3 py-1 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700">
                                <span className="w-8 shrink-0 font-mono text-xs text-slate-300 select-none dark:text-slate-500">{i + 1}</span>
                                <span className="font-mono text-slate-700 truncate dark:text-slate-200">{row}</span>
                            </div>
                        ))}
                        {parsedData.length > 100 && (
                            <div className="px-3 py-1 text-xs text-slate-400 italic dark:text-slate-500">... 還有 {parsedData.length - 100} 筆</div>
                        )}
                    </div>
                ) : (
                    // CSV Preview (Columns)
                    Object.entries(parsedData).map(([key, data]) => (
                        <div key={key} className="mb-4 last:mb-0">
                            <div className="sticky top-0 bg-slate-50 px-3 py-1 font-bold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-700">
                                {key} ({data.length})
                            </div>
                            {data.slice(0, 20).map((row, i) => (
                                <div key={i} className="flex gap-3 px-3 py-1 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700">
                                    <span className="w-6 shrink-0 font-mono text-xs text-slate-300 select-none dark:text-slate-500">{i + 1}</span>
                                    <span className="font-mono text-slate-700 truncate dark:text-slate-200">{row}</span>
                                </div>
                            ))}
                            {data.length > 20 && (
                                <div className="px-3 py-1 text-xs text-slate-400 italic dark:text-slate-500">... 還有 {data.length - 20} 筆</div>
                            )}
                        </div>
                    )))}
            </div>
        </div>
    );
}
