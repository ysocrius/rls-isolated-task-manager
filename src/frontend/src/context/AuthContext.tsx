import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createClient, type Session, type User, type SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Frontend)
// Initialize Supabase Client (Frontend)
// Vercel / Vite Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase Env Vars in Frontend');
    // Fallback to empty string to prevent crash at runtime, but auth will fail
}

export const supabase: SupabaseClient = createClient(supabaseUrl || '', supabaseKey || '');

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signInWithPassword: (email: string, password: string) => Promise<{ error: any }>;
    signUpWithPassword: (email: string, password: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    signInDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithPassword = async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({ email, password });
    };

    const signUpWithPassword = async (email: string, password: string) => {
        return await supabase.auth.signUp({
            email,
            password,
            options: {
                // If email confirmation is on, this is needed. 
                // If off, they get signed in immediately.
                // We'll assume standard flow.
            }
        });
    };

    const signInDemo = async () => {
        const demoUser: User = {
            id: 'demo-user-123',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
        } as User;

        const demoSession: Session = {
            access_token: 'demo-token',
            refresh_token: 'demo-refresh',
            expires_in: 3600,
            token_type: 'bearer',
            user: demoUser
        };

        setSession(demoSession);
        setUser(demoUser);
    };

    const signOut = async () => {
        // Clear Supabase session if exists, else just clear local state for demo
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signInWithPassword, signUpWithPassword, signOut, signInDemo }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
