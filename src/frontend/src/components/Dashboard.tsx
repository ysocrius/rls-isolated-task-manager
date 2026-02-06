import { useState } from 'react';
import { PacketCapsule } from './PacketCapsule';
import { TerminalInput } from './TerminalInput';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
    const { tasks, createTask, deleteTask, updateTitle, updateDescription, toggleStatus } = useTasks();
    const { signOut } = useAuth();
    const [showAll, setShowAll] = useState(true);

    const handleCreateTask = createTask;
    const handleDeleteTask = deleteTask;
    const handleUpdateTitle = updateTitle;
    const handleUpdateDescription = updateDescription;
    const handleToggleStatus = toggleStatus;

    // Stack Sorting: Pending (Anomalies) Top, Completed Bottom
    const sortedTasks = [...tasks]
        .filter(t => showAll || t.status === 'pending') // Apply filter based on showAll
        .sort((a, b) => {
            // If statuses are different, pending comes first
            if (a.status !== b.status) {
                return a.status === 'pending' ? -1 : 1;
            }
            // If statuses are the same, sort by creation date (newest first)
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });

    // Derived Stats
    const activeThreats = tasks.filter(t => t.status === 'pending').length;

    return (
        <div className={`
      min-h-screen p-8 transition-colors duration-700
      ${activeThreats > 0 ? 'bg-orange-50' : 'bg-stone-50'}
    `}>
            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">

                {/* Header */}
                <div className="col-span-12 flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg transition-colors
              ${activeThreats > 0 ? 'bg-orange-900 text-orange-400' : 'bg-emerald-900 text-emerald-400'}
            `}>
                            🛡️
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-sans tracking-tight text-emerald-900">Global Trends</h1>
                            <p className="font-mono text-sm text-stone-500">Task Manager</p>
                        </div>
                    </div>
                    {/* Header Actions */}
                    <div className="glass-card px-6 py-3 rounded-full flex items-center gap-4">
                        <span className="font-sans font-semibold text-sm uppercase tracking-wider text-emerald-900">
                            Focus Filter
                        </span>
                        <div
                            onClick={() => setShowAll(!showAll)}
                            className={`
                            relative w-16 h-8 rounded-full cursor-pointer transition-colors duration-300 ease-in-out
                            ${!showAll ? 'bg-emerald-500 shadow-inner' : 'bg-stone-300 shadow-inner'}
                        `}
                        >
                            <div
                                className={`
                                absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300
                                ${!showAll ? 'translate-x-8' : 'translate-x-0'}
                            `}
                            />
                        </div>
                        {/* Logout Button */}
                        <button
                            onClick={signOut}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-200 text-stone-600 hover:bg-red-100 hover:text-red-500 transition-colors"
                            title="Disconnect Session"
                        >
                            ⏻
                        </button>
                    </div>
                </div>

                {/* Main Stage: Task Stack */}
                <div className="col-span-12 lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between pl-2 pr-4 mb-2">
                        <h2 className="text-xl font-bold font-sans text-emerald-900 tracking-tight">Task Board</h2>
                        <div className="font-mono text-xs text-stone-400">PENDING_TASKS: {activeThreats}</div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl min-h-[600px] relative flex flex-col">

                        {/* Injection Terminal */}
                        <TerminalInput onTaskCreate={handleCreateTask} />

                        {/* The Stack */}
                        <div className="space-y-2 relative flex-1 overflow-y-auto no-scrollbar">
                            {sortedTasks.length === 0 && (
                                <div className="text-center mt-20 text-stone-400 font-mono">
                                    No active tasks...
                                </div>
                            )}

                            {sortedTasks.map((task) => (
                                <div key={task._id} className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <PacketCapsule
                                        task={task}
                                        onToggleStatus={handleToggleStatus}
                                        onDelete={handleDeleteTask}
                                        onUpdateTitle={handleUpdateTitle}
                                        onUpdateDescription={handleUpdateDescription}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Analytics */}
                <div className="col-span-12 lg:col-span-4 space-y-6">

                    {/* Task Velocity Barcode */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-lg font-bold font-sans text-emerald-900 mb-4">Task Velocity</h3>
                        <div className="flex items-end justify-between h-32 w-full gap-1 p-4 bg-stone-50 rounded-lg border border-stone-200 shadow-inner overflow-hidden">
                            {/* Fill remaining slots with ghost data if visible tasks < 40 */}
                            {Array.from({ length: Math.max(0, 40 - tasks.length) }).map((_, i) => (
                                <div
                                    key={`ghost-${i}`}
                                    className="w-1.5 rounded-t-sm bg-stone-300"
                                    style={{
                                        height: `${10 + Math.random() * 20}%`,
                                        opacity: 0.1
                                    }}
                                />
                            ))}
                            {/* Render Actual Tasks */}
                            {tasks.slice(0, 40).map((task) => (
                                <div
                                    key={task._id}
                                    className={`w-1.5 rounded-t-sm transition-all duration-500 ${task.status === 'pending' ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                    style={{
                                        // Pseudo-random height based on char code of last ID char to keep it deterministic but "techy"
                                        height: `${30 + (task._id.charCodeAt(task._id.length - 1) % 70)}%`,
                                        opacity: task.status === 'pending' ? 0.9 : 0.6
                                    }}
                                />
                            ))}
                        </div>
                        <div className="mt-4 flex justify-between text-xs font-mono text-stone-400">
                            <span>Recent</span>
                            <span>Task History</span>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card p-4 rounded-xl">
                            <div className="text-stone-500 text-xs font-mono mb-1">TOTAL_TASKS</div>
                            <div className="text-3xl font-bold font-sans text-emerald-900">
                                {tasks.length}
                            </div>
                        </div>
                        <div className="glass-card p-4 rounded-xl">
                            <div className="text-stone-500 text-xs font-mono mb-1">PENDING</div>
                            <div className={`text-3xl font-bold font-sans ${activeThreats > 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                {activeThreats}
                            </div>
                        </div>
                    </div>

                    {/* Status Console - Recent Activity */}
                    <div className="glass-card p-4 rounded-xl font-mono text-xs text-stone-600 h-48 overflow-y-auto">
                        <div className="mb-2 font-bold text-stone-400"># SECURITY_LOG</div>
                        {tasks.slice(0, 6).map(t => (
                            <div key={t._id} className="mb-1 truncate">
                                <span className={t.status === 'pending' ? 'text-orange-600' : 'text-emerald-600'}>
                                    {t.status === 'pending' ? '[TODO] ' : '[DONE] '}
                                </span>
                                {t.title}
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </div>
    );
};
