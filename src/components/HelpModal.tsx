
import { AlertCircle, Save, FolderOpen, Edit2 } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col dark:bg-slate-800">
                <h3 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100 flex-shrink-0">📖 使用說明</h3>

                <div className="space-y-6 text-slate-700 dark:text-slate-300 overflow-y-auto pr-2 flex-1 min-h-0">

                    {/* 基本流程 */}
                    <section>
                        <h4 className="mb-3 font-bold text-lg text-blue-600 dark:text-blue-400">📋 基本操作流程</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/40">
                                <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">步驟 1</span>
                                <div>
                                    <strong>上傳資料來源</strong>
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                        <li><strong>TXT 檔案</strong>：純文字檔，每行代表一筆數據</li>
                                        <li><strong>CSV 檔案</strong>：支援多欄位數據，上傳後可選擇要匯入的欄位</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/40">
                                <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">步驟 2</span>
                                <div>
                                    <strong>上傳 Excel 模板</strong>
                                    <p className="mt-1">上傳您的 Excel 報告模板 (.xlsx)，系統會自動讀取工作表</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/40">
                                <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">步驟 3</span>
                                <div>
                                    <strong>設定填寫規則</strong>
                                    <p className="mt-1">點擊「新增規則」定義數據如何填入 Excel</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/40">
                                <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">步驟 4</span>
                                <div>
                                    <strong>執行填入</strong>
                                    <p className="mt-1">點擊「開始執行填入」，完成後自動下載新的 Excel 檔案</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 設定檔管理 */}
                    <section>
                        <h4 className="mb-3 font-bold text-lg text-indigo-600 dark:text-indigo-400">💾 設定檔管理（多產品支援）</h4>
                        <p className="text-sm mb-3">您可以將常用的設定儲存為「設定檔」，方便日後快速套用。支援管理多個產品的設定檔庫。</p>

                        <div className="space-y-3">
                            {/* 儲存設定 */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100 dark:from-indigo-900/20 dark:to-purple-900/20 dark:border-indigo-800/40">
                                <div className="flex items-center gap-2 mb-2">
                                    <Save className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    <strong className="text-indigo-700 dark:text-indigo-300">儲存設定</strong>
                                </div>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    <li><strong>新建檔案</strong>：建立一個全新的設定檔庫（JSON 檔案）</li>
                                    <li><strong>加入現有</strong>：將目前設定追加到已存在的設定檔庫中</li>
                                    <li>💡 <em>提示：一個設定檔庫可以包含多個產品的設定</em></li>
                                </ul>
                            </div>

                            {/* 載入設定 */}
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-100 dark:from-emerald-900/20 dark:to-teal-900/20 dark:border-emerald-800/40">
                                <div className="flex items-center gap-2 mb-2">
                                    <FolderOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    <strong className="text-emerald-700 dark:text-emerald-300">載入設定檔</strong>
                                </div>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    <li>支援載入<strong>單一設定檔</strong>或<strong>設定檔庫</strong></li>
                                    <li>載入設定檔庫時，會彈出選擇視窗讓您挑選要套用的產品</li>
                                    <li>💡 <em>提示：可以在上傳資料來源後直接載入設定檔，系統會自動套用</em></li>
                                </ul>
                            </div>

                            {/* 管理設定檔 */}
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800/40">
                                <div className="flex items-center gap-2 mb-2">
                                    <Edit2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    <strong className="text-amber-700 dark:text-amber-300">管理設定檔庫</strong>
                                </div>
                                <p className="text-sm mb-2">載入設定檔庫後，在選擇視窗中可以：</p>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    <li><strong>重命名</strong>：將滑鼠移到設定檔名稱上，點擊鉛筆圖示 ✏️ 即可修改</li>
                                    <li><strong>刪除</strong>：點擊垃圾桶圖示 🗑️ 可永久刪除該設定檔</li>
                                    <li>⚠️ <em>注意：所有修改會立即寫入檔案，無法復原</em></li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 進階功能 */}
                    <section>
                        <h4 className="mb-3 font-bold text-lg text-purple-600 dark:text-purple-400">🚀 進階功能</h4>
                        <div className="space-y-2 text-sm">
                            <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100 dark:bg-purple-900/20 dark:border-purple-800/40">
                                <strong className="text-purple-700 dark:text-purple-300">跨工作表填寫</strong>
                                <p className="mt-1">設定檔支援「相對工作表位置」，可以自動適應不同的工作表結構</p>
                                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                    例如：規則 1 在「第 5 張表」，規則 2 在「第 6 張表」，載入時系統會自動計算偏移量
                                </p>
                            </div>
                            <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100 dark:bg-purple-900/20 dark:border-purple-800/40">
                                <strong className="text-purple-700 dark:text-purple-300">自動編碼偵測</strong>
                                <p className="mt-1">系統會自動偵測 TXT/CSV 檔案的編碼（支援 UTF-8、Big5、GBK 等），避免亂碼問題</p>
                            </div>
                            <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100 dark:bg-purple-900/20 dark:border-purple-800/40">
                                <strong className="text-purple-700 dark:text-purple-300">格式保留</strong>
                                <p className="mt-1">系統會完整保留 Excel 模板的格式、樣式、圖片等，僅填入數據並設定字體為黑色</p>
                            </div>
                        </div>
                    </section>

                    {/* 注意事項 */}
                    <div className="mt-4 p-4 bg-yellow-50 rounded-xl text-xs text-yellow-700 border border-yellow-100 flex items-start gap-2 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/40">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p><strong>⚠️ 重要提醒：</strong></p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>原始的 Excel 檔案<strong>不會被修改</strong>，系統會產生一個新的檔案</li>
                                <li>設定檔的修改（重命名/刪除）會<strong>立即寫入檔案</strong>，請謹慎操作</li>
                                <li>建議定期備份重要的設定檔庫</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                        關閉
                    </button>
                </div>
            </div>
        </div>
    );
}
