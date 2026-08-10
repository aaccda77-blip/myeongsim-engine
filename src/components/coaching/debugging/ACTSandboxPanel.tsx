import React, { useState, useEffect } from 'react';
import { motion as framerMotion, AnimatePresence as FramerAnimatePresence } from 'framer-motion';
import { PsychDebuggingEngine, PsychologicalMetrics, DebuggingMission } from '../../../modules/debugging/PsychDebuggingEngine';
import { DefusionMissionCard } from './DefusionMissionCard';
import { MicroTimerCard } from './MicroTimerCard';

interface ACTSandboxPanelProps {
    isOpen: boolean;
    onClose: () => void;
    initialMetrics?: PsychologicalMetrics;
}

export const ACTSandboxPanel: React.FC<ACTSandboxPanelProps> = ({ 
    isOpen, 
    onClose, 
    initialMetrics = { fusionScore: 85, avoidanceScore: 75, perfectionismScore: 80 }
}) => {
    // 1. 상태 정의
    const [metrics, setMetrics] = useState<PsychologicalMetrics>(initialMetrics);
    const [diagnosedMission, setDiagnosedMission] = useState<DebuggingMission | null>(null);
    const [sandboxStep, setSandboxStep] = useState<'IDLE' | 'PHASE_1' | 'PHASE_2' | 'COMPLETED'>('IDLE');
    const [simulatedConsoleLogs, setSimulatedConsoleLogs] = useState<string[]>([]);
    const [isTypingLog, setIsTypingLog] = useState(false);

    // 2. 실시간 분석 업데이트
    useEffect(() => {
        const mission = PsychDebuggingEngine.diagnose(metrics);
        setDiagnosedMission(mission);
        
        // 콘솔 로그 시뮬레이션
        if (isOpen && sandboxStep === 'IDLE') {
            setIsTypingLog(true);
            setSimulatedConsoleLogs([
                `[SYSTEM INFO] 대뇌 OS 실시간 커널 모니터링 가동...`,
                `[METRICS SYNC] 인지융합도: ${metrics.fusionScore}%, 경험회피성향: ${metrics.avoidanceScore}%, 완벽주의락: ${metrics.perfectionismScore}%`,
                `[DIAGNOSING] 심리 오작동 가중치 벡터 연산 중...`,
                `[ALERT STATUS] 오류 판정: ${mission.bugCode} (${mission.bugTitle})`,
                `[LOG] ${mission.errorLog}`
            ]);
            const timer = setTimeout(() => setIsTypingLog(false), 600);
            return () => clearTimeout(timer);
        }
    }, [metrics, isOpen, sandboxStep]);

    if (!isOpen) return null;

    // 슬라이더 변경 핸들러
    const handleMetricChange = (key: keyof PsychologicalMetrics, value: number) => {
        if (sandboxStep !== 'IDLE') return; // 시뮬레이션 진행 중에는 슬라이더 수정 불가
        setMetrics(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // 디버깅 프로토콜 가동
    const startDebuggingProtocol = () => {
        if (!diagnosedMission) return;
        setSandboxStep('PHASE_1');
    };

    // 1단계 완료 -> 2단계 타이머 진입
    const handlePhase1Complete = () => {
        setSandboxStep('PHASE_2');
    };

    // 2단계 완료 -> 최종 완료 리포트 진입
    const handlePhase2Complete = () => {
        setSandboxStep('COMPLETED');
    };

    // 디버깅 세션 리셋
    const resetSandbox = () => {
        setSandboxStep('IDLE');
    };

    // 심리 오류 등급별 네온 컬러 지정
    const getSeverityColor = (severity?: string) => {
        switch (severity) {
            case 'CRITICAL': return 'text-red-500 border-red-500 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
            case 'HIGH': return 'text-orange-500 border-orange-500 bg-orange-950/20 shadow-[0_0_15px_rgba(249,115,22,0.3)]';
            case 'MEDIUM': return 'text-yellow-500 border-yellow-500 bg-yellow-950/20 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
            default: return 'text-green-500 border-green-500 bg-green-950/20 shadow-[0_0_15px_rgba(34,197,94,0.3)]';
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-lg p-4 overflow-y-auto">
            <framerMotion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                className="bg-slate-950 border border-blue-500/30 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-[0_0_60px_rgba(59,130,246,0.25)] text-gray-100 relative"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-800/80 flex justify-between items-center bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-slate-950 sticky top-0 z-10 backdrop-blur-md">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
                            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-900/30 px-2 py-0.5 rounded">
                                SYSTEM CONSOLE
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 tracking-tight mt-1.5">
                            3세대 ACT 심리 디버깅 샌드박스
                        </h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white text-3xl font-light focus:outline-none transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5"
                    >
                        &times;
                    </button>
                </div>

                {/* Main Body */}
                <div className="p-6 md:p-8 space-y-8">
                    <FramerAnimatePresence mode="wait">
                        {/* 1. IDLE 모드: 실시간 분석기 및 뇌 회로 슬라이더 조절 시뮬레이션 */}
                        {sandboxStep === 'IDLE' && (
                            <framerMotion.div
                                key="sandbox-idle"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-8"
                            >
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Left Column: 실시간 슬라이더 세팅 */}
                                    <div className="space-y-6 bg-slate-900/40 p-6 rounded-2xl border border-gray-800/60 backdrop-blur-sm">
                                        <div>
                                            <h3 className="text-base font-bold text-blue-300 mb-1 flex items-center gap-2">
                                                <span>🧬</span> 내담자 심리 가중치 인풋 (실시간 조절)
                                            </h3>
                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                슬라이더를 조작해 다양한 인지 왜곡 상태를 인위적으로 과열시켜 보며 알고리즘의 분석 결과를 실시간으로 모니터링하세요.
                                            </p>
                                        </div>

                                        {/* Slider 1: Cognitive Fusion */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-300 font-medium">1) 인지적 융합도 (Cognitive Fusion)</span>
                                                <span className="text-blue-400 font-mono font-bold">{metrics.fusionScore}%</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="100" 
                                                value={metrics.fusionScore} 
                                                onChange={(e) => handleMetricChange('fusionScore', parseInt(e.target.value))}
                                                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                            />
                                            <p className="text-[10px] text-gray-500">생각을 곧 절대적 사실로 혼동하여 자신을 옥죄고 갇히는 상태</p>
                                        </div>

                                        {/* Slider 2: Experiential Avoidance */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-300 font-medium">2) 경험적 회피 성향 (Experiential Avoidance)</span>
                                                <span className="text-purple-400 font-mono font-bold">{metrics.avoidanceScore}%</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="100" 
                                                value={metrics.avoidanceScore} 
                                                onChange={(e) => handleMetricChange('avoidanceScore', parseInt(e.target.value))}
                                                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                            />
                                            <p className="text-[10px] text-gray-500">불안과 불편함을 견디지 못하고 해야 할 가치 행동을 무기한 도피하는 패턴</p>
                                        </div>

                                        {/* Slider 3: Perfectionism Lock */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-300 font-medium">3) 완벽주의 과열도 (Perfectionism Overheat)</span>
                                                <span className="text-pink-400 font-mono font-bold">{metrics.perfectionismScore}%</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="100" 
                                                value={metrics.perfectionismScore} 
                                                onChange={(e) => handleMetricChange('perfectionismScore', parseInt(e.target.value))}
                                                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                            />
                                            <p className="text-[10px] text-gray-500">100% 무결점을 고집하며 시작을 옥죄는 대뇌 프로세스 실행 보류 스키마</p>
                                        </div>
                                    </div>

                                    {/* Right Column: 알고리즘 엔진 실시간 아웃풋 콘솔 */}
                                    <div className="space-y-5 flex flex-col">
                                        <div className="flex-1 bg-gray-950 rounded-2xl border border-blue-500/20 p-5 font-mono text-xs flex flex-col justify-between shadow-inner relative overflow-hidden min-h-[220px]">
                                            <div className="absolute top-0 right-0 p-2">
                                                <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">
                                                    REAL-TIME ANALYZER
                                                </span>
                                            </div>

                                            <div className="space-y-2 overflow-y-auto max-h-[180px] pr-1">
                                                {simulatedConsoleLogs.map((log, index) => (
                                                    <p key={index} className={`leading-relaxed ${
                                                        log.includes('SYSTEM ERROR') || log.includes('ERR_') 
                                                        ? 'text-red-400 font-bold' 
                                                        : log.includes('SYSTEM ALERT') 
                                                        ? 'text-orange-400' 
                                                        : log.includes('SYSTEM WARNING') 
                                                        ? 'text-yellow-400' 
                                                        : 'text-gray-400'
                                                    }`}>
                                                        {log}
                                                    </p>
                                                ))}
                                                {isTypingLog && (
                                                    <span className="inline-block w-1.5 h-3 bg-blue-400 animate-pulse"></span>
                                                )}
                                            </div>
                                        </div>

                                        {diagnosedMission && (
                                            <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${getSeverityColor(diagnosedMission.bugSeverity)}`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                                                            심리 오작동 판독코드 ({diagnosedMission.bugSeverity})
                                                        </span>
                                                        <strong className="text-sm md:text-base font-black">
                                                            {diagnosedMission.bugTitle}
                                                        </strong>
                                                    </div>
                                                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded">
                                                        {diagnosedMission.bugCode}
                                                    </span>
                                                </div>
                                                
                                                <div className="text-xs opacity-90 border-t border-white/10 pt-2 flex flex-col gap-1">
                                                    <p>🎯 <span className="font-semibold text-gray-300">ACT 수용 원리</span>: {diagnosedMission.recommendedConcept}</p>
                                                    <p className="truncate">🧩 <span className="font-semibold text-gray-300">전념 미션</span>: {diagnosedMission.actionGuide}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Start Button */}
                                <div className="text-center pt-4">
                                    <button
                                        onClick={startDebuggingProtocol}
                                        disabled={!diagnosedMission || diagnosedMission.bugCode === 'SYSTEM_NORMAL'}
                                        className={`w-full max-w-md py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-98 ${
                                            diagnosedMission && diagnosedMission.bugCode !== 'SYSTEM_NORMAL'
                                            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white cursor-pointer'
                                            : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/60'
                                        }`}
                                    >
                                        {diagnosedMission && diagnosedMission.bugCode === 'SYSTEM_NORMAL' 
                                            ? '🟢 시스템 정상 작동 중 (디버깅 불필요)' 
                                            : '⚡ 실시간 3세대 심리 디버깅 프로토콜 기동'}
                                    </button>
                                </div>
                            </framerMotion.div>
                        )}

                        {/* 2. PHASE 1: Defusion 생각 격리 입력 */}
                        {sandboxStep === 'PHASE_1' && diagnosedMission && (
                            <framerMotion.div
                                key="sandbox-phase1"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <DefusionMissionCard 
                                    defaultTargetText={diagnosedMission.defusionTargetText}
                                    onComplete={handlePhase1Complete}
                                />
                            </framerMotion.div>
                        )}

                        {/* 3. PHASE 2: Micro Timer 5분 강제 전념 행동 */}
                        {sandboxStep === 'PHASE_2' && diagnosedMission && (
                            <framerMotion.div
                                key="sandbox-phase2"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <MicroTimerCard 
                                    actionGuide={diagnosedMission.actionGuide}
                                    targetSeconds={diagnosedMission.actionTimeSeconds}
                                    onComplete={handlePhase2Complete}
                                />
                            </framerMotion.div>
                        )}

                        {/* 4. COMPLETED: 최종 성공 리포트 */}
                        {sandboxStep === 'COMPLETED' && diagnosedMission && (
                            <framerMotion.div
                                key="sandbox-completed"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6 text-center py-6 max-w-xl mx-auto"
                            >
                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 flex items-center justify-center text-white text-4xl mx-auto shadow-[0_0_35px_rgba(52,211,153,0.3)] animate-pulse">
                                    🛡️
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300 tracking-tight">
                                        대뇌 OS 심리 디버깅 통합 패치 성공
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                                        인지적 융합 격리 및 5분간의 전념행동(Committed Action) 수행을 통해, 완벽주의 강박 루프가 완벽히 무력화되고 편도체 과각성이 정상 레벨로 복구되었습니다.
                                    </p>
                                </div>

                                <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-6 text-left space-y-4">
                                    <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                                        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                                            PATCH OVERVIEW
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div className="bg-slate-950 p-3 rounded-lg border border-gray-800/80">
                                            <span className="text-gray-500 block mb-1">격리된 심리 버그</span>
                                            <strong className="text-white text-sm">{diagnosedMission.bugTitle}</strong>
                                            <span className="text-[10px] text-red-400 block mt-0.5 font-mono">{diagnosedMission.bugCode}</span>
                                        </div>

                                        <div className="bg-slate-950 p-3 rounded-lg border border-gray-800/80">
                                            <span className="text-gray-500 block mb-1">뇌 가소성 복원 결과</span>
                                            <strong className="text-emerald-400 text-sm">전전두엽(PFC) 활성화</strong>
                                            <span className="text-[10px] text-gray-400 block mt-0.5">불안 회로 통제권 정상 탈환</span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-950 rounded-xl text-xs text-gray-300 leading-relaxed border border-gray-800/80">
                                        💡 **소버린 메타인지 분석 보고**: 3세대 심리코칭의 핵심은 생각을 없애는 것이 아니라, 생각과 나 사이의 **간격(Gap)**을 만들고 내 가치에 맞는 사소한 행동을 바로 개시하는 데 있습니다. 당신은 오늘 대뇌 자가 복구 패치를 성공적으로 로드하셨습니다!
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 justify-center">
                                    <button
                                        onClick={resetSandbox}
                                        className="px-6 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs tracking-wide transition-colors"
                                    >
                                        🔄 다시 시뮬레이션 해보기
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-gray-950 font-bold text-xs tracking-widest uppercase transition-all shadow-md active:scale-98"
                                    >
                                        닫고 메인으로 돌아가기
                                    </button>
                                </div>
                            </framerMotion.div>
                        )}
                    </FramerAnimatePresence>
                </div>
            </framerMotion.div>
        </div>
    );
};
