
import { AlertCircle } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A202C66] backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <h3 className="mb-6 text-[24px] font-bold text-[#333333] flex-shrink-0 flex items-center gap-2">
                    <i className="ri-book-read-line text-[#2D76FC]"></i>
                    使用說明
                </h3>

                <div className="flex flex-col gap-6 text-[#333333] overflow-y-auto pr-2 flex-1 min-h-0 custom-scrollbar">

                    {/* 基本流程 */}
                    <section>
                        <h4 className="mb-4 font-bold text-[18px] text-[#2D76FC] flex items-center gap-2">
                            <i className="ri-list-check-3"></i>
                            基本操作流程
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E6E8EB]">
                                <div className="font-bold text-[#2D76FC] text-[12px] uppercase tracking-wider mb-2">Step 1</div>
                                <strong className="text-[15px] block mb-1">上傳資料來源</strong>
                                <p className="text-[13px] text-[#888888]">上傳 .txt 或 .csv 資料檔案，系統會自動偵測編碼。</p>
                            </div>
                            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E6E8EB]">
                                <div className="font-bold text-[#2D76FC] text-[12px] uppercase tracking-wider mb-2">Step 2</div>
                                <strong className="text-[15px] block mb-1">上傳 Excel 模板</strong>
                                <p className="text-[13px] text-[#888888]">上傳您的報告模板 (.xlsx)，系統將讀取其結構。</p>
                            </div>
                            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E6E8EB]">
                                <div className="font-bold text-[#2D76FC] text-[12px] uppercase tracking-wider mb-2">Step 3</div>
                                <strong className="text-[15px] block mb-1">設定填寫規則</strong>
                                <p className="text-[13px] text-[#888888]">定義資料如何對應至 Excel，可載入或新建設定檔。</p>
                            </div>
                            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E6E8EB]">
                                <div className="font-bold text-[#2D76FC] text-[12px] uppercase tracking-wider mb-2">Step 4</div>
                                <strong className="text-[15px] block mb-1">執行填入</strong>
                                <p className="text-[13px] text-[#888888]">點擊開始按鈕，完成後系統會自動觸發下載。</p>
                            </div>
                        </div>
                    </section>

                    {/* 設定檔管理 */}
                    <section>
                        <h4 className="mb-4 font-bold text-[18px] text-[#00A8A8] flex items-center gap-2">
                            <i className="ri-save-3-line"></i>
                            設定檔管理
                        </h4>
                        <div className="flex flex-col gap-3 text-[14px]">
                            <div className="p-4 bg-[#F0FFFF] rounded-xl border border-[#00A8A833]">
                                <strong className="text-[#008080] block mb-1">多產品支援</strong>
                                <p className="text-[#556677] text-[13px]">
                                    您可以將目前的規則儲存為 JSON 檔案。在載入時，如果檔案包含多個設定，系統將提供清單讓您選擇套用。
                                </p>
                            </div>
                            <div className="p-4 bg-[#F0FFFF] rounded-xl border border-[#00A8A833]">
                                <strong className="text-[#008080] block mb-1">相對位置偏移</strong>
                                <p className="text-[#556677] text-[13px]">
                                    設定檔會紀錄工作表的相對位置。載入時只需指定「起始工作表」，後續規則會根據偏移量自動尋找對應 Sheet。
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 注意事項 */}
                    <div className="mt-4 p-4 bg-[#FFF5F5] rounded-xl text-[13px] text-[#C53030] border border-[#FECACA] flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                            <p className="font-bold">重要提醒：</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>系統處理完成後會下載一個「新檔案」，不會變更您的原始模板。</li>
                                <li>重命名或刪除設定檔的操作會「立即套用」至本地檔案。</li>
                                <li>請確保瀏覽器支援 File System Access API (建議使用 Chrome/Edge)。</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end pt-4 border-t border-[#E6E8EB] flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="py-3 px-8 rounded-xl bg-[#333333] text-white font-bold text-[14px] shadow-lg transition-all hover:bg-[#222222]"
                    >
                        關閉
                    </button>
                </div>
            </div>
        </div>
    );
}
