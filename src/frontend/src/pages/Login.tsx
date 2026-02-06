import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error' | 'success'>('idle');
    const [msg, setMsg] = useState('');

    const { signInWithPassword, signUpWithPassword, signInDemo } = useAuth();
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMsg('');

        try {
            if (mode === 'signup') {
                const { error } = await signUpWithPassword(email, password);
                if (error) throw error;
                // Supabase might require email confirmation, but usually returns user.
                setStatus('success');
                setMsg('Account created! Please sign in (or check email if confirmation is on).');
                setMode('signin');
            } else {
                const { error } = await signInWithPassword(email, password);
                if (error) throw error;
                navigate('/');
            }
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setMsg(error.message || 'Authentication failed');
        } finally {
            if (status !== 'success') setStatus('idle');
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F4] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-stone-100">
                    <div className="mb-8 text-center">
                        <div className="w-16 h-16 bg-emerald-900 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-900/20">
                            <span className="text-2xl">🛡️</span>
                        </div>
                        <h1 className="text-2xl font-bold text-emerald-950 tracking-tight">
                            Security Clearance
                        </h1>
                        <p className="text-xs font-mono text-emerald-600/60 mt-2 tracking-widest uppercase">
                            GLOBAL_TRENDS // ACCESS_CONTROL
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">
                                Identity
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="agent@dnsclick.com"
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">
                                Passcode
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono text-sm"
                                required
                            />
                        </div>

                        <div className="h-4"></div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-emerald-900 hover:bg-emerald-800 text-emerald-50 font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-emerald-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {status === 'loading' ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {mode === 'signin' ? 'ACCESS SERVER' : 'REGISTER AGENT'} <span className="text-emerald-400">→</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Mode Toggle */}
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            className="text-xs text-stone-400 hover:text-emerald-700 font-mono transition-colors"
                        >
                            {mode === 'signin'
                                ? "NEW AGENT? // INITIALIZE_REGISTRATION"
                                : "EXISTING AGENT? // RETURN_TO_LOGIN"}
                        </button>
                    </div>


                    {/* Guest Access Divider */}
                    {status !== 'loading' && (
                        <div className="mt-6 pt-6 border-t border-stone-100">
                            <button
                                onClick={() => {
                                    signInDemo();
                                    navigate('/');
                                }}
                                className="w-full py-2 text-stone-500 hover:text-emerald-600 text-xs font-mono border border-dashed border-stone-300 rounded-lg hover:border-emerald-300 transition-colors flex items-center justify-center gap-2"
                            >
                                <span>🤖</span> INITIATE_GUEST_PROTOCOL
                            </button>
                        </div>
                    )}

                    {(status === 'error' || msg) && (
                        <div className={`mt-4 p-3 ${status === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'} text-xs rounded-lg text-center font-mono border`}>
                            {status === 'error' ? 'ACCESS_DENIED: ' : 'SYSTEM: '} {msg}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
