
import { RefreshCw } from 'lucide-react';
import { ProgressState } from '../types';

interface ActionPanelProps {
    progress: ProgressState;
    isProcessing: boolean;
    canExecute: boolean;
    onExecute: () => void;
}

export default function ActionPanel({
    progress,
    isProcessing,
    canExecute,
    onExecute
}: ActionPanelProps) {
    return (
        <div className="rounded-3xl border border-white/40 bg-white/40 p-6 shadow-xl shadow-rose-100/50 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-emerald-900/10">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white/60 p-2 dark:bg-slate-700/60">
                        <RefreshCw className={`h-5 w-5 text-slate-600 dark:text-slate-200 ${isProcessing ? 'animate-spin' : ''}`} />
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{progress.status}</span>
                </div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{progress.percent}%</span>
            </div>

            <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/50">
                <div
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-600 dark:from-emerald-500 dark:to-teal-600 transition-all duration-300 ease-out"
                    style={{ width: `${progress.percent}%` }}
                />
            </div>

            <button
                onClick={onExecute}
                disabled={!canExecute || isProcessing}
                className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 dark:from-emerald-600 dark:to-teal-700 py-4 text-base font-bold text-white shadow-lg shadow-rose-500/30 dark:shadow-emerald-500/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-rose-500/40 dark:hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
                {isProcessing ? '處理中...' : '開始執行填入'}
            </button>
        </div>
    );
}
