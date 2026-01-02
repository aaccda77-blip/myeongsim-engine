'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronRight, ChevronLeft, Share2, Download, Home, Sparkles, Star, MessageCircle, Loader2, Check } from 'lucide-react';
import { UserSoulProfile } from '@/types/akashic_records';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import PremiumActionGuide from './PremiumActionGuide';

interface InteractiveViewProps {
    data: {
        profile: UserSoulProfile;
        content: any;
        timestamp: string;
        chatHistory?: { role: string; content: string }[];
    };
}

export default function MindTotemInteractiveView({ data }: InteractiveViewProps) {
    const [chapter, setChapter] = useState<'cover' | 'intro' | 'chat' | 'analysis' | 'actions' | 'end'>('cover');
    const [isBookOpen, setIsBookOpen] = useState(false);
    const router = useRouter();

    const handleOpenBook = () => {
        setIsBookOpen(true);
        setTimeout(() => setChapter('intro'), 1500);
    };

    const nextChapter = (target: typeof chapter) => {
        setChapter(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGoBack = () => {
        router.push('/');
    };

    // Floating particles effect
    const FloatingParticles = () => (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary-olive/30 rounded-full"
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                    }}
                    animate={{
                        y: [null, -100],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 5 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="w-full min-h-screen flex flex-col items-center relative font-sans text-white overflow-hidden">
            <FloatingParticles />

            {/* Background Gradient */}
            <div className="fixed inset-0 bg-gradient-to-b from-[#0a0f14] via-[#0d1117] to-[#050505] z-0" />

            {/* [SCENE] 1. The Book Cover */}
            <AnimatePresence>
                {!isBookOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
                    >
                        <PremiumBookCover
                            name={data.profile?.name || '방문자'}
                            date={data.timestamp}
                            onOpen={handleOpenBook}
                            onBack={handleGoBack}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* [SCENE] 2. Main Content */}
            {isBookOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="w-full max-w-2xl px-4 py-8 flex-1 flex flex-col gap-8 relative z-10"
                >
                    {/* Header */}
                    <header className="sticky top-0 z-40 w-full flex justify-between items-center py-3 px-5 bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl mt-4 shadow-2xl">
                        <button onClick={handleGoBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <Home className="w-5 h-5 text-gray-400 hover:text-white" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary-olive animate-pulse" />
                            <span className="text-xs font-bold tracking-widest text-primary-olive">MIND TOTEM</span>
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase px-2 py-1 bg-white/5 rounded-full">{chapter}</span>
                    </header>

                    {/* Dynamic Chapters */}
                    <div className="min-h-[70vh] relative">
                        <AnimatePresence mode="wait">
                            {chapter === 'intro' && (
                                <IntroChapter
                                    key="intro"
                                    profile={data.profile}
                                    onNext={() => nextChapter('chat')}
                                />
                            )}
                            {chapter === 'chat' && (
                                <ChatHistoryChapter
                                    key="chat"
                                    chatHistory={data.chatHistory || []}
                                    content={data.content}
                                    onNext={() => nextChapter('analysis')}
                                    onPrev={() => nextChapter('intro')}
                                />
                            )}
                            {chapter === 'analysis' && (
                                <AnalysisChapter
                                    key="analysis"
                                    content={data.content}
                                    profile={data.profile}
                                    onNext={() => nextChapter('actions')}
                                    onPrev={() => nextChapter('chat')}
                                />
                            )}
                            {chapter === 'actions' && (
                                <ActionChapter
                                    key="actions"
                                    content={data.content}
                                    onNext={() => nextChapter('end')}
                                    onPrev={() => nextChapter('analysis')}
                                />
                            )}
                            {chapter === 'end' && (
                                <OutroChapter
                                    key="end"
                                    profile={data.profile}
                                    onPrev={() => nextChapter('actions')}
                                    onGoHome={handleGoBack}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Progress Indicator */}
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-40 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        {['intro', 'chat', 'analysis', 'actions', 'end'].map((step) => (
                            <motion.div
                                key={step}
                                className={`rounded-full transition-all duration-500 ${step === chapter ? 'w-6 h-2 bg-gradient-to-r from-primary-olive to-emerald-400' : 'w-2 h-2 bg-gray-700'}`}
                                whileHover={{ scale: 1.2 }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// === Premium Book Cover ===
function PremiumBookCover({ name, date, onOpen, onBack }: { name: string; date: string; onOpen: () => void; onBack: () => void }) {
    return (
        <motion.div
            className="relative w-[320px] h-[450px] perspective-1000"
            initial={{ rotateY: -15 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 1 }}
        >
            {/* Back Button */}
            <button
                onClick={onBack}
                className="absolute -top-12 left-0 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
                <ChevronLeft className="w-4 h-4" /> 채팅으로 돌아가기
            </button>

            {/* Book Cover */}
            <div className="relative w-full h-full bg-gradient-to-br from-[#1a1f2e] via-[#0f1419] to-[#050505] rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-5" />
                <div className="absolute top-4 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-primary-olive/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-primary-olive/50 to-transparent" />

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute w-40 h-40 border border-primary-olive/20 rounded-full"
                    />

                    <Sparkles className="w-10 h-10 text-primary-olive mb-6 animate-pulse" />

                    <h1 className="text-2xl font-serif font-bold text-white mb-2">
                        {name}님의
                    </h1>
                    <h2 className="text-3xl font-serif font-bold bg-gradient-to-r from-primary-olive via-emerald-400 to-primary-olive bg-clip-text text-transparent mb-6">
                        소울 아카이브
                    </h2>

                    <p className="text-xs text-gray-500 mb-8">{new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                    <motion.button
                        onClick={onOpen}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-gradient-to-r from-primary-olive to-emerald-600 text-white font-bold rounded-full shadow-lg shadow-primary-olive/30 flex items-center gap-2"
                    >
                        <BookOpen className="w-5 h-5" />
                        책 펼치기
                    </motion.button>
                </div>

                {/* Corner Decorations */}
                <Star className="absolute top-6 right-6 w-4 h-4 text-primary-olive/30" />
                <Star className="absolute bottom-6 left-6 w-4 h-4 text-primary-olive/30" />
            </div>
        </motion.div>
    );
}

// === Intro Chapter ===
function IntroChapter({ profile, onNext }: { profile: any; onNext: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="flex flex-col items-center text-center space-y-8 pt-8"
        >
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary-olive to-transparent" />

            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
                {profile?.name || '방문자'}님의<br />
                <span className="text-primary-olive">운명 기록서</span>
            </h1>

            <p className="text-gray-400 max-w-md leading-relaxed text-sm">
                당신이 태어난 순간, 우주가 기록한 고유한 진동수를 해석합니다.
                이곳은 당신의 잠재력과 운명이 숨쉬는 비밀의 서재입니다.
            </p>

            <motion.button
                onClick={onNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 px-8 py-4 bg-gradient-to-r from-primary-olive/20 to-emerald-500/20 border border-primary-olive/50 rounded-2xl text-white font-bold flex items-center gap-3 shadow-lg"
            >
                다음으로 <ChevronRight className="w-5 h-5" />
            </motion.button>
        </motion.div>
    );
}

// === Chat History Chapter (NEW!) ===
function ChatHistoryChapter({ chatHistory, content, onNext, onPrev }: { chatHistory: any[]; content: any; onNext: () => void; onPrev: () => void }) {
    // Extract chat from content if available
    const displayContent = content?.saju_analysis || content?.full_text || "AI 분석 내용이 없습니다.";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-serif font-bold text-white">AI 코치의 분석</h2>
            </div>

            {/* Chat Content Display */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/60 border border-white/10 rounded-2xl p-6 backdrop-blur-sm max-h-[50vh] overflow-y-auto">
                <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{displayContent}</ReactMarkdown>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
                <button onClick={onPrev} className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center gap-2">
                    <ChevronLeft className="w-4 h-4" /> 이전
                </button>
                <button onClick={onNext} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-olive to-emerald-600 text-white font-bold flex items-center justify-center gap-2">
                    다음 <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

// === Analysis Chapter ===
function AnalysisChapter({ content, profile, onNext, onPrev }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-primary-olive to-emerald-400 rounded-full" />
                <h2 className="text-2xl font-serif font-bold text-primary-olive">영혼의 설계도</h2>
            </div>

            <div className="bg-gradient-to-br from-gray-900/60 to-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                    <ReactMarkdown>{content?.saju_analysis || content?.full_text || "분석 데이터를 불러오는 중..."}</ReactMarkdown>
                </div>
            </div>

            <div className="flex gap-3">
                <button onClick={onPrev} className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center gap-2">
                    <ChevronLeft className="w-4 h-4" /> 이전
                </button>
                <button onClick={onNext} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-olive to-emerald-600 text-white font-bold flex items-center justify-center gap-2">
                    다음 <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

// === Action Chapter ===
function ActionChapter({ content, onNext, onPrev }: any) {
    const actions = [
        { title: "NOW", subtitle: "30초", desc: content?.action_now || "심호흡 3번하기", color: "from-orange-500 to-red-500" },
        { title: "TODAY", subtitle: "하루", desc: content?.action_today || "하늘 한 번 올려다보기", color: "from-blue-500 to-cyan-500" },
        { title: "WEEK", subtitle: "루틴", desc: content?.action_week || "감사 일기 쓰기", color: "from-purple-500 to-pink-500" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
                <h2 className="text-2xl font-serif font-bold text-blue-400">실천 가이드</h2>
            </div>

            <div className="grid gap-4">
                {actions.map((action, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.15 }}
                        className="relative group"
                    >
                        <div className={`absolute -inset-1 bg-gradient-to-r ${action.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity`} />
                        <div className="relative bg-gray-900/80 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex flex-col items-center justify-center text-white`}>
                                <span className="text-xs font-bold">{action.title}</span>
                                <span className="text-[10px] opacity-80">{action.subtitle}</span>
                            </div>
                            <p className="text-white font-medium flex-1">{action.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex gap-3">
                <button onClick={onPrev} className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center gap-2">
                    <ChevronLeft className="w-4 h-4" /> 이전
                </button>
                <button onClick={onNext} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-olive to-emerald-600 text-white font-bold flex items-center justify-center gap-2">
                    마무리 <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

// === Outro Chapter with PDF & Share ===
function OutroChapter({ profile, onPrev, onGoHome }: { profile: any; onPrev: () => void; onGoHome: () => void }) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const showToastMsg = (msg: string) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: '명심코칭 마인드 토템',
                    text: `${profile?.name || ''}님의 소울 아카이브`,
                    url: window.location.href,
                });
                showToastMsg('✨ 공유되었습니다!');
            } else {
                await navigator.clipboard.writeText(window.location.href);
                showToastMsg('📋 링크가 복사되었습니다!');
            }
        } catch (e) {
            await navigator.clipboard.writeText(window.location.href);
            showToastMsg('📋 링크가 복사되었습니다!');
        }
    };

    const handleDownloadPDF = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        try {
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');
            const canvas = await html2canvas(document.body, { scale: 2, backgroundColor: '#0a0a0a' });
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`마인드토템_${profile?.name || 'user'}.pdf`);
            showToastMsg('🎉 PDF 저장 완료!');
        } catch (e) {
            showToastMsg('PDF 생성 실패');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center space-y-8 py-12 relative"
        >
            {/* Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-primary-olive to-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl font-medium text-sm"
                    >
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            <Sparkles className="w-12 h-12 text-primary-olive animate-pulse" />

            <h2 className="text-3xl font-serif font-bold text-white">
                당신의 이야기는<br /><span className="text-primary-olive">이제 시작입니다.</span>
            </h2>

            <p className="text-gray-400 text-sm max-w-sm">
                이 리포트는 단지 지도일 뿐입니다.<br />
                진짜 여행은 당신의 발걸음으로 완성됩니다.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full max-w-sm mt-6">
                <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
                >
                    <Share2 className="w-5 h-5" /> 공유하기
                </motion.button>

                <motion.button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-primary-olive to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                    {isDownloading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> 생성 중...</>
                    ) : (
                        <><Download className="w-5 h-5" /> PDF 소장</>
                    )}
                </motion.button>

                <button onClick={onPrev} className="w-full py-3 text-gray-500 hover:text-white transition-colors text-sm flex items-center justify-center gap-2">
                    <ChevronLeft className="w-4 h-4" /> 이전으로
                </button>

                <button onClick={onGoHome} className="w-full py-3 text-gray-500 hover:text-white transition-colors text-sm flex items-center justify-center gap-2">
                    <Home className="w-4 h-4" /> 채팅으로 돌아가기
                </button>
            </div>
        </motion.div>
    );
}
