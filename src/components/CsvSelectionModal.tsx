
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A202C66] backdrop-blur-sm p-4 animate-in fade-in">
            <div className="flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-200 max-h-[80vh]">
                <div className="border-b border-[#E6E8EB] px-8 py-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-[20px] font-bold text-[#333333]">選擇匯入欄位</h3>
                        <p className="mt-1 text-[13px] text-[#888888]">
                            偵測到 CSV 格式，請選擇要匯入的資料欄位 (共 {csvResult.headers.length} 欄)。
                        </p>
                    </div>
                    <button
                        onClick={onLoadProfile}
                        className="flex items-center gap-2 px-3 py-2 bg-[#F0FFF4] hover:bg-[#DCFCE7] text-[#166534] rounded-lg text-[13px] font-bold border border-[#BBF7D0] transition-colors"
                        title="套用現有的設定檔"
                    >
                        <i className="ri-file-settings-line"></i>
                        <span>載入設定檔</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                    <div className="mb-6 flex items-center gap-4">
                        <button
                            onClick={onSelectAll}
                            className="text-[14px] font-bold text-[#2D76FC] hover:underline"
                        >
                            全選
                        </button>
                        <button
                            onClick={onDeselectAll}
                            className="text-[14px] font-bold text-[#888888] hover:underline"
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
                                    className={`cursor-pointer rounded-xl border p-4 transition-all ${isSelected
                                        ? 'border-[#2D76FC] bg-[#EEF2FF] border-2'
                                        : 'border-[#E6E8EB] bg-[#F8FAFC] hover:border-[#2D76FC]'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`flex h-4 w-4 items-center justify-center rounded border ${isSelected ? 'border-[#2D76FC] bg-[#2D76FC]' : 'border-[#CBD5E0] bg-white'}`}>
                                            {isSelected && <i className="ri-check-line text-white text-[10px]"></i>}
                                        </div>
                                        <span className="truncate font-bold text-[14px] text-[#333333]" title={header}>{header}</span>
                                    </div>
                                    <div className="mt-1 pl-6 text-[12px] text-[#A0AEC0]">
                                        {count} 筆資料
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 bg-[#F8FAFC] px-8 py-5 rounded-b-2xl border-t border-[#E6E8EB]">
                    <button
                        onClick={onCancel}
                        className="py-2.5 px-6 rounded-xl border border-[#E6E8EB] bg-white text-[#333333] font-bold text-[14px] hover:bg-[#F8FAFC]"
                    >
                        取消
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={selectedHeaders.size === 0}
                        className="py-2.5 px-6 rounded-xl bg-[#2D76FC] text-white font-bold text-[14px] shadow-[0_10px_20px_rgba(45,118,252,0.2)] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                    >
                        確認匯入 ({selectedHeaders.size})
                    </button>
                </div>
            </div>
        </div>
    );
}
