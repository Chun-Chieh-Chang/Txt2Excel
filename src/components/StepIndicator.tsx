
import { CheckCircle, Play } from 'lucide-react';

interface StepIndicatorProps {
    currentStep: number;
}

const STEPS = [
    { id: 1, label: '上傳資料', icon: CheckCircle },
    { id: 2, label: '上傳模板', icon: CheckCircle },
    { id: 3, label: '設定規則', icon: CheckCircle },
    { id: 4, label: '執行填入', icon: Play },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
    return (
        <div className="mb-8">
            <div className="flex justify-between relative px-2">
                {STEPS.map((step, idx) => {
                    const isActive = currentStep >= step.id;
                    const isDone = currentStep > step.id;

                    return (
                        <div key={step.id} className="relative flex flex-col items-center flex-1">
                            <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-3xl border-4 transition-all duration-300 shadow-xl
                ${isActive ? 'border-sky-500 bg-white text-sky-600 shadow-sky-200 dark:border-[#3cb371] dark:bg-[#1a2f2b] dark:text-[#98fb98] dark:shadow-[#004d35]/40' : 'border-slate-200 bg-slate-50 text-slate-300 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-600'}
                ${isDone ? '!bg-sky-500 !border-sky-500 !text-white dark:!bg-[#2e8b57] dark:!border-[#2e8b57]' : ''}
                `}>
                                <step.icon className={`h-8 w-8 ${isActive ? 'animate-in zoom-in duration-300' : ''}`} />
                            </div>
                            <div className={`mt-3 text-sm font-black tracking-wide transition-colors duration-300 ${isActive ? 'text-slate-900 dark:text-[#d1ffd6]' : 'text-slate-400 dark:text-slate-600'}`}>
                                {step.label}
                            </div>
                            {/* Connector Line */}
                            {idx !== 3 && (
                                <div className="absolute top-7 left-1/2 -z-10 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full">
                                    <div className={`h-full bg-sky-400 dark:bg-[#3cb371] transition-all duration-500 ease-out rounded-full`} style={{ width: isDone ? '100%' : '0%' }} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
