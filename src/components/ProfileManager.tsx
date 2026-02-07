import { useState } from 'react';
import { Save, FolderOpen, FileUp } from 'lucide-react';
import { Profile, Rule, ProfileRule, ProfileLibrary } from '../types';

interface ProfileManagerProps {
    currentRules: Rule[];
    currentHeaders: string[]; // From selectedHeaders Set
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

        // 1. Identify Base Sheet
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
            } else {
                console.warn(`Worksheet ${r.worksheet} not found using 0 offset fallback`);
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

    // Unified Smart Save: Single file picker, auto-detect new vs append
    // Save as NEW file
    const handleSaveNew = async () => {
        const profile = createCurrentProfile();
        if (!profile) return;

        try {
            // @ts-ignore - FSA API
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

            // Write to file
            const content = JSON.stringify(library, null, 2);
            const writable = await handle.createWritable();
            await writable.write(content);
            await writable.close();

            alert(`新設定檔庫建立成功！\n已儲存 "${profile.name}"`);

        } catch (err: any) {
            if (err.name !== 'AbortError') {
                console.error(err);
                alert("儲存失敗: " + err.message);
            }
        }
    };

    // Append to existing file
    const handleAppendToExisting = async () => {
        const profile = createCurrentProfile();
        if (!profile) return;

        try {
            // @ts-ignore - FSA API
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

            // Read existing content
            const existingFile = await handle.getFile();
            const existingContent = await existingFile.text();

            console.log("Reading existing file, size:", existingFile.size);

            let library: ProfileLibrary = [profile];

            if (existingContent.trim()) {
                const parsed = JSON.parse(existingContent);

                if (Array.isArray(parsed)) {
                    library = [...parsed, profile];
                    console.log("Appending to library, new size:", library.length);
                } else if (parsed.id && parsed.rules) {
                    // Legacy single profile -> convert to array
                    library = [parsed, profile];
                    console.log("Converted single profile to library");
                } else {
                    throw new Error("無效的設定檔格式");
                }
            }

            // Write to file
            const content = JSON.stringify(library, null, 2);
            const writable = await handle.createWritable();
            await writable.write(content);
            await writable.close();

            alert(`已將 "${profile.name}" 加入設定檔庫！\n(目前共 ${library.length} 個設定)`);

        } catch (err: any) {
            if (err.name !== 'AbortError') {
                console.error(err);
                alert("儲存失敗: " + err.message);
            }
        }
    };

    // Load from File
    const loadLibraryFromFile = async () => {
        try {
            let content = '';
            let fileHandle: any = null; // Store handle

            // @ts-ignore - FSA API
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
                // It's a library -> LIFT STATE UP to parent (App.tsx)
                if (parsed.length === 0) {
                    alert("此檔案是空的設定檔庫");
                    return;
                }
                // Pass handle along with data
                onLoadLibrary(parsed, fileHandle);
            } else if (parsed.id && parsed.rules) {
                // Single Profile -> Load immediately
                onLoadProfile(parsed);
            } else {
                alert("檔案格式無法辨識");
            }

        } catch (err: any) {
            if (err.name !== 'AbortError') {
                console.error("Load failed:", err);
                alert("載入失敗: " + err.message);
            }
        }
    };

    return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 transition-all">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                    <FolderOpen className="w-5 h-5 text-indigo-500" />
                    <span>設定檔管理 (多產品支援)</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    {isExpanded ? '收起' : '展開'}
                </button>
            </div>

            {isExpanded && (
                <div className="mt-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* Name Input Row */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            placeholder="請輸入設定名稱 (例如: 產品 A-101)..."
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* 1. Save New */}
                        <button
                            onClick={handleSaveNew}
                            className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20"
                            title="建立新的設定檔庫"
                        >
                            <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">新建檔案</span>
                        </button>

                        {/* 2. Append */}
                        <button
                            onClick={handleAppendToExisting}
                            className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20"
                            title="加入到現有的設定檔庫"
                        >
                            <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">加入現有</span>
                        </button>

                        {/* 3. Load */}
                        <button
                            onClick={loadLibraryFromFile}
                            className="px-4 py-3 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50 border-2 border-slate-200 dark:border-slate-600 border-dashed rounded-xl text-slate-600 dark:text-slate-300 font-bold transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                        >
                            <FileUp className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">載入設定檔</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
