'use client';

import { useState, useEffect } from 'react';
import { Lock, Unlock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CREDENTIALS = {
    id: 'aaccda777',
    pw: 'rkdaltnr77!@'
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [input, setInput] = useState({ id: '', pw: '' });
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const auth = sessionStorage.getItem('myeongsim_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.id === CREDENTIALS.id && input.pw === CREDENTIALS.pw) {
            sessionStorage.setItem('myeongsim_auth', 'true');
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
            // Shake effect logic handled by framer-motion via key change or state
        }
    };

    if (isLoading) return null; // Blink prevention

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center p-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary-olive/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-sm bg-deep-slate border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-xl"
                >
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 bg-primary-olive/20 rounded-full flex items-center justify-center mb-4 text-primary-olive">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-serif font-bold text-white tracking-widest uppercase">Myeongsim Access</h1>
                        <p className="text-xs text-gray-500 mt-2">Authorized Personnel Only</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 font-bold ml-1">ID</label>
                            <input
                                type="text"
                                value={input.id}
                                onChange={(e) => setInput({ ...input, id: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-olive transition-colors placeholder:text-gray-700"
                                placeholder="Enter ID"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 font-bold ml-1">PASSWORD</label>
                            <input
                                type="password"
                                value={input.pw}
                                onChange={(e) => setInput({ ...input, pw: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-olive transition-colors placeholder:text-gray-700"
                                placeholder="Enter Password"
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-500 text-xs text-center font-bold"
                            >
                                접근 권한이 없습니다. 아이디와 비밀번호를 확인하세요.
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-primary-olive text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(101,140,66,0.3)] hover:bg-[#7da855] hover:shadow-[0_0_30px_rgba(101,140,66,0.5)] transition-all mt-4 flex items-center justify-center gap-2 group"
                        >
                            <span>ACCESS SYSTEM</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}
