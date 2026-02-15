
import React from 'react';

interface HeaderProps {
    onReset: () => void;
    onOpenHelp: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, onOpenHelp }) => {
    return (
        <header className="header-card">
            <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-[32px] shadow-lg rotate-[-3deg] transition-transform hover:rotate-0"
                     style={{ background: 'linear-gradient(135deg, #08739D 0%, #4984AC 100%)' }}>
                    <i className="ri-article-line"></i>
                </div>
                <div>
                    <h1 className="text-3xl font-black text-[#08739D] tracking-tighter leading-none italic">Txt2Excel</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] bg-[#AEC60C] px-2 py-0.5 rounded-sm">V3.0 Master Edition</span>
                        <div className="h-1 w-12 bg-gradient-to-right from-[#6D9D39] to-transparent rounded-full"></div>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-5">
                <button 
                    onClick={onOpenHelp}
                    className="icon-btn-pro"
                    title="操作說明"
                >
                    <i className="ri-question-line"></i>
                </button>
                <button 
                    onClick={onReset}
                    className="icon-btn-pro hover:bg-[#C53030] hover:!text-white"
                    title="重置系統"
                >
                    <i className="ri-refresh-line"></i>
                </button>
            </div>
        </header>
    );
};

export default Header;
