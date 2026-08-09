/**
 * [약관 동의 페이지] - /consent
 * 
 * 특징:
 * - 대한민국 개인정보 보호법 규격 맞춤 약관 동의 절차
 * - [필수] 이용약관, [필수] 개인정보 처리방침, [선택] 마케팅 정보 수신
 * - 전체 동의 및 부분 동의 지원
 * - 약관 클릭 시 전문 미리보기 모달 지원
 * - 취소 클릭 시 안전하게 로그아웃 후 /login 이동
 */

'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { ConsentService } from '@/lib/services/ConsentService';
import { CURRENT_TERMS_VERSION, CURRENT_PRIVACY_VERSION } from '@/config/legalVersions';
import { ShieldCheck, CheckSquare, Square, ChevronRight, X, ExternalLink, Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';

export default function ConsentPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Checkbox states
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);

    // Modal state
    const [previewModal, setPreviewModal] = useState<'terms' | 'privacy' | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session || !session.user) {
                    router.push('/login');
                    return;
                }
                setUserId(session.user.id);

                // Existing consent check
                const consents = await ConsentService.getConsents(session.user.id);
                if (ConsentService.isConsentValid(consents)) {
                    // Already agreed with current version -> proceed to report
                    router.push('/report');
                    return;
                }
            } catch (e) {
                console.error('Consent auth error:', e);
            } finally {
                setIsLoading(false);
            }
        };

        checkUser();
    }, [router]);

    const handleAllCheck = () => {
        const nextState = !(agreeTerms && agreePrivacy && agreeMarketing);
        setAgreeTerms(nextState);
        setAgreePrivacy(nextState);
        setAgreeMarketing(nextState);
    };

    const handleCancel = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreeTerms || !agreePrivacy) {
            alert('필수 약관 및 개인정보 처리방침에 동의하셔야 명심코칭 서비스를 이용하실 수 있습니다.');
            return;
        }

        if (!userId) return;

        try {
            setIsSubmitting(true);
            await ConsentService.saveConsents(userId, agreeTerms, agreePrivacy, agreeMarketing);
            router.push('/report');
        } catch (error) {
            console.error('Consent save error:', error);
            alert('동의 처리 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = agreeTerms && agreePrivacy;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050B14] flex justify-center items-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050B14] text-gray-100 flex flex-col justify-between relative overflow-hidden">
            {/* Header */}
            <div className="w-full max-w-md mx-auto px-5 pt-10 pb-6 flex-1 flex flex-col justify-center">
                
                {/* Brand Badge */}
                <div className="flex justify-center mb-6">
                    <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300 shadow-[0_0_20px_rgba(252,211,77,0.15)] flex items-center gap-2 text-xs font-bold">
                        <ShieldCheck className="w-5 h-5 text-amber-400" />
                        <span>명심코칭 법적 서비스 약관 동의</span>
                    </div>
                </div>

                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-xl font-bold text-gray-100 tracking-tight">
                        서비스 이용을 위한 약관에 동의해주세요
                    </h1>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        명심코칭은 대한민국 「개인정보 보호법」 및 관계 법령을 엄격히 준수하며 고객님의 개인정보를 안전하게 보호합니다.
                    </p>
                </div>

                {/* Consent Form */}
                <form onSubmit={handleSubmit} className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl space-y-5 shadow-2xl">
                    
                    {/* 전체 동의 버튼 */}
                    <div 
                        onClick={handleAllCheck}
                        className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between cursor-pointer hover:bg-amber-400/15 transition-all"
                    >
                        <div className="flex items-center gap-3 font-extrabold text-sm text-amber-300">
                            {agreeTerms && agreePrivacy && agreeMarketing ? (
                                <CheckSquare className="w-5 h-5 text-amber-400" />
                            ) : (
                                <Square className="w-5 h-5 text-amber-400/60" />
                            )}
                            <span>전체 약관에 동의합니다</span>
                        </div>
                    </div>

                    <div className="h-px bg-white/10 my-2" />

                    {/* [필수] 이용약관 */}
                    <div className="flex items-center justify-between text-xs py-1">
                        <div 
                            onClick={() => setAgreeTerms(!agreeTerms)}
                            className="flex items-center gap-3 cursor-pointer flex-1"
                        >
                            {agreeTerms ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                            ) : (
                                <Square className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="font-bold text-gray-200">
                                [필수] 서비스 이용약관 동의 <span className="text-[10px] text-gray-500 font-mono">(v{CURRENT_TERMS_VERSION})</span>
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setPreviewModal('terms')}
                            className="text-gray-400 hover:text-amber-300 text-[11px] underline flex items-center gap-0.5 cursor-pointer ml-2"
                        >
                            <span>보기</span>
                            <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>

                    {/* [필수] 개인정보 처리방침 */}
                    <div className="flex items-center justify-between text-xs py-1">
                        <div 
                            onClick={() => setAgreePrivacy(!agreePrivacy)}
                            className="flex items-center gap-3 cursor-pointer flex-1"
                        >
                            {agreePrivacy ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                            ) : (
                                <Square className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="font-bold text-gray-200">
                                [필수] 개인정보 처리방침 동의 <span className="text-[10px] text-gray-500 font-mono">(v{CURRENT_PRIVACY_VERSION})</span>
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setPreviewModal('privacy')}
                            className="text-gray-400 hover:text-amber-300 text-[11px] underline flex items-center gap-0.5 cursor-pointer ml-2"
                        >
                            <span>보기</span>
                            <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>

                    {/* [선택] 마케팅 수신 동의 */}
                    <div className="flex items-center justify-between text-xs py-1">
                        <div 
                            onClick={() => setAgreeMarketing(!agreeMarketing)}
                            className="flex items-center gap-3 cursor-pointer flex-1"
                        >
                            {agreeMarketing ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                            ) : (
                                <Square className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="text-gray-400">
                                [선택] 마케팅 혜택 알림 및 소식 수신 동의
                            </span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold text-xs transition-colors cursor-pointer"
                        >
                            취소 (로그아웃)
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            className={`flex-1 py-3.5 rounded-2xl font-extrabold text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                                isFormValid && !isSubmitting
                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-400/25 scale-[1.02]'
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>저장 중...</span>
                                </>
                            ) : (
                                <>
                                    <span>명심코칭 시작하기</span>
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal for viewing terms / privacy in-place */}
            {previewModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#0B0F19] border border-white/10 w-full max-w-lg max-h-[80vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
                            <h3 className="text-sm font-bold text-amber-300">
                                {previewModal === 'terms' ? '이용약관 전문' : '개인정보 처리방침 전문'}
                            </h3>
                            <button
                                onClick={() => setPreviewModal(null)}
                                className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 p-5 overflow-y-auto text-xs text-gray-300 leading-relaxed space-y-4">
                            <iframe
                                src={previewModal === 'terms' ? '/terms' : '/privacy'}
                                className="w-full h-[60vh] border-0 rounded-xl bg-[#070C16]"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
}
