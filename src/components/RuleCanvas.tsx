
import { Rule } from '../types';

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
        <div className="pro-card min-h-[500px]">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-[#E7EEF8]">
                <div className="flex flex-col">
                    <div className="text-[12px] font-black text-[#6D9D39] uppercase tracking-[0.2em] mb-1">Configuration</div>
                    <h2 className="text-2xl font-black text-[#08739D]">填入規則管理</h2>
                </div>
                <button 
                    onClick={onAddRule}
                    disabled={!excelFile || !dataFile}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#4984AC] hover:bg-[#08739D] text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/10 disabled:opacity-30 disabled:grayscale"
                >
                    <i className="ri-add-circle-line text-lg"></i>
                    新增規則
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {rules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[#A0AEC0]">
                        <div className="w-24 h-24 bg-[#E7EEF8] rounded-full flex items-center justify-center mb-6">
                            <i className="ri-draft-line text-4xl opacity-40"></i>
                        </div>
                        <p className="font-bold tracking-widest uppercase text-xs">Waiting for configuration...</p>
                        <p className="text-sm mt-2 opacity-60">尚未設定任何填入規則</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {rules.map((rule, index) => (
                            <div 
                                key={rule.id} 
                                onClick={() => onEditRule(rule)}
                                className="flex items-center gap-5 p-5 rounded-2xl bg-[#E7EEF844] border-2 border-transparent hover:border-[#4984AC] hover:bg-white cursor-pointer transition-all group shadow-sm"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#4984AC] font-black italic">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-[#08739D] flex items-center gap-2">
                                        <span className="truncate">{rule.worksheet}</span>
                                        <i className="ri-arrow-right-s-line opacity-30"></i>
                                        <span className="text-[#6D9D39]">{rule.startCell}</span>
                                    </div>
                                    <div className="text-[12px] text-[#4984AC] font-medium mt-1 flex gap-3 opacity-70">
                                        <span><i className="ri-database-line mr-1"></i>{rule.rowCount} 筆數據</span>
                                        <span><i className="ri-compass-3-line mr-1"></i>{rule.direction === 'horizontal' ? '橫向' : '直向'}</span>
                                        {rule.source && <span className="truncate"><i className="ri-focus-3-line mr-1"></i>{rule.source}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDeleteRule(rule.id, e); }}
                                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                                    >
                                        <i className="ri-delete-bin-line"></i>
                                    </button>
                                </div>
                                <i className="ri-checkbox-circle-fill text-[#AEC60C] text-[28px] shadow-sm rounded-full"></i>
                            </div>
                        ))}
                    </div>
                )}
                
                <div 
                    onClick={onAddRule}
                    className={`mt-4 py-8 rounded-[24px] border-2 border-dashed border-[#B8C6D9] flex flex-col items-center justify-center gap-3 text-[#4984AC] hover:border-[#08739D] hover:text-[#08739D] hover:bg-white cursor-pointer transition-all ${(!excelFile || !dataFile) ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                >
                    <div className="w-12 h-12 bg-[#E7EEF8] rounded-full flex items-center justify-center">
                        <i className="ri-add-line text-2xl"></i>
                    </div>
                    <span className="font-bold tracking-widest text-sm uppercase">Quick Entry • 新增自定義規則</span>
                </div>
            </div>
        </div>
    );
}
