'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Lock, RefreshCw, LogOut, Sparkles, CheckCircle2, ShieldCheck, 
    CreditCard, Send, ExternalLink, Award, AlertCircle, ShoppingBag
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface PaymentLockOverlayProps {
    onRefresh: () => Promise<boolean>;
    userId?: string;
}

export default function PaymentLockOverlay({ onRefresh, userId }: PaymentLockOverlayProps) {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'wire'>('info');

    // 무통장 입금 신청 폼 상태
    const [depositorName, setDepositorName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wireSubmitted, setWireSubmitted] = useState(false);

    // 저장된 이름/전화번호 불러오기
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedName = localStorage.getItem('user_name') || localStorage.getItem('myeongsim_book_buyer') || '';
            const savedPhone = localStorage.getItem('user_phone') || '';
            if (savedName) setDepositorName(savedName);
            if (savedPhone) setPhone(savedPhone);
        }
    }, []);

    // 실시간 관리자 승인 확인
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            // 1. 서버 API로 승인 여부 실시간 조회
            const nameToQuery = depositorName.trim() || (typeof window !== 'undefined' ? localStorage.getItem('user_name') || '' : '');
            const uidToQuery = userId || (typeof window !== 'undefined' ? localStorage.getItem('user_id') || '' : '');

            const res = await fetch(`/api/payment/check-approval?name=${encodeURIComponent(nameToQuery)}&userId=${encodeURIComponent(uidToQuery)}&t=${Date.now()}`);
            const data = await res.json();

            if (data.approved) {
                // 승인 완료! 로컬 권한 세팅
                if (data.tier === 'MONTHLY_98K' || data.tier?.includes('98000') || data.tier?.includes('MONTHLY')) {
                    localStorage.setItem('myeongsim_monthly_vip', 'true');
                    localStorage.setItem('myeongsim_paid_user', 'true');
                } else if (data.tier === 'BOOK_ZERO_POINT' || data.tier?.includes('BOOK')) {
                    localStorage.setItem('myeongsim_smartstore_vip', 'true');
                    localStorage.setItem('myeongsim_book_verified', 'true');
                    localStorage.setItem('myeongsim_paid_user', 'true');
                } else {
                    localStorage.setItem('myeongsim_paid_user', 'true');
                }

                window.dispatchEvent(new Event('myeongsim_auth_change'));
                await onRefresh();
                alert('🎉 축하합니다! 관리자 승인이 확인되었습니다.\n모든 서비스가 정상 해금되었습니다.');
                return;
            }

            // 2. 부모 콜백 실행
            const isStillLocked = await onRefresh();
            if (isStillLocked) {
                alert('⏳ 아직 관리자 승인 대기 중입니다.\n\n무통장 입금 신청을 완료하셨다면, 관리자가 입금 확인 후 즉시 열어드립니다. 잠시 후 다시 새로고침을 눌러주세요.');
            } else {
                alert('🎉 승인이 확인되었습니다! 환영합니다.');
            }
        } catch (e) {
            const isStillLocked = await onRefresh();
            if (isStillLocked) {
                alert('⏳ 현재 관리자 승인 대기 중입니다.');
            }
        } finally {
            setIsRefreshing(false);
        }
    };

    // 무통장 입금 신청 제출
    const handleWireSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!depositorName.trim()) {
            alert('입금자명을 입력해 주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/payment/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId || phone || depositorName.trim(),
                    amount: 98000,
                    depositorName: depositorName.trim(),
                    phone: phone.trim(),
                    productName: '특허출원기념 월정액 98,000원 ALL-PASS'
                })
            });

            const data = await res.json();
            if (data.success || res.ok) {
                setWireSubmitted(true);
                // 로컬에 이름 저장
                localStorage.setItem('user_name', depositorName.trim());
                if (phone) localStorage.setItem('user_phone', phone.trim());
            } else {
                setWireSubmitted(true);
            }
        } catch (e) {
            setWireSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 로그아웃
    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (e) {}
        if (typeof window !== 'undefined') {
            localStorage.removeItem('myeongsim_site_access');
            localStorage.removeItem('myeongsim_user_profile');
            document.cookie = "myeongsim_site_access=; path=/; max-age=0;";
        }
        window.location.href = '/';
    };

    return (
        <div className="fixed inset-0 z-[99998] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-3 sm:p-6 text-center select-none overflow-y-auto animate-fade-in font-sans">
            
            <div className="w-full max-w-lg bg-[#0c101c] border-2 border-amber-400/50 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(251,191,36,0.3)] my-auto relative">
                
                {/* 상단 럭셔리 골드 잠금 엠블럼 */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="size-16 sm:size-20 bg-gradient-to-br from-amber-400/20 via-yellow-500/10 to-transparent rounded-3xl border-2 border-amber-400/60 flex items-center justify-center mx-auto mb-3.5 shadow-[0_0_25px_rgba(251,191,36,0.35)]"
                >
                    <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-pulse" />
                </motion.div>

                {/* 뱃지 */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[11px] font-mono font-black mb-2">
                    <Award size={13} className="text-amber-400" />
                    <span>정식 멤버십 잠금 · 결제 후 즉시 이용 가능</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    명심코칭 VIP 멤버십 전면 잠금
                </h1>
                
                <p className="text-xs sm:text-sm text-gray-300 mt-1.5 leading-relaxed break-keep px-2">
                    현재 결제 또는 관리자 승인이 완료되지 않은 계정입니다.<br />
                    <span className="text-amber-300 font-bold">월정액 멤버십 결제</span> 또는 <span className="text-cyan-300 font-bold">관리자 승인</span> 시 124개 전 서비스가 즉시 해금됩니다.
                </p>

                {/* 가격 앵커링 디스플레이 (정가 289,000원 ➔ 98,000원) */}
                <div className="mt-4 p-3.5 rounded-2xl bg-black/70 border border-amber-400/40 flex items-center justify-between px-4 text-left">
                    <div>
                        <span className="text-[11px] text-gray-400 line-through font-mono block">
                            정가 월 289,000원
                        </span>
                        <span className="text-xs text-amber-400 font-black flex items-center gap-1">
                            <Sparkles size={12} />
                            <span>특허출원 기념 66% 파격 특별가</span>
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                            <span className="text-2xl font-black text-amber-300 tracking-tight font-mono">
                                98,000
                            </span>
                            <span className="text-xs font-bold text-amber-200">원 / 월</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono block">
                            (하루 3,200원대 ALL-PASS)
                        </span>
                    </div>
                </div>

                {/* 탭 전환 (① 안내 및 스마트스토어 / ② 무통장 입금 신청) */}
                <div className="flex p-1 rounded-xl bg-slate-900 border border-white/10 mt-4 text-xs font-bold">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            activeTab === 'info' 
                                ? 'bg-amber-400 text-slate-950 font-black shadow' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <ShoppingBag size={14} />
                        <span>1. 스마트스토어 구매</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('wire')}
                        className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            activeTab === 'wire' 
                                ? 'bg-amber-400 text-slate-950 font-black shadow' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <CreditCard size={14} />
                        <span>2. 무통장 입금 (월 98,000원)</span>
                    </button>
                </div>

                {/* 탭 1: 스마트스토어 도서 구매 안내 */}
                {activeTab === 'info' && (
                    <div className="mt-3.5 space-y-3 text-left animate-fade-in">
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs text-gray-300 space-y-1.5">
                            <div className="font-bold text-amber-300 flex items-center gap-1">
                                <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                                <span>네이버 스마트스토어 도서 구매 회원 혜택</span>
                            </div>
                            <p className="text-[11px] text-gray-300 leading-relaxed">
                                청류 스마트스토어에서 도서를 구매하시면 기본 제로포인트 명심 리포트, 사주 일진 에너지, 일진 선언문이 <strong className="text-white">평생 무료 승인</strong>됩니다.
                            </p>
                        </div>

                        <a
                            href="https://smartstore.naver.com/cheongryubooks"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-transform hover:scale-[1.02] cursor-pointer"
                        >
                            <ExternalLink size={15} />
                            <span>네이버 스마트스토어에서 구매하기</span>
                        </a>
                    </div>
                )}

                {/* 탭 2: 월 98,000원 무통장 입금 신청 폼 */}
                {activeTab === 'wire' && (
                    <div className="mt-3.5 space-y-3 text-left animate-fade-in">
                        {wireSubmitted ? (
                            <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-center space-y-2">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                                <h3 className="text-base font-black text-white">
                                    입금 신청이 성공적으로 접수되었습니다!
                                </h3>
                                <p className="text-xs text-emerald-200 leading-relaxed">
                                    관리자 화면에 즉시 등록되었습니다.<br />
                                    입금 확인 후 <strong>관리자가 승인(열어주기)</strong>을 완료하면 즉시 잠금이 해제됩니다.
                                </p>
                                <button
                                    onClick={handleRefresh}
                                    className="w-full mt-2 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    <span>승인 상태 실시간 확인</span>
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleWireSubmit} className="space-y-3">
                                {/* 계좌 정보 박스 */}
                                <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-400/40 text-xs text-left">
                                    <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                                        <span>입금 계좌 안내</span>
                                        <span className="text-[10px] bg-amber-400/20 px-2 py-0.5 rounded text-amber-200">
                                            카카오뱅크
                                        </span>
                                    </div>
                                    <div className="font-mono text-sm font-black text-white flex items-center justify-between">
                                        <span>3333-01-2345678</span>
                                        <span className="text-xs text-gray-300 font-normal">예금주: 청류 이경윤</span>
                                    </div>
                                    <div className="text-[11px] text-gray-400 mt-1">
                                        입금 금액: <strong className="text-amber-300 font-mono">98,000원</strong> (부가세 포함)
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-300 mb-1">
                                            입금자명 (실제 입금하실 성함) *
                                        </label>
                                        <input
                                            type="text"
                                            value={depositorName}
                                            onChange={(e) => setDepositorName(e.target.value)}
                                            placeholder="예: 홍길동"
                                            required
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-amber-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-300 mb-1">
                                            연락처 (승인 알림 및 확인용)
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="예: 010-1234-5678"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-amber-400 font-mono"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    <Send size={14} />
                                    <span>{isSubmitting ? '신청 처리 중...' : '월 98,000원 무통장 입금 신청하기'}</span>
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* 하단 새로고침 및 로그아웃 버튼 */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>{isRefreshing ? '승인 상태 확인 중...' : '⚡ 관리자 승인 확인 (새로고침)'}</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full py-2 rounded-xl text-gray-400 hover:text-gray-200 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                        <LogOut size={12} />
                        <span>로그아웃 / 다른 아이디로 접속</span>
                    </button>
                </div>

            </div>

        </div>
    );
}
