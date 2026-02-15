
import React from 'react';
import { Profile } from '../types';

interface ProductSelectionModalProps {
    isOpen: boolean;
    profiles: Profile[];
    onConfirm: (selected: Profile[]) => void;
    onCancel: () => void;
    title?: string;
    onRename?: (id: string, newName: string) => Promise<void> | void;
    onDelete?: (id: string) => Promise<void> | void;
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
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [tempName, setTempName] = React.useState('');

    React.useEffect(() => {
        if (isOpen) {
            setSelectedId(null);
            setEditingId(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSelect = (id: string) => {
        setSelectedId(id === selectedId ? null : id);
    };

    const handleConfirm = () => {
        if (!selectedId) return;
        const selected = profiles.filter(p => p.id === selectedId);
        onConfirm(selected);
    };

    const startEditing = (e: React.MouseEvent, profile: Profile) => {
        e.stopPropagation();
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
            if (selectedId === id) setSelectedId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A202C66] backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden grid grid-rows-[auto_minmax(0,1fr)_auto] max-h-[85vh] animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-[#E6E8EB] flex justify-between items-center">
                    <div>
                        <h3 className="text-[20px] font-bold text-[#333333]">{title}</h3>
                        <p className="text-[13px] text-[#888888] mt-1">請勾選要套用的設定項目</p>
                    </div>
                </div>

                <div className="overflow-y-auto p-6 flex flex-col gap-3 custom-scrollbar">
                    {profiles.map(profile => {
                        const isSelected = profile.id === selectedId;
                        const isEditing = profile.id === editingId;

                        return (
                            <div
                                key={profile.id}
                                onClick={() => !isEditing && handleSelect(profile.id)}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                    ? 'bg-[#EEF2FF] border-[#2D76FC]'
                                    : 'bg-[#F8FAFC] border-[#E6E8EB] hover:border-[#2D76FC]'
                                    }`}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${isSelected
                                        ? 'bg-[#2D76FC] border-[#2D76FC]'
                                        : 'bg-white border-[#CBD5E0]'
                                        }`}>
                                        {isSelected && <i className="ri-check-line text-white text-[10px]"></i>}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {isEditing ? (
                                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                                <input
                                                    type="text"
                                                    value={tempName}
                                                    onChange={e => setTempName(e.target.value)}
                                                    className="w-full px-2 py-1 text-[14px] border border-[#2D76FC] rounded focus:outline-none bg-white"
                                                    autoFocus
                                                />
                                                <button onClick={saveEditing} className="p-1 text-[#00A8A8] hover:bg-[#F0FFFF] rounded">
                                                    <i className="ri-check-line font-bold"></i>
                                                </button>
                                                <button onClick={cancelEditing} className="p-1 text-[#F56565] hover:bg-[#FFF5F5] rounded">
                                                    <i className="ri-close-line font-bold"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="group flex items-center gap-2 font-bold text-[#333333]">
                                                <div className="truncate text-[15px]">{profile.name}</div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {onRename && (
                                                        <button
                                                            onClick={(e) => startEditing(e, profile)}
                                                            className="p-1 text-[#888888] hover:text-[#2D76FC]"
                                                        >
                                                            <i className="ri-edit-line"></i>
                                                        </button>
                                                    )}
                                                    {onDelete && (
                                                        <button
                                                            onClick={(e) => handleDelete(e, profile.id)}
                                                            className="p-1 text-[#888888] hover:text-[#F56565]"
                                                        >
                                                            <i className="ri-delete-bin-line"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        <div className="text-[12px] text-[#A0AEC0] mt-0.5 font-medium">
                                            {profile.rules.length} 條規則 • {new Date(profile.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {profiles.length === 0 && (
                        <div className="text-center py-10 text-[#A0AEC0] italic text-[14px]">
                            此檔案中沒有有效的設定檔
                        </div>
                    )}
                </div>

                <div className="px-8 py-5 bg-[#F8FAFC] border-t border-[#E6E8EB] flex justify-end gap-3 rounded-b-2xl">
                    <button
                        onClick={onCancel}
                        className="py-2.5 px-6 rounded-xl border border-[#E6E8EB] bg-white text-[#333333] font-bold text-[14px] hover:bg-[#F8FAFC]"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedId}
                        className="py-2.5 px-6 rounded-xl bg-[#2D76FC] text-white font-bold text-[14px] shadow-[0_10px_20px_rgba(45,118,252,0.2)] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                    >
                        確認載入
                    </button>
                </div>
            </div>
        </div>
    );
}
