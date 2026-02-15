
import { ParsedData } from '../types';

interface RuleModalProps {
    isOpen: boolean;
    editingRuleId: string | null;
    ruleForm: {
        worksheet: string;
        startCell: string;
        rowCount: number;
        direction: 'horizontal' | 'vertical';
        source: string;
    };
    setRuleForm: (form: any) => void;
    worksheets: string[];
    parsedData: ParsedData;
    onSave: () => void;
    onClose: () => void;
}

export default function RuleModal({
    isOpen,
    editingRuleId,
    ruleForm,
    setRuleForm,
    worksheets,
    parsedData,
    onSave,
    onClose
}: RuleModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A202C66] backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-200">
                <h3 className="mb-6 text-[20px] font-bold text-[#333333]">
                    {editingRuleId ? '編輯規則' : '新增填入規則'}
                </h3>

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] font-semibold text-[#888888] uppercase tracking-wider">選擇工作表</label>
                        <select
                            value={ruleForm.worksheet}
                            onChange={(e) => setRuleForm({ ...ruleForm, worksheet: e.target.value })}
                            className="w-full rounded-xl border border-[#E6E8EB] bg-[#F8FAFC] px-4 py-3 text-[14px] focus:outline-none focus:border-[#2D76FC] transition-colors"
                        >
                            {worksheets.slice(-10).map(ws => (
                                <option key={ws} value={ws}>{ws}</option>
                            ))}
                        </select>
                    </div>

                    {!Array.isArray(parsedData) && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-semibold text-[#888888] uppercase tracking-wider">資料來源 (欄位)</label>
                            <select
                                value={ruleForm.source}
                                onChange={(e) => setRuleForm({ ...ruleForm, source: e.target.value })}
                                className="w-full rounded-xl border border-[#E6E8EB] bg-[#F8FAFC] px-4 py-3 text-[14px] focus:outline-none focus:border-[#2D76FC] transition-colors"
                            >
                                {Object.keys(parsedData).map(key => {
                                    const firstValue = (parsedData as Record<string, string[]>)[key]?.[0] || '無數據';
                                    return (
                                        <option key={key} value={key}>
                                            {key} ({firstValue})
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-semibold text-[#888888] uppercase tracking-wider">起始標頭 (如 I26)</label>
                            <input
                                type="text"
                                value={ruleForm.startCell}
                                onChange={(e) => setRuleForm({ ...ruleForm, startCell: e.target.value.toUpperCase() })}
                                className="w-full rounded-xl border border-[#E6E8EB] bg-[#F8FAFC] px-4 py-3 text-[14px] focus:outline-none focus:border-[#2D76FC] transition-colors"
                                placeholder="例如 I26"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-semibold text-[#888888] uppercase tracking-wider">每頁筆數</label>
                            <input
                                type="number"
                                value={ruleForm.rowCount}
                                onChange={(e) => setRuleForm({ ...ruleForm, rowCount: e.target.value })}
                                className="w-full rounded-xl border border-[#E6E8EB] bg-[#F8FAFC] px-4 py-3 text-[14px] focus:outline-none focus:border-[#2D76FC] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] font-semibold text-[#888888] uppercase tracking-wider">填入方向</label>
                        <select
                            disabled
                            className="w-full cursor-not-allowed rounded-xl border border-[#E6E8EB] bg-[#EDF2F7] px-4 py-3 text-[14px] text-[#A0AEC0]"
                        >
                            <option value="horizontal">橫向（間隔列填寫模式）</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl border border-[#E6E8EB] bg-white text-[#333333] font-bold text-[14px] transition-all hover:bg-[#F8FAFC]"
                    >
                        取消
                    </button>
                    <button
                        onClick={onSave}
                        className="flex-1 py-3 px-4 rounded-xl bg-[#2D76FC] text-white font-bold text-[14px] shadow-[0_10px_20px_rgba(45,118,252,0.2)] transition-all hover:bg-[#1B65ED]"
                    >
                        確認
                    </button>
                </div>
            </div>
        </div>
    );
}
