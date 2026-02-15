
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

    const displaySheets = worksheets.slice(-10);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A202C66] backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-[#E6E8EB]">
                    <h3 className="text-[20px] font-bold text-[#333333]">選擇起始工作表</h3>
                    <p className="text-[13px] text-[#888888] mt-1">請選擇預計應套用第一個規則的工作表名稱</p>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar flex flex-col gap-2">
                    {displaySheets.map((sheet) => (
                        <button
                            key={sheet}
                            onClick={() => onConfirm(sheet)}
                            className="w-full text-left px-5 py-4 rounded-xl border-2 border-[#E6E8EB] bg-[#F8FAFC] hover:border-[#2D76FC] hover:bg-white transition-all group font-bold text-[#333333]"
                        >
                            <span className="text-[15px] group-hover:text-[#2D76FC] transition-colors">{sheet}</span>
                        </button>
                    ))}
                    {worksheets.length > 10 && (
                        <p className="text-center text-[12px] text-[#A0AEC0] mt-2 font-medium">
                            (僅顯示最後 10 個工作表)
                        </p>
                    )}
                </div>

                <div className="px-8 py-5 bg-[#F8FAFC] border-t border-[#E6E8EB] flex justify-end">
                    <button
                        onClick={onCancel}
                        className="py-2.5 px-6 rounded-xl border border-[#E6E8EB] bg-white text-[#333333] font-bold text-[14px] hover:bg-[#F8FAFC]"
                    >
                        取消
                    </button>
                </div>
            </div>
        </div>
    );
}
