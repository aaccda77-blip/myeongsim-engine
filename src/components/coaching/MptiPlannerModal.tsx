'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Terminal, CheckCircle2, Send, Cpu, AlertTriangle, RefreshCw, Sparkles, Compass, ShieldAlert } from 'lucide-react';
import { useReportStore, EgoSyncMessage } from '@/store/useReportStore';

interface MptiPlannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile?: any;
    resultType: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
    answers: Record<string, number>;
    birthOhaeng: Record<string, number>;
    avatarCode: string; // [NEW] FPTI 아바타 코드
    isOverlayMode?: boolean; // [NEW] 오버레이 모드 여부
}

interface PlannerData {
    systemWarning: string;
    oneLiner: string;
    missions: string[];
    meditation: string;
}

export default function MptiPlannerModal({ 
    isOpen, 
    onClose, 
    userProfile, 
    resultType, 
    answers, 
    birthOhaeng,
    avatarCode,
    isOverlayMode = false
}: MptiPlannerModalProps) {
    const [step, setStep] = useState<number>(0); // 0: Compiler Loading, 1: Dashboard Console
    const [loadingLogIndex, setLoadingLogIndex] = useState<number>(0);
    const [plannerData, setPlannerData] = useState<PlannerData | null>(null);
    const [completedMissions, setCompletedMissions] = useState<Set<number>>(new Set());
    const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
    
    // 실시간 디버거 대화 입력 상태
    const [worryInput, setWorryInput] = useState<string>('');
    const [isDebugging, setIsDebugging] = useState<boolean>(false);
    const [stepNotice, setStepNotice] = useState<string | null>(null);
    const noticeTimeoutRef = useRef<any>(null);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const handleStepClick = (s: any) => {
        if (noticeTimeoutRef.current) {
            clearTimeout(noticeTimeoutRef.current);
        }
        setStepNotice(`이 메뉴는 순차적인 '마음 디버깅 단계'입니다. 하단에 고민을 적어 대화하시면 AI 분석 결과에 따라 '${s.name}' 단계로 자동으로 이동합니다.`);
        noticeTimeoutRef.current = setTimeout(() => {
            setStepNotice(null);
            noticeTimeoutRef.current = null;
        }, 4500);
    };

    // 전역 스토어 상태 및 액션 연동
    const {
        egoSyncHistory,
        egoSyncStep,
        egoSyncBlur,
        egoSyncSpeed,
        addEgoSyncMessage,
        setEgoSyncUI,
        resetEgoSync
    } = useReportStore();

    const COMPILER_LOGS = [
        '🚀 [BOOT] INITIALIZING FPTI_MIND_TUNING_COMPILER V3.0',
        '⚡ [CONNECT] ESTABLISHING SECURE GATEWAY TO GEMINI 2.5 FLASH API...',
        `📂 [DATA] MOUNTING INNATE SAJU MATRIX: [W:${birthOhaeng.wood || 0}, F:${birthOhaeng.fire || 0}, E:${birthOhaeng.earth || 0}, M:${birthOhaeng.metal || 0}, W:${birthOhaeng.water || 0}]`,
        `📊 [DATA] MOUNTING FPTI QUIZ RESPONSE VECTOR: [W:${answers.wood || 0}, F:${answers.fire || 0}, E:${answers.earth || 0}, M:${answers.metal || 0}, W:${answers.water || 0}]`,
        `🔮 [AVATAR] FPTI AVATAR CODE INSTANTIATED: [${avatarCode}]`,
        '⚙️ [ALGORITHM] CALCULATING INTEGRATED ENERGY BALANCE MATRIX...',
        '🧠 [COMPILING] RUNNING COGNITIVE REFRAMING & BEHAVIORAL PROTOCOLS...',
        '🟢 [SUCCESS] GEMINI API RESPONSE VERIFIED (200 OK)',
        '🚀 [SYSTEM] FPTI MIND TUNING PROTOCOL LOADED SUCCESSFULLY!'
    ];

    // BGM 오디오 제어 및 초기 로드
    useEffect(() => {
        if (isOpen) {
            audioRef.current = new Audio('/sounds/528hz_healing_bgm.mp3');
            audioRef.current.loop = true;
            audioRef.current.volume = 0.4;
            setStep(0);
            setLoadingLogIndex(0);
            setWorryInput('');
            setCompletedMissions(new Set());
            fetchPlannerData();
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
                setIsBgmPlaying(false);
            }
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [isOpen]);

    // 스크롤 제어
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [egoSyncHistory, step]);

    const toggleBgm = () => {
        if (!audioRef.current) return;
        if (isBgmPlaying) {
            audioRef.current.pause();
            setIsBgmPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
            setIsBgmPlaying(true);
        }
    };

    // 플래너 데이터 가져오기
    const fetchPlannerData = async () => {
        try {
            const res = await fetch('/api/coaching/mpti-planner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: userProfile?.userName || '익명',
                    resultType,
                    birthOhaeng,
                    answers,
                    avatarCode
                })
            });
            const data = await res.json();
            setPlannerData(data);
        } catch (error) {
            console.error('Error fetching planner data:', error);
        }
    };

    // 로딩 시퀀스 애니메이션 제어
    useEffect(() => {
        if (isOpen && step === 0) {
            const interval = setInterval(() => {
                setLoadingLogIndex(prev => {
                    if (prev >= COMPILER_LOGS.length - 1) {
                        clearInterval(interval);
                        // 데이터 로딩이 끝난 후 약간의 딜레이 뒤 대시보드로 전환
                        setTimeout(() => setStep(1), 500);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 250);
            return () => clearInterval(interval);
        }
    }, [isOpen, step]);

    // 대화 시작 시 첫 턴 자동 인사말 주입
    useEffect(() => {
        if (isOpen && step === 1 && plannerData && egoSyncHistory.length === 0) {
            addEgoSyncMessage({
                role: 'model',
                content: `안녕하세요, ${userProfile?.userName || '익명'}님. 분석된 FPTI 성향인 [${avatarCode}] 및 타고난 사주 오행 기질을 기반으로 당신만을 위한 실시간 에고싱크(Ego-Sync) 정렬 세션을 활성화했습니다.\n\n현재 마음을 어지럽히거나 긴장하게 만드는 가장 지배적인 '에고의 소음(불안, 강박적 서사, 걱정 등)'은 무엇인가요? 가만히 응시해보고, 그 소음에 어울리는 이름표를 붙여 말해주십시오. (STEP 1: 소음 라벨링 단계)`,
                step: 1
            });
        }
    }, [isOpen, step, plannerData, egoSyncHistory, avatarCode]);

    // 실시간 에고싱크 대화 처리
    const handleRunEgoSync = async () => {
        if (!worryInput.trim() || isDebugging) return;
        const userMsg = worryInput.trim();
        setWorryInput('');
        setIsDebugging(true);

        // 1. 유저 메세지 로컬 추가
        addEgoSyncMessage({
            role: 'user',
            content: userMsg,
            step: egoSyncStep
        });

        try {
            // 2. 히스토리 직렬화
            const formattedHistory = egoSyncHistory.map(h => ({
                role: h.role,
                content: h.content
            }));
            formattedHistory.push({ role: 'user', content: userMsg });

            // 3. API 요청 전송
            const res = await fetch('/api/coaching/mpti-planner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: userProfile?.userName || '익명',
                    resultType,
                    birthOhaeng,
                    avatarCode,
                    worry: userMsg,
                    chatHistory: formattedHistory,
                    currentStep: egoSyncStep
                })
            });
            const data = await res.json();

            // 4. 스토어 상태 및 UI 동기화
            const aiStep = data.analysis?.current_step || egoSyncStep;
            const blurEffect = data.ui_control?.blur_effect || false;
            const flowSpeed = data.ui_control?.background_flow_speed || 'standard';

            setEgoSyncUI(blurEffect, flowSpeed, aiStep);

            // 5. AI 응답 추가
            addEgoSyncMessage({
                role: 'model',
                content: `${data.response?.validation || ''}\n\n${data.response?.coaching_question || ''}`,
                step: aiStep,
                egoPattern: data.analysis?.detected_ego_pattern,
                validation: data.response?.validation,
                coachingQuestion: data.response?.coaching_question
            });
        } catch (error) {
            console.error('Error debugging worry:', error);
            addEgoSyncMessage({
                role: 'model',
                content: '[SYSTEM-ERR] 마인드 서버 연산 부하가 감지되었습니다. 깊게 호흡하며 10초 후 다시 입력해보세요.',
                step: egoSyncStep
            });
        } finally {
            setIsDebugging(false);
        }
    };

    const toggleMissionComplete = (idx: number) => {
        setCompletedMissions(prev => {
            const next = new Set(prev);
            if (next.has(idx)) {
                next.delete(idx);
            } else {
                next.add(idx);
            }
            return next;
        });
    };

    if (!isOpen) return null;

    const progressPct = Math.round((completedMissions.size / 3) * 100);

    // 4단계 헤더 매핑 데이터
    const STEPS_INFO = [
        { num: 1, name: '소음 인지', icon: '🏷️' },
        { num: 2, name: '회광반조', icon: '🪞' },
        { num: 3, name: '저항수용', icon: '👐' },
        { num: 4, name: '본질경청', icon: '📡' }
    ];

    // 모달 / 오버레이 통합 클래스 설정
    const containerClasses = isOverlayMode 
        ? "w-full h-full bg-slate-950 text-text-gray flex flex-col relative"
        : "bg-slate-950 border border-teal-500/20 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(20,184,166,0.15)] relative flex flex-col overflow-hidden max-h-[92vh]";

    const pulseDurationClass = egoSyncSpeed === 'slow' ? 'duration-[9000ms]' : 'duration-[3000ms]';

    return (
        <div className={isOverlayMode ? "w-full h-full overflow-hidden" : "fixed inset-0 z-[3600] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto"}>
            <motion.div
                initial={isOverlayMode ? { opacity: 0, x: 50 } : { opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={isOverlayMode ? { opacity: 0, x: 50 } : { opacity: 0, y: 50, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={containerClasses}
            >
                {/* [Aura Effect] 배경 빛 애니메이션 */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                    <div className={`absolute top-[20%] left-[10%] w-[350px] h-[350px] bg-teal-500/[0.03] rounded-full blur-[100px] animate-pulse ${pulseDurationClass}`} />
                    <div className={`absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-emerald-500/[0.02] rounded-full blur-[80px] animate-pulse ${pulseDurationClass}`} />
                </div>

                {/* 상단 탭 헤더 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-[#10b748] animate-pulse" />
                        <span className="text-[#10b748] text-xs font-mono tracking-wider">AI_MIND_TUNER_CONSOLE</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* BGM 재생 버튼 */}
                        <button
                            onClick={toggleBgm}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] border font-mono transition-all ${
                                isBgmPlaying 
                                ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' 
                                : 'bg-slate-900 text-slate-500 border-slate-800'
                            }`}
                        >
                            {isBgmPlaying ? '🔊 528Hz BGM ON' : '🔈 528Hz BGM OFF'}
                        </button>

                        <button
                            onClick={onClose}
                            className="bg-slate-900 p-1.5 rounded-full text-slate-400 hover:text-white border border-slate-800 transition-all active:scale-95"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* 본문 스크롤 컨테이너 */}
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar flex flex-col gap-5">
                    {/* STEP 0: COMPILER LOG COMPILING */}
                    {step === 0 && (
                        <div className="flex flex-col py-6">
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <Cpu className="text-teal-400 animate-spin" size={28} />
                                <h3 className="text-white text-md font-bold font-mono">COMPILING MPTI PLANNER...</h3>
                            </div>

                            <div className="w-full bg-slate-950 border border-slate-900 rounded-xl p-4 font-mono text-[10px] text-slate-400 h-64 overflow-y-auto flex flex-col gap-1.5 shadow-inner custom-scrollbar">
                                {COMPILER_LOGS.slice(0, loadingLogIndex + 1).map((log, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`${idx === loadingLogIndex ? 'text-teal-400 animate-pulse' : 'text-slate-500'}`}
                                    >
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 1: PLANNER DASHBOARD */}
                    {step === 1 && plannerData && (
                        <div className="flex flex-col gap-5 py-1">
                            {/* 시스템 워닝 로그 헤더 */}
                            <div className="bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl flex items-start gap-3 shadow-[0_0_15px_rgba(245,158,11,0.03)]">
                                <AlertTriangle className="text-amber-400 shrink-0 mt-0.5 animate-pulse" size={16} />
                                <div>
                                    <div className="text-amber-400 font-mono text-[9px] tracking-wider uppercase mb-0.5">
                                        {plannerData.systemWarning}
                                    </div>
                                    <p className="text-slate-300 text-[11px] leading-relaxed break-keep font-medium">
                                        {plannerData.oneLiner}
                                    </p>
                                </div>
                            </div>

                            {/* 1일 오행 튜닝 미션 목록 */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-white text-xs font-semibold flex items-center gap-1.5">
                                        <Sparkles size={12} className="text-teal-400" />
                                        <span>오늘의 오행 조율 미션</span>
                                    </h4>
                                    <span className="text-[10px] font-mono text-teal-400">{progressPct}% 튜닝 완료</span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {plannerData.missions.map((mission, idx) => {
                                        const isDone = completedMissions.has(idx);
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => toggleMissionComplete(idx)}
                                                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                                                    isDone 
                                                    ? 'bg-teal-500/5 border-teal-500/20 text-teal-300' 
                                                    : 'bg-slate-950 border-slate-900 hover:border-slate-800 text-slate-350 hover:text-white'
                                                }`}
                                            >
                                                <span className={`shrink-0 mt-0.5 flex items-center justify-center w-4 h-4 rounded-full border transition-all ${
                                                    isDone 
                                                    ? 'bg-teal-500/20 border-teal-500 text-teal-400' 
                                                    : 'bg-slate-900 border-slate-800 text-transparent'
                                                }`}>
                                                    ✓
                                                </span>
                                                <span className="text-[11px] leading-relaxed break-keep">{mission}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 명상 화두 */}
                            <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl flex flex-col items-center text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-teal-500/[0.01] rounded-full w-24 h-24 -z-10 animate-ping"></div>
                                <span className="text-[9px] font-mono text-teal-500 mb-1 uppercase tracking-wider">Aura Meditation Topic</span>
                                <p className="text-slate-300 text-xs leading-relaxed max-w-xs break-keep font-medium">
                                    "{plannerData.meditation}"
                                </p>
                            </div>

                            {/* 4단계 에고싱크 정렬 스테이터스바 */}
                            <div className="border border-slate-900 rounded-2xl p-4 bg-slate-950 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-white text-xs font-semibold flex items-center gap-1.5">
                                        <Compass size={12} className="text-[#10b748] animate-spin-slow" />
                                        <span>실시간 에고싱크(Ego-Sync) 정렬</span>
                                    </h4>
                                    <span className="text-[10px] font-mono text-teal-400 font-semibold">Tuning Step {egoSyncStep}/4</span>
                                </div>

                                {/* 안내 노티스 메시지 영역 */}
                                <AnimatePresence>
                                    {stepNotice && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[10.5px] text-amber-400 leading-normal break-keep flex items-start gap-1.5 shadow-[0_4px_15px_rgba(245,158,11,0.05)]">
                                                <span className="shrink-0 mt-0.5">💡</span>
                                                <span>{stepNotice}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* 가로 Step 인디케이터 */}
                                <div className="grid grid-cols-4 gap-1">
                                    {STEPS_INFO.map(s => {
                                        const isActive = egoSyncStep >= s.num;
                                        const isCurrent = egoSyncStep === s.num;
                                        return (
                                            <button 
                                                key={s.num}
                                                onClick={() => handleStepClick(s)}
                                                className={`flex flex-col items-center py-1.5 rounded-lg border font-sans text-center transition-all cursor-help active:scale-95 ${
                                                    isCurrent
                                                    ? 'bg-teal-500/10 border-teal-400/50 text-teal-300 shadow-[0_0_10px_rgba(20,184,166,0.1)]'
                                                    : isActive
                                                    ? 'bg-slate-900 border-teal-500/20 text-teal-400/70'
                                                    : 'bg-slate-950 border-slate-900 text-slate-600'
                                                }`}
                                            >
                                                <span className="text-[10px] mb-0.5">{s.icon}</span>
                                                <span className="text-[8px] font-bold whitespace-nowrap">{s.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* 에고싱크 대화창 */}
                                <div className="w-full bg-slate-950/80 border border-slate-900 rounded-xl p-3 flex flex-col gap-3 min-h-[180px] max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {egoSyncHistory.map((msg, idx) => {
                                        const isUser = msg.role === 'user';
                                        // 현재 활성화된 blur_effect이고, 마지막 메시지가 아니며, 유저의 메시지일 때 왜곡 필터링 적용
                                        const shouldBlur = egoSyncBlur && (idx < egoSyncHistory.length - 1) && msg.role === 'user';
                                        
                                        return (
                                            <div
                                                key={idx}
                                                className={`flex flex-col gap-1 w-full`}
                                            >
                                                <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 px-1">
                                                    <span>{isUser ? userProfile?.userName || 'USER' : 'MIND_COACH_AI'}</span>
                                                    {msg.step && <span>STEP {msg.step}</span>}
                                                </div>
                                                <div
                                                    className={`p-3 rounded-2xl max-w-[85%] text-[11px] leading-relaxed break-keep font-sans transition-all duration-1000 ${
                                                        isUser 
                                                        ? 'bg-teal-500/10 border border-teal-500/20 text-teal-200 self-end ml-auto' 
                                                        : 'bg-slate-900 border border-slate-800 text-slate-200 self-start mr-auto'
                                                    } ${shouldBlur ? 'blur-[2px] opacity-35' : ''}`}
                                                >
                                                    {msg.content.split('\n').map((line, i) => (
                                                        <p key={i} className="mb-1 last:mb-0">{line}</p>
                                                    ))}
                                                </div>
                                                {/* 에고 인지 왜곡 탐지 로그 */}
                                                {!isUser && msg.egoPattern && (
                                                    <div className="text-[8px] font-mono text-amber-500/80 px-1.5 flex items-center gap-1">
                                                        <ShieldAlert size={8} />
                                                        <span>[DETECTED_EGO_NOISE]: {msg.egoPattern}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {isDebugging && (
                                        <div className="flex gap-2 items-center self-start text-xs font-mono text-teal-400 animate-pulse py-1">
                                            <RefreshCw className="animate-spin" size={10} />
                                            <span>[DECIPHERING_MIND_WAVES...]</span>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* 고민 디버그 한줄 전송 폼 */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={worryInput}
                                        onChange={(e) => setWorryInput(e.target.value)}
                                        placeholder="현재 내면의 고민이나 생각의 소음을 말해보세요..."
                                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleRunEgoSync();
                                        }}
                                        disabled={isDebugging}
                                    />
                                    <button
                                        onClick={handleRunEgoSync}
                                        disabled={isDebugging || !worryInput.trim()}
                                        className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 p-2.5 rounded-xl transition-all shrink-0 flex items-center justify-center active:scale-95"
                                    >
                                        <Send size={12} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 px-1 border-t border-slate-900 pt-2 mt-1">
                                    <span>* 에고의 방어기제를 해제하면 다음 단계가 개방됩니다.</span>
                                    <button 
                                        onClick={() => {
                                            if (confirm('에고싱크 대화 히스토리를 초기화하시겠습니까?')) {
                                                resetEgoSync();
                                            }
                                        }}
                                        className="hover:text-teal-400 underline transition-colors"
                                    >
                                        대화 초기화
                                    </button>
                                </div>
                            </div>

                            {/* 하단 완성 버튼 */}
                            <button
                                onClick={onClose}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-xs transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.2)] flex items-center justify-center gap-1.5 active:scale-[0.98] mt-2"
                            >
                                <CheckCircle2 size={14} />
                                <span>마음 튜닝 패치 완료</span>
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
