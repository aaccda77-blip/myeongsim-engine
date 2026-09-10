'use client';

import React, { useState } from 'react';
import { 
    X, Sparkles, CheckCircle2, ShieldCheck, CreditCard, Send, 
    ExternalLink, Watch, Headphones, Heart, Star, BookOpen, AlertCircle, Award
} from 'lucide-react';
import { grantUserApprovalSync } from '@/lib/authGuardUtils';

interface UnifiedSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName?: string;
}

export default function UnifiedSubscriptionModal({
    isOpen,
    onClose,
    featureName = '이 프리미엄 기능'
}: UnifiedSubscriptionModalProps) {
    const [tab, setTab] = useState<'info' | 'wire'>('info');
    const [depositorName, setDepositorName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [isCheckingApproval, setIsCheckingApproval] = useState(false);

    if (!isOpen) return null;

    const handleWireSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!depositorName.trim()) {
            alert('입금자명을 입력해 주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            await fetch('/api/payment/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: phone.trim() || depositorName.trim(),
                    amount: 0,
                    depositorName: depositorName.trim(),
                    phone: phone.trim(),
                    productName: '베타오픈기념 도서구매 시 전면무료개방 (구매승인)'
                })
            });

            if (typeof window !== 'undefined') {
                localStorage.setItem('myeongsim_pending_approval', 'true');
                localStorage.setItem('myeongsim_depositor_name', depositorName.trim());
                if (phone.trim()) localStorage.setItem('myeongsim_phone', phone.trim());
                localStorage.setItem('myeongsim_user_id', phone.trim() || depositorName.trim());
            }
            setSubmitted(true);
        } catch (e) {
            console.error('Submit error:', e);
            if (typeof window !== 'undefined') {
                localStorage.setItem('myeongsim_pending_approval', 'true');
                localStorage.setItem('myeongsim_depositor_name', depositorName.trim());
            }
            setSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCheckApprovalStatus = async () => {
        setIsCheckingApproval(true);
        try {
            // 1. 관리자 세션인 경우 즉시 무조건 완전 해금
            const isAdmin = typeof document !== 'undefined' && (
                document.cookie.includes('admin_session=') ||
                sessionStorage.getItem('myeongsim_admin_authed') === 'true' ||
                sessionStorage.getItem('myeongsim_admin_authenticated') === 'true' ||
                localStorage.getItem('myeongsim_admin_authenticated') === 'true'
            );
            if (isAdmin) {
                grantUserApprovalSync('MONTHLY_98K');
                alert('👑 [최고 관리자 인증] 모든 124개 VIP 서비스가 즉시 해금되었습니다!');
                onClose();
                return;
            }

            const storedName = localStorage.getItem('myeongsim_depositor_name') || localStorage.getItem('user_name') || depositorName.trim();
            const storedUserId = localStorage.getItem('myeongsim_user_id') || localStorage.getItem('user_id') || phone.trim() || '';
            const storedEmail = localStorage.getItem('myeongsim_email') || localStorage.getItem('user_email') || '';
            const storedPhone = localStorage.getItem('myeongsim_phone') || phone.trim() || '';
            const storedOrder = localStorage.getItem('myeongsim_verified_order') || '';

            const params = new URLSearchParams();
            if (storedUserId) params.set('userId', storedUserId);
            if (storedName) params.set('name', storedName);
            if (storedEmail) params.set('email', storedEmail);
            if (storedPhone) params.set('phone', storedPhone);
            if (storedOrder) params.set('orderNumber', storedOrder);

            const res = await fetch(`/api/payment/check-approval?${params.toString()}&t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                if (data.approved) {
                    grantUserApprovalSync(data.tier);
                    alert('🎉 [승인 완료] 관리자 승인이 완료되었습니다! 124개 전 VIP 서비스가 해금되었습니다.');
                    onClose();
                } else {
                    alert('⏳ 아직 관리자 확인 중입니다. 잠시 후 다시 [승인 확인]을 눌러주세요.\n(관리자가 입금 확인 후 수분 내에 승인합니다)');
                }
            } else {
                alert('⏳ 관리자 확인 중입니다. 잠시 후 다시 시도해 주세요.');
            }
        } catch (e) {
            alert('승인 확인 중 네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsCheckingApproval(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
            <div className="relative w-full max-w-lg bg-[#0c101c] border border-amber-400/40 rounded-3xl shadow-[0_0_30px_rgba(251,191,36,0.25)] overflow-hidden flex flex-col max-h-[95vh]">
                
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 size-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                    <X size={18} />
                </button>

                {/* 상단 럭셔리 골드 배너 */}
                <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent border-b border-amber-400/20 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-mono font-black mb-2">
                        <Award size={13} className="text-amber-400" />
                        <span>🎉 명심코칭 앱 베타 오픈 기념 · 도서 구매자 특별 혜택</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        도서 구매 시 한시적 전면 무료 개방!
                    </h2>
                    <p className="text-xs text-amber-200/90 mt-1">
                        도서 《제로 포인트》 구매 고객님께 월 98,000원 멤버십을 한시적으로 전면 무료 개방합니다.<br />
                        (도서 구매 후 승인 시 {featureName}을(를) 포함한 전 서비스 즉시 무료 이용)
                    </p>

                    {/* 가격 앵커링 디스플레이 (98,000원 ✕ ➔ 0원 무료) */}
                    <div className="mt-3.5 p-3.5 rounded-2xl bg-black/70 border border-amber-400/40 flex items-center justify-between px-4">
                        <div className="text-left">
                            <span className="text-xs text-red-400 line-through block font-mono font-bold">
                                정가 월 98,000원 ✕
                            </span>
                            <span className="text-xs text-amber-400 font-black flex items-center gap-1">
                                <Sparkles size={12} />
                                <span>베타 오픈 한시적 무료 개방</span>
                            </span>
                        </div>
                        <div className="text-right">
                            <div className="flex items-baseline justify-end gap-1">
                                <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]">
                                    0
                                </span>
                                <span className="text-xs font-black text-amber-400">원 / 무료</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-bold">
                                도서 구매 후 승인 시 즉시 이용
                            </span>
                        </div>
                    </div>
                </div>

                {/* 중앙 컨텐츠 영역 */}
                <div className="p-5 overflow-y-auto space-y-4 text-left">
                    {submitted ? (
                        <div className="py-6 text-center space-y-3 animate-fade-in">
                            <div className="size-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300">
                                <CheckCircle2 size={36} className="animate-bounce" />
                            </div>
                            <h3 className="text-lg font-black text-white">도서 구매 승인 신청 접수 완료!</h3>
                            <p className="text-xs text-gray-300 leading-relaxed max-w-xs mx-auto">
                                <strong className="text-amber-300">{depositorName}</strong>님의 도서 구매 무료 승인 신청이 접수되었습니다.<br />
                                관리자가 구매 내역 확인 후 수분 내에 <strong>[전면 무료 승인]</strong>을 완료합니다.
                            </p>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] text-gray-400 font-mono">
                                도서 구매 고객 대상: 월 98,000원 멤버십 124개 전 서비스 한시적 전면 무료 개방
                            </div>
                            <div className="space-y-2 pt-2">
                                <button
                                    onClick={handleCheckApprovalStatus}
                                    disabled={isCheckingApproval}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs cursor-pointer shadow-xl shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                                >
                                    <Sparkles size={14} className="fill-current text-slate-950" />
                                    <span>{isCheckingApproval ? '승인 상태 확인 중...' : '⚡ 관리자 승인 완료 확인 (새로고침)'}</span>
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white font-bold text-xs cursor-pointer transition-colors"
                                >
                                    확인 및 닫기
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* 이미 승인/입금 완료한 사용자를 위한 빠른 해금 버튼 */}
                            <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/10 border border-amber-400/40 flex items-center justify-between gap-2">
                                <div className="text-[11px] text-amber-200">
                                    <span className="font-bold">이미 관리자 승인을 받으셨나요?</span>
                                    <span className="text-[10px] text-gray-400 block">버튼을 누르면 1초 만에 모든 잠금이 해제됩니다.</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCheckApprovalStatus}
                                    disabled={isCheckingApproval}
                                    className="px-3 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                                >
                                    {isCheckingApproval ? '확인 중...' : '⚡ 즉시 잠금 해제'}
                                </button>
                            </div>

                            {/* 포함 혜택 5대 핵심 가치 스택 */}
                            <div className="space-y-2 bg-white/[0.03] p-3.5 rounded-2xl border border-white/10">
                                <span className="text-[11px] font-mono font-bold text-amber-300 flex items-center gap-1 mb-1">
                                    <Sparkles size={12} />
                                    <span>도서 구매 시 한시적 전면 무료 개방되는 5대 VIP 혜택</span>
                                </span>
                                <div className="space-y-1.5 text-xs text-gray-200">
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-400 font-bold">✓</span>
                                        <span><strong>스마트워치 9대 퀀텀 다이얼</strong> & <strong>명심 3D 입체 서라운드</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-400 font-bold">✓</span>
                                        <span>내 사주 일간 x 당일 일진 <strong>1:1 맞춤 일진 핵심 선언문</strong> 매일 생성</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-400 font-bold">✓</span>
                                        <span><strong>바이오케어 5종</strong> (당뇨/비만/혈관 약물 문해력 & 영양 시너지)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-400 font-bold">✓</span>
                                        <span><strong>108 인생 대전환 리포트</strong> & <strong>AI 마스터코어</strong> 심층 코칭</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-400 font-bold">✓</span>
                                        <span>양자 주파수 힐링송 & 딥 브라운 3D 공간 음원 무제한 스트리밍</span>
                                    </div>
                                </div>
                            </div>

                            {/* 도서 구매 고객을 위한 안내 뱃지 */}
                            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-200 leading-relaxed flex items-start gap-2.5">
                                <BookOpen size={16} className="text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-amber-300 block mb-0.5">🎉 베타 오픈 기념 한시적 전면 무료 개방 안내</strong>
                                    <span>
                                        도서 《제로 포인트》를 구매하신 모든 독자님께 정가 98,000원 상당의 멤버십을 한시적으로 <strong>전면 무료 개방</strong>합니다. 도서 구매 후 승인 신청하시면 전 서비스를 즉시 무료로 이용하실 수 있습니다.
                                    </span>
                                </div>
                            </div>

                            {/* 2대 결제 창구 선택 탭 */}
                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setTab('info')}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                                        tab === 'info'
                                            ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
                                            : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                                    }`}
                                >
                                    <ExternalLink size={13} />
                                    <span>1. 도서 구매하기</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTab('wire')}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                                        tab === 'wire'
                                            ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
                                            : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                                    }`}
                                >
                                    <CreditCard size={13} />
                                    <span>2. 도서 구매 무료 승인 신청</span>
                                </button>
                            </div>

                            {/* 탭 1: 스마트스토어 도서 구매 링크 */}
                            {tab === 'info' && (
                                <div className="space-y-2.5 pt-1 animate-fade-in">
                                    <a
                                        href="https://smartstore.naver.com/cheongryubooks/products/13751650301"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all cursor-pointer active:scale-[0.98]"
                                    >
                                        <span>📚 스마트스토어에서 도서 《제로포인트》 구매하기</span>
                                        <ExternalLink size={14} />
                                    </a>
                                    <p className="text-[10px] text-gray-400 text-center">
                                        도서를 구매하신 후 [2. 도서 구매 무료 승인 신청] 탭에서 신청해 주시면 관리자 확인 후 전면 무료 승인됩니다.
                                    </p>
                                </div>
                            )}

                            {/* 탭 2: 도서 구매자 무료 승인 신청 폼 */}
                            {tab === 'wire' && (
                                <form onSubmit={handleWireSubmit} className="space-y-3 pt-1 animate-fade-in">
                                    <div className="p-3 bg-black/60 rounded-xl border border-amber-400/30 text-center">
                                        <span className="text-[10px] text-amber-300 block font-mono font-bold">✨ 도서 구매자 전면 무료 승인 창구</span>
                                        <span className="text-sm font-black text-white block mt-0.5">
                                            도서 《제로포인트》 구매 고객 무료 사용 승인 신청
                                        </span>
                                        <span className="text-[11px] text-gray-300">
                                            비용: <span className="line-through text-red-400 font-mono">월 98,000원 ✕</span> ➔ <strong className="text-emerald-400 font-bold">0원 (한시적 전면 무료)</strong>
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-[11px] text-gray-300 font-bold block mb-1">
                                                구매자 성함 (도서 주문자명) *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={depositorName}
                                                onChange={(e) => setDepositorName(e.target.value)}
                                                placeholder="예: 홍길동"
                                                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] text-gray-300 font-bold block mb-1">
                                                연락처 (휴대폰 번호) *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="예: 010-1234-5678"
                                                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        <Send size={13} />
                                        <span>{isSubmitting ? '신청 처리 중...' : '⚡ 도서 구매 확인 및 전면 무료 승인 신청하기'}</span>
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>

                {/* 하단 희소성 안내 문구 */}
                <div className="p-3 bg-black/80 border-t border-white/10 text-center">
                    <p className="text-[10px] text-gray-400 font-mono">
                        ⚡ 명심코칭 앱 베타 오픈 기념 한정 혜택: 도서 구매 후 승인 시 월 98,000원 전 서비스가 한시적으로 전면 무료 개방됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
