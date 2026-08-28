'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Sparkles, Music, Play, Pause, Volume2, VolumeX,
    RotateCcw, Heart, Share2, Copy, Check, ChevronRight,
    Wind, ShieldAlert, Brain, Flame, BatteryLow, Sparkle,
    Download, Loader2, Briefcase, ShieldCheck, CheckCircle2,
    ChevronDown, ChevronUp, DollarSign, Lightbulb
} from 'lucide-react';
import {
    generateZeroPointMusicTrack,
    EMOTIONAL_STATE_OPTIONS,
    EmotionalState,
    ZeroPointTrackInfo
} from '@/lib/engine/zeroPointMusicEngine';
import { parseSajuFourPillars } from '@/lib/engine/ntsBusinessRecommender';
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
    const [includeName, setIncludeName] = useState<boolean>(true); // [NEW] 이름 포함 여부 (기본 true: 1:1 헌정곡)
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
        userName: userProfile?.userName || userProfile?.name || globalReportData?.userName || (globalReportData as any)?.name || '대표',
        saju: userProfile?.saju || globalReportData?.saju
    };

    const pillars = parseSajuFourPillars(effectiveProfile?.saju);

    const trackInfo: ZeroPointTrackInfo = generateZeroPointMusicTrack(
        effectiveProfile,
        selectedEmotion,
        includeName
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

    const [enableVoice, setEnableVoice] = useState<boolean>(true);
    const [activeVerseIdx, setActiveVerseIdx] = useState<number>(0);

    // 가사 음성 나레이션 & 하이라이트 싱크
    const voiceTimeoutsRef = useRef<any[]>([]);

    const clearVoiceTimers = () => {
        voiceTimeoutsRef.current.forEach(t => clearTimeout(t));
        voiceTimeoutsRef.current = [];
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    };

    const startVoiceNarration = () => {
        clearVoiceTimers();
        if (!enableVoice || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

        const verses = trackInfo.lyricsVerses;
        const delays = [1500, 14000, 27000, 40000]; // 4구절 딜레이

        verses.forEach((verse, idx) => {
            const delay = delays[idx] || (idx * 13000);
            const timer = setTimeout(() => {
                setActiveVerseIdx(idx);
                
                const utterance = new SpeechSynthesisUtterance(verse.line);
                utterance.lang = 'ko-KR';
                utterance.rate = 0.82; // 차분하고 부드러운 명상 템포
                utterance.pitch = 0.95;
                utterance.volume = isMuted ? 0 : 0.9;

                // 가능한 경우 가장 자연스러운 한국어 보이스 선택
                const voices = window.speechSynthesis.getVoices();
                const koVoice = voices.find(v => v.lang.includes('ko') && (v.name.includes('Natural') || v.name.includes('Yuna') || v.name.includes('Google') || v.name.includes('Heami')));
                if (koVoice) utterance.voice = koVoice;

                window.speechSynthesis.speak(utterance);
            }, delay);

            voiceTimeoutsRef.current.push(timer);
        });
    };

    // 음악 재생/정지 시 음성 제어
    useEffect(() => {
        if (isPlaying) {
            startVoiceNarration();
        } else {
            clearVoiceTimers();
            setActiveVerseIdx(-1);
        }
        return () => {
            clearVoiceTimers();
        };
    }, [isPlaying, enableVoice]);

    // [NEW] 🎧 공식 보컬 완성곡 샘플 플레이어 ('이름 포함', '이름 미포함', '맑은 물')
    const [currentSampleTrack, setCurrentSampleTrack] = useState<'name_soyoung' | 'light_breath' | 'clean_water'>('name_soyoung');
    const [isSamplePlaying, setIsSamplePlaying] = useState<boolean>(false);
    const [sampleProgress, setSampleProgress] = useState<number>(0);
    const [sampleDuration, setSampleDuration] = useState<number>(0);
    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
    const [isPaidSuccess, setIsPaidSuccess] = useState<boolean>(false);
    const sampleAudioRef = useRef<HTMLAudioElement | null>(null);

    const playSampleTrack = (track: 'name_soyoung' | 'light_breath' | 'clean_water') => {
        let audioSrc = '/sample_name_soyoung.wav';
        if (track === 'light_breath') audioSrc = '/sample_light_breath.wav';
        else if (track === 'clean_water') audioSrc = '/sample_essay_song.wav';
        
        if (sampleAudioRef.current) {
            sampleAudioRef.current.pause();
        }

        const audio = new Audio(audioSrc);
        audio.ontimeupdate = () => {
            setSampleProgress(audio.currentTime);
            if (audio.duration && !isNaN(audio.duration)) {
                setSampleDuration(audio.duration);
            }
        };
        audio.onended = () => {
            setIsSamplePlaying(false);
            setSampleProgress(0);
        };
        audio.onerror = (e) => {
            console.error("Sample audio load error:", e);
        };

        sampleAudioRef.current = audio;
        setCurrentSampleTrack(track);

        // 사주 힐링 BGM이 켜져있다면 중지
        if (isPlaying) {
            zeroPointSoundEngine.stop();
            clearVoiceTimers();
            setIsPlaying(false);
        }

        audio.play().then(() => {
            setIsSamplePlaying(true);
        }).catch(err => {
            console.error("Audio playback error:", err);
        });
    };

    const toggleSamplePlay = (track: 'name_soyoung' | 'light_breath' | 'clean_water' = currentSampleTrack) => {
        if (currentSampleTrack !== track || !sampleAudioRef.current) {
            playSampleTrack(track);
            return;
        }

        if (isSamplePlaying) {
            sampleAudioRef.current.pause();
            setIsSamplePlaying(false);
        } else {
            if (isPlaying) {
                zeroPointSoundEngine.stop();
                clearVoiceTimers();
                setIsPlaying(false);
            }
            sampleAudioRef.current.play().then(() => {
                setIsSamplePlaying(true);
            }).catch(err => {
                console.error("Audio playback error:", err);
            });
        }
    };

    const handleSampleSeek = (newTime: number) => {
        if (sampleAudioRef.current) {
            sampleAudioRef.current.currentTime = newTime;
            setSampleProgress(newTime);
        }
    };

    // 모달 닫힐 때 오디오 및 음성 정지
    useEffect(() => {
        if (!isOpen) {
            zeroPointSoundEngine.stop();
            clearVoiceTimers();
            setIsPlaying(false);
            setCurrentStep(1);
            setPlaySeconds(0);
            setActiveVerseIdx(-1);
            if (sampleAudioRef.current) {
                sampleAudioRef.current.pause();
                sampleAudioRef.current.currentTime = 0;
            }
            setIsSamplePlaying(false);
            setSampleProgress(0);
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
            clearVoiceTimers();
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

    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    const handleDownloadAudio = async () => {
        try {
            setIsDownloading(true);
            const blob = await zeroPointSoundEngine.exportWavAudio(trackInfo.targetElement, 45);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const safeName = (effectiveProfile?.userName || '대표').replace(/\s+/g, '_');
            const fileName = `${safeName}_기질_1대1_맞춤_코칭_에세이노래_432Hz.wav`;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Audio download error:', err);
            alert('음원 생성 및 다운로드 중 문제가 발생했습니다.');
        } finally {
            setIsDownloading(false);
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
                                    <span>기질 1:1 맞춤 코칭 에세이노래</span>
                                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono border border-amber-500/30">
                                        432Hz 주파수 리셋
                                    </span>
                                </h3>
                                <p className="text-[10.5px] text-gray-400">선천적 기질의 불균형을 알맞게 조율하는 432Hz 힐링 에세이 사운드</p>
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

                                {/* [NEW] 🌟 대표 사주 맞춤 제작 실사례: 이*영 님 (戊戌일주) '가벼워진 숨' 힐링노래 카드 */}
                                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-indigo-950/60 border border-amber-500/40 shadow-2xl space-y-3.5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                                    {/* Header & Badges */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black px-2.5 py-0.5 rounded-full shadow-sm">
                                                🌟 실제 맞춤제작 사례
                                            </span>
                                            <span className="text-[10px] text-amber-300 font-mono font-bold">
                                                이*영 님 (24세) 헌정곡
                                            </span>
                                        </div>
                                        <span className="text-[9.5px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                                            432Hz Full Vocal
                                        </span>
                                    </div>

                                    {/* Title & Saju Pillars */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-baseline justify-between">
                                            <h4 className="text-base font-extrabold text-white flex items-center gap-1.5">
                                                <span>가벼워진 숨</span>
                                                <span className="text-xs font-normal text-amber-300">| 戊戌 기질 맞춤 힐링노래</span>
                                            </h4>
                                        </div>

                                        {/* 만세력 4주 8글자 칩 */}
                                        <div className="flex items-center gap-1.5 text-[10px]">
                                            <span className="px-2 py-0.5 rounded bg-slate-950/80 text-gray-300 border border-slate-800 font-mono">
                                                壬午년
                                            </span>
                                            <span className="px-2 py-0.5 rounded bg-slate-950/80 text-gray-300 border border-slate-800 font-mono">
                                                癸丑월
                                            </span>
                                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 font-mono shadow-sm">
                                                戊戌일 (본원)
                                            </span>
                                            <span className="px-2 py-0.5 rounded bg-slate-950/80 text-gray-300 border border-slate-800 font-mono">
                                                甲寅시
                                            </span>
                                        </div>
                                    </div>

                                    {/* Emotional Prescription Catchphrase */}
                                    <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1">
                                        <div className="text-[11.5px] font-bold text-amber-200 flex items-center gap-1.5">
                                            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                                            <span>"힘들 때 수시로 들으세요."</span>
                                        </div>
                                        <p className="text-[10.5px] text-gray-300 leading-relaxed">
                                            광활한 대지(戊戌)처럼 모든 짐을 혼자 짊어지려 할 때, 무거운 숨을 가볍게 비워내고 쉼을 선물하는 432Hz 힐링 처방입니다.
                                        </p>
                                    </div>

                                    {/* Track Select Tabs (이름 포함 vs 이름 미포함 vs 맑은 물) */}
                                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-[10px]">
                                        <button
                                            onClick={() => playSampleTrack('name_soyoung')}
                                            className={`py-1.5 px-1 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-0.5 text-center ${
                                                currentSampleTrack === 'name_soyoung'
                                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            <span>💖 이름 포함 (소영)</span>
                                        </button>
                                        <button
                                            onClick={() => playSampleTrack('light_breath')}
                                            className={`py-1.5 px-1 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-0.5 text-center ${
                                                currentSampleTrack === 'light_breath'
                                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            <span>🌿 이름 미포함</span>
                                        </button>
                                        <button
                                            onClick={() => playSampleTrack('clean_water')}
                                            className={`py-1.5 px-1 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-0.5 text-center ${
                                                currentSampleTrack === 'clean_water'
                                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            <span>💧 맑은 물</span>
                                        </button>
                                    </div>

                                    {/* Audio Player & Progress Bar */}
                                    <div className="space-y-2 bg-slate-950/90 p-3 rounded-2xl border border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleSamplePlay(currentSampleTrack)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                                                        isSamplePlaying
                                                            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 animate-pulse'
                                                            : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/30'
                                                    }`}
                                                >
                                                    {isSamplePlaying ? (
                                                        <Pause className="w-4 h-4 fill-current" />
                                                    ) : (
                                                        <Play className="w-4 h-4 fill-current ml-0.5" />
                                                    )}
                                                </button>
                                                <div>
                                                    <div className="text-xs font-bold text-white">
                                                        {currentSampleTrack === 'name_soyoung'
                                                            ? '가벼워진 숨 (이*영 님 헌정곡: 이름 포함)'
                                                            : currentSampleTrack === 'light_breath'
                                                            ? '가벼워진 숨 (순수 에세이: 이름 미포함)'
                                                            : '맑은 물이 머무는 곳'}
                                                    </div>
                                                    <div className="text-[9.5px] text-gray-400">
                                                        {isSamplePlaying ? '🎵 실제 보컬 완성곡 재생 중...' : '재생 버튼을 눌러 들어보세요'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-[10px] font-mono text-amber-300 font-bold">
                                                {formatTime(Math.floor(sampleProgress))} / {sampleDuration > 0 ? formatTime(Math.floor(sampleDuration)) : '03:40'}
                                            </div>
                                        </div>

                                        <input
                                            type="range"
                                            min="0"
                                            max={sampleDuration || 220}
                                            step="0.5"
                                            value={sampleProgress}
                                            onChange={(e) => handleSampleSeek(parseFloat(e.target.value))}
                                            className="w-full h-1.5 bg-slate-800 accent-amber-400 rounded-lg cursor-pointer"
                                        />
                                    </div>

                                    {/* [NEW] 💖 구입을 망설이는 분들을 위한 따뜻한 감성 위로 멘트 */}
                                    <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-100 text-[11px] leading-relaxed">
                                        <p className="font-medium text-gray-200">
                                            "본인의 기질에 맞는, <strong className="text-amber-300 font-bold">본인의 이름이 들어간 당신만의 1:1 맞춤 코칭 에세이 가사노래</strong>입니다."
                                        </p>
                                        <p className="text-amber-300 font-extrabold text-[11.5px] mt-1">
                                            ✨ 힘들 때마다 들으시면서, 제로포인트로 돌아오세요.
                                        </p>
                                    </div>

                                    {/* 4,900원 결제/평생소장 버튼 */}
                                    <button
                                        onClick={() => setShowPaymentModal(true)}
                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5"
                                    >
                                        <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                                        <span>✨ 4,900원 결제하고 내 사주 맞춤 노래 평생 소장하기</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* [NEW] 💖 이름 포함 여부 선택 옵션 (고객 선택 메뉴) */}
                                <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                                    <label className="font-bold text-gray-200 flex items-center gap-1.5 text-xs">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                        <span>노래 가사 유형 선택 (내 이름 포함 여부)</span>
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIncludeName(true)}
                                            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-2.5 ${
                                                includeName
                                                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                                                    : 'bg-slate-900/60 border-slate-800 text-gray-400 hover:border-slate-700'
                                            }`}
                                        >
                                            <span className="text-xl">💖</span>
                                            <div>
                                                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                                                    <span>내 이름 포함 1:1 헌정곡</span>
                                                    <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-bold">추천</span>
                                                </div>
                                                <div className="text-[10.5px] text-gray-300 mt-0.5 leading-snug">
                                                    가사 속에 '{effectiveProfile.userName} 님'의 이름을 직접 불러주어 깊은 감동과 위로를 줍니다.
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setIncludeName(false)}
                                            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-2.5 ${
                                                !includeName
                                                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                                                    : 'bg-slate-900/60 border-slate-800 text-gray-400 hover:border-slate-700'
                                            }`}
                                        >
                                            <span className="text-xl">🌿</span>
                                            <div>
                                                <div className="font-bold text-xs text-white">
                                                    이름 미포함 순수 에세이곡
                                                </div>
                                                <div className="text-[10.5px] text-gray-300 mt-0.5 leading-snug">
                                                    이름 없이 은은한 시적 은유로 마음을 차분하게 이완하고 힐링합니다.
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* User Saju Pill Box */}
                                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-2">
                                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold border border-amber-400/30">
                                        {effectiveProfile.userName} 님의 선천적 기질 원식
                                    </span>
                                    <h4 className="text-sm font-bold text-white">
                                        {trackInfo.subTitle}
                                    </h4>
                                    <div className="flex justify-center gap-2 pt-1">
                                        <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-mono font-bold text-xs border border-slate-700">
                                            {pillars.yGan}{pillars.yJi}년
                                        </span>
                                        <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-mono font-bold text-xs border border-slate-700">
                                            {pillars.mGan}{pillars.mJi}월
                                        </span>
                                        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-200 font-mono font-bold text-xs border border-amber-500/40 shadow-sm">
                                            {pillars.dGan}{pillars.dJi}일 (본원)
                                        </span>
                                        <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-mono font-bold text-xs border border-slate-700">
                                            {pillars.tGan}{pillars.tJi}시
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
                                    <span>기질 맞춤 튜닝 처방 리포트 확인하기</span>
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
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={handleDownloadAudio}
                                                disabled={isDownloading}
                                                className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all cursor-pointer text-[10.5px] flex items-center gap-1 shadow-md disabled:opacity-50"
                                                title="432Hz 고음질 WAV 음원 소장 다운로드"
                                            >
                                                {isDownloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                                                <span>{isDownloading ? '생성중...' : '음원 다운로드'}</span>
                                            </button>
                                            <button
                                                onClick={handleCopyLyrics}
                                                className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white transition-colors cursor-pointer text-[10px] flex items-center gap-1"
                                                title="가사 복사"
                                            >
                                                {copiedLyrics ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                                <span>{copiedLyrics ? '복사됨' : '가사'}</span>
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
                                    <div className="flex items-center justify-between">
                                        <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                            <span>나만의 기질 조율 에세이 가사</span>
                                        </div>
                                        {/* Voice Narration Toggle */}
                                        <button
                                            onClick={() => setEnableVoice(!enableVoice)}
                                            className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                                                enableVoice
                                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                                                    : 'bg-slate-900 text-gray-400 border-slate-700 hover:text-gray-200'
                                            }`}
                                        >
                                            <span>{enableVoice ? '🎤 감성 보이스 낭독 ON' : '🔇 BGM만 듣기'}</span>
                                        </button>
                                    </div>

                                    <div className="space-y-2 pl-2 border-l-2 border-amber-500/40">
                                        {trackInfo.lyricsVerses.map((verse, vIdx) => {
                                            const isActive = activeVerseIdx === vIdx;
                                            return (
                                                <div
                                                    key={vIdx}
                                                    className={`p-2 rounded-xl transition-all duration-500 ${
                                                        isActive
                                                            ? 'bg-amber-500/20 border border-amber-400/60 shadow-lg shadow-amber-500/10 translate-x-1'
                                                            : 'bg-transparent border border-transparent'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <span className="text-[9.5px] font-mono text-gray-500">{verse.timeLabel}</span>
                                                        {isActive && (
                                                            <span className="text-[10px] text-amber-300 font-bold animate-pulse flex items-center gap-1">
                                                                <span>🎵 낭독 중</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className={`text-xs leading-relaxed transition-colors ${
                                                        isActive
                                                            ? 'text-amber-100 font-bold text-sm'
                                                            : 'text-gray-300 font-medium'
                                                    }`}>
                                                        "{verse.line}"
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed">
                                        {trackInfo.myeongsimCoaching}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDownloadAudio}
                                        disabled={isDownloading}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                    >
                                        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                        <span>{isDownloading ? '432Hz 고음질 렌더링 중...' : '📥 432Hz 코칭 에세이노래 소장하기 (.WAV)'}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            zeroPointSoundEngine.stop();
                                            setIsPlaying(false);
                                            onClose();
                                        }}
                                        className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
                                    >
                                        닫기
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* [NEW] 💳 4,900원 맞춤 노래 평생 소장 결제 팝업 모달 */}
                    {showPaymentModal && (
                        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
                            <div className="w-full max-w-sm bg-slate-900 border border-amber-500/50 rounded-3xl p-5 shadow-2xl space-y-4 text-xs relative">
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setIsPaidSuccess(false);
                                    }}
                                    className="absolute top-3.5 right-3.5 text-gray-400 hover:text-white p-1"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                <div className="text-center space-y-1.5 pt-1">
                                    <div className="w-11 h-11 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-lg">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-base font-black text-white">
                                        나만의 1:1 맞춤 힐링노래 평생 소장권
                                    </h4>
                                    <p className="text-[11px] text-gray-300">
                                        {effectiveProfile.userName} 님의 선천적 기질 8글자 1:1 맞춤 처방
                                    </p>
                                </div>

                                {!isPaidSuccess ? (
                                    <>
                                        {/* [NEW] 💖 구입을 망설이는 분들을 위한 따뜻한 감성 위로 멘트 */}
                                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-indigo-500/20 border border-amber-400/40 text-amber-100 text-[11px] leading-relaxed shadow-lg">
                                            <div className="flex items-start gap-2">
                                                <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0 mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="font-medium text-gray-100">
                                                        "본인의 기질에 맞는, <strong className="text-amber-300 font-bold">본인의 이름이 들어간 당신만의 1:1 맞춤 코칭 에세이 가사노래</strong>입니다."
                                                    </p>
                                                    <p className="text-amber-300 font-extrabold text-[11.5px]">
                                                        ✨ 힘들 때마다 들으시면서, 제로포인트로 돌아오세요.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                                            <div className="flex items-baseline justify-between border-b border-slate-800 pb-2">
                                                <span className="text-gray-400 text-[11px]">런칭 기념 특별 혜택가</span>
                                                <div className="text-right">
                                                    <span className="text-gray-500 line-through text-[10px] mr-1.5">39,000원</span>
                                                    <span className="text-amber-400 font-black text-base">4,900원</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 text-[10.5px] text-gray-300">
                                                <div className="flex items-center gap-1.5">
                                                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                    <span className="font-semibold text-amber-200">
                                                        {includeName
                                                            ? `💖 '${effectiveProfile.userName} 님' 이름 포함 1:1 헌정 에세이 작사`
                                                            : `🌿 '${effectiveProfile.userName} 님' 사주 기질 맞춤 순수 에세이 작사`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                    <span>432Hz 고음질 스튜디오 WAV 음원 파일 평생 소장</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                    <span>지친 마음을 비워내는 제로포인트 호흡 가이드 포함</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <button
                                                onClick={() => {
                                                    setIsPaidSuccess(true);
                                                    setTimeout(() => {
                                                        handleDownloadAudio();
                                                    }, 800);
                                                }}
                                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                                                <span>4,900원 결제하고 즉시 소장하기</span>
                                            </button>
                                            <p className="text-[9.5px] text-gray-400 text-center">
                                                * 결제 즉시 고음질 432Hz WAV 파일 다운로드가 시작됩니다.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 animate-fade-in">
                                        <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/40">
                                            <Check className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <h5 className="font-bold text-white text-sm">결제가 성공적으로 완료되었습니다!</h5>
                                            <p className="text-[11px] text-emerald-300">
                                                {effectiveProfile.userName} 님의 맞춤 432Hz 힐링 음원이 다운로드되었습니다.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowPaymentModal(false);
                                                setIsPaidSuccess(false);
                                            }}
                                            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                                        >
                                            확인
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
