
import { Rule } from '../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface RuleCanvasProps {
    rules: Rule[];
    onAddRule: () => void;
    onEditRule: (rule: Rule) => void;
    onDeleteRule: (id: string, e: React.MouseEvent) => void;
    excelFile: File | null;
    dataFile: File | null;
}

export default function RuleCanvas({
    rules,
    onAddRule,
    onEditRule,
    onDeleteRule,
    excelFile,
    dataFile
}: RuleCanvasProps) {
    return (
        <div className={`relative flex min-h-[500px] flex-col rounded-[2rem] border-2 border-slate-200/50 bg-white/60 p-2 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-500 ${!excelFile ? 'opacity-50 blur-[2px] pointer-events-none grayscale' : ''} dark:border-slate-700/50 dark:bg-slate-800/60 dark:shadow-emerald-900/10`}>

            {/* Background Grid */}
            <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 rounded-[2rem]" />
            <div className="absolute inset-x-6 top-16 bottom-6 z-0 border-2 border-dashed border-slate-300/50 rounded-xl dark:border-slate-700/50" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-6 py-4">
                <div>
                    <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">填入規則</h2>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{rules.length} 個規則已設定</p>
                </div>
                <button
                    onClick={onAddRule}
                    disabled={!excelFile || !dataFile}
                    className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20 dark:bg-[#2e8b57] dark:shadow-[#2e8b57]/30 transition-all hover:scale-110 disabled:bg-slate-300 disabled:shadow-none"
                >
                    <Plus className="h-6 w-6 transition-transform group-hover:rotate-90" />
                </button>
            </div>

            {/* Canvas Area */}
            <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-4">
                {rules.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
                        <div className="mb-4 rounded-full bg-slate-100/50 p-6 dark:bg-slate-700/50">
                            <Plus className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                        </div>
                        <p className="text-sm font-bold">尚未設定規則</p>
                        <p className="text-xs opacity-70 mt-1">點擊右上方按鈕新增</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {rules.map((rule) => {


                            return (
                                <div
                                    key={rule.id}
                                    onClick={() => onEditRule(rule)}
                                    className="group relative flex cursor-pointer items-center justify-between rounded-2xl border-2 border-white bg-white/80 p-4 shadow-sm transition-all hover:border-sky-300 hover:shadow-md hover:translate-x-1 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-[#3cb371]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 font-bold text-sm ring-4 ring-sky-50 dark:bg-[#1a2f2b] dark:text-[#98fb98] dark:ring-[#004d35]/30">
                                            {rule.startCell}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100">{rule.worksheet}</h4>
                                            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 dark:bg-slate-700 dark:text-slate-300">{rule.rowCount} 筆</span>
                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 dark:bg-slate-700 dark:text-slate-300">{rule.direction === 'horizontal' ? '橫向' : '直向'}</span>
                                                {rule.source && <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 dark:bg-[#004d35]/30 dark:text-[#98fb98] dark:border-[#004d35]/50">源: {rule.source}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEditRule(rule); }}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-sky-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-[#98fb98]">
                                            <Edit2 className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={(e) => onDeleteRule(rule.id, e)}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
