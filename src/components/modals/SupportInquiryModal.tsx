'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AlertTriangle, 
    MessageSquare, 
    Star, 
    RotateCcw, 
    ChevronRight, 
    ChevronDown,
    ArrowLeft, 
    X, 
    Check, 
    CheckSquare, 
    Square, 
    Clock, 
    ShieldCheck,
    Send
} from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';

export interface InquiryItem {
    id: string;
    type: 'error' | 'feedback' | 'review' | 'refund';
    typeLabel: string;
    title: string;
    content: string;
    rating?: number;
    paymentMethod?: string;
    paymentAmount?: string;
    paymentDate?: string;
    agreeMarketing?: boolean;
    status: 'pending' | 'completed';
    reply?: string;
    createdAt: string;
}

interface SupportInquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: 'main' | 'error' | 'feedback' | 'review' | 'refund';
}

export default function SupportInquiryModal({ isOpen, onClose, initialView = 'main' }: SupportInquiryModalProps) {
    const { reportData } = useReportStore();
    const [view, setView] = useState<'main' | 'error' | 'feedback' | 'review' | 'refund'>(initialView);
    const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
    const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);

    // Form States - Common & Specific
    const [selectedReportId, setSelectedReportId] = useState<string>('report-1');
    const [isReportDropdownOpen, setIsReportDropdownOpen] = useState(false);
    const [errorDetail, setErrorDetail] = useState('');
    
    const [feedbackDetail, setFeedbackDetail] = useState('');
    
    const [starRating, setStarRating] = useState(5);
    const [reviewDetail, setReviewDetail] = useState('');
    const [agreeMarketing, setAgreeMarketing] = useState(true);

    const [paymentMethod, setPaymentMethod] = useState<'card' | 'overseas' | 'transfer'>('card');
    const [paymentAmount, setPaymentAmount] = useState('890원 핀포인트 (890원)');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [refundReason, setRefundReason] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Load inquiries from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('myeongsim_inquiries');
            if (saved) {
                try {
                    setInquiries(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to parse inquiries:', e);
                }
            }
        }
    }, [isOpen]);

    useEffect(() => {
        setView(initialView);
    }, [initialView, isOpen]);

    // Save inquiries to localStorage & DB
    const saveInquiry = async (newItem: InquiryItem) => {
        const updated = [newItem, ...inquiries];
        setInquiries(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem('myeongsim_inquiries', JSON.stringify(updated));
        }

        // Try API submission asynchronously
        try {
            await fetch('/api/support/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
        } catch (e) {
            console.warn('API inquiry sync warning:', e);
        }
    };

    const handleSubmitError = (e: React.FormEvent) => {
        e.preventDefault();
        if (!errorDetail.trim()) {
            alert('상세 설명을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            const newItem: InquiryItem = {
                id: `inq-${Date.now()}`,
                type: 'error',
                typeLabel: '오류 문의',
                title: `${reportData?.userName || '사용자'}님 기질 리포트 해설 오류`,
                content: errorDetail,
                status: 'pending',
                createdAt: new Date().toLocaleString('ko-KR')
            };
            saveInquiry(newItem);
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setTimeout(() => {
                setSubmitSuccess(false);
                setErrorDetail('');
                setView('main');
            }, 1200);
        }, 500);
    };

    const handleSubmitFeedback = (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedbackDetail.trim()) {
            alert('의견을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            const newItem: InquiryItem = {
                id: `inq-${Date.now()}`,
                type: 'feedback',
                typeLabel: '피드백',
                title: '서비스 개선 소중한 의견',
                content: feedbackDetail,
                status: 'pending',
                createdAt: new Date().toLocaleString('ko-KR')
            };
            saveInquiry(newItem);
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setTimeout(() => {
                setSubmitSuccess(false);
                setFeedbackDetail('');
                setView('main');
            }, 1200);
        }, 500);
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            const newItem: InquiryItem = {
                id: `inq-${Date.now()}`,
                type: 'review',
                typeLabel: '리뷰 남기기',
                title: `${starRating}점 만족도 후기`,
                content: reviewDetail || '서비스가 매우 만족스럽습니다!',
                rating: starRating,
                agreeMarketing,
                status: 'pending',
                createdAt: new Date().toLocaleString('ko-KR')
            };
            saveInquiry(newItem);
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setTimeout(() => {
                setSubmitSuccess(false);
                setReviewDetail('');
                setView('main');
            }, 1200);
        }, 500);
    };

    const handleSubmitRefund = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            const newItem: InquiryItem = {
                id: `inq-${Date.now()}`,
                type: 'refund',
                typeLabel: '환불 요청',
                title: `[환불] ${paymentAmount}`,
                content: refundReason || '개인 사정으로 인한 환불 요청',
                paymentMethod: paymentMethod === 'card' ? '간편결제/국내카드' : paymentMethod === 'overseas' ? '해외카드' : '계좌이체',
                paymentAmount,
                paymentDate,
                status: 'pending',
                createdAt: new Date().toLocaleString('ko-KR')
            };
            saveInquiry(newItem);
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setTimeout(() => {
                setSubmitSuccess(false);
                setRefundReason('');
                setView('main');
            }, 1200);
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="bg-[#121824] border border-amber-500/20 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[750px] text-gray-100 font-sans"
                >
                    {/* Top Header */}
                    <div className="bg-[#182030] px-4 py-3.5 border-b border-white/10 flex items-center justify-between relative z-10">
                        {view !== 'main' ? (
                            <button
                                onClick={() => setView('main')}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        ) : (
                            <div className="w-6" />
                        )}

                        <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                            {view === 'main' && '문의하기'}
                            {view === 'error' && '오류 문의'}
                            {view === 'feedback' && '피드백'}
                            {view === 'review' && '리뷰 남기기'}
                            {view === 'refund' && '환불 문의'}
                        </h1>

                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Main Area */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">

                        {/* SUCCESS OVERLAY */}
                        {submitSuccess && (
                            <div className="p-8 flex flex-col items-center justify-center text-center h-full space-y-4 animate-fadeIn">
                                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400">
                                    <Check className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-white">문의가 정상 접수되었습니다!</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    담당팀이 내용 확인 후 빠르게 24시간 이내에 안내해 드리겠습니다.
                                </p>
                            </div>
                        )}

                        {/* VIEW 1: MAIN MENU (Screenshot 1) */}
                        {!submitSuccess && view === 'main' && (
                            <div className="space-y-0">
                                {/* Yellow Sub-header Banner */}
                                <div className="bg-amber-400 text-gray-950 font-bold text-center py-3.5 px-4 text-xs tracking-wide shadow-md">
                                    문의 유형을 선택해주세요
                                </div>

                                {/* Menu Items List */}
                                <div className="divide-y divide-white/5 bg-[#121824]">

                                    {/* 1. 오류 문의 */}
                                    <button
                                        onClick={() => setView('error')}
                                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-all text-left group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 group-hover:scale-105 transition-transform">
                                                <AlertTriangle className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                                                    오류 문의
                                                </h3>
                                                <p className="text-[11px] text-gray-400 font-light mt-0.5">
                                                    해설이 나오지 않나요?
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                                    </button>

                                    {/* 2. 피드백 보내기 */}
                                    <button
                                        onClick={() => setView('feedback')}
                                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-all text-left group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                                                <MessageSquare className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                                                    피드백 보내기
                                                </h3>
                                                <p className="text-[11px] text-gray-400 font-light mt-0.5">
                                                    서비스 개선 의견이 있으신가요?
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                                    </button>

                                    {/* 3. 리뷰 남기기 */}
                                    <button
                                        onClick={() => setView('review')}
                                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-all text-left group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                                                <Star className="w-5 h-5 fill-amber-400/20" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                                                    리뷰 남기기
                                                </h3>
                                                <p className="text-[11px] text-gray-400 font-light mt-0.5">
                                                    소중한 후기를 남겨주세요.
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                                    </button>

                                    {/* 4. 환불 요청 */}
                                    <button
                                        onClick={() => setView('refund')}
                                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-all text-left group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 group-hover:scale-105 transition-transform">
                                                <RotateCcw className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                                                    환불 요청
                                                </h3>
                                                <p className="text-[11px] text-gray-400 font-light mt-0.5">
                                                    환불을 원하시나요?
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                                    </button>

                                </div>

                                {/* Magenta Section Header Banner */}
                                <div className="bg-[#E95383] text-white font-black text-center py-3 px-4 text-sm shadow-md mt-2 tracking-wide">
                                    내 문의 내역
                                </div>
                                <div className="bg-[#121824] px-4 py-2 border-b border-white/5 text-[11px] text-gray-400 text-center font-light">
                                    클릭하시면 상세 내용을 보실 수 있습니다.
                                </div>

                                {/* Inquiry History List */}
                                <div className="p-4 space-y-2.5">
                                    {inquiries.length === 0 ? (
                                        <div className="py-12 text-center text-xs text-gray-500 font-light">
                                            아직 문의하신 내용이 없습니다.
                                        </div>
                                    ) : (
                                        inquiries.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => setSelectedInquiry(selectedInquiry?.id === item.id ? null : item)}
                                                className="bg-black/40 border border-white/10 hover:border-amber-500/40 rounded-2xl p-3.5 transition-all cursor-pointer space-y-2"
                                            >
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                                        item.type === 'error' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                                                        item.type === 'feedback' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                                        item.type === 'review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                                        'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                                                    }`}>
                                                        {item.typeLabel}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 flex items-center gap-1 font-mono">
                                                        <Clock size={11} />
                                                        {item.createdAt}
                                                    </span>
                                                </div>

                                                <div className="text-xs font-bold text-gray-200 truncate">
                                                    {item.title}
                                                </div>

                                                {selectedInquiry?.id === item.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="pt-2 border-t border-white/10 text-[11px] text-gray-300 space-y-2 leading-relaxed"
                                                    >
                                                        <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 whitespace-pre-wrap text-gray-300 font-light">
                                                            {item.content}
                                                        </div>

                                                        {item.rating && (
                                                            <div className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                                                                평가: {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)} ({item.rating}점)
                                                            </div>
                                                        )}

                                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-[11px] text-emerald-300">
                                                            <strong>[안내]</strong> 문의가 접수되어 담당자가 순차적으로 확인 중입니다. (24시간 이내 답변)
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>

                            </div>
                        )}

                        {/* VIEW 2: ERROR INQUIRY (Screenshot 5) */}
                        {!submitSuccess && view === 'error' && (
                            <form onSubmit={handleSubmitError} className="p-4 space-y-4">
                                {/* Counter Stats */}
                                <div className="grid grid-cols-2 bg-black/40 border border-white/10 rounded-xl text-center py-3">
                                    <div>
                                        <div className="text-[10px] text-gray-400 mb-0.5 font-bold">전체</div>
                                        <div className="text-base font-black text-white">2</div>
                                    </div>
                                    <div className="border-l border-white/10">
                                        <div className="text-[10px] text-gray-400 mb-0.5 font-bold">오류</div>
                                        <div className="text-base font-black text-red-400">0</div>
                                    </div>
                                </div>

                                {/* Report Dropdown Header */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setIsReportDropdownOpen(!isReportDropdownOpen)}
                                        className="w-full flex items-center justify-between font-bold text-xs text-white py-2 px-1 border-b border-white/10"
                                    >
                                        <span>내 해설 모두보기</span>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isReportDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Report List */}
                                    {isReportDropdownOpen && (
                                        <div className="mt-2 space-y-2 bg-black/30 border border-white/10 rounded-xl p-2.5">
                                            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer text-xs">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="report"
                                                        value="report-1"
                                                        checked={selectedReportId === 'report-1'}
                                                        onChange={() => setSelectedReportId('report-1')}
                                                        className="accent-amber-400"
                                                    />
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                                        기질
                                                    </span>
                                                    <span className="font-bold text-gray-200">
                                                        {reportData?.userName || '사용자'}님 기질해설
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-gray-500 font-mono">구입 안함</span>
                                            </label>

                                            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer text-xs">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="report"
                                                        value="report-2"
                                                        checked={selectedReportId === 'report-2'}
                                                        onChange={() => setSelectedReportId('report-2')}
                                                        className="accent-amber-400"
                                                    />
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                                                        일일 코칭
                                                    </span>
                                                    <span className="font-bold text-gray-200">
                                                        {new Date().toISOString().split('T')[0]}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                    정상
                                                </span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* Textarea */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-200 flex items-center gap-1">
                                        상세 설명 <span className="text-red-400 text-[10px]">(필수)</span>
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            rows={5}
                                            value={errorDetail}
                                            onChange={(e) => setErrorDetail(e.target.value)}
                                            maxLength={300}
                                            placeholder="어떤 오류가 발생했는지 적어주시면 빠르게 처리해드리겠습니다."
                                            className="w-full bg-black/50 border border-white/15 focus:border-amber-400 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
                                        />
                                        <div className="absolute bottom-2.5 right-3 text-[10px] text-gray-500 font-mono">
                                            {errorDetail.length}/300
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-sm rounded-xl transition-all active:scale-98 shadow-lg shadow-amber-400/20 cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? '제출 중...' : '제출하기'}
                                </button>
                            </form>
                        )}

                        {/* VIEW 3: FEEDBACK (Screenshot 4) */}
                        {!submitSuccess && view === 'feedback' && (
                            <form onSubmit={handleSubmitFeedback} className="space-y-4">
                                <div className="bg-amber-400 text-gray-950 p-4 text-center space-y-1 shadow-md">
                                    <h3 className="font-extrabold text-xs">
                                        명심코칭에게 전하고 싶은 의견이 있나요?
                                    </h3>
                                    <p className="text-[11px] font-normal text-gray-900">
                                        더 좋은 서비스를 만들기 위해 소중한 의견을 들려주세요.
                                    </p>
                                </div>

                                <div className="p-4 space-y-4">
                                    <textarea
                                        rows={6}
                                        value={feedbackDetail}
                                        onChange={(e) => setFeedbackDetail(e.target.value)}
                                        placeholder="예) 새로운 분석 모듈을 추가해주세요!"
                                        className="w-full bg-black/50 border border-white/15 focus:border-amber-400 rounded-xl p-3.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
                                    />

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-sm rounded-xl transition-all active:scale-98 shadow-lg shadow-amber-400/20 cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmitting ? '전송 중...' : '피드백 보내기'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* VIEW 4: REVIEW (Screenshot 3) */}
                        {!submitSuccess && view === 'review' && (
                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                <div className="bg-amber-400 text-gray-950 p-4 text-center space-y-1 shadow-md">
                                    <h3 className="font-extrabold text-xs">
                                        명심코칭을 이용해보신 느낌은 어떠셨나요?
                                    </h3>
                                    <p className="text-[11px] font-normal text-gray-900">
                                        여러분의 리뷰는 서비스 성장에 큰 힘이 됩니다.
                                    </p>
                                </div>

                                <div className="p-4 space-y-5">
                                    {/* Star Rating Selector */}
                                    <div className="text-center space-y-2 py-2">
                                        <div className="text-xs font-bold text-gray-300">별점 평가</div>
                                        <div className="flex justify-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setStarRating(star)}
                                                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                                                >
                                                    <Star
                                                        className={`w-7 h-7 ${
                                                            star <= starRating
                                                                ? 'text-amber-400 fill-amber-400'
                                                                : 'text-gray-600 fill-transparent'
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <div className="text-xs font-mono font-bold text-amber-400">
                                            {starRating}점 / 5점
                                        </div>
                                    </div>

                                    {/* Textarea */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-200 flex items-center gap-1">
                                            리뷰 내용 <span className="text-gray-400 text-[10px] font-normal">(선택)</span>
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={reviewDetail}
                                            onChange={(e) => setReviewDetail(e.target.value)}
                                            placeholder="서비스 이용 경험을 자유롭게 적어주세요 😊"
                                            className="w-full bg-black/50 border border-white/15 focus:border-amber-400 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
                                        />
                                    </div>

                                    {/* Marketing Checkbox */}
                                    <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-gray-300 leading-snug">
                                        <input
                                            type="checkbox"
                                            checked={agreeMarketing}
                                            onChange={(e) => setAgreeMarketing(e.target.checked)}
                                            className="mt-0.5 accent-amber-400 w-4 h-4 rounded"
                                        />
                                        <div>
                                            리뷰 내용은 <span className="font-bold underline text-white">마케팅에 사용될 수 있음</span>에 동의하시나요?
                                            <p className="text-[10px] text-gray-500 font-light mt-0.5">
                                                (직접 작성해주신 내용 외의 정보는 절대 활용되지 않습니다.)
                                            </p>
                                        </div>
                                    </label>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-sm rounded-xl transition-all active:scale-98 shadow-lg shadow-amber-400/20 cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmitting ? '등록 중...' : '리뷰 등록하기'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* VIEW 5: REFUND INQUIRY (Screenshot 2) */}
                        {!submitSuccess && view === 'refund' && (
                            <form onSubmit={handleSubmitRefund} className="space-y-4">
                                {/* Yellow Notice List */}
                                <div className="bg-amber-400 text-gray-950 p-4 space-y-1.5 text-[11px] font-bold shadow-md">
                                    <div className="flex items-center gap-1.5">
                                        • <span className="underline">사용하지 않은</span> 핀포인트/패스 환불 가능합니다. ✅
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        • 보너스 혹은 무료 리포트는 환불이 어렵습니다. ❌
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        • 결제 후 <span className="underline">7일 이내</span> 요청하셔야 환불이 가능해요.
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        • 결제 금액의 <span className="underline">일부만</span> 환불받는 것도 가능해요.
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        • 환불 시 구매하신 리포트는 차감됩니다.
                                    </div>
                                </div>

                                <div className="p-4 space-y-4">
                                    {/* Payment Method */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white">결제 수단</label>
                                        <div className="space-y-1.5 bg-black/40 border border-white/10 p-3 rounded-xl">
                                            <label className="flex items-center gap-2 text-xs text-gray-200 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="method"
                                                    value="card"
                                                    checked={paymentMethod === 'card'}
                                                    onChange={() => setPaymentMethod('card')}
                                                    className="accent-amber-400"
                                                />
                                                간편결제 / 국내카드
                                            </label>
                                            <label className="flex items-center gap-2 text-xs text-gray-200 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="method"
                                                    value="overseas"
                                                    checked={paymentMethod === 'overseas'}
                                                    onChange={() => setPaymentMethod('overseas')}
                                                    className="accent-amber-400"
                                                />
                                                해외카드 결제
                                            </label>
                                            <label className="flex items-center gap-2 text-xs text-gray-200 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="method"
                                                    value="transfer"
                                                    checked={paymentMethod === 'transfer'}
                                                    onChange={() => setPaymentMethod('transfer')}
                                                    className="accent-amber-400"
                                                />
                                                계좌이체
                                            </label>
                                        </div>
                                    </div>

                                    {/* Payment Amount Selector */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-white">결제 금액</label>
                                        <select
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            className="w-full bg-black/50 border border-white/15 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors"
                                        >
                                            <option value="890원 핀포인트 (890원)">890원 핀포인트 (890원)</option>
                                            <option value="990원 핀포인트 (990원)">990원 핀포인트 (990원)</option>
                                            <option value="1,900원 핀포인트 (1,900원)">1,900원 핀포인트 (1,900원)</option>
                                            <option value="9,010원 ALL-PASS (9,010원)">9,010원 ALL-PASS (9,010원)</option>
                                        </select>
                                    </div>

                                    {/* Payment Date Input */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-white flex items-center gap-1">
                                            결제 일자를 알려주세요 <span className="text-gray-400 text-[10px] font-normal">(선택)</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={paymentDate}
                                            onChange={(e) => setPaymentDate(e.target.value)}
                                            className="w-full bg-black/50 border border-white/15 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors"
                                        />
                                    </div>

                                    {/* Refund Reason */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-white flex items-center gap-1">
                                            환불 사유 <span className="text-gray-400 text-[10px] font-normal">(선택)</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={refundReason}
                                            onChange={(e) => setRefundReason(e.target.value)}
                                            placeholder="사유를 입력해주시면 서비스 개선에 큰 도움이 됩니다."
                                            className="w-full bg-black/50 border border-white/15 focus:border-amber-400 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-sm rounded-xl transition-all active:scale-98 shadow-lg shadow-amber-400/20 cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmitting ? '요청 중...' : '환불 요청 제출하기'}
                                    </button>
                                </div>
                            </form>
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
