import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import type { Task } from '../types';
import { useAuth } from './AuthContext';

interface TaskContextType {
    tasks: Task[];
    createTask: (title: string) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    updateTitle: (id: string, title: string) => Promise<void>;
    updateDescription: (id: string, description: string) => Promise<void>;
    toggleStatus: (id: string, currentStatus: 'pending' | 'completed') => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Use relative path for Vercel (rewrites) & Local (proxy)
const API_URL = '/api/tasks';

export const TaskProvider = ({ children }: { children: ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const { session } = useAuth();

    // Helper to get auth headers
    const getAuthHeaders = () => {
        return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
    };

    const fetchTasks = async () => {
        if (!session) return;
        try {
            const { data } = await axios.get(API_URL, { headers: getAuthHeaders() });
            setTasks(data);
        } catch (err) {
            console.error('Failed to fetch tasks', err);
        }
    };

    useEffect(() => {
        if (!session) {
            setTasks([]); // Clear cache on logout
        } else {
            fetchTasks();
        }
    }, [session]);

    const createTask = async (title: string) => {
        try {
            const { data } = await axios.post(API_URL, { title }, { headers: getAuthHeaders() });
            setTasks(prev => [data, ...prev]);
        } catch (err) {
            console.error('Injection failed', err);
        }
    };

    const deleteTask = async (id: string) => {
        setTasks(prev => prev.filter(t => t._id !== id));
        try {
            await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
        } catch (err) {
            console.error('Purge failed', err);
            fetchTasks();
        }
    };

    const updateTitle = async (id: string, newTitle: string) => {
        setTasks(prev => prev.map(t =>
            t._id === id ? { ...t, title: newTitle } : t
        ));
        try {
            await axios.put(`${API_URL}/${id}`, { title: newTitle }, { headers: getAuthHeaders() });
        } catch (err) {
            console.error('Rename failed', err);
            fetchTasks();
        }
    };

    const updateDescription = async (id: string, newDescription: string) => {
        setTasks(prev => prev.map(t =>
            t._id === id ? { ...t, description: newDescription } : t
        ));
        try {
            await axios.put(`${API_URL}/${id}`, { description: newDescription }, { headers: getAuthHeaders() });
        } catch (err) {
            console.error('Payload update failed', err);
            fetchTasks();
        }
    };

    const toggleStatus = async (id: string, currentStatus: 'pending' | 'completed') => {
        const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
        setTasks(prev => prev.map(t =>
            t._id === id ? { ...t, status: newStatus } : t
        ));
        try {
            await axios.put(`${API_URL}/${id}`, { status: newStatus }, { headers: getAuthHeaders() });
        } catch (err) {
            console.error('Mitigation failed', err);
            fetchTasks();
        }
    };

    return (
        <TaskContext.Provider value={{
            tasks,
            createTask,
            deleteTask,
            updateTitle,
            updateDescription,
            toggleStatus
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};
