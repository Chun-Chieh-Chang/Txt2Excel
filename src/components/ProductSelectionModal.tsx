import React from 'react';
import { X, Check, Edit2, Trash2 } from 'lucide-react';
import { Profile } from '../types';

interface ProductSelectionModalProps {
    isOpen: boolean;
    profiles: Profile[]; // The loaded library
    onConfirm: (selected: Profile[]) => void;
    onCancel: () => void;
    title?: string;
    onRename?: (id: string, newName: string) => Promise<void> | void;
    onDelete?: (id: string) => Promise<void> | void; // Add optional delete callback
}

export default function ProductSelectionModal({
    isOpen,
    profiles,
    onConfirm,
    onCancel,
    title = '選擇要套用的產品設定',
    onRename,
    onDelete
}: ProductSelectionModalProps) {
    // Single selection state
    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    // State for renaming
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [tempName, setTempName] = React.useState('');

    // Reset selection when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setSelectedId(null);
            setEditingId(null); // Also reset editing state
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSelect = (id: string) => {
        // Toggle or enforced switch? Let's just switch.
        setSelectedId(id === selectedId ? null : id);
    };

    const handleConfirm = () => {
        if (!selectedId) return;
        const selected = profiles.filter(p => p.id === selectedId);
        onConfirm(selected);
    };

    const startEditing = (e: React.MouseEvent, profile: Profile) => {
        e.stopPropagation(); // prevent selection
        setEditingId(profile.id);
        setTempName(profile.name);
    };

    const saveEditing = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onRename && editingId) {
            await onRename(editingId, tempName);
        }
        setEditingId(null);
    };

    const cancelEditing = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(null);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!onDelete) return;

        const profile = profiles.find(p => p.id === id);
        if (!profile) return;

        if (confirm(`確定要刪除設定檔「${profile.name}」嗎？\n\n此操作將永久修改檔案，無法復原。`)) {
            await onDelete(id);
            // If the deleted profile was selected, clear selection
            if (selectedId === id) {
                setSelectedId(null);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            {/* Modal Container: Using CSS Grid with minmax(0,1fr) to FORCE content shrinking */}
            <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-rows-[auto_minmax(0,1fr)_auto] max-h-[85vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 z-10">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            {title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            此檔案包含多個設定檔，請勾選要套用的項目
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* List: Scrollable Area */}
                <div className="overflow-y-auto p-4 space-y-2">
                    {profiles.map(profile => {
                        const isSelected = profile.id === selectedId;
                        const isEditing = profile.id === editingId;

                        return (
                            <div
                                key={profile.id}
                                onClick={() => !isEditing && handleSelect(profile.id)}
                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isSelected
                                    ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-500/50'
                                    : 'bg-white border-slate-200 hover:border-indigo-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${isSelected
                                        ? 'bg-indigo-600 border-indigo-600'
                                        : 'bg-white border-slate-300 dark:bg-slate-700 dark:border-slate-500'
                                        }`}>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {isEditing ? (
                                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                                <input
                                                    type="text"
                                                    value={tempName}
                                                    onChange={e => setTempName(e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                                    autoFocus
                                                />
                                                <button onClick={saveEditing} className="p-1 text-green-600 hover:bg-green-100 rounded">
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button onClick={cancelEditing} className="p-1 text-red-500 hover:bg-red-100 rounded">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="group flex items-center gap-2">
                                                <div className="font-bold text-slate-700 dark:text-slate-200 truncate">
                                                    {profile.name}
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {onRename && (
                                                        <button
                                                            onClick={(e) => startEditing(e, profile)}
                                                            className="p-1 text-slate-400 hover:text-indigo-600"
                                                            title="修改名稱"
                                                        >
                                                            <Edit2 className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                    {onDelete && (
                                                        <button
                                                            onClick={(e) => handleDelete(e, profile.id)}
                                                            className="p-1 text-slate-400 hover:text-red-600"
                                                            title="刪除設定檔"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="text-xs text-slate-400 mt-0.5">
                                            {profile.rules.length} 條規則 • {new Date(profile.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {profiles.length === 0 && (
                        <div className="text-center py-8 text-slate-400">
                            (此檔案中沒有有效的設定檔)
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 z-10">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedId}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <span>確認載入</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

