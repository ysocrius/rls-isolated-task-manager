
import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';

// Get Tasks (Filtered by User)
export const getTasks = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    // Security Check
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId) // RLS Logic
        .order('createdAt', { ascending: false });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
};

// Create Task (With Owner)
export const createTask = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { title, description } = req.body;
    const { data, error } = await supabase
        .from('tasks')
        .insert([{
            title,
            description,
            user_id: userId // Associate with Owner
        }])
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};

// Update Task (Owner Only)
export const updateTask = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    const { data, error } = await supabase
        .from('tasks')
        .update(req.body)
        .eq('_id', id)
        .eq('user_id', userId) // Ensure Ownership
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};

// Delete Task (Owner Only)
export const deleteTask = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('_id', id)
        .eq('user_id', userId); // Ensure Ownership

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ message: 'Task deleted' });
};
