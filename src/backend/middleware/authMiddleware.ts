import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient';

// Extend Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get Token from Header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Bearer token missing' });
    }

    try {
        // 2. Verify Token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error('Auth Error:', error);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // 3. Attach User to Request
        req.user = user;
        next();
    } catch (err) {
        console.error('Middleware Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
