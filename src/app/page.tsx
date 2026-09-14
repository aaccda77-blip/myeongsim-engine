'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Sparkles, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function HomePage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [checkingExistingAuth, setCheckingExistingAuth] = useState(true);

    // 이미 게이트를 통과했거나 관리자 세션이 있는 경우 즉시 /report로 자동 이동
    useEffect(() => {
        let isCancelled = false;

        const checkAuthAndRedirect = async () => {
            try {
                const localAccess = typeof window !== 'undefined' && localStorage.getItem('myeongsim_site_access') === 'granted';
                const hasCookie = typeof document !== 'undefined' && (
                    document.cookie.includes('myeongsim_site_access=granted') ||
                    document.cookie.includes('myeongsim_site_access_client=granted') ||
                    document.cookie.includes('admin_session=')
                );

                if (localAccess || hasCookie) {
                    window.location.href = '/report';
                    return;
                }

                // httpOnly 쿠키 확인을 위해 서버 GET 확인
                const res = await fetch('/api/gate/verify', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.hasAccess && !isCancelled) {
                        try {
                            localStorage.setItem('myeongsim_site_access', 'granted');
                        } catch (e) {}
                        window.location.href = '/report';
                        return;
                    }
                }
            } catch (e) {
                console.warn('[HomePage] auth check exception:', e);
            } finally {
                if (!isCancelled) setCheckingExistingAuth(false);
            }
        };

        checkAuthAndRedirect();

        return () => {
            isCancelled = true;
        };
    }, []);

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
                    localStorage.setItem('user_name', trimmedUser);
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

            {/* 📣 도서 구매 독자 VIP 혜택 안내 카드 */}
            <div className="w-full max-w-md mt-5 relative z-10">
                <div className="bg-gradient-to-br from-amber-950/60 via-slate-900/80 to-purple-950/60 border border-amber-400/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(245,158,11,0.15)] backdrop-blur-xl">
                    {/* 상단 뱃지 */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-black font-mono tracking-widest">
                            <Sparkles className="w-3 h-3" />
                            <span>BOOK READER EXCLUSIVE</span>
                        </div>
                    </div>

                    {/* 제목 */}
                    <h2 className="text-white font-black text-base sm:text-lg leading-tight mb-2 break-keep">
                        📖 도서 구매 독자님을 위한<br />
                        <span className="text-amber-400">프라이빗 회원제 혜택 안내</span>
                    </h2>

                    {/* 본문 */}
                    <p className="text-gray-300/85 text-[12px] sm:text-xs leading-relaxed break-keep mb-4">
                        보다 깊이 있는 밀착 코칭과 최상의 서비스 품질을 위해,
                        회원님들의 소중한 요청에 따라 <span className="text-amber-300 font-bold">임시적으로 프라이빗 회원제</span>로 전환 운영 중입니다.
                        <br /><br />
                        <span className="text-white font-bold">도서를 구매하신 독자 회원님께서는</span> 책에 수록된
                        <span className="text-amber-300 font-bold"> 오픈 혜택 이벤트를 그대로 100% 온전히 받아보실 수 있도록</span> 아래 창구를 통해 개별 케어 중입니다.
                    </p>

                    {/* 연락처 목록 */}
                    <div className="space-y-2.5">
                        <a
                            href="mailto:mindflowlabbooks@naver.com"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/10 transition-all group"
                        >
                            <span className="text-lg">✉️</span>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold">이메일 문의</p>
                                <p className="text-amber-300 text-xs font-mono font-bold group-hover:text-amber-200">mindflowlabbooks@naver.com</p>
                            </div>
                        </a>

                        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-white/10">
                            <span className="text-lg">💬</span>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold">카카오톡 1:1 오픈채팅 문의</p>
                                <p className="text-yellow-300 text-xs font-bold">카카오톡 오픈채팅으로 문의해주세요</p>
                            </div>
                        </div>

                        <a
                            href="tel:010-9114-2352"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-white/10 hover:border-green-400/50 hover:bg-green-400/5 transition-all group"
                        >
                            <span className="text-lg">📞</span>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold">긴급 직통 문의</p>
                                <p className="text-green-300 text-xs font-mono font-bold group-hover:text-green-200">010-9114-2352</p>
                                <p className="text-[10px] text-gray-500">부재 시 문자를 남겨주시면 확인 즉시 연락드립니다</p>
                            </div>
                        </a>
                    </div>

                    {/* 하단 마무리 문구 */}
                    <p className="mt-4 text-center text-[11px] text-gray-400/70 border-t border-white/10 pt-3 break-keep">
                        변함없는 관심과 성원에 진심으로 감사드립니다 🙏
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
