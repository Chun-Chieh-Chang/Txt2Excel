
import { useEffect } from 'react';
import { FileSpreadsheet, RotateCcw } from 'lucide-react';

interface HeaderProps {
    onReset: () => void;
    onOpenHelp: () => void;
}

export default function Header({ onReset, onOpenHelp }: HeaderProps) {

    useEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/20 bg-white/40 backdrop-blur-xl supports-[backdrop-filter]:bg-white/30 dark:border-slate-800/40 dark:bg-slate-900/40 supports-[backdrop-filter]:dark:bg-slate-900/40">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 dark:from-emerald-500 dark:to-teal-600 text-white shadow-xl shadow-rose-500/30 dark:shadow-emerald-500/30 transform transition-transform hover:scale-110 duration-300">
                        <FileSpreadsheet className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 drop-shadow-sm">Txt<span className="text-rose-600 dark:text-emerald-400">2</span>Excel</h1>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Intelligent Tool v3.0</p>
                    </div>
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 hidden md:block opacity-80">凱益品管部專用軟體</h1>
                </div>

                <div className="flex gap-2 relative z-10">
                    <button onClick={onReset} className="group flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white/90 px-4 py-2 text-sm font-black text-slate-700 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-emerald-400 dark:border-slate-600 dark:bg-slate-200 dark:text-[#004d35] dark:hover:border-emerald-500 shadow-sm">
                        <RotateCcw className="h-4 w-4 transition-transform group-hover:-rotate-180" />
                        重置
                    </button>
                    <button
                        onClick={onOpenHelp}
                        className="flex items-center gap-2 rounded-xl border-2 border-transparent bg-white/90 px-4 py-2 text-sm font-black text-slate-700 transition-all hover:-translate-y-1 hover:shadow-lg hover:text-emerald-700 dark:border-slate-600 dark:bg-slate-200 dark:text-[#004d35] shadow-sm"
                    >
                        說明
                    </button>

                </div>
            </div>
        </header>
    );
}
