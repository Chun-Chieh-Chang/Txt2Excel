
import { useState } from 'react';
import { Profile, Rule, ProfileRule, ProfileLibrary } from '../types';

interface ProfileManagerProps {
    currentRules: Rule[];
    currentHeaders: string[];
    worksheets: string[];
    onLoadProfile: (profile: Profile) => void;
    onLoadLibrary: (library: ProfileLibrary, fileHandle?: any) => void;
}

export default function ProfileManager({ currentRules, currentHeaders, worksheets, onLoadProfile, onLoadLibrary }: ProfileManagerProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [profileName, setProfileName] = useState('品號+後綴名(視需要設定)');

    const createCurrentProfile = (): Profile | null => {
        if (currentRules.length === 0) {
            alert('目前沒有設定任何規則，無法儲存');
            return null;
        }
        if (worksheets.length === 0) {
            alert('無法偵測工作表，無法計算相對位置');
            return null;
        }
        if (!profileName.trim()) {
            alert("請輸入設定檔名稱 (例如: 產品A-001)");
            return null;
        }

        const firstRuleSheet = currentRules[0].worksheet;
        const baseIndex = worksheets.indexOf(firstRuleSheet);

        if (baseIndex === -1) {
            alert(`找不到規則 1 的工作表 (${firstRuleSheet})，無法儲存`);
            return null;
        }

        const profileRules: ProfileRule[] = currentRules.map(r => {
            const sheetIdx = worksheets.indexOf(r.worksheet);
            let offset = 0;
            if (sheetIdx !== -1) {
                offset = sheetIdx - baseIndex;
            }
            return {
                sheetOffset: offset,
                startCell: r.startCell,
                rowCount: r.rowCount,
                direction: r.direction,
                source: r.source
            };
        });

        return {
            id: Date.now().toString(),
            name: profileName.trim(),
            createdAt: Date.now(),
            headers: currentHeaders,
            rules: profileRules
        };
    };

    const handleSaveNew = async () => {
        const profile = createCurrentProfile();
        if (!profile) return;
        try {
            // @ts-ignore
            if (!window.showSaveFilePicker) {
                alert("瀏覽器不支援檔案系統 API");
                return;
            }
            // @ts-ignore
            const handle = await window.showSaveFilePicker({
                suggestedName: `Config_${profile.name}.json`,
                types: [{
                    description: 'Configuration Library',
                    accept: { 'application/json': ['.json'] },
                }],
            });
            const library: ProfileLibrary = [profile];
            const content = JSON.stringify(library, null, 2);
            const writable = await handle.createWritable();
            await writable.write(content);
            await writable.close();
            alert(`新設定檔庫建立成功！\n已儲存 "${profile.name}"`);
        } catch (err: any) {
            if (err.name !== 'AbortError') alert("儲存失敗: " + err.message);
        }
    };

    const handleAppendToExisting = async () => {
        const profile = createCurrentProfile();
        if (!profile) return;
        try {
            // @ts-ignore
            if (!window.showOpenFilePicker) {
                alert("瀏覽器不支援檔案系統 API");
                return;
            }
            // @ts-ignore
            const [handle] = await window.showOpenFilePicker({
                types: [{
                    description: 'Configuration Library',
                    accept: { 'application/json': ['.json'] },
                }],
                multiple: false
            });
            const existingFile = await handle.getFile();
            const existingContent = await existingFile.text();
            let library: ProfileLibrary = [profile];
            if (existingContent.trim()) {
                const parsed = JSON.parse(existingContent);
                if (Array.isArray(parsed)) {
                    library = [...parsed, profile];
                } else if (parsed.id && parsed.rules) {
                    library = [parsed, profile];
                } else {
                    throw new Error("無效的設定檔格式");
                }
            }
            const content = JSON.stringify(library, null, 2);
            const writable = await handle.createWritable();
            await writable.write(content);
            await writable.close();
            alert(`已將 "${profile.name}" 加入設定檔庫！\n(目前共 ${library.length} 個設定)`);
        } catch (err: any) {
            if (err.name !== 'AbortError') alert("儲存失敗: " + err.message);
        }
    };

    const loadLibraryFromFile = async () => {
        try {
            let content = '';
            let fileHandle: any = null;
            // @ts-ignore
            if (window.showOpenFilePicker) {
                // @ts-ignore
                const [handle] = await window.showOpenFilePicker({
                    types: [{
                        description: 'Configuration Library',
                        accept: { 'application/json': ['.json'] },
                    }],
                    multiple: false
                });
                fileHandle = handle;
                const file = await handle.getFile();
                content = await file.text();
            } else {
                alert("瀏覽器不支援");
                return;
            }
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) {
                if (parsed.length === 0) {
                    alert("此檔案是空的設定檔庫");
                    return;
                }
                onLoadLibrary(parsed, fileHandle);
            } else if (parsed.id && parsed.rules) {
                onLoadProfile(parsed);
            } else {
                alert("檔案格式無法辨識");
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') alert("載入失敗: " + err.message);
        }
    };

    return (
        <div className="pro-card mb-6 overflow-hidden">
            <div 
                className="rule-header cursor-pointer hover:opacity-80" 
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="section-title flex items-center gap-2 text-[18px]">
                    <i className="ri-folder-open-line text-[#2D76FC]"></i>
                    設定檔管理 (多產品支援)
                </div>
                <div className="text-[#888888] text-[14px]">
                    {isExpanded ? '收起' : '展開'}
                    <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line ml-1`}></i>
                </div>
            </div>

            {isExpanded && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] font-semibold text-[#888888] uppercase tracking-wider">設定檔名稱</label>
                        <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            placeholder="請輸入設定名稱 (例如: 產品 A-101)..."
                            className="w-full px-4 py-3 rounded-xl border border-[#E6E8EB] bg-[#F8FAFC] text-[14px] focus:outline-none focus:border-[#2D76FC] transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={handleSaveNew}
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#F8FAFC] border border-[#E6E8EB] text-[#333333] font-bold text-[14px] transition-all hover:bg-white hover:border-[#2D76FC] hover:text-[#2D76FC] group"
                        >
                            <i className="ri-file-add-line text-lg group-hover:scale-110 transition-transform"></i>
                            建立新檔案
                        </button>
                        <button
                            onClick={handleAppendToExisting}
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#F8FAFC] border border-[#E6E8EB] text-[#333333] font-bold text-[14px] transition-all hover:bg-white hover:border-[#2D76FC] hover:text-[#2D76FC] group"
                        >
                            <i className="ri-save-line text-lg group-hover:scale-110 transition-transform"></i>
                            加入現有檔案
                        </button>
                    </div>
                    
                    <button
                        onClick={loadLibraryFromFile}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2D76FC1A] text-[#2D76FC] border border-transparent font-bold text-[14px] transition-all hover:bg-[#2D76FC2A]"
                    >
                        <i className="ri-folder-upload-line text-lg"></i>
                        載入設定檔庫
                    </button>
                </div>
            )}
        </div>
    );
}
