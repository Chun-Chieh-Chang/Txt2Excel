
import React from 'react';

interface FileUploadProps {
    dataFile: File | null;
    excelFile: File | null;
    parsedData: any;
    onDataUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onExcelUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearData: () => void;
    onClearExcel: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
    dataFile,
    excelFile,
    onDataUpload,
    onExcelUpload,
    onClearData,
    onClearExcel
}) => {
    return (
        <div className="flex flex-col gap-8">
            {/* Data File Card */}
            <div className="pro-card">
                <div className="flex justify-between items-center mb-2">
                    <div className="text-xl font-black text-[#08739D] flex items-center gap-3">
                        <i className="ri-database-2-line text-2xl text-[#6D9D39]"></i>
                        上傳原始資料
                    </div>
                    {dataFile ? (
                        <span className="badge-pro bg-[#6D9D39] text-white">READY</span>
                    ) : (
                        <span className="badge-pro bg-[#E7EEF8] text-[#4984AC] border border-[#4984AC33]">WAITING</span>
                    )}
                </div>
                
                <label className="pro-upload-area group">
                    {!dataFile ? (
                        <div className="text-center z-10 transition-colors group-hover:text-[#08739D]">
                            <i className="ri-upload-cloud-2-line text-5xl mb-3 block text-[#4984AC]"></i>
                            <div className="text-lg font-bold">點擊或拖放 TXT / CSV 檔案</div>
                            <div className="text-sm opacity-60">支援多種編碼自動偵測</div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-inner border border-[#E7EEF8] z-10">
                            <div className="w-12 h-12 bg-[#08739D1A] rounded-xl flex items-center justify-center text-[#08739D] text-2xl">
                                <i className="ri-file-text-line"></i>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-[#08739D] truncate">{dataFile.name}</div>
                                <div className="text-xs text-[#4984AC] font-medium">{(dataFile.size / 1024).toFixed(1)} KB</div>
                            </div>
                            <button 
                                onClick={(e) => { e.preventDefault(); onClearData(); }}
                                className="w-8 h-8 rounded-full hover:bg-[#FEE2E2] hover:text-[#EF4444] text-[#A0AEC0] flex items-center justify-center transition-colors"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                    )}
                    <input type="file" onChange={onDataUpload} className="hidden" accept=".txt,.csv" />
                </label>
            </div>

            {/* Excel Template Card */}
            <div className="pro-card">
                <div className="flex justify-between items-center mb-2">
                    <div className="text-xl font-black text-[#08739D] flex items-center gap-3">
                        <i className="ri-file-excel-2-line text-2xl text-[#AEC60C]"></i>
                        上傳 Excel 模板
                    </div>
                    {excelFile ? (
                        <span className="badge-pro bg-[#6D9D39] text-white">READY</span>
                    ) : (
                        <span className="badge-pro bg-[#E7EEF8] text-[#4984AC] border border-[#4984AC33]">WAITING</span>
                    )}
                </div>
                
                <label className="pro-upload-area group">
                    {!excelFile ? (
                        <div className="text-center z-10 transition-colors group-hover:text-[#08739D]">
                            <i className="ri-file-add-line text-5xl mb-3 block text-[#4984AC]"></i>
                            <div className="text-lg font-bold">選擇 Excel 目的檔案 (.xlsx)</div>
                            <div className="text-sm opacity-60">系統將透過規則填入數據</div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-inner border border-[#E7EEF8] z-10">
                            <div className="w-12 h-12 bg-[#AEC60C1A] rounded-xl flex items-center justify-center text-[#AEC60C] text-2xl">
                                <i className="ri-file-excel-line"></i>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-[#08739D] truncate">{excelFile.name}</div>
                                <div className="text-xs text-[#4984AC] font-medium">{(excelFile.size / 1024).toFixed(1)} KB</div>
                            </div>
                            <button 
                                onClick={(e) => { e.preventDefault(); onClearExcel(); }}
                                className="w-8 h-8 rounded-full hover:bg-[#FEE2E2] hover:text-[#EF4444] text-[#A0AEC0] flex items-center justify-center transition-colors"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                    )}
                    <input type="file" onChange={onExcelUpload} className="hidden" accept=".xlsx" />
                </label>
            </div>
        </div>
    );
};

export default FileUpload;
