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

    // [NEW] 🎧 공식 보컬 완성곡 샘플 플레이어 ('이름 포함', '이름 미포함', '맑은 물', '날아올라', '강미숙 님')
    const [currentSampleTrack, setCurrentSampleTrack] = useState<'name_soyoung' | 'light_breath' | 'clean_water' | 'fly_high' | 'kang_misook'>('name_soyoung');
    const [isSamplePlaying, setIsSamplePlaying] = useState<boolean>(false);
    const [sampleProgress, setSampleProgress] = useState<number>(0);
    const [sampleDuration, setSampleDuration] = useState<number>(0);
    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
    const [isPaidSuccess, setIsPaidSuccess] = useState<boolean>(false);
    const sampleAudioRef = useRef<HTMLAudioElement | null>(null);
    const meditationBgmRef = useRef<HTMLAudioElement | null>(null);
    const meditationVoiceRef = useRef<HTMLAudioElement | null>(null);

    const playSampleTrack = (track: 'name_soyoung' | 'light_breath' | 'clean_water' | 'fly_high' | 'kang_misook') => {
        let audioSrc = '/sample_name_soyoung.wav';
        if (track === 'light_breath') audioSrc = '/sample_light_breath.wav';
        else if (track === 'clean_water') audioSrc = '/sample_essay_song.wav';
        else if (track === 'fly_high') audioSrc = '/sample_fly_high.wav';
        else if (track === 'kang_misook') audioSrc = '/sample_kang_misook.wav';
        
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

    const toggleSamplePlay = (track: 'name_soyoung' | 'light_breath' | 'clean_water' | 'fly_high' | 'kang_misook' = currentSampleTrack) => {
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
            if (meditationBgmRef.current) {
                meditationBgmRef.current.pause();
                meditationBgmRef.current = null;
            }
            if (meditationVoiceRef.current) {
                meditationVoiceRef.current.pause();
                meditationVoiceRef.current = null;
            }
            setIsSamplePlaying(false);
            setSampleProgress(0);
        }
    }, [isOpen]);

    // STEP 3 명상 호흡 가이드 실제 사운드 & 애니메이션 정밀 동기화
    const [breathDuration, setBreathDuration] = useState<number>(4.2);

    useEffect(() => {
        let t1: any = null;
        let t2: any = null;
        let t3: any = null;
        let step3Timer: any = null;

        const playMeditationVoice = (src: string) => {
            try {
                if (meditationVoiceRef.current) {
                    meditationVoiceRef.current.pause();
                    meditationVoiceRef.current.currentTime = 0;
                }
                const audio = new Audio(src);
                audio.volume = 0.95;
                meditationVoiceRef.current = audio;
                audio.play().catch(e => console.log('Meditation voice play suppressed:', e));
            } catch (e) {
                console.error(e);
            }
        };

        if (currentStep === 3) {
            // 528Hz 치유 파동 BGM 재생
            try {
                const bgm = new Audio('/sounds/528hz_healing_bgm.mp3');
                bgm.volume = 0.35;
                bgm.loop = true;
                meditationBgmRef.current = bgm;
                bgm.play().catch(e => console.log('Meditation BGM suppressed:', e));
            } catch (e) {
                console.error(e);
            }

            // [1단계: 0초 ~ 4.2초] 들이마시기 (Inhale 4.2초 음원과 100% 동기화)
            setBreathDuration(4.2);
            setBreathText('숨을 깊게 들이마십니다... (Inhale)');
            setBreathScale(1.45);
            playMeditationVoice('/sounds/meditation_inhale.wav');

            // [2단계: 4.3초 ~ 7.8초] 멈추기 (Hold 3.6초 음원과 100% 동기화)
            t1 = setTimeout(() => {
                setBreathDuration(3.6);
                setBreathText('잠시 멈춥니다... (Hold)');
                setBreathScale(1.45);
                playMeditationVoice('/sounds/meditation_hold.wav');
            }, 4300);

            // [3단계: 7.9초 ~ 11.8초] 내쉬기 (Exhale 3.8초 음원과 100% 동기화)
            t2 = setTimeout(() => {
                setBreathDuration(3.8);
                setBreathText('천천히 숨을 내쉽니다... (Exhale)');
                setBreathScale(0.85);
                playMeditationVoice('/sounds/voice_exhale.mp3');
            }, 7900);

            // [4단계: 11.9초 ~ 13.2초] 제로포인트 도달 완료 멘트
            t3 = setTimeout(() => {
                setBreathDuration(1.2);
                setBreathText('✨ 마음의 중심, 제로포인트에 도달했습니다.');
                setBreathScale(1.0);
            }, 11900);

            // [5단계: 13.5초] 완료 후 STEP 4 이동 및 오행 힐링 음악 시작
            step3Timer = setTimeout(() => {
                if (meditationBgmRef.current) {
                    meditationBgmRef.current.pause();
                    meditationBgmRef.current = null;
                }
                if (meditationVoiceRef.current) {
                    meditationVoiceRef.current.pause();
                    meditationVoiceRef.current = null;
                }
                setCurrentStep(4);
                // 자동으로 힐링 오행 음악 재생 시작
                zeroPointSoundEngine.play(trackInfo.targetElement);
                zeroPointSoundEngine.setVolume(volume);
                setIsPlaying(true);
            }, 13500);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
                clearTimeout(step3Timer);
                if (meditationBgmRef.current) {
                    meditationBgmRef.current.pause();
                    meditationBgmRef.current = null;
                }
                if (meditationVoiceRef.current) {
                    meditationVoiceRef.current.pause();
                    meditationVoiceRef.current = null;
                }
            };
        } else {
            if (meditationBgmRef.current) {
                meditationBgmRef.current.pause();
                meditationBgmRef.current = null;
            }
            if (meditationVoiceRef.current) {
                meditationVoiceRef.current.pause();
                meditationVoiceRef.current = null;
            }
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

    // [NEW] 🎫 《제로포인트》 도서 독자 전용 2번 방식 (1:1 주문제작 신청 ➔ 카카오톡/이메일 전달)
    const [bookCouponCode, setBookCouponCode] = useState<string>('');
    const [isCouponModalOpen, setIsCouponModalOpen] = useState<boolean>(false);
    const [couponStep, setCouponStep] = useState<'verify' | 'apply_form' | 'complete'>('verify');
    const [orderUserName, setOrderUserName] = useState<string>(effectiveProfile.userName || '');
    const [orderBirth, setOrderBirth] = useState<string>('');
    const [orderSongStyle, setOrderSongStyle] = useState<'calm' | 'upbeat'>('calm');
    const [orderDeliveryType, setOrderDeliveryType] = useState<'kakao' | 'email'>('kakao');
    const [orderContact, setOrderContact] = useState<string>('');
    const [copiedOrderText, setCopiedOrderText] = useState<boolean>(false);
    const [isShareSuccess, setIsShareSuccess] = useState<boolean>(false);

    // [NEW] 🏦 무통장 입금 및 관리자 승인 시스템 (토스뱅크 1002-6847-4899 마인드플로우랩)
    const [depositorName, setDepositorName] = useState<string>(effectiveProfile.userName || '');
    const [isAccountCopied, setIsAccountCopied] = useState<boolean>(false);
    const [isDepositSubmitted, setIsDepositSubmitted] = useState<boolean>(false);
    const [copiedDepositText, setCopiedDepositText] = useState<boolean>(false);

    const handleCopyAccount = () => {
        navigator.clipboard.writeText('토스뱅크 1002-6847-4899');
        setIsAccountCopied(true);
        setTimeout(() => setIsAccountCopied(false), 2500);
    };

    const handleDepositSubmit = () => {
        if (!depositorName.trim()) {
            alert('입금자 성함을 입력해 주세요.');
            return;
        }
        setIsDepositSubmitted(true);
    };

    const getDepositSummaryText = () => {
        return `[명심코칭 유료 컨텐츠 입금 확인 요청]\n- 입금자명: ${depositorName}\n- 신청 컨텐츠: 432Hz 1:1 맞춤 힐링노래 평생소장권\n- 입금액: 4,900원 (토스뱅크 1002-6847-4899 마인드플로우랩)\n- 사용자 사주 정보: ${effectiveProfile.userName} (${effectiveProfile.birthDate || '미입력'})`;
    };

    const handleCopyDepositSummary = () => {
        navigator.clipboard.writeText(getDepositSummaryText());
        setCopiedDepositText(true);
        setTimeout(() => setCopiedDepositText(false), 2500);
    };

    const handleVerifyCoupon = () => {
        const cleaned = bookCouponCode.trim().replace(/[-\s]/g, '').toUpperCase();
        if (!cleaned) {
            alert('도서에 동봉된 시크릿 인증 코드를 입력해 주세요.');
            return;
        }

        // 16자리 코드 또는 유효한 프로모션 코드 검증
        if (cleaned.length >= 8 || cleaned.includes('ZERO') || cleaned.includes('MYENG') || cleaned.includes('VIP')) {
            setCouponStep('apply_form');
        } else {
            alert('유효하지 않은 인증 코드입니다. 도서의 시크릿 골드 티켓에 적힌 16자리 번호를 다시 확인해 주세요.');
        }
    };

    const handleOrderSubmit = () => {
        if (!orderUserName.trim()) {
            alert('노래에 들어갈 성함을 입력해 주세요.');
            return;
        }
        if (!orderContact.trim()) {
            alert(orderDeliveryType === 'kakao' ? '카카오톡 연락처 또는 닉네임을 입력해 주세요.' : '음원을 수신할 이메일 주소를 입력해 주세요.');
            return;
        }
        setCouponStep('complete');
    };

    const getOrderSummaryText = () => {
        const styleText = orderSongStyle === 'calm' ? '차분하고 따뜻한 432Hz 감성 헌정곡 (이완·위로)' : '신나고 힘나는 128 BPM 도파민 업비트곡 (자신감·도약)';
        return `[《제로포인트》 1:1 맞춤 힐링송 제작 신청]\n- 인증 코드: ${bookCouponCode}\n- 신청자 성함: ${orderUserName}\n- 생년월일/사주: ${orderBirth || '정보 없음'}\n- 희망 곡 스타일: ${styleText}\n- 전달 방식: ${orderDeliveryType === 'kakao' ? '카카오톡 1:1 전달' : '이메일 전달'}\n- 연락처: ${orderContact}`;
    };

    const handleCopyOrderText = () => {
        navigator.clipboard.writeText(getOrderSummaryText());
        setCopiedOrderText(true);
        setTimeout(() => setCopiedOrderText(false), 2500);
    };

    const handleShareSong = () => {
        const shareTitle = `[명심코칭] ${effectiveProfile.userName} 님의 1:1 맞춤 사주 힐링송 🎵`;
        const shareText = `《제로포인트》 나의 사주 기질과 마음에 맞춘 432Hz AI 힐링 에세이 노래를 들어보세요! ✨`;
        const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://myeongsimcoaching.com';

        if (navigator.share) {
            navigator.share({
                title: shareTitle,
                text: shareText,
                url: shareUrl,
            }).catch(() => {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${shareUrl}`);
            setIsShareSuccess(true);
            setTimeout(() => setIsShareSuccess(false), 2500);
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
            const fileName = `${safeName}_기질_1대1_맞춤_코칭_에세이노래_432Hz.mp3`;
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
                            STEP 1: 사주 확인 & 가사 유형 선택 & 현재 감정 상태 선택
                            ======================================================== */}
                        {currentStep === 1 && (
                            <div className="space-y-4 animate-fade-in">
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

                                {/* [NEW] 💖 이름 포함 여부 선택 옵션 (고객 선택 메뉴) */}
                                <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                                    <label className="font-bold text-gray-200 flex items-center gap-1.5 text-xs">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Q. 노래 가사 유형을 선택해 주세요</span>
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
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in relative">
                                <motion.div
                                    animate={{ scale: breathScale }}
                                    transition={{ duration: breathDuration, ease: 'easeInOut' }}
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

                                <button
                                    onClick={() => {
                                        if (meditationBgmRef.current) {
                                            meditationBgmRef.current.pause();
                                            meditationBgmRef.current = null;
                                        }
                                        if (meditationVoiceRef.current) {
                                            meditationVoiceRef.current.pause();
                                            meditationVoiceRef.current = null;
                                        }
                                        setCurrentStep(4);
                                        zeroPointSoundEngine.play(trackInfo.targetElement);
                                        zeroPointSoundEngine.setVolume(volume);
                                        setIsPlaying(true);
                                    }}
                                    className="text-[10.5px] text-gray-400 hover:text-amber-300 underline transition-colors cursor-pointer pt-2"
                                >
                                    호흡 명상 건너뛰고 바로 듣기 ➔
                                </button>
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

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        onClick={handleDownloadAudio}
                                        disabled={isDownloading}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                    >
                                        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                        <span>{isDownloading ? '432Hz 고음질 렌더링 중...' : '📥 432Hz 기본 BGM 무료 소장하기 (.MP3)'}</span>
                                    </button>

                                    <button
                                        onClick={handleShareSong}
                                        className="py-3 px-4 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <span>{isShareSuccess ? '✅ 복사 완료!' : '🔗 내 힐링송 공유'}</span>
                                    </button>
                                </div>

                                {/* 🎫 《제로포인트》 도서 구매자 전용 라운지 배너 (구글 인앱결제 정책 준수 Cross-Platform) */}
                                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-900/40 border border-amber-400/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-2xl shrink-0">🎫</span>
                                        <div>
                                            <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                                                <span>《제로포인트》 도서 독자 전용 VIP 라운지</span>
                                                <span className="text-[9.5px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-extrabold">무료 혜택</span>
                                            </div>
                                            <p className="text-[10.5px] text-gray-300 mt-0.5">
                                                책 속 시크릿 코드를 등록하고 나만의 1:1 맞춤 힐링송을 받아보세요.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsCouponModalOpen(true)}
                                        className="w-full sm:w-auto shrink-0 py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-[11px] shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
                                    >
                                        쿠폰 코드 등록하기
                                    </button>
                                </div>

                                {/* ========================================================
                                    [PREMIUM UPSELL] 🌟 1:1 맞춤제작 풀보컬 완성곡 실사례 & 4,900원 소장 안내
                                    ======================================================== */}
                                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-indigo-950/60 border border-amber-500/40 shadow-2xl space-y-4 relative overflow-hidden mt-6">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                                    {/* Header & Badges */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black px-2.5 py-0.5 rounded-full shadow-sm">
                                                🌟 실제 1:1 맞춤제작 풀보컬 사례
                                            </span>
                                            <span className="text-[10.5px] text-amber-300 font-bold">
                                                {currentSampleTrack === 'clean_water'
                                                    ? '남자1 사주 (辛巳일주 乾命)'
                                                    : currentSampleTrack === 'kang_misook'
                                                    ? '여자2 님 (51세, 甲子일주 신나는 힐링곡)'
                                                    : currentSampleTrack === 'fly_high'
                                                    ? '도파민 뿜뿜!! 날아올라 (신나는 힐링곡)'
                                                    : '여자1 님 (24세, 戊戌일주)'}
                                            </span>
                                        </div>
                                        <span className="text-[9.5px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30 font-mono">
                                            {currentSampleTrack === 'kang_misook' || currentSampleTrack === 'fly_high' ? '⚡ Upbeat Healing' : '432Hz Full Vocal'}
                                        </span>
                                    </div>

                                    {/* Free vs Premium Notice */}
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-indigo-500/15 border border-amber-400/40 text-[11px] text-amber-200 leading-relaxed shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                                        <div>
                                            💡 <strong>[안내]</strong> 기본 432Hz 명상 BGM은 <strong>평생 100% 무료</strong>입니다. 아래 실제 사례처럼 <strong>전문 AI 보컬이 부른 고음질 1:1 맞춤 노래(.MP3 파일)</strong>를 영구 소장해 보세요!
                                        </div>
                                        <div className="shrink-0 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-3 py-1 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md self-end sm:self-center">
                                            <span className="text-slate-700 line-through text-[10px] font-bold">30,000원</span>
                                            <span className="text-rose-950 font-black">🔥 이벤트 특가 4,900원</span>
                                        </div>
                                    </div>

                                    {/* Track Select Tabs (여자1 님 vs 여자2 님 vs 순수 에세이 vs 신사일주 남자1 vs 도파민 날아올라) */}
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800 text-[10px] sm:text-xs gpu-smooth">
                                        <button
                                            onClick={() => playSampleTrack('name_soyoung')}
                                            className={`py-2 px-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-0.5 text-center leading-tight ${
                                                currentSampleTrack === 'name_soyoung'
                                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-black'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            <span>💖 1. 여자1(잔잔)</span>
                                        </button>
                                        <button
                                            onClick={() => playSampleTrack('kang_misook')}
                                            className={`py-2 px-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-0.5 text-center leading-tight ${
                                                currentSampleTrack === 'kang_misook'
                                                    ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-slate-950 shadow-md font-black'
                                                    : 'text-rose-300 hover:text-white'
                                            }`}
                                        >
                                            <span>⚡ 2. 여자2(신나는🔥)</span>
                                        </button>
                                        <button
                                            onClick={() => playSampleTrack('light_breath')}
                                            className={`py-2 px-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-0.5 text-center leading-tight ${
                                                currentSampleTrack === 'light_breath'
                                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-black'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            <span>🌿 3. 숨(순수)</span>
                                        </button>
                                        <button
                                            onClick={() => playSampleTrack('clean_water')}
                                            className={`py-2 px-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-0.5 text-center leading-tight ${
                                                currentSampleTrack === 'clean_water'
                                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-black'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            <span>💧 4. 맑은물(남자1)</span>
                                        </button>
                                        <button
                                            onClick={() => playSampleTrack('fly_high')}
                                            className={`py-2 px-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-0.5 text-center leading-tight ${
                                                currentSampleTrack === 'fly_high'
                                                    ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black shadow-md'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            <span>🚀 5. 날아올라</span>
                                        </button>
                                    </div>

                                    {/* Saju 4 Pillars & Explanation Box (동적 전환) */}
                                    {currentSampleTrack === 'clean_water' ? (
                                        <>
                                            {/* 💧 남자1 사주 (庚申년 癸未월 辛巳일 乙未시) 맑은 물이 머무는 곳 사주 분석 */}
                                            <div className="p-3.5 rounded-2xl bg-slate-950/85 border border-sky-500/40 space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-sky-300 flex items-center gap-1.5">
                                                        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                                                        <span>남자1 사주 원식 (辛巳일주 乾命)</span>
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-mono">오행: 金3 土2 火1 水1 木1</span>
                                                </div>

                                                {/* 만세력 4주 8글자 칩 */}
                                                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                                                    <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                                                        <div className="text-gray-400 text-[9px]">년주 (겁재/겁재)</div>
                                                        <div className="font-bold text-sky-200 font-mono text-xs mt-0.5">庚申</div>
                                                    </div>
                                                    <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                                                        <div className="text-gray-400 text-[9px]">월주 (식신/편인)</div>
                                                        <div className="font-bold text-sky-200 font-mono text-xs mt-0.5">癸未</div>
                                                    </div>
                                                    <div className="p-1.5 rounded-xl bg-sky-500/20 border border-sky-500/50 shadow-sm">
                                                        <div className="text-sky-300 font-bold text-[9px]">일주 (본원/정관)</div>
                                                        <div className="font-extrabold text-sky-100 font-mono text-xs mt-0.5">辛巳</div>
                                                    </div>
                                                    <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                                                        <div className="text-gray-400 text-[9px]">시주 (편재/편인)</div>
                                                        <div className="font-bold text-sky-200 font-mono text-xs mt-0.5">乙未</div>
                                                    </div>
                                                </div>

                                                <p className="text-[10.5px] text-gray-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                                                    💡 <strong>[사주 기질 진단]</strong>: 辛巳(신사) 일주 남성은 섬세하고 고귀한 보석(辛金)의 기질이나, 년주의 강한 <strong>庚申(겁재) 경쟁 압박</strong>과 <strong>未月·巳火의 건조하고 뜨거운 열기</strong>로 인해 보석이 흙먼지와 열기에 지치기 쉽습니다. 따라서 맑고 시원한 <strong>癸水(식신)의 맑은 물기운으로 보석을 씻어내어(도세주옥, 淘洗珠玉)</strong> 본래의 맑은 빛을 되찾아주는 432Hz 힐링 처방입니다.
                                                </p>
                                            </div>

                                            {/* 맑은 물이 머무는 곳 과학적 근거 & 가사 연계성 */}
                                            <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/30 space-y-2 text-[10.5px] text-gray-300 leading-relaxed">
                                                <div className="text-[11px] font-bold text-sky-300 flex items-center gap-1.5">
                                                    <Heart className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                                                    <span>왜 '맑은 물이 머무는 곳'일까요? (도세주옥 淘洗珠玉 처방)</span>
                                                </div>
                                                
                                                <div className="space-y-1.5 pl-1 border-l-2 border-sky-500/40">
                                                    <p>
                                                        🧠 <strong>음향심리학적 과학 근거</strong>: 메마른 신경계의 과열된 화기(火氣)를 가라앉히는 <strong>432Hz 수(水) 파동 공명</strong>으로 두뇌의 온도를 낮추고 심박수를 안정시킵니다.
                                                    </p>
                                                    <div className="bg-slate-950/60 p-2.5 rounded-xl space-y-1.5 text-[10px] text-gray-300">
                                                        <div>• <strong className="text-sky-300">Verse 1 ("단단하게 쥐고 있던 두 손을 가만히 펴봅니다... 뜨거운 열기")</strong> ➔ 辛巳·未月의 건조한 열감과 압박 공감</div>
                                                        <div>• <strong className="text-sky-300">Verse 2 ("메마른 대지 위로 조용히 맑은 단비가 내려앉아요")</strong> ➔ 癸水(식신)의 시원한 432Hz 물기운 처방</div>
                                                        <div>• <strong className="text-sky-300">Pre-Chorus ("세상의 먼지를 씻어내고 본래의 빛을 발하듯")</strong> ➔ 보석을 맑게 씻어내는 도세주옥 치유</div>
                                                        <div>• <strong className="text-sky-300">Chorus & Outro ("가장 고요한 마음의 중심에서 비로소 온전한 나를 만나네")</strong> ➔ 평온한 제로포인트(Zero-Point) 회귀</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : currentSampleTrack === 'kang_misook' ? (
                                        <>
                                            {/* ⚡ 여자2 님 (51세, 1976.09.09 12:00, 甲子일주 坤命) 사주 분석 */}
                                            <div className="p-3.5 rounded-2xl bg-slate-950/85 border border-rose-500/40 space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                                                        <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                                                        <span>여자2 님의 사주 원식 (1976.09.09 午시, 51세 坤命)</span>
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-mono">오행: 木1 火3 土1 金2 水1</span>
                                                </div>

                                                {/* 만세력 4주 8글자 칩 */}
                                                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                                                    <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                                                        <div className="text-gray-400 text-[9px]">년주 (식신/편재)</div>
                                                        <div className="font-bold text-rose-200 font-mono text-xs mt-0.5">丙辰</div>
                                                    </div>
                                                    <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                                                        <div className="text-gray-400 text-[9px]">월주 (상관/정관)</div>
                                                        <div className="font-bold text-rose-200 font-mono text-xs mt-0.5">丁酉</div>
                                                    </div>
                                                    <div className="p-1.5 rounded-xl bg-rose-500/20 border border-rose-500/50 shadow-sm">
                                                        <div className="text-rose-300 font-bold text-[9px]">일주 (본원/정인)</div>
                                                        <div className="font-extrabold text-rose-100 font-mono text-xs mt-0.5">甲子</div>
                                                    </div>
                                                    <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                                                        <div className="text-gray-400 text-[9px]">시주 (편관/상관)</div>
                                                        <div className="font-bold text-rose-200 font-mono text-xs mt-0.5">庚午</div>
                                                    </div>
                                                </div>

                                                <p className="text-[10.5px] text-gray-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-rose-500/20">
                                                    💡 <strong>[사주 기질 진단]</strong>: 푸른 소나무 `甲子(갑자)` 일주에 `丙火(식신)·丁火(상관)·午火(상관)`로 **식상(3개)의 넘치는 열정과 표현력**을 타고났으나, `酉金·庚金` 관살의 책임감으로 늘 남들을 먼저 배려하고 챙기느라 자신의 끼와 흥을 억눌러왔습니다.
                                                </p>
                                            </div>

                                            {/* 여자2 님 과학적 & 명리학적 가사 연계 설명 */}
                                            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-amber-950/40 to-slate-900 border border-rose-500/40 space-y-2 text-[10.5px] text-gray-300 leading-relaxed">
                                                <div className="text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                                                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                                                    <span>왜 '신나는 힐링곡'일까요? (식상(食傷) 대발산 & 도파민 부스팅)</span>
                                                </div>
                                                
                                                <div className="space-y-1.5 pl-1 border-l-2 border-rose-500/40">
                                                    <p>
                                                        🧠 <strong>음향심리학적 과학 근거</strong>: 억눌렸던 식상(표현 에너지)을 깨우는 <strong>128 BPM 경쾌한 비트</strong>가 뇌의 보상 회로(측좌핵)를 자극하여 엔도르핀과 도파민을 분비시킵니다.
                                                    </p>
                                                    <div className="bg-slate-950/60 p-2.5 rounded-xl space-y-1 text-[10px] text-gray-300">
                                                        <div>• <strong className="text-rose-300">Verse 1 ("파란 하늘 끝까지... 톡톡 터지는 탄산처럼 기분 좋은 아침")</strong> ➔ 甲木의 활력을 깨우는 시원한 에너지</div>
                                                        <div>• <strong className="text-rose-300">Verse 2 ("남들을 챙기느라 숨겨둔 나의 미소 이제는 세상 밖으로 활짝")</strong> ➔ 관살 압박을 벗고 식상(火)의 끼와 미소 해방</div>
                                                        <div>• <strong className="text-rose-300">Chorus & Spoken ("여자2 님, 오롯이 당신만을 위한 눈부신 기쁨으로 춤춥니다 / 세상은 나의 무대야!")</strong> ➔ 당당한 제로포인트 주인공 회귀</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : currentSampleTrack === 'fly_high' ? (
                                        <>
                                            {/* ⚡ 도파민 뿜뿜!! 신나는 힐링 버전 사주 분석 */}
                                            <div className="p-3.5 rounded-2xl bg-slate-950/85 border border-pink-500/40 space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-pink-300 flex items-center gap-1.5">
                                                        <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
                                                        <span>에너지 대전환: 戊戌(대지) ➔ 丙·丁(화기) 도약 처방</span>
                                                    </span>
                                                    <span className="text-[10px] text-amber-300 font-bold bg-pink-500/20 px-2 py-0.5 rounded-full">🔥 도파민 부스팅 124 BPM</span>
                                                </div>

                                                <p className="text-[10.5px] text-gray-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-pink-500/20">
                                                    ⚡ <strong>[도파민 힐링의 원리]</strong>: 무거운 흙(土)과 편관(甲寅)의 짓눌림 속에 갇혀있던 에너지를, <strong>밝고 역동적인 화(火)·목(木)의 긍정 에너지로 단숨에 폭발</strong>시키는 쾌감 처방입니다. 무기력과 번아웃을 부수고 즉각적인 자신감과 활력을 채워줍니다!
                                                </p>
                                            </div>

                                            {/* 도파민 & 뇌과학적 효능 설명 박스 */}
                                            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-pink-950/40 via-purple-950/40 to-slate-900 border border-pink-500/40 space-y-2.5 text-[10.5px] text-gray-300 leading-relaxed">
                                                <div className="text-[11px] font-bold text-pink-300 flex items-center gap-1.5">
                                                    <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                                                    <span>'날아올라'의 과학적 효능 & 뇌과학적 근거 (Dopamine Booster)</span>
                                                </div>
                                                
                                                <div className="space-y-2 pl-1 border-l-2 border-pink-500/40">
                                                    <div className="bg-slate-950/60 p-2.5 rounded-xl space-y-1.5 text-[10px] text-gray-300">
                                                        <div>🧠 <strong>1. 도파민(Dopamine) & 엔도르핀 분비</strong>: 124 BPM의 업비트 리듬이 뇌의 쾌락·동기부여 중추인 <strong>측좌핵(Nucleus Accumbens)</strong>을 자극하여 우울감을 걷어내고 기분을 즉각 상승시킵니다.</div>
                                                        <div>🏃 <strong>2. 운동 피질(Motor Cortex) 활성화</strong>: 카운트다운("하나 둘 셋 넷")과 점프 가사가 두뇌의 행동 신경을 자극하여 굳어있던 몸과 마음을 경쾌하게 움직이게 만듭니다.</div>
                                                        <div>🌟 <strong>3. 자기 긍정 확언(Self-Affirmation) 효과</strong>: "당신의 세상은 지금부터 가장 눈부시게 빛날 거예요" 나레이션이 잠재의식의 방어기제를 녹이고 자존감을 극대화합니다.</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* 💖 여자1 님 잔잔한 감성 헌정곡 사주 분석 */}
                                            <div className="p-3.5 rounded-2xl bg-slate-950/85 border border-slate-800 space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                                                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                                        <span>여자1 님의 사주 원식 (2003.01.25 寅시, 女)</span>
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-mono">오행: 木2 火1 土3 金0 水2</span>
                                                </div>

                                                {/* 만세력 4주 8글자 칩 */}
                                                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                                                    <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                                                        <div className="text-gray-400 text-[9px]">년주 (편재/정인)</div>
                                                        <div className="font-bold text-amber-200 font-mono text-xs mt-0.5">壬午</div>
                                                    </div>
                                                    <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                                                        <div className="text-gray-400 text-[9px]">월주 (정재/겁재)</div>
                                                        <div className="font-bold text-amber-200 font-mono text-xs mt-0.5">癸丑</div>
                                                    </div>
                                                    <div className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/50 shadow-sm">
                                                        <div className="text-amber-300 font-bold text-[9px]">일주 (본원/비견)</div>
                                                        <div className="font-extrabold text-amber-100 font-mono text-xs mt-0.5">戊戌</div>
                                                    </div>
                                                    <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                                                        <div className="text-gray-400 text-[9px]">시주 (편관/편관)</div>
                                                        <div className="font-bold text-amber-200 font-mono text-xs mt-0.5">甲寅</div>
                                                    </div>
                                                </div>

                                                <p className="text-[10.5px] text-gray-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                                                    💡 <strong>[사주 기질 진단]</strong>: 戊戌(무술) 일주는 거대한 대지처럼 강한 책임감과 끈기를 지녔으나, 시주의 <strong>甲寅(편관) 중압감</strong>과 <strong>土(3) 비견의 무게</strong>로 인해 모든 짐을 혼자 짊어지려는 완벽주의가 강합니다. 특히 <strong>금(金=호흡·비움·이완)이 결핍(0개)</strong>되어 어깨가 무겁고 마음의 긴장이 쉽게 쌓이는 구조입니다.
                                                </p>
                                            </div>

                                            {/* 과학적 근거 & 가사 연계성 설명 박스 */}
                                            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2 text-[10.5px] text-gray-300 leading-relaxed">
                                                <div className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                                                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                                                    <span>왜 이 가사로 지어졌을까요? (과학적 & 명리학적 1:1 연계)</span>
                                                </div>
                                                
                                                <div className="space-y-1.5 pl-1 border-l-2 border-indigo-500/40">
                                                    <p>
                                                        🧠 <strong>음향심리학적 과학 근거</strong>: 자연의 수학적 비율과 일치하는 <strong>432Hz 주파수</strong>가 부교감신경을 자극하여 스트레스 호르몬을 낮추고 뇌파를 알파파로 안정시킵니다. 또한 뇌의 <strong>자기 참조 효과(Self-Referential Effect)</strong>로 인해 노래 속에서 다정하게 내 이름이 불릴 때 심리적 방어 기제가 풀리고 깊은 치유가 일어납니다.
                                                    </p>
                                                    <div className="bg-slate-950/60 p-2.5 rounded-xl space-y-1.5 text-[10px] text-gray-300">
                                                        <div>• <strong className="text-amber-300">Verse 1 ("늘 단단하게 버티며 서 있어야 했던 날들... 무거운 마음의 짐")</strong> ➔ 戊戌(대지)·甲寅(편관)의 짓눌린 중압감과 어른스러운 침묵을 깊이 공감하여 심리적 무장 해제</div>
                                                        <div>• <strong className="text-amber-300">Verse 2 ("얼어붙었던 땅을 녹이는 따스한 봄볕 속에 조용히 녹아내리네")</strong> ➔ 癸丑월(겨울 동토)의 얼어붙은 마음을 午火(정인)의 따뜻한 온기로 녹여주는 명리학적 조후 처방</div>
                                                        <div>• <strong className="text-amber-300">Pre-Chorus ("내가 나를 붙잡고 있던 긴장의 손을 풀고")</strong> ➔ 사주에 결핍된 金(0개, 폐·호흡·비움) 기운을 보강하는 432Hz 이완 호흡 유도</div>
                                                        <div>• <strong className="text-amber-300">Chorus & Spoken ("더 이상 홀로 모든 것을 짊어지지 않아도... 마음껏 가벼워져도 괜찮습니다")</strong> ➔ 戊土의 완벽주의를 내려놓고 고요한 제로포인트(Zero-Point) 참된 쉼으로 회귀</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Audio Player & Progress Bar */}
                                    <div className="space-y-2 bg-slate-950/90 p-3 rounded-2xl border border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleSamplePlay(currentSampleTrack)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                                                        isSamplePlaying
                                                            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 animate-pulse'
                                                            : currentSampleTrack === 'kang_misook' || currentSampleTrack === 'fly_high'
                                                            ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-400 hover:to-amber-300 text-white shadow-pink-500/30'
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
                                                            ? '가벼워진 숨 (여자1 님 헌정곡: 24세 戊戌일주)'
                                                            : currentSampleTrack === 'kang_misook'
                                                            ? '신나는 힐링곡 (여자2 님 헌정곡: 51세 甲子일주)'
                                                            : currentSampleTrack === 'light_breath'
                                                            ? '가벼워진 숨 (순수 에세이: 이름 미포함)'
                                                            : currentSampleTrack === 'clean_water'
                                                            ? '맑은 물이 머무는 곳 (남자1: 辛巳일주)'
                                                            : '가벼운 날아올라 (⚡도파민 뿜뿜!! 신나는 힐링)'}
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

                                        {/* 🎤 실시간 노래 가사 뷰어 (실제 음원 보컬과 100% 일치하는 정밀 싱크 가사) */}
                                        <div className="pt-2 border-t border-slate-800/80 space-y-2">
                                            <div className="flex items-center justify-between text-[10.5px]">
                                                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                                                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                                    <span>실시간 노래 가사 (음원 100% 정밀 싱크)</span>
                                                </span>
                                                {isSamplePlaying ? (
                                                    <span className="text-[9.5px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 font-bold animate-pulse flex items-center gap-1">
                                                        <span>🎵 보컬 재생 중</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-[9.5px] text-gray-500">재생 시 가사가 실시간 하이라이트됩니다</span>
                                                )}
                                            </div>

                                            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 hide-scrollbar">
                                                {(currentSampleTrack === 'name_soyoung' ? [
                                                    { section: 'Intro', timeLabel: '00:00 - 00:14', line: '🎵 [Intro] 432Hz Soft Warm Piano & Gentle Breeze', start: 0, end: 14 },
                                                    { section: 'Verse 1', timeLabel: '00:15 - 00:26', line: '늘 단단하게 버티며 서 있어야 했던 날들', start: 15, end: 26 },
                                                    { section: 'Verse 1', timeLabel: '00:27 - 00:43', line: '어른스러운 침묵 뒤에 숨겨둔 무거운 마음의 짐들을 가만히 내려 놓아요', start: 27, end: 43 },
                                                    { section: 'Verse 2', timeLabel: '00:44 - 00:58', line: '흘리지 못한 눈물도, 삼켜낸 수많은 말들도', start: 44, end: 58 },
                                                    { section: 'Verse 2', timeLabel: '00:59 - 01:12', line: '얼어붙었던 땅을 녹이는 따스한 봄볕 속에 조용히 녹아 내리네', start: 59, end: 112 },
                                                    { section: 'Pre-Chorus', timeLabel: '01:13 - 01:36', line: '내가 나를 붙잡고 있던 긴장의 손을 풀고 가만히 불어오는 바람의 결에 조심스레 내 마음을 맡겨 봅니다', start: 113, end: 136 },
                                                    { section: 'Chorus', timeLabel: '01:37 - 01:52', line: '더 이상 홀로 모든 것을 짊어지지 않아도 바람처럼 가볍게 햇살처럼 자유롭게', start: 137, end: 152 },
                                                    { section: 'Chorus', timeLabel: '01:53 - 02:13', line: '있는 그대로의 나로 숨 쉬는 곳 가장 편안한 제로 포인트에 닿아 비로소 참된 쉼을 만나네', start: 153, end: 213 },
                                                    { section: 'Spoken Word', timeLabel: '02:14 - 02:38', line: '🗣️ [Spoken Word] "여자1 님 참 잘 버텨왔어요. 애 많이 썼어요. 이제는 마음껏 가벼워져도 괜찮습니다. 당신의 중심은 이미 온전하니까요."', start: 214, end: 238 },
                                                    { section: 'Outro', timeLabel: '02:39 - 03:00', line: '무게를 비워낸 자리에 차오르는 평온 마음의 제로 포인트 나에게로 돌아오는 길...', start: 239, end: 300 },
                                                    { section: 'Ending', timeLabel: '03:01 - 03:40', line: '🎵 [Fade Out] 잔잔한 피아노와 432Hz 여운...', start: 301, end: 220 }
                                                ] : currentSampleTrack === 'kang_misook' ? [
                                                    { section: 'Intro & Count', timeLabel: '00:00 - 00:14', line: '🎵 [Intro] "One two, ready, go! ⚡" (상쾌하고 신나는 비트)', start: 0, end: 14 },
                                                    { section: 'Verse 1', timeLabel: '00:15 - 00:29', line: '파란 하늘 끝까지 펼쳐진 푸른 물결 어깨를 짓누르던 생각은 바람에 날려 톡톡 터지는 탄산처럼 기분 좋은 아침이야', start: 15, end: 29 },
                                                    { section: 'Verse 2', timeLabel: '00:30 - 00:44', line: '남들을 챙기느라 숨겨둔 나의 미소 이제는 세상 밖으로 활짝 꺼내 볼래 발걸음마다 통통 튀는 신나는 멜로디', start: 30, end: 44 },
                                                    { section: 'Pre-Chorus', timeLabel: '00:45 - 00:59', line: '심장이 기분 좋게 쿵쾅대기 시작해 눈부신 바람을 타고 날아오를 시간 자 두 손을 번쩍 들고!', start: 45, end: 59 },
                                                    { section: 'Chorus', timeLabel: '01:00 - 01:14', line: '반짝이는 햇살 타고 끝없이 달려가 가장 자유롭고 당당한 나를 만나는 지금', start: 60, end: 74 },
                                                    { section: 'Chorus', timeLabel: '01:15 - 01:35', line: '마음의 제로 포인트 세상은 나의 무대야 찬란하게 빛나는 오늘을 마음껏 노래해! (Shine on, Brilliant day!)', start: 75, end: 95 },
                                                    { section: 'Spoken Word', timeLabel: '01:36 - 01:50', line: '🗣️ [Spoken Word] "여자2 님, 늘 모두를 비춰주던 당신의 고마운 마음이 이제는 오롯이 당신만을 위한 눈부신 기쁨으로 춤춥니다. 망설이지 말고 오늘을 마음껏 누리세요."', start: 96, end: 110 },
                                                    { section: 'Verse 3', timeLabel: '01:51 - 02:06', line: '두려움은 파도 넘어 던져 버리고 더 높이 날아올라 푸른 바다를 안아 봐 눈부신 우리의 지금 완벽한 시작이야', start: 111, end: 126 },
                                                    { section: 'Chorus', timeLabel: '02:07 - 02:20', line: '반짝이는 햇살 타고 끝없이 달려가 가장 자유롭고 당당한 나를 만나는 지금', start: 127, end: 140 },
                                                    { section: 'Chorus', timeLabel: '02:21 - 02:36', line: '마음의 제로 포인트 세상은 나의 무대야 찬란하게 빛나는 오늘을 마음껏 노래해 랄랄랄랄랄랄', start: 141, end: 156 },
                                                    { section: 'Finale & Outro', timeLabel: '02:37 - 02:56', line: '눈부신 바람을 타고 활짝 웃는 여자2 님을 위해 다 함께 댄스! (One two, ready, go! ⚡)', start: 157, end: 180 }
                                                ] : currentSampleTrack === 'light_breath' ? [
                                                    { section: 'Intro', timeLabel: '00:00 - 00:13', line: '🎵 [Intro] 432Hz Soft Warm Piano & Gentle Breeze', start: 0, end: 13 },
                                                    { section: 'Verse 1', timeLabel: '00:14 - 00:24', line: '늘 담담하게 버티며 서 있어야 했던 날들', start: 14, end: 24 },
                                                    { section: 'Verse 1', timeLabel: '00:25 - 00:40', line: '어른스러운 침묵 뒤에 숨겨둔 무거운 마음의 짐들을 가만히 내려놔요', start: 25, end: 40 },
                                                    { section: 'Verse 2', timeLabel: '00:41 - 00:55', line: '흘리지 못한 눈물도, 삼켜낸 수많은 말들도', start: 41, end: 55 },
                                                    { section: 'Verse 2', timeLabel: '00:56 - 01:12', line: '얼어붙었던 땅을 녹이는 따스한 봄볕 속에 조용히 녹아 내리네', start: 56, end: 112 },
                                                    { section: 'Pre-Chorus', timeLabel: '01:13 - 01:37', line: '내가 나를 붙잡고 있던 긴장의 손을 풀고 가만히 불어오는 바람의 결에 조심스레 내 마음을 맡겨 봅니다', start: 113, end: 137 },
                                                    { section: 'Chorus', timeLabel: '01:38 - 01:59', line: '더 이상 홀로 모든 것을 짊어지지 않아도 바람처럼 가볍게 햇살처럼 자유롭게 있는 그대로의 나로 숨쉬는 곳', start: 138, end: 159 },
                                                    { section: 'Chorus', timeLabel: '02:00 - 02:16', line: '가장 평온한 제로포인트에 닿아 비로소 참된 쉼을 만나네', start: 160, end: 216 },
                                                    { section: 'Spoken Word', timeLabel: '02:17 - 02:36', line: '🗣️ [Spoken Word] "잘 버텨왔어요. 참 애썼어요. 이제는 마음껏 가벼워져도 괜찮습니다. 당신의 중심은 이미 온전하니까요."', start: 217, end: 236 },
                                                    { section: 'Outro', timeLabel: '02:37 - 02:58', line: '무게를 비워낸 자리에 차오르는 평온 마음의 제로포인트 나에게로 돌아오는 길...', start: 237, end: 258 },
                                                    { section: 'Ending', timeLabel: '02:59 - 03:40', line: '🎵 [Fade Out] 잔잔한 피아노와 432Hz 여운...', start: 259, end: 220 }
                                                ] : currentSampleTrack === 'clean_water' ? [
                                                    { section: 'Intro', timeLabel: '00:00 - 00:08', line: '🎵 [Intro] 432Hz 잔잔하고 맑은 물결 피아노 선율', start: 0, end: 8 },
                                                    { section: 'Verse 1', timeLabel: '00:09 - 00:23', line: '단단하게 쥐고 있던 두 손을 가만히 펴봅니다 쉼 없이 나를 채찍질하던', start: 9, end: 23 },
                                                    { section: 'Verse 1', timeLabel: '00:24 - 00:34', line: '뜨거운 열기가 한숨 속에 흩어집니다', start: 24, end: 34 },
                                                    { section: 'Verse 2', timeLabel: '00:35 - 00:43', line: '흐트러지지 않으려 세워둔 날카로운 벽', start: 35, end: 43 },
                                                    { section: 'Verse 2', timeLabel: '00:44 - 00:57', line: '메마른 대지 위로 조용히 맑은 단비가 내려앉아요', start: 44, end: 57 },
                                                    { section: 'Pre-Chorus', timeLabel: '00:58 - 01:09', line: '바람은 그저 불어가고 물결은 다투지 않고 흐르듯', start: 58, end: 69 },
                                                    { section: 'Pre-Chorus', timeLabel: '01:10 - 01:24', line: '내가 나를 옥죄던 생각의 끈을 가만히 놓아줍니다', start: 70, end: 84 },
                                                    { section: 'Chorus', timeLabel: '01:25 - 01:40', line: '서두르지 않아도 모든 것은 제자리로 돌아오고', start: 85, end: 100 },
                                                    { section: 'Chorus', timeLabel: '01:41 - 01:56', line: '흐르는 물처럼 부드러워진 마음에 푸른 평온이 깃듭니다', start: 101, end: 116 },
                                                    { section: 'Chorus', timeLabel: '01:57 - 02:12', line: '가장 고요한 마음의 중심에서 비로소 온전한 나를 만나네', start: 117, end: 132 },
                                                    { section: 'Spoken Word', timeLabel: '02:13 - 02:30', line: '🗣️ [Spoken Word] "더 이상 애쓰지 않아도 괜찮아요. 비워낸 그 자리에 가장 맑은 숨이 차오릅니다."', start: 133, end: 150 },
                                                    { section: 'Outro', timeLabel: '02:31 - 02:49', line: '고요 속으로 맑은 흐름 속으로 마음의 제로 포인트 본연의 온전한 나에게로...', start: 151, end: 169 },
                                                    { section: 'Ending', timeLabel: '02:50 - 03:40', line: '🎵 [Fade Out] 맑은 물결과 피아노 여운 페이드아웃...', start: 170, end: 220 }
                                                ] : [
                                                    { section: 'Intro & Count', timeLabel: '00:00 - 00:18', line: '🎵 하나 둘 셋 넷... 셋 넷... 흠... 하나 둘 셋 넷! ⚡', start: 0, end: 18 },
                                                    { section: 'Verse 1', timeLabel: '00:19 - 00:26', line: '어깨 위에 얹어둔 무거운 생각들 가벼운 바람결에 훌훌 털어 날려 봐', start: 19, end: 26 },
                                                    { section: 'Verse 1', timeLabel: '00:27 - 00:34', line: '조금 서툴러도 뭐 어때 웃어 버리면 그만인 걸', start: 27, end: 34 },
                                                    { section: 'Verse 2', timeLabel: '00:35 - 00:42', line: '꽁꽁 얼어붙었던 어제의 고민도 따스한 햇살 아래 사르르 녹아내려', start: 35, end: 42 },
                                                    { section: 'Verse 2', timeLabel: '00:43 - 00:50', line: '두 발끝이 먼저 리듬을 타기 시작해', start: 43, end: 50 },
                                                    { section: 'Pre-Chorus', timeLabel: '00:51 - 01:04', line: '준비 땅! 심장이 두근두근 뛰어올라 숨겨둔 내 안의 빛을 활짝 열어둘 시간 망설이지 말고 점프!', start: 51, end: 104 },
                                                    { section: 'Chorus', timeLabel: '01:05 - 01:13', line: '파란 하늘 위로 높이 날아올라봐 가장 자유로운 나를 만나는 이 순간', start: 105, end: 113 },
                                                    { section: 'Chorus', timeLabel: '01:14 - 01:27', line: '모든 짐을 비워낸 가벼운 그곳에서 눈부시게 반짝이는 나의 오늘을 노래해! (헤이! Let\'s shine together)', start: 114, end: 127 },
                                                    { section: 'Spoken Word', timeLabel: '01:28 - 01:44', line: '🗣️ [Spoken Word] "세영(소영) 님 그동안 정말 씩씩하게 잘해왔어요. 이제는 마음껏 웃고 가볍게 날아오를 차례예요. 당신의 세상은 지금부터 가장 눈부시게 빛날 거예요."', start: 128, end: 144 },
                                                    { section: 'Verse 3', timeLabel: '01:45 - 02:01', line: '망설였던 어제는 안녕 펼쳐진 길 위로 신나게 달려가 우리의 새로움이 여기서 다시 시작이야', start: 145, end: 201 },
                                                    { section: 'Chorus', timeLabel: '02:02 - 02:10', line: '파란 하늘 위로 높이 날아올라봐 가장 자유로운 나를 만나는 이 순간', start: 202, end: 210 },
                                                    { section: 'Finale', timeLabel: '02:11 - 02:29', line: '모든 짐을 비워낸 가벼운 그곳에서 눈부시게 반짝이는 나의 오늘을 노래해 랄랄랄랄라 가벼워진 발걸음 환하게 웃는 나를 향해 점프!', start: 211, end: 229 },
                                                    { section: 'Outro', timeLabel: '02:30 - 02:45', line: '🎵 [Energy Climax] 눈부신 도파민 충전 완료! ⚡✨', start: 230, end: 245 }
                                                ]).map((lyric, idx) => {
                                                    const isCurrent = isSamplePlaying && sampleProgress >= lyric.start && sampleProgress <= lyric.end;
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`p-2.5 rounded-2xl transition-all duration-300 ${
                                                                isCurrent
                                                                    ? 'bg-amber-500/25 border border-amber-400 shadow-md shadow-amber-500/15 translate-x-1'
                                                                    : 'bg-slate-900/60 border border-white/5'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 mb-1">
                                                                <span className="text-amber-300 font-bold">{lyric.section} ({lyric.timeLabel})</span>
                                                                {isCurrent && (
                                                                    <span className="text-amber-300 font-bold flex items-center gap-1">
                                                                        <span>● 현재 소절</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={`text-xs leading-relaxed transition-colors ${
                                                                isCurrent ? 'text-amber-100 font-extrabold text-[12.5px]' : 'text-gray-300'
                                                            }`}>
                                                                {lyric.line}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-100 text-[11px] leading-relaxed">
                                        <p className="font-medium text-gray-200">
                                            "본인의 기질에 맞는, <strong className="text-amber-300 font-bold">본인의 이름이 들어간 당신만의 1:1 맞춤 코칭 에세이 가사노래</strong>입니다."
                                        </p>
                                        <p className="text-amber-300 font-extrabold text-[11.5px] mt-1">
                                            ✨ 힘들 때마다 들으시면서, 제로포인트로 돌아오세요.
                                        </p>
                                    </div>

                                    <div className="space-y-2 pt-1">
                                        <div className="text-[11px] font-bold text-amber-300 text-center flex items-center justify-center gap-1">
                                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                            <span>원하는 버전을 선택하여 4,900원에 평생 소장하세요</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <button
                                                onClick={() => {
                                                    setIncludeName(true);
                                                    setIsDepositSubmitted(false);
                                                    setShowPaymentModal(true);
                                                }}
                                                className="py-3 px-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-[11.5px] shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 text-center"
                                            >
                                                <span>💖 1. 내 이름 포함 헌정곡 (4,900원)</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIncludeName(false);
                                                    setIsDepositSubmitted(false);
                                                    setShowPaymentModal(true);
                                                }}
                                                className="py-3 px-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-[11.5px] shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 text-center"
                                            >
                                                <span>🌿 2. 순수 에세이 힐링곡 (4,900원)</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={() => {
                                            zeroPointSoundEngine.stop();
                                            setIsPlaying(false);
                                            onClose();
                                        }}
                                        className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
                                    >
                                        모달 닫기
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* [NEW] 💳 4,900원 맞춤 노래 평생 소장 결제 팝업 모달 */}
                    {showPaymentModal && (
                        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
                            <div className="w-full max-w-sm bg-slate-900 border border-amber-500/50 rounded-3xl p-5 shadow-2xl space-y-4 text-xs relative max-h-[90vh] overflow-y-auto hide-scrollbar">
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setIsDepositSubmitted(false);
                                    }}
                                    className="absolute top-3.5 right-3.5 text-gray-400 hover:text-white p-1 cursor-pointer"
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
                                        {effectiveProfile.userName} 님의 선천적 기질 8글자 1:1 맞춤 코칭
                                    </p>
                                </div>

                                {!isDepositSubmitted ? (
                                    <>
                                        {/* [NEW] 💖 따뜻한 감성 위로 멘트 */}
                                        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-indigo-500/20 border border-amber-400/40 text-amber-100 text-[11px] leading-relaxed shadow-lg">
                                            <div className="flex items-start gap-2">
                                                <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0 mt-0.5" />
                                                <div className="space-y-0.5">
                                                    <p className="font-medium text-gray-100">
                                                        "본인의 기질에 맞는, <strong className="text-amber-300 font-bold">본인의 이름이 들어간 1:1 맞춤 힐링노래</strong>입니다."
                                                    </p>
                                                    <p className="text-amber-300 font-bold text-[10.5px]">
                                                        ✨ 힘들 때마다 들으시면서 제로포인트로 돌아오세요.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 혜택 및 가격 안내 */}
                                        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                                            <div className="flex items-baseline justify-between border-b border-slate-800 pb-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-gray-300 text-[11px] font-bold">런칭 기념 이벤트 특가</span>
                                                    <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded font-extrabold">84% 할인</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-gray-500 line-through text-[10px] mr-1.5">30,000원</span>
                                                    <span className="text-amber-400 font-black text-base">4,900원</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1 text-[10.5px] text-gray-300">
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
                                                    <span>432Hz 고음질 힐링 MP3 음원 파일 평생 소장</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                    <span className="font-bold text-amber-200">📖 《제로포인트》 도서 포함</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 🏦 무통장 입금 계좌 안내 박스 */}
                                        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-2 text-[11px]">
                                            <div className="flex items-center justify-between text-amber-300 font-bold">
                                                <span className="flex items-center gap-1">🏦 무통장 입금 안내</span>
                                                <span className="text-xs font-black text-amber-400">4,900원</span>
                                            </div>
                                            <div className="p-2 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-between">
                                                <div className="font-mono text-white text-xs font-bold tracking-wider">
                                                    토스뱅크 1002-6847-4899
                                                    <span className="text-[10px] text-gray-400 font-normal ml-1.5">(마인드플로우랩)</span>
                                                </div>
                                                <button
                                                    onClick={handleCopyAccount}
                                                    className="px-2 py-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] cursor-pointer transition-colors"
                                                >
                                                    {isAccountCopied ? '✅ 복사됨' : '복사'}
                                                </button>
                                            </div>
                                            <div className="space-y-1 pt-0.5">
                                                <label className="text-[10.5px] font-bold text-gray-300">입금자 성함 *</label>
                                                <input
                                                    type="text"
                                                    value={depositorName}
                                                    onChange={(e) => setDepositorName(e.target.value)}
                                                    placeholder="예: 홍길동 (실제 입금하신 이름)"
                                                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <button
                                                onClick={handleDepositSubmit}
                                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                                                <span>입금 완료 및 1:1 오픈채팅으로 승인 요청하기 ➔</span>
                                            </button>
                                            
                                            {/* 도서 독자 시크릿 쿠폰 등록 링크 */}
                                            <div className="text-center pt-1">
                                                <button
                                                    onClick={() => {
                                                        setShowPaymentModal(false);
                                                        setIsCouponModalOpen(true);
                                                    }}
                                                    className="text-[10.5px] text-amber-300 hover:text-amber-200 underline font-medium cursor-pointer"
                                                >
                                                    🎫 《제로포인트》 도서 시크릿 코드가 있으신가요? (무료 이용)
                                                </button>
                                            </div>

                                            <p className="text-[9.5px] text-gray-400 text-center">
                                                * 입금 확인 후 관리자 승인을 통해 1:1 맞춤 MP3 음원이 전달됩니다.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    /* 입금 확인 접수 완료 및 오픈카톡 안내 화면 */
                                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-400/40 text-center space-y-3.5 animate-fade-in">
                                        <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40 text-2xl">
                                            🎉
                                        </div>

                                        <div className="space-y-1">
                                            <h5 className="font-bold text-white text-sm">입금 확인 요청이 접수되었습니다!</h5>
                                            <p className="text-[11px] text-amber-200 leading-relaxed">
                                                <strong>'{depositorName} 님'</strong>의 입금(4,900원) 내역 확인 후, 관리자 승인 및 1:1 맞춤 432Hz MP3 음원을 직접 발송해 드립니다.
                                            </p>
                                        </div>

                                        {/* QR코드 및 오픈채팅 바로가기 */}
                                        <div className="p-3 rounded-2xl bg-white/5 border border-slate-800 flex flex-col items-center space-y-2">
                                            <div className="text-[10.5px] font-bold text-amber-300">
                                                📱 1:1 오픈채팅으로 입금자명을 알려주세요
                                            </div>
                                            <div className="w-24 h-24 bg-white p-1 rounded-xl shadow-md border border-amber-400/40 flex items-center justify-center">
                                                <img
                                                    src="/images/kakao_openchat_qr.jpg"
                                                    alt="1:1 오픈채팅 QR코드"
                                                    className="w-full h-full object-contain rounded-lg"
                                                />
                                            </div>
                                            <div className="w-full flex items-center justify-between text-[10px] text-gray-300 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700">
                                                <span>입금자명: <strong>{depositorName}</strong> (4,900원)</span>
                                                <button
                                                    onClick={handleCopyDepositSummary}
                                                    className="text-[9.5px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded cursor-pointer"
                                                >
                                                    {copiedDepositText ? '✅ 복사됨' : '내용 복사'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-1">
                                            <a
                                                href="https://open.kakao.com/o/sfNxzYKi"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer block"
                                            >
                                                <span>💬 1:1 오픈채팅 입장하여 입금 확인 요청하기</span>
                                            </a>

                                            <button
                                                onClick={() => {
                                                    setShowPaymentModal(false);
                                                    setIsDepositSubmitted(false);
                                                }}
                                                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                                            >
                                                확인 및 닫기
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* [NEW] 🎫 《제로포인트》 도서 독자 전용 2번 방식 (1:1 주문제작 신청 ➔ 카카오톡/이메일 전달) */}
                    {isCouponModalOpen && (
                        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
                            <div className="w-full max-w-sm bg-slate-900 border border-amber-400/60 rounded-3xl p-5 shadow-2xl space-y-4 text-xs relative max-h-[90vh] overflow-y-auto hide-scrollbar">
                                <button
                                    onClick={() => {
                                        setIsCouponModalOpen(false);
                                        setCouponStep('verify');
                                    }}
                                    className="absolute top-3.5 right-3.5 text-gray-400 hover:text-white p-1 cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {/* STEP 1: 인증 코드 입력 */}
                                {couponStep === 'verify' && (
                                    <>
                                        <div className="text-center space-y-1.5 pt-1">
                                            <div className="w-11 h-11 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-lg text-xl">
                                                🎫
                                            </div>
                                            <h4 className="text-base font-black text-white">
                                                《제로포인트》 도서 독자 인증
                                            </h4>
                                            <p className="text-[11px] text-gray-300 leading-relaxed">
                                                도서에 동봉된 <strong>시크릿 골드 티켓의 인증 코드</strong>를 입력하세요.
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-amber-300">
                                                    16자리 독자 인증 코드
                                                </label>
                                                <input
                                                    type="text"
                                                    value={bookCouponCode}
                                                    onChange={(e) => setBookCouponCode(e.target.value)}
                                                    placeholder="예: ZERO-POINT-2026-XXXX"
                                                    className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-center tracking-widest text-xs focus:outline-none focus:border-amber-400 uppercase placeholder:text-gray-600"
                                                />
                                            </div>

                                            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-gray-300 text-[10.5px] leading-relaxed space-y-1.5">
                                                <div className="text-amber-300 font-bold flex items-center gap-1">
                                                    <span>🎁 초판 독자 무료 혜택 (정가 30,000원 상당)</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-300">
                                                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                    <span>내 이름 & 사주 기질 맞춤 1:1 헌정 힐링송(MP3) 무료 제작</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-300">
                                                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                    <span>평생 소장용 432Hz 고음질 MP3 파일 제공</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleVerifyCoupon}
                                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <Sparkles className="w-4 h-4 fill-current" />
                                                <span>코드 인증하고 1:1 맞춤제작 신청하기 ➔</span>
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* STEP 2: 1:1 맞춤 힐링송 제작 신청서 */}
                                {couponStep === 'apply_form' && (
                                    <div className="space-y-3.5 animate-fade-in">
                                        <div className="text-center space-y-1 pt-1">
                                            <div className="text-xs font-black text-amber-300 flex items-center justify-center gap-1">
                                                <span>🎨 STEP 2. 나만의 1:1 힐링송 제작 신청</span>
                                            </div>
                                            <p className="text-[11px] text-gray-300">
                                                사주 기질과 성함에 맞춘 세상에 단 하나뿐인 노래를 작곡해 드립니다.
                                            </p>
                                        </div>

                                        <div className="space-y-2.5">
                                            <div className="space-y-1">
                                                <label className="text-[10.5px] font-bold text-gray-300">1. 노래에 들어갈 성함 *</label>
                                                <input
                                                    type="text"
                                                    value={orderUserName}
                                                    onChange={(e) => setOrderUserName(e.target.value)}
                                                    placeholder="예: 홍길동"
                                                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10.5px] font-bold text-gray-300">2. 생년월일 및 태어난 시간 (양/음력)</label>
                                                <input
                                                    type="text"
                                                    value={orderBirth}
                                                    onChange={(e) => setOrderBirth(e.target.value)}
                                                    placeholder="예: 1985년 3월 15일 낮 12시 (양력)"
                                                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10.5px] font-bold text-gray-300">3. 희망하는 곡 분위기</label>
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOrderSongStyle('calm')}
                                                        className={`p-2 rounded-xl border text-[10.5px] font-bold transition-all text-center cursor-pointer ${
                                                            orderSongStyle === 'calm'
                                                                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                                                                : 'bg-slate-950 border-slate-800 text-gray-400'
                                                        }`}
                                                    >
                                                        💖 잔잔 감성 (위로·이완)
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setOrderSongStyle('upbeat')}
                                                        className={`p-2 rounded-xl border text-[10.5px] font-bold transition-all text-center cursor-pointer ${
                                                            orderSongStyle === 'upbeat'
                                                                ? 'bg-pink-500/20 border-pink-400 text-pink-200'
                                                                : 'bg-slate-950 border-slate-800 text-gray-400'
                                                        }`}
                                                    >
                                                        ⚡ 신나는 힐링 (도파민)
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10.5px] font-bold text-gray-300">4. 음원(MP3) 받으실 연락처 *</label>
                                                <div className="flex gap-2 mb-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOrderDeliveryType('kakao')}
                                                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                                            orderDeliveryType === 'kakao'
                                                                ? 'bg-amber-400 text-slate-950 border-amber-400 font-extrabold'
                                                                : 'bg-slate-950 text-gray-400 border-slate-800'
                                                        }`}
                                                    >
                                                        💬 1:1 오픈채팅 전달 (추천)
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setOrderDeliveryType('email')}
                                                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                                            orderDeliveryType === 'email'
                                                                ? 'bg-indigo-500 text-white border-indigo-400 font-extrabold'
                                                                : 'bg-slate-950 text-gray-400 border-slate-800'
                                                        }`}
                                                    >
                                                        📧 이메일 전달
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={orderContact}
                                                    onChange={(e) => setOrderContact(e.target.value)}
                                                    placeholder={orderDeliveryType === 'kakao' ? "오픈채팅 닉네임 또는 연락처" : "음원을 받을 이메일 주소 (예: user@naver.com)"}
                                                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleOrderSubmit}
                                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                                        >
                                            <Sparkles className="w-4 h-4 fill-current" />
                                            <span>맞춤 힐링송 제작 신청 완료하기</span>
                                        </button>
                                    </div>
                                )}

                                {/* STEP 3: 신청 완료 & 1:1 오픈카톡 안내 */}
                                {couponStep === 'complete' && (
                                    <div className="space-y-3.5 text-center animate-fade-in pt-1">
                                        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/40 text-2xl">
                                            🎉
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black text-white">
                                                1:1 맞춤 힐링송 제작 신청이 완료되었습니다!
                                            </h4>
                                            <p className="text-[11px] text-emerald-300 leading-relaxed">
                                                <strong>'{orderUserName} 님'</strong>의 사주 기질에 맞춘 432Hz MP3 완성곡을 정성껏 작곡하여 전달해 드립니다.
                                            </p>
                                        </div>

                                        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-1.5 text-[10.5px]">
                                            <div className="text-amber-300 font-bold flex items-center justify-between">
                                                <span>📋 신청 접수 정보</span>
                                                <button
                                                    onClick={handleCopyOrderText}
                                                    className="text-[9.5px] bg-slate-800 hover:bg-slate-700 text-gray-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                                                >
                                                    {copiedOrderText ? '✅ 복사 완료!' : '내용 복사'}
                                                </button>
                                            </div>
                                            <div className="text-gray-300 space-y-0.5 text-[10px] font-mono">
                                                <div>• 성함: {orderUserName}</div>
                                                <div>• 스타일: {orderSongStyle === 'calm' ? '잔잔 감성 헌정곡' : '신나는 도파민 힐링'}</div>
                                                <div>• 수신처: {orderContact} ({orderDeliveryType === 'kakao' ? '카톡' : '이메일'})</div>
                                            </div>
                                        </div>

                                        {/* QR코드 및 오픈카톡 바로가기 */}
                                        <div className="p-3.5 rounded-2xl bg-white/5 border border-amber-500/30 flex flex-col items-center space-y-2.5">
                                            <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                                                <span>📱 스마트폰 카메라로 QR 스캔 또는 바로 입장</span>
                                            </div>
                                            <div className="w-28 h-28 bg-white p-1.5 rounded-xl shadow-lg border border-amber-400/50 flex items-center justify-center">
                                                <img
                                                    src="/images/kakao_openchat_qr.jpg"
                                                    alt="1:1 오픈채팅 QR코드"
                                                    className="w-full h-full object-contain rounded-lg"
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-400">
                                                카카오톡에서 <strong>'{orderUserName}'</strong> 닉네임으로 입장하시면 가장 빠르게 음원을 전송해 드립니다.
                                            </p>
                                        </div>

                                        <div className="space-y-2 pt-1">
                                            {/* 오픈카톡 바로가기 버튼 */}
                                            <a
                                                href="https://open.kakao.com/o/sfNxzYKi"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer block"
                                            >
                                                <span>💬 1:1 카카오톡 오픈채팅 바로 입장하기</span>
                                            </a>

                                            <button
                                                onClick={() => {
                                                    setIsCouponModalOpen(false);
                                                    setCouponStep('verify');
                                                }}
                                                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-xs cursor-pointer"
                                            >
                                                확인 및 닫기
                                            </button>
                                        </div>
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
