'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Sparkles, CheckCircle2, X, Send, ShieldCheck, Heart, Radio } from 'lucide-react';

interface HealingSongApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultName?: string;
    defaultOrder?: string;
}

export default function HealingSongApplyModal({
    isOpen,
    onClose,
    defaultName = '',
    defaultOrder = ''
}: HealingSongApplyModalProps) {
    const [name, setName] = useState(defaultName || '');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [element, setElement] = useState('금(金)');
    const [frequency, setFrequency] = useState('432Hz');
    const [theme, setTheme] = useState('수면/휴식');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [receiptCode, setReceiptCode] = useState('');

    useEffect(() => {
        if (defaultName) setName(defaultName);
        // 기신청 내역 확인
        if (typeof window !== 'undefined') {
            const savedReceipt = localStorage.getItem('myeongsim_healing_song_receipt');
            if (savedReceipt) {
                setReceiptCode(savedReceipt);
            }
        }
    }, [defaultName]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = `CR-SONG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setReceiptCode(code);
        setIsSubmitted(true);

        if (typeof window !== 'undefined') {
            localStorage.setItem('myeongsim_healing_song_applied', 'true');
            localStorage.setItem('myeongsim_healing_song_receipt', code);
            localStorage.setItem('myeongsim_healing_song_data', JSON.stringify({
                name,
                email,
                phone,
                element,
                frequency,
                theme,
                message,
                appliedAt: new Date().toISOString()
            }));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md bg-[#111C2F] border border-purple-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-left space-y-5 overflow-hidden relative"
            >
                {/* 상단 장식 빛 */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* 헤더 */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="size-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                            <Music size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-400/20">
                                독자 1위 특전
                            </span>
                            <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                                1:1 맞춤 헌정 힐링송 무료 작곡
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                        <p className="text-[11px] text-gray-300 leading-relaxed bg-purple-950/40 border border-purple-500/20 p-3 rounded-xl font-medium">
                            🎵 책 2p·308p 수록 혜택: 독자님의 사주 오행 기질과 주파수를 정밀 분석하여, 세상에 단 하나뿐인 전용 치유 음원을 작곡하여 선물해 드립니다.
                        </p>

                        {/* 이름 & 연락처 */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-300">신청자 성함</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="성함 입력"
                                    className="w-full h-10 px-3 rounded-xl bg-[#0a111c] border border-white/10 text-white focus:outline-none focus:border-purple-400 font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-300">이메일 주소 (MP3 수령용)</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@gmail.com"
                                    className="w-full h-10 px-3 rounded-xl bg-[#0a111c] border border-white/10 text-white focus:outline-none focus:border-purple-400 font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {/* 사주 일간 & 주파수 */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-300">내 사주 중심 오행</label>
                                <select
                                    value={element}
                                    onChange={(e) => setElement(e.target.value)}
                                    className="w-full h-10 px-3 rounded-xl bg-[#0a111c] border border-white/10 text-white focus:outline-none focus:border-purple-400 font-medium cursor-pointer"
                                >
                                    <option value="금(金)">금(金) - 다이아몬드/결단</option>
                                    <option value="목(木)">목(木) - 숲/성장/창의</option>
                                    <option value="화(火)">화(火) - 태양/열정/확장</option>
                                    <option value="토(土)">토(土) - 대지/포용/안정</option>
                                    <option value="수(水)">수(水) - 깊은 바다/지혜/유연</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-300">희망 치유 주파수</label>
                                <select
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                    className="w-full h-10 px-3 rounded-xl bg-[#0a111c] border border-white/10 text-white focus:outline-none focus:border-purple-400 font-medium cursor-pointer"
                                >
                                    <option value="432Hz">432Hz (우주 맥박, 깊은 이완)</option>
                                    <option value="528Hz">528Hz (기적의 주파수, DNA 복원)</option>
                                </select>
                            </div>
                        </div>

                        {/* 치유 테마 */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-300">희망 힐링 테마</label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {[
                                    { id: '수면/휴식', label: '🌙 깊은 수면 & 번아웃 회복' },
                                    { id: '초집중/영감', label: '💡 초집중 & 영감 발현' },
                                    { id: '감정정화', label: '🧘 불안/분노/조급함 정화' },
                                    { id: '풍요/확장', label: '💎 풍요 & 자기 확신 증폭' }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setTheme(t.id)}
                                        className={`p-2 rounded-xl text-[11px] font-bold transition-all text-left border cursor-pointer ${
                                            theme === t.id
                                                ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-sm'
                                                : 'bg-[#0a111c] border-white/10 text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 추가 요청 사항 */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-300">작가 및 사운드 팀에 전할 이야기 (선택)</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="현재 겪고 계신 마음의 고민이나 바라는 변화를 편하게 적어주세요."
                                rows={2}
                                className="w-full p-2.5 rounded-xl bg-[#0a111c] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 text-xs resize-none"
                            />
                        </div>

                        {/* 제출 버튼 */}
                        <button
                            type="submit"
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20 cursor-pointer active:scale-98 transition-all"
                        >
                            <Send size={14} />
                            <span>1:1 헌정 힐링송 작곡 무료 신청 접수</span>
                        </button>
                    </form>
                ) : (
                    /* 접수 완료 화면 */
                    <div className="py-6 space-y-4 text-center">
                        <div className="size-16 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center mx-auto text-purple-300 animate-bounce">
                            <Sparkles size={32} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-white">
                                신청이 성공적으로 접수되었습니다!
                            </h3>
                            <p className="text-xs text-gray-300">
                                접수 번호: <span className="font-mono text-purple-300 font-bold">{receiptCode}</span>
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left text-xs text-gray-300 space-y-2">
                            <p className="font-bold text-white flex items-center gap-1">
                                <CheckCircle2 size={13} className="text-emerald-400" />
                                <span>{name}님의 {element} 기질 기반 {frequency} 음원 작업 착수</span>
                            </p>
                            <p className="text-[11px] leading-relaxed text-gray-400">
                                입력해 주신 이메일(<span className="text-gray-200">{email}</span>)로 2~3일 내에 고음질 마스터링 MP3 파일과 사주 주파수 해설서가 안전하게 발송됩니다.
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                        >
                            확인 및 닫기
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
