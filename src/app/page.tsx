'use client';

import React, { useState } from 'react';
import { Lock, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function HomePage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedUser = username.trim();
        const trimmedPass = password.trim();

        if (!trimmedUser || !trimmedPass) {
            setErrorMsg('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            const res = await fetch('/api/gate/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: trimmedUser, password: trimmedPass })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Save access locally
                try {
                    localStorage.setItem('myeongsim_site_access', 'granted');
                } catch (e) {}
                document.cookie = "myeongsim_site_access=granted; path=/; max-age=2592000; SameSite=Lax";
                document.cookie = "myeongsim_site_access_client=granted; path=/; max-age=2592000; SameSite=Lax";

                // Direct jump to main report
                window.location.href = '/report';
            } else {
                setErrorMsg(data.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
            }
        } catch (err) {
            setErrorMsg('인증 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-amber-400 selection:text-slate-950">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Main Card */}
            <div className="w-full max-w-md bg-slate-900/95 border-2 border-amber-400/40 rounded-3xl p-7 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl relative z-10 animate-fade-in-up">
                {/* Header Icon */}
                <div className="flex flex-col items-center text-center mb-7">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.5)] border border-amber-200 mb-4 animate-pulse">
                        <Lock className="w-8 h-8 stroke-[2.5]" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold font-mono mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>GRAND OPENING SOON</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                        아직 앱 스타트 준비 중입니다
                    </h1>

                    <p className="text-xs sm:text-sm text-gray-300/80 mt-2.5 leading-relaxed break-keep">
                        현재 명심코칭 공식 서비스 런칭을 위한 최종 완성도 점검 및 비공개 사전 테스트 중입니다. 사전 승인된 계정으로 로그인해 주세요.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1.5 ml-1">
                            접속 아이디 (ID)
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="아이디를 입력하세요"
                            className="w-full px-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm font-medium transition-all"
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1.5 ml-1">
                            접속 비밀번호 (PW)
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            className="w-full px-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm font-medium transition-all"
                            disabled={loading}
                        />
                    </div>

                    {/* Error Notice */}
                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs font-bold animate-shake">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-base shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                    >
                        {loading ? (
                            <span className="inline-block w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>명심코칭 입장하기</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Notice */}
                <div className="mt-7 pt-5 border-t border-white/10 text-center">
                    <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>명심코칭 마인드 웰니스 보안 게이트웨이</span>
                    </p>
                </div>
            </div>

            {/* Bottom Copyright */}
            <p className="text-[11px] text-gray-400/60 mt-6 text-center">
                © 2026 MYONGSIM COACHING. All Rights Reserved.
            </p>
        </div>
    );
}
