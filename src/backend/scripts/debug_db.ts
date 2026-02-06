
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load Env from Root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

console.log('Connecting to:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log('--- INSPECTING TASKS ---');
    const { data, error } = await supabase
        .from('tasks')
        .select('*'); // Select ALL columns

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (!data || data.length === 0) {
        console.log('No tasks found.');
        return;
    }

    console.log(`Found ${data.length} tasks.`);
    data.forEach(t => {
        console.log(`ID: ${t._id} | UserID: ${t.user_id} | Title: ${t.title}`);
    });
}

inspect();
