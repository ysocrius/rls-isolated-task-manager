import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { session, loading } = useAuth();

    if (loading) {
        // Loading State (Splash)
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-900 rounded-xl flex items-center justify-center text-2xl animate-pulse">
                        🛡️
                    </div>
                    <div className="font-mono text-xs text-stone-400">VERIFYING_CREDENTIALS...</div>
                </div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
