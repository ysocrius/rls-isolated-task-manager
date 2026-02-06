import { memo, useState, useEffect, useRef } from 'react';
import type { Task } from '../types';

interface PacketCapsuleProps {
    task: Task;
    onToggleStatus: (id: string, currentStatus: 'pending' | 'completed') => void;
    onDelete: (id: string) => void;

    onUpdateTitle: (id: string, newTitle: string) => void;
    onUpdateDescription: (id: string, newDescription: string) => void;
}

export const PacketCapsule = memo(({ task, onToggleStatus, onDelete, onUpdateTitle, onUpdateDescription }: PacketCapsuleProps) => {
    const isPending = task.status === 'pending';
    const [isEditing, setIsEditing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description || '');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleStartEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleSave = () => {
        if (editTitle.trim() && editTitle !== task.title) {
            onUpdateTitle(task._id, editTitle);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setEditTitle(task.title);
            setIsEditing(false);
        }
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setEditTitle(task.title);
            setIsEditing(false);
        }
    };

    const handleDescBlur = () => {
        if (editDesc !== task.description) {
            onUpdateDescription(task._id, editDesc);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(task._id);
    };

    return (
        <div className="mb-3 transition-all duration-300 ease-out group relative">
            {/* Main Capsule */}
            <div
                onClick={() => onToggleStatus(task._id, task.status)}
                className={`
          flex items-center justify-between px-4 py-3 rounded-t-full 
          ${isExpanded ? 'rounded-b-none' : 'rounded-b-full'}
          cursor-pointer font-mono text-sm border 
          ${isPending
                        ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-md hover:shadow-orange-500/20'
                        : 'bg-emerald-50/50 border-emerald-500/50 text-emerald-700/70 hover:opacity-100 opacity-60'}
        `}>
                {/* Delete Action (Mobile: Always Visible | Desktop: Hover) */}

                <div className="flex items-center gap-4 overflow-hidden">
                    {/* Protocol Slot -> Static Tag */}
                    <span className={`
    font - bold text - xs px - 2 py - 0.5 rounded
          ${isPending ? 'bg-orange-200 text-orange-800' : 'bg-emerald-200 text-emerald-800'}
    `}>
                        TASK
                    </span>

                    {/* Source IP Slot -> Task Title */}
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-transparent border-b border-stone-500 focus:outline-none font-semibold w-[200px] md:w-[400px] text-emerald-900"
                        />
                    ) : (
                        <span
                            onClick={(e) => e.stopPropagation()}
                            onDoubleClick={handleStartEdit}
                            className="font-semibold truncate max-w-[200px] md:max-w-[400px] cursor-text hover:underline decoration-dashed decoration-stone-400 underline-offset-4"
                            title="Double-click to edit"
                        >
                            {task.title}
                        </span>
                    )}
                </div>

                {/* Size Slot -> Priority/Action */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold opacity-60 group-hover:opacity-100 transition-opacity hidden sm:inline mr-2">
                        {isPending ? 'HIGH_PRIORITY' : 'SECURE'}
                    </span>

                    {/* Delete Action (Now Inline & Visible) */}
                    <button
                        onClick={handleDelete}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                        title="Terminate Process"
                    >
                        ×
                    </button>

                    {/* Expand Chevron */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200/50 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    >
                        ▼
                    </button>
                </div>
            </div>

            {/* Payload Inspector (Description) */}
            {isExpanded && (
                <div className={`
    rounded - b - 2xl border - x border - b p - 4 text - xs font - mono shadow - inner
                    ${isPending ? 'bg-orange-100/50 border-orange-500 text-orange-900' : 'bg-emerald-100/50 border-emerald-500 text-emerald-900'}
    `}>
                    <div className="flex gap-4">
                        <div className="opacity-50 select-none">
                            0x0000<br />0x0010<br />0x0020
                        </div>
                        <div className="flex-1">
                            <div className="opacity-50 mb-1 font-bold">TASK_DESCRIPTION:</div>
                            <textarea
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                onBlur={handleDescBlur}
                                onClick={(e) => e.stopPropagation()}
                                placeholder="[EMPTY_PACKET_DATA] - Click to add description..."
                                className="w-full bg-transparent resize-none focus:outline-none border-b border-transparent focus:border-stone-400/50 h-[4.5em]"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});
