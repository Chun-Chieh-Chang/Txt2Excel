
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200 dark:bg-slate-800">
                <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">
                    {editingRuleId ? '編輯規則' : '新增填入規則'}
                </h3>

                <div className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">選擇工作表</label>
                        <select
                            value={ruleForm.worksheet}
                            onChange={(e) => setRuleForm({ ...ruleForm, worksheet: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium transition-all hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100"
                        >
                            {worksheets.slice(-10).map(ws => (
                                <option key={ws} value={ws}>{ws}</option>
                            ))}
                        </select>
                    </div>

                    {!Array.isArray(parsedData) && (
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">資料來源 (欄位)</label>
                            <select
                                value={ruleForm.source}
                                onChange={(e) => setRuleForm({ ...ruleForm, source: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium transition-all hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100"
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
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">起始儲存格 (如 I26)</label>
                            <input
                                type="text"
                                value={ruleForm.startCell}
                                onChange={(e) => setRuleForm({ ...ruleForm, startCell: e.target.value.toUpperCase() })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium transition-all hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100"
                                placeholder="例如 I26"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <span className="flex items-center gap-1">每頁筆數</span>
                            </label>
                            <input
                                type="number"
                                value={ruleForm.rowCount}
                                onChange={(e) => setRuleForm({ ...ruleForm, rowCount: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium transition-all hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">填入方向</label>
                        <select
                            disabled
                            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-400"
                        >
                            <option value="horizontal">橫向（每隔一列用一格）</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        取消
                    </button>
                    <button
                        onClick={onSave}
                        className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"
                    >
                        確認
                    </button>
                </div>
            </div>
        </div>
    );
}
