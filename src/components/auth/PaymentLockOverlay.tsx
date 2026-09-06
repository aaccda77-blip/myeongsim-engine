'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Lock, RefreshCw, LogOut, Sparkles, CheckCircle2, ShieldCheck, 
    CreditCard, Send, ExternalLink, Award, AlertCircle, ShoppingBag,
    BookOpen, Check, MessageCircle
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

    // 도서 구매 인증 상태 (네이버 스마트스토어, YES24, 교보문고 등)
    const [bookChannel, setBookChannel] = useState<'smartstore' | 'yes24' | 'kyobo' | 'other'>('smartstore');
    const [orderNumber, setOrderNumber] = useState('');
    const [bookBuyerName, setBookBuyerName] = useState('');
    const [bookBuyerPhone, setBookBuyerPhone] = useState('');
    const [isVerifyingBook, setIsVerifyingBook] = useState(false);

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
            if (savedName) {
                setDepositorName(savedName);
                setBookBuyerName(savedName);
            }
            if (savedPhone) {
                setPhone(savedPhone);
                setBookBuyerPhone(savedPhone);
            }
            // 이전에 입금 신청한 기록이 있으면 접수 화면으로 복원
            if (localStorage.getItem('myeongsim_pending_wire') === 'true') {
                setWireSubmitted(true);
            }
        }
    }, []);

    // ⚡ [자동 승인 감지 Auto-Polling] 3.5초마다 백그라운드 자동 확인
    useEffect(() => {
        let isCancelled = false;
        let timer: any = null;

        const checkSilent = async () => {
            try {
                const nameToQuery = depositorName.trim() || bookBuyerName.trim() || (typeof window !== 'undefined' ? localStorage.getItem('user_name') || '' : '');
                const uidToQuery = userId || (typeof window !== 'undefined' ? localStorage.getItem('user_id') || '' : '');

                if (!nameToQuery && !uidToQuery) return;

                const res = await fetch(`/api/payment/check-approval?name=${encodeURIComponent(nameToQuery)}&userId=${encodeURIComponent(uidToQuery)}&t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.approved && !isCancelled) {
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
                        localStorage.removeItem('myeongsim_pending_wire');
                        window.dispatchEvent(new Event('myeongsim_auth_change'));
                        await onRefresh();
                    }
                }
            } catch (e) {
                // 조용히 재시도
            }
        };

        timer = setInterval(checkSilent, 3500);

        return () => {
            isCancelled = true;
            if (timer) clearInterval(timer);
        };
    }, [depositorName, bookBuyerName, userId, onRefresh]);

    // 🎁 [3분 스피드 맛보기 체험 즉시 발급]
    const handleStartFreeTrial = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('myeongsim_paid_user', 'true');
            localStorage.setItem('myeongsim_smartstore_vip', 'true');
            localStorage.setItem('myeongsim_trial_active', 'true');
            // 3분(180초) 타이트한 맛보기로 보안 및 결제 전환 극대화
            const exp = Date.now() + 3 * 60 * 1000;
            localStorage.setItem('myeongsim_expires_at', new Date(exp).toISOString());
            window.dispatchEvent(new Event('myeongsim_auth_change'));
        }
        alert('⚡ [3분 스피드 맛보기 체험 시작]\n\n관리자 승인을 기다리시는 동안 기본 명심 리포트를 3분간 먼저 둘러보실 수 있습니다!\n(3분 후 자동으로 다시 잠기며, 관리자 승인 시 평생 무제한으로 해금됩니다)');
        onRefresh();
    };

    // 도서 구매 정품 인증 처리 (스마트스토어, YES24, 교보문고 등)
    const handleBookVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanOrder = orderNumber.trim();
        const cleanName = bookBuyerName.trim() || depositorName.trim();
        const cleanPhone = bookBuyerPhone.trim() || phone.trim();

        if (!cleanOrder) {
            alert('주문번호 또는 영수증 번호를 입력해 주세요.\n(네이버 스마트스토어 또는 YES24 결제내역에서 확인하실 수 있습니다)');
            return;
        }

        setIsVerifyingBook(true);
        try {
            const finalUserId = userId || cleanPhone || cleanName || cleanOrder;
            const res = await fetch('/api/auth/verify-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderNumber: cleanOrder,
                    depositorName: cleanName,
                    phone: cleanPhone,
                    channel: bookChannel,
                    userId: finalUserId
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // 성공! 로컬 권한 즉시 세팅
                if (typeof window !== 'undefined') {
                    localStorage.setItem('myeongsim_book_verified', 'true');
                    localStorage.setItem('myeongsim_smartstore_vip', 'true');
                    localStorage.setItem('myeongsim_paid_user', 'true');
                    localStorage.setItem('myeongsim_verified_order', cleanOrder);
                    if (cleanName) localStorage.setItem('user_name', cleanName);
                    if (cleanPhone) localStorage.setItem('user_phone', cleanPhone);
                    window.dispatchEvent(new Event('myeongsim_auth_change'));
                }

                alert('🎉 축하합니다! 도서 구매 정품 인증이 확인되었습니다.\n\n기본 제로포인트 명심 리포트, 사주 일진 에너지, 일진 선언문이 평생 무료로 즉시 해금되었습니다.');
                await onRefresh();
            } else {
                alert(data.message || '주문번호가 올바르지 않거나 이미 등록된 번호입니다. 확인 후 다시 입력해 주세요.');
            }
        } catch (err) {
            console.error('Book verify error:', err);
            alert('인증 처리 중 네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsVerifyingBook(false);
        }
    };

    // 실시간 관리자 승인 확인
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            // 1. 서버 API로 승인 여부 실시간 조회
            const nameToQuery = depositorName.trim() || bookBuyerName.trim() || (typeof window !== 'undefined' ? localStorage.getItem('user_name') || '' : '');
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
                alert('⏳ 아직 관리자 승인 대기 중입니다.\n\n무통장 입금 또는 도서 인증 신청을 완료하셨다면, 관리자가 확인 후 즉시 열어드립니다. 잠시 후 다시 새로고침을 눌러주세요.');
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
                    <span>정식 멤버십 잠금 · 결제 또는 도서 인증 후 즉시 이용 가능</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    명심코칭 정품 회원 전면 잠금
                </h1>
                
                <p className="text-xs sm:text-sm text-gray-300 mt-1.5 leading-relaxed break-keep px-2">
                    도서 구매자 인증 또는 월정액 VIP 신청이 완료되지 않은 상태입니다.<br />
                    <span className="text-amber-300 font-bold">도서 구매 인증</span> 시 기본 리포트 평생 무료, <span className="text-cyan-300 font-bold">월정액 ALL-PASS</span> 시 124개 전 서비스가 즉시 해금됩니다.
                </p>

                {/* 탭 전환 (① 도서 구매자 인증 / ② 무통장 입금 신청) */}
                <div className="flex p-1 rounded-2xl bg-slate-900/90 border border-white/10 mt-4 text-xs font-bold gap-1">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            activeTab === 'info' 
                                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/30' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <BookOpen size={14} className={activeTab === 'info' ? 'text-slate-950' : 'text-amber-400'} />
                        <span>1. 도서 구매자 인증</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('wire')}
                        className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            activeTab === 'wire' 
                                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/30' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <CreditCard size={14} className={activeTab === 'wire' ? 'text-slate-950' : 'text-amber-400'} />
                        <span>2. 월 98,000원 ALL-PASS</span>
                    </button>
                </div>

                {/* 탭 1: 도서 구매자 인증 폼 (YES24 / 스마트스토어 / 교보문고 등) */}
                {activeTab === 'info' && (
                    <div className="mt-3.5 space-y-3.5 text-left animate-fade-in">
                        {/* 혜택 안내 배너 */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-400/40 text-xs text-gray-300 space-y-1.5">
                            <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs sm:text-sm">
                                <CheckCircle2 size={15} className="text-amber-400 shrink-0" />
                                <span>네이버 스마트스토어 · YES24 도서 구매 회원 혜택</span>
                            </div>
                            <p className="text-[11px] text-gray-300 leading-relaxed">
                                도서를 구매하신 독자님은 아래에 <strong className="text-amber-300 font-bold">주문번호 또는 영수증 승인번호</strong>를 입력해 주시면 기본 제로포인트 명심 리포트, 사주 일진 에너지, 일진 선언문이 <strong className="text-white font-black underline underline-offset-2">평생 무료로 즉시 승인</strong>됩니다.
                            </p>
                        </div>

                        {/* 도서 구매 인증 폼 */}
                        <form onSubmit={handleBookVerify} className="space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-amber-400/30">
                            {/* 구매처 선택 칩 버튼 */}
                            <div>
                                <label className="block text-[11px] font-bold text-gray-300 mb-1.5">
                                    도서 구매처 선택 *
                                </label>
                                <div className="grid grid-cols-4 gap-1 text-[11px] font-bold">
                                    {[
                                        { id: 'smartstore', label: '네이버스토어' },
                                        { id: 'yes24', label: 'YES24' },
                                        { id: 'kyobo', label: '교보문고' },
                                        { id: 'other', label: '기타 서점' }
                                    ].map((ch) => (
                                        <button
                                            key={ch.id}
                                            type="button"
                                            onClick={() => setBookChannel(ch.id as any)}
                                            className={`py-1.5 rounded-lg border transition-all text-center cursor-pointer ${
                                                bookChannel === ch.id
                                                    ? 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow'
                                                    : 'bg-black/40 text-gray-400 border-white/10 hover:text-white'
                                            }`}
                                        >
                                            {ch.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 주문번호 입력 */}
                            <div>
                                <label className="block text-[11px] font-bold text-gray-300 mb-1">
                                    주문번호 / 영수증 승인번호 *
                                </label>
                                <input
                                    type="text"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    placeholder={
                                        bookChannel === 'smartstore'
                                            ? '예: 20260904-12345678 (네이버페이 16자리)'
                                            : bookChannel === 'yes24'
                                            ? '예: YES24 주문번호 또는 승인번호'
                                            : '예: 도서 구매 주문번호 또는 승인번호'
                                    }
                                    required
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-amber-400/50 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 font-mono"
                                />
                            </div>

                            {/* 구매자 성함 & 연락처 */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-300 mb-1">
                                        구매자 성함 (주문자명) *
                                    </label>
                                    <input
                                        type="text"
                                        value={bookBuyerName}
                                        onChange={(e) => setBookBuyerName(e.target.value)}
                                        placeholder="예: 홍길동"
                                        required
                                        className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/15 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-amber-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-300 mb-1">
                                        연락처 (확인용)
                                    </label>
                                    <input
                                        type="tel"
                                        value={bookBuyerPhone}
                                        onChange={(e) => setBookBuyerPhone(e.target.value)}
                                        placeholder="예: 010-1234-5678"
                                        className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/15 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-amber-400 font-mono"
                                    />
                                </div>
                            </div>

                            {/* 인증 및 즉시 해금 버튼 */}
                            <button
                                type="submit"
                                disabled={isVerifyingBook}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/30 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 mt-1"
                            >
                                {isVerifyingBook ? (
                                    <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles size={15} />
                                        <span>도서 구매 정품 인증하기 (즉시 해금)</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* 아직 책을 안 산 분들을 위한 구매처 안내 */}
                        <div className="pt-2 border-t border-white/10">
                            <p className="text-[11px] text-gray-400 text-center mb-2">
                                📚 아직 책을 구매하지 않으셨나요? 아래 서점에서 바로 구매하실 수 있습니다:
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <a
                                    href="https://smartstore.naver.com/cheongryubooks"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-400/30 transition-all text-center"
                                >
                                    <ExternalLink size={13} />
                                    <span>네이버 스마트스토어</span>
                                </a>
                                <a
                                    href="https://search.shopping.naver.com/book/search?query=%EC%A0%9C%EB%A1%9C%ED%8F%AC%EC%9D%B8%ED%8A%B8%20%EB%AA%85%EC%8B%AC"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-cyan-400/30 transition-all text-center"
                                >
                                    <ExternalLink size={13} />
                                    <span>YES24 / 교보 검색</span>
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* 탭 2: 월 98,000원 무통장 입금 신청 폼 */}
                {activeTab === 'wire' && (
                    <div className="mt-3.5 space-y-3 text-left animate-fade-in">
                        {wireSubmitted ? (
                            <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-center space-y-3">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                                <h3 className="text-base font-black text-white">
                                    입금 신청이 성공적으로 접수되었습니다!
                                </h3>
                                <p className="text-xs text-emerald-200 leading-relaxed">
                                    관리자 화면에 즉시 등록되었습니다.<br />
                                    관리자가 확인 후 승인하면 <strong className="text-white underline">화면이 자동으로 감지되어 해금</strong>됩니다.
                                </p>

                                {/* 💬 카카오톡 1:1 오픈채팅으로 빠른 승인 요청 버튼 */}
                                <a
                                    href="https://open.kakao.com/o/spgWFR8h"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3.5 rounded-xl bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                                >
                                    <MessageCircle size={17} className="fill-[#191919]" />
                                    <span>💬 카카오톡 1:1 오픈채팅으로 빠른 승인 요청</span>
                                </a>

                                {/* 🎁 대기 중 3분 스피드 맛보기 체험 */}
                                <button
                                    type="button"
                                    onClick={handleStartFreeTrial}
                                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-400/30 transition-all cursor-pointer"
                                >
                                    <Sparkles size={14} className="text-amber-400" />
                                    <span>기다리는 동안 3분 스피드 맛보기 (핵심 분석 미리보기)</span>
                                </button>

                                {/* 수동 실시간 확인 & 정보 수정 */}
                                <div className="flex gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={handleRefresh}
                                        className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                                        <span>승인 상태 수동 확인</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            localStorage.removeItem('myeongsim_pending_wire');
                                            setWireSubmitted(false);
                                        }}
                                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 font-medium text-xs transition-all cursor-pointer"
                                    >
                                        신청 수정
                                    </button>
                                </div>
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

                {/* 하단 카카오톡 오픈채팅 & 무료 맛보기 & 새로고침 및 로그아웃 버튼 */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
                    {/* 카카오톡 1:1 오픈채팅 상시 지원 버튼 */}
                    <a
                        href="https://open.kakao.com/o/spgWFR8h"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-xl bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-yellow-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                        <MessageCircle size={16} className="fill-[#191919]" />
                        <span>💬 카카오톡 1:1 오픈채팅 문의 / 빠른 승인 요청</span>
                    </a>

                    {/* 3분 스피드 맛보기 체험 바로가기 */}
                    <button
                        type="button"
                        onClick={handleStartFreeTrial}
                        className="w-full py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-400/30 transition-all cursor-pointer"
                    >
                        <Sparkles size={14} className="text-amber-400" />
                        <span>⚡ 기다리지 않고 3분 스피드 맛보기로 둘러보기</span>
                    </button>

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
