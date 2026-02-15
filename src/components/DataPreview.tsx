
import { ParsedData } from '../types';

interface DataPreviewProps {
    parsedData: ParsedData;
}

export default function DataPreview({ parsedData }: DataPreviewProps) {
    const hasData = Array.isArray(parsedData) ? parsedData.length > 0 : Object.keys(parsedData).length > 0;

    if (!hasData) return null;

    return (
        <div className="pro-card">
            <div className="flex items-center justify-between border-b border-[#E6E8EB] pb-4">
                <h3 className="section-title text-[18px]">資料預覽</h3>
                <span className="badge-pro badge-ready-pro">
                    {Array.isArray(parsedData)
                        ? `${parsedData.length} 筆`
                        : `${Object.values(parsedData).reduce((a, b) => a + b.length, 0)} 筆`}
                </span>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2">
                {Array.isArray(parsedData) ? (
                    // TXT Preview
                    <div>
                        {parsedData.slice(0, 100).map((row, i) => (
                            <div key={i} className="flex gap-3 px-3 py-1 text-sm transition-colors hover:bg-slate-50">
                                <span className="w-8 shrink-0 font-mono text-xs text-[#A0AEC0] select-none">{i + 1}</span>
                                <span className="font-mono text-[#333333] truncate">{row}</span>
                            </div>
                        ))}
                        {parsedData.length > 100 && (
                            <div className="px-3 py-1 text-xs text-[#A0AEC0] italic text-center mt-2">... 還有 {parsedData.length - 100} 筆</div>
                        )}
                    </div>
                ) : (
                    // CSV Preview
                    Object.entries(parsedData).map(([key, data]) => (
                        <div key={key} className="mb-4 last:mb-0">
                            <div className="sticky top-0 bg-[#F8FAFC] px-3 py-1 font-bold text-xs text-[#556677] uppercase tracking-wider border-b border-[#E6E8EB] z-10">
                                {key} ({data.length})
                            </div>
                            {data.slice(0, 20).map((row, i) => (
                                <div key={i} className="flex gap-3 px-3 py-1 text-sm transition-colors hover:bg-[#F8FAFC]">
                                    <span className="w-6 shrink-0 font-mono text-xs text-[#A0AEC0] select-none">{i + 1}</span>
                                    <span className="font-mono text-[#333333] truncate">{row}</span>
                                </div>
                            ))}
                            {data.length > 20 && (
                                <div className="px-3 py-1 text-xs text-[#A0AEC0] italic text-center mt-2">... 還有 {data.length - 20} 筆</div>
                            )}
                        </div>
                    )))}
            </div>
        </div>
    );
}
