'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Sparkles, Music, Play, Pause, Volume2, VolumeX,
    RotateCcw, Heart, Share2, Copy, Check, ChevronRight,
    Wind, ShieldAlert, Brain, Flame, BatteryLow, Sparkle
} from 'lucide-react';
import {
    generateZeroPointMusicTrack,
    EMOTIONAL_STATE_OPTIONS,
    EmotionalState,
    ZeroPointTrackInfo
} from '@/lib/engine/zeroPointMusicEngine';
import { zeroPointSoundEngine } from '@/lib/sound/zeroPointSoundEngine';
import { useReportStore } from '@/store/useReportStore';

interface ZeroPointMusicModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile?: any;
}

export default function ZeroPointMusicModal({
    isOpen,
    onClose,
    userProfile
}: ZeroPointMusicModalProps) {
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
    const [selectedEmotion, setSelectedEmotion] = useState<EmotionalState>('rush');
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0.5);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [playSeconds, setPlaySeconds] = useState<number>(0);
    const [copiedLyrics, setCopiedLyrics] = useState<boolean>(false);
    const [breathText, setBreathText] = useState<string>('천천히 숨을 들이쉬세요...');
    const [breathScale, setBreathScale] = useState<number>(1);

    // 글로벌 스토어와 프로필 병합
    const globalReportData = useReportStore.getState().reportData;
    const effectiveProfile = {
        ...globalReportData,
        ...userProfile,
        saju: userProfile?.saju || globalReportData?.saju
    };

    const trackInfo: ZeroPointTrackInfo = generateZeroPointMusicTrack(
        effectiveProfile,
        selectedEmotion
    );

    // 음악 재생 타이머
    useEffect(() => {
        let timer: any = null;
        if (isPlaying) {
            timer = setInterval(() => {
                setPlaySeconds(prev => (prev >= 180 ? 0 : prev + 1));
            }, 1000);
        } else {
            if (timer) clearInterval(timer);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isPlaying]);

    // 모달 닫힐 때 오디오 정지
    useEffect(() => {
        if (!isOpen) {
            zeroPointSoundEngine.stop();
            setIsPlaying(false);
            setCurrentStep(1);
            setPlaySeconds(0);
        }
    }, [isOpen]);

    // STEP 3 명상 호흡 가이드 타이머
    useEffect(() => {
        let step3Timer: any = null;
        if (currentStep === 3) {
            setBreathText('천천히 숨을 들이쉬고... (Inhale)');
            setBreathScale(1.3);

            const t1 = setTimeout(() => {
                setBreathText('잠시 멈추어 고요를 느끼고... (Hold)');
            }, 2500);

            const t2 = setTimeout(() => {
                setBreathText('부드럽게 내쉬세요... (Exhale)');
                setBreathScale(0.9);
            }, 4500);

            step3Timer = setTimeout(() => {
                setCurrentStep(4);
                // 자동으로 힐링 오행 음악 재생 시작
                zeroPointSoundEngine.play(trackInfo.targetElement);
                zeroPointSoundEngine.setVolume(volume);
                setIsPlaying(true);
            }, 6500);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(step3Timer);
            };
        }
    }, [currentStep, trackInfo.targetElement, volume]);

    const handlePlayPause = () => {
        if (isPlaying) {
            zeroPointSoundEngine.stop();
            setIsPlaying(false);
        } else {
            zeroPointSoundEngine.play(trackInfo.targetElement);
            zeroPointSoundEngine.setVolume(isMuted ? 0 : volume);
            setIsPlaying(true);
        }
    };

    const handleVolumeChange = (newVol: number) => {
        setVolume(newVol);
        if (isMuted && newVol > 0) setIsMuted(false);
        zeroPointSoundEngine.setVolume(newVol);
    };

    const handleToggleMute = () => {
        if (isMuted) {
            setIsMuted(false);
            zeroPointSoundEngine.setVolume(volume);
        } else {
            setIsMuted(true);
            zeroPointSoundEngine.setVolume(0);
        }
    };

    const handleCopyLyrics = () => {
        const fullText = `[${trackInfo.trackTitle}]\n${trackInfo.subTitle}\n\n` +
            trackInfo.lyricsVerses.map(v => `${v.timeLabel} ${v.line}`).join('\n') +
            `\n\n${trackInfo.myeongsimCoaching}`;
        navigator.clipboard.writeText(fullText);
        setCopiedLyrics(true);
        setTimeout(() => setCopiedLyrics(false), 2000);
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-slate-900 border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-950/60">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 border border-amber-500/30 text-amber-300">
                                <Music className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                                    <span>사주 맞춤 제로포인트 힐링 사운드</span>
                                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono border border-amber-500/30">
                                        432Hz 테라피
                                    </span>
                                </h3>
                                <p className="text-[10.5px] text-gray-400">오행 불균형 해소 & 나만의 영혼 에세이 송</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Step Progress Bar */}
                    <div className="grid grid-cols-4 gap-1 p-2 bg-slate-950/40 border-b border-white/5 text-[10px] text-center font-bold">
                        {[
                            { step: 1, label: '1. 상태 진단' },
                            { step: 2, label: '2. 오행 처방' },
                            { step: 3, label: '3. 호흡 명상' },
                            { step: 4, label: '4. 힐링 플레이어' }
                        ].map(s => (
                            <div
                                key={s.step}
                                className={`py-1.5 rounded-lg transition-all ${
                                    currentStep === s.step
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                        : currentStep > s.step
                                        ? 'text-emerald-400'
                                        : 'text-gray-500'
                                }`}
                            >
                                {s.label}
                            </div>
                        ))}
                    </div>

                    {/* Body Content */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs hide-scrollbar">
                        
                        {/* ========================================================
                            STEP 1: 사주 확인 & 현재 감정 상태 선택
                            ======================================================== */}
                        {currentStep === 1 && (
                            <div className="space-y-4 animate-fade-in">
                                {/* User Saju Pill Box */}
                                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-2">
                                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold border border-amber-400/30">
                                        {effectiveProfile?.userName || '대표'} 님의 사주 원식
                                    </span>
                                    <h4 className="text-sm font-bold text-white">
                                        {trackInfo.subTitle}
                                    </h4>
                                    <div className="flex justify-center gap-2 pt-1">
                                        <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-mono font-bold text-xs border border-slate-700">
                                            {effectiveProfile?.saju?.yearGan || '丙'}{effectiveProfile?.saju?.yearJi || '辰'}년
                                        </span>
                                        <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-mono font-bold text-xs border border-slate-700">
                                            {effectiveProfile?.saju?.monthGan || '丁'}{effectiveProfile?.saju?.monthJi || '酉'}월
                                        </span>
                                        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-200 font-mono font-bold text-xs border border-amber-500/40 shadow-sm">
                                            {effectiveProfile?.saju?.dayGan || '甲'}{effectiveProfile?.saju?.dayJi || '子'}일 (본원)
                                        </span>
                                        <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-mono font-bold text-xs border border-slate-700">
                                            {effectiveProfile?.saju?.timeGan || '庚'}{effectiveProfile?.saju?.timeJi || '午'}시
                                        </span>
                                    </div>
                                </div>

                                {/* Emotional State Selection */}
                                <div className="space-y-2">
                                    <label className="font-bold text-gray-300 flex items-center gap-1.5 text-xs">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Q. 오늘 마음에서 가장 내려놓고 싶은 상태는 무엇인가요?</span>
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {EMOTIONAL_STATE_OPTIONS.map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setSelectedEmotion(opt.id)}
                                                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-2.5 ${
                                                    selectedEmotion === opt.id
                                                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                                                        : 'bg-slate-950/60 border-slate-800 text-gray-300 hover:border-slate-700 hover:bg-slate-900'
                                                }`}
                                            >
                                                <span className="text-lg">{opt.icon}</span>
                                                <div>
                                                    <div className="font-bold text-xs text-white">{opt.label}</div>
                                                    <div className="text-[10.5px] text-gray-400 mt-0.5">{opt.hint}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setCurrentStep(2)}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                                >
                                    <span>사주 맞춤 오행 처방 리포트 확인하기</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* ========================================================
                            STEP 2: 오행 처방 진단 리포트 (Sound Remedy)
                            ======================================================== */}
                        {currentStep === 2 && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10.5px] font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                                            {trackInfo.albumArtTheme.elementBadge}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-mono">
                                            BPM: {trackInfo.remedyConfig.bpm} · {trackInfo.remedyConfig.baseFrequency}Hz
                                        </span>
                                    </div>

                                    <h4 className="text-sm font-bold text-white">
                                        {trackInfo.remedyConfig.title}
                                    </h4>

                                    <p className="text-[11.5px] text-gray-300 leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                                        {trackInfo.sajuDiagnosis}
                                    </p>

                                    <div className="space-y-2 text-[11px]">
                                        <div className="flex items-start justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                                            <span className="text-gray-400">🎻 처방 악기 구성:</span>
                                            <span className="font-bold text-amber-200 text-right max-w-[200px]">
                                                {trackInfo.remedyConfig.instruments}
                                            </span>
                                        </div>
                                        <div className="flex items-start justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                                            <span className="text-gray-400">🌊 치유 효과:</span>
                                            <span className="text-emerald-300 text-right max-w-[200px]">
                                                {trackInfo.remedyConfig.description}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-xs transition-colors cursor-pointer"
                                    >
                                        이전
                                    </button>
                                    <button
                                        onClick={() => setCurrentStep(3)}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        <span>제로포인트 음악 생성 & 5초 명상</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ========================================================
                            STEP 3: 제로포인트 5초 명상 호흡 가이드
                            ======================================================== */}
                        {currentStep === 3 && (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                                <motion.div
                                    animate={{ scale: breathScale }}
                                    transition={{ duration: 2.5, ease: 'easeInOut' }}
                                    className="w-36 h-36 rounded-full bg-gradient-to-tr from-amber-400/30 via-indigo-500/30 to-emerald-400/30 border-2 border-amber-400/50 flex items-center justify-center shadow-2xl shadow-amber-500/20 relative"
                                >
                                    <div className="w-24 h-24 rounded-full bg-slate-950/90 border border-white/20 flex flex-col items-center justify-center text-amber-300 font-bold">
                                        <span className="text-lg">0</span>
                                        <span className="text-[10px] tracking-widest text-gray-400 uppercase font-mono">Zero Point</span>
                                    </div>
                                </motion.div>

                                <div className="space-y-2">
                                    <div className="text-xs text-amber-400 font-bold uppercase tracking-widest">
                                        Myeongsim Sound Therapy
                                    </div>
                                    <h4 className="text-base font-bold text-white transition-all">
                                        {breathText}
                                    </h4>
                                    <p className="text-[11px] text-gray-400 max-w-xs">
                                        사주의 치우친 기운을 비워내고 고요한 0점으로 귀환 중입니다...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ========================================================
                            STEP 4: 제로포인트 감성 플레이어 & 실시간 가사 싱크
                            ======================================================== */}
                        {currentStep === 4 && (
                            <div className="space-y-4 animate-fade-in">
                                {/* Album Art Card */}
                                <div className={`w-full p-4 rounded-3xl bg-gradient-to-br ${trackInfo.albumArtTheme.bgGradient} border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[160px]`}>
                                    <div className="flex justify-between items-start z-10">
                                        <span className="text-[10px] font-bold bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full text-white border border-white/20">
                                            {trackInfo.albumArtTheme.icon} {trackInfo.albumArtTheme.elementBadge}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={handleCopyLyrics}
                                                className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white transition-colors cursor-pointer text-[10px] flex items-center gap-1"
                                                title="가사 복사"
                                            >
                                                {copiedLyrics ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                                <span>{copiedLyrics ? '복사됨' : '가사 복사'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Animated Waveform Indicator */}
                                    <div className="flex items-center justify-center gap-1 my-2 z-10">
                                        {[40, 70, 95, 60, 85, 50, 90, 65, 45, 80, 55, 75, 40].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{
                                                    height: isPlaying ? [10, h * 0.4, 10] : 6
                                                }}
                                                transition={{
                                                    duration: 0.8 + (i % 3) * 0.2,
                                                    repeat: Infinity,
                                                    ease: 'easeInOut'
                                                }}
                                                className="w-1 rounded-full bg-amber-400/80"
                                            />
                                        ))}
                                    </div>

                                    <div className="z-10">
                                        <h3 className="text-base font-bold text-white drop-shadow">
                                            {trackInfo.trackTitle}
                                        </h3>
                                        <p className="text-[11px] text-gray-300 drop-shadow">
                                            {trackInfo.subTitle}
                                        </p>
                                    </div>
                                </div>

                                {/* Audio Controls Panel */}
                                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                                    {/* Progress Timeline */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-mono text-gray-400">
                                            <span>{formatTime(playSeconds)}</span>
                                            <span className="text-amber-300 font-bold">432Hz Solfeggio Resonance</span>
                                            <span>03:00</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden relative">
                                            <div
                                                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                                                style={{ width: `${(playSeconds / 180) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Buttons & Volume */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleToggleMute}
                                                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                            >
                                                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                                            </button>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.05"
                                                value={isMuted ? 0 : volume}
                                                onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                                                className="w-16 h-1 bg-slate-800 accent-amber-400 rounded-lg cursor-pointer"
                                            />
                                        </div>

                                        {/* Main Play/Pause Button */}
                                        <button
                                            onClick={handlePlayPause}
                                            className="w-11 h-11 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                                        >
                                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                                        </button>

                                        <button
                                            onClick={() => {
                                                setPlaySeconds(0);
                                                zeroPointSoundEngine.play(trackInfo.targetElement);
                                                setIsPlaying(true);
                                            }}
                                            className="text-gray-400 hover:text-amber-300 transition-colors cursor-pointer p-1.5"
                                            title="처음부터 다시 재생"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Lyrics & Coaching Essay Box */}
                                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                                    <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                        <span>나만의 제로포인트 에세이 가사</span>
                                    </div>

                                    <div className="space-y-2 pl-2 border-l-2 border-amber-500/40">
                                        {trackInfo.lyricsVerses.map((verse, vIdx) => (
                                            <div key={vIdx} className="space-y-0.5">
                                                <span className="text-[9.5px] font-mono text-gray-500">{verse.timeLabel}</span>
                                                <p className="text-xs text-gray-200 font-medium leading-relaxed">
                                                    "{verse.line}"
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed">
                                        {trackInfo.myeongsimCoaching}
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        zeroPointSoundEngine.stop();
                                        setIsPlaying(false);
                                        onClose();
                                    }}
                                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
                                >
                                    마음 리셋 완료 (닫기)
                                </button>
                            </div>
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
