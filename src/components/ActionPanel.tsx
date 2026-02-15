
import React from 'react';
import { ProgressState } from '../types';

interface ActionPanelProps {
    progress: ProgressState;
    isProcessing: boolean;
    onExecute: () => void;
    canExecute: boolean;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ progress, isProcessing, onExecute, canExecute }) => {
    return (
        <div className="pro-card">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <div className="text-[12px] font-black text-[#4984AC] uppercase tracking-[0.1em]">系統狀態 Processing Status</div>
                        <div className="text-2xl font-bold text-[#08739D]">{progress.status}</div>
                    </div>
                    {isProcessing && (
                        <div className="text-3xl font-black text-[#AEC60C] italic">
                            {progress.percent}%
                        </div>
                    )}
                </div>

                <div className="h-4 w-full bg-[#E7EEF8] rounded-full overflow-hidden border border-white">
                    <div 
                        className="h-full transition-all duration-700 ease-out"
                        style={{ 
                            width: `${progress.percent}%`,
                            background: 'linear-gradient(90deg, #08739D 0%, #6D9D39 100%)',
                            boxShadow: '0 0 15px rgba(109,157,57,0.4)'
                        }}
                    ></div>
                </div>

                <div className="flex justify-center mt-4">
                    <button 
                        onClick={onExecute}
                        disabled={!canExecute || isProcessing}
                        className="execute-btn-pro disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group"
                    >
                        <span>{isProcessing ? '正在執行系統指令' : '啟動自動化執行'}</span>
                        <i className="ri-flashlight-line group-hover:animate-bounce"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionPanel;
