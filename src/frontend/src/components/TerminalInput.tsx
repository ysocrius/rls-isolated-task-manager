import { useState, type KeyboardEvent } from 'react';

interface TerminalInputProps {
    onTaskCreate: (title: string) => void;
}

export const TerminalInput = ({ onTaskCreate }: TerminalInputProps) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            onTaskCreate(input.trim());
            setInput('');
        }
    };

    return (
        <div className="bg-stone-900 rounded-lg p-4 mb-4 shadow-inner flex items-center gap-3 font-mono text-sm border border-stone-800">
            {/* Command Prompt */}
            <div className="flex items-center gap-3 w-full font-mono text-sm max-w-[90%]">
                <span className="text-emerald-500 font-bold hidden sm:inline select-none">user@session:~$</span>
                <span className="text-emerald-500 font-bold sm:hidden select-none">➜</span>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-stone-200 font-bold placeholder-stone-600 caret-white tracking-widest"
                    placeholder="Enter new task..."
                    autoComplete="off"
                    autoFocus
                />
            </div>
        </div>
    );
};
