'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, X, Brain, Zap, Shield, ArrowRight, CheckCircle2, 
    MessageSquare, Compass, Activity, Radio, Cpu, Target, Layers, Play
} from 'lucide-react';
import { AwarenessQuestItem } from '@/data/awarenessQuests108';
import { saju108Matrix } from '@/data/saju108Matrix';
import { useReportStore } from '@/store/useReportStore';

interface QuestPreFlightBriefingModalProps {
    isOpen: boolean;
    onClose: () => void;
    quest: AwarenessQuestItem | null;
    onStartCoaching: (prompt: string, intent?: string) => void;
}

export default function QuestPreFlightBriefingModal({
    isOpen,
    onClose,
    quest,
    onStartCoaching
}: QuestPreFlightBriefingModalProps) {
    const { reportData } = useReportStore();
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);

    // 사주 매트릭스 데이터 매칭
    const matrixInfo = useMemo(() => {
        if (!quest) return null;
        return saju108Matrix[quest.pKey] || null;
    }, [quest]);

    // 질문 옵션 3선 구성
    const questionOptions = useMemo(() => {
        if (!quest) return [];
        const q1 = matrixInfo?.socratic || `내 무의식 속에서 '${quest.cleanTitle}'과 관련된 어떤 생각 회로가 자동 작동하고 있나요?`;
        const q2 = `이 퀘스트와 연관된 내 무의식의 가장 고질적인 Dark Code(방어기제/착각)는 무엇이며 어떻게 해제할 수 있나요?`;
        const q3 = `내 사주 기질과 뇌 회로 패턴에 맞춰, 오늘 당장 실천할 수 있는 신경가소성 재배선 미션을 1가지만 제시해줘.`;

        return [
            {
                tag: '본질 탐구',
                badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
                title: '소크라테스식 본질 자각 질문',
                text: q1,
                icon: '🧭'
            },
            {
                tag: '코드 해제',
                badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                title: 'Dark Code 방어기제 디코딩',
                text: q2,
                icon: '⚡'
            },
            {
                tag: '실전 액션',
                badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
                title: '신경망 재배선 퀀텀 액션',
                text: q3,
                icon: '🚀'
            }
        ];
    }, [quest, matrixInfo]);

    if (!isOpen || !quest) return null;

    // 코칭 시작 핸들러
    const handleLaunch = () => {
        const chosenQuestion = questionOptions[selectedQuestionIndex]?.text || questionOptions[0].text;
        const prompt = `[🚀 핵심 자각 퀘스트 ${quest.num}번: ${quest.cleanTitle} // 1:1 심층 코칭]\n\n` +
            `■ 자각 주제: ${quest.desc}\n` +
            `■ 뇌과학 자각 포인트: ${matrixInfo?.desc || quest.desc}\n` +
            `■ 핵심 메타인지 선언: "${matrixInfo?.recursive || '본래 고요한 참나를 자각합니다.'}"\n\n` +
            `🎯 [유저가 선택한 1순위 집중 코칭 질문]\n"${chosenQuestion}"\n\n` +
            `위 질문을 중심으로, 내 사주 원국 기질과 무의식 뇌 회로 패턴을 종합 분석하여 깊이 있는 1:1 명심 코칭을 시작해줘.`;

        onStartCoaching(prompt, quest.intent);
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans selection:bg-pink-500 selection:text-white animate-in fade-in duration-200">
                
                {/* 메인 브리핑 모달 컨테이너 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 20 }}
                    transition={{ type: 'spring', damping: 24, stiffness: 260 }}
                    className="w-full max-w-2xl bg-[#090616] border-2 border-pink-500/50 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(236,72,153,0.35)] relative overflow-hidden my-auto max-h-[92vh] flex flex-col"
                >
                    {/* 상단 앰비언트 글로우 배경 */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-32 bg-gradient-to-b from-pink-500/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

                    {/* 1. 최상단 헤더 HUD */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10 shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="size-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-lg shadow-pink-500/30">
                                🚀
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/40">
                                        PRE-FLIGHT BRIEFING
                                    </span>
                                    <span className="text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1">
                                        <Radio size={10} className="animate-pulse text-cyan-400" />
                                        <span>432Hz · 528Hz 세타파 동기화</span>
                                    </span>
                                </div>
                                <h2 className="text-xs text-gray-400 font-bold mt-0.5">
                                    1:1 AI 명심 코칭 세션 브리핑 룸
                                </h2>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="size-8 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* 2. 스크롤 가능한 메인 바디 */}
                    <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                        
                        {/* 퀘스트 메인 타이틀 배너 */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900/80 to-[#140b2b] border border-pink-500/30 relative overflow-hidden">
                            <div className="flex items-center gap-2 text-xs text-pink-300 font-bold mb-1.5">
                                <span className="font-mono bg-pink-500/20 px-2 py-0.5 rounded-md border border-pink-400/30">
                                    QUEST #{String(quest.num).padStart(2, '0')}
                                </span>
                                <span>{quest.phaseLabel}</span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                                <span className="text-2xl">{quest.icon}</span>
                                <span>{quest.cleanTitle}</span>
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-300 mt-1.5 leading-relaxed font-medium">
                                {quest.desc}
                            </p>
                        </div>

                        {/* 3. 뇌 신경망 ↔ 사주 기질 텔레메트리 HUD 게이지 */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                                <span className="flex items-center gap-1.5">
                                    <Cpu size={14} className="text-pink-400" />
                                    <span>뇌 회로 & 사주 기질 실시간 공명도 (Neural Telemetry)</span>
                                </span>
                                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                                    <span>ONLINE READY</span>
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20">
                                    <div className="text-[10px] text-gray-400 font-medium">무의식 싱크율</div>
                                    <div className="text-base sm:text-lg font-black font-mono text-pink-400 mt-0.5">94%</div>
                                    <div className="text-[9px] text-purple-300 mt-0.5">전전두엽 최적</div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
                                    <div className="text-[10px] text-gray-400 font-medium">신경가소성 전환도</div>
                                    <div className="text-base sm:text-lg font-black font-mono text-cyan-400 mt-0.5">88%</div>
                                    <div className="text-[9px] text-cyan-300 mt-0.5">회로 재배선 가능</div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20">
                                    <div className="text-[10px] text-gray-400 font-medium">감정 저항 계수</div>
                                    <div className="text-base sm:text-lg font-black font-mono text-amber-400 mt-0.5">16%</div>
                                    <div className="text-[9px] text-emerald-300 mt-0.5">매우 안정적</div>
                                </div>
                            </div>

                            {/* 바이오 사운드 웨이브 비주얼 이펙트 */}
                            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[11px]">
                                <span className="text-gray-400 flex items-center gap-1.5">
                                    <Activity size={13} className="text-pink-400 animate-pulse" />
                                    <span>바이오 주파수 캐리어</span>
                                </span>
                                <div className="flex items-center gap-1">
                                    <div className="w-1 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                                    <div className="w-1 h-5 bg-purple-400 rounded-full animate-bounce" style={{ animationDuration: '0.8s' }} />
                                    <div className="w-1 h-2.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDuration: '0.5s' }} />
                                    <div className="w-1 h-4 bg-indigo-400 rounded-full animate-bounce" style={{ animationDuration: '0.7s' }} />
                                    <span className="ml-1 text-[10px] font-mono text-gray-300">528Hz DNA REPAIR WAVE</span>
                                </div>
                            </div>
                        </div>

                        {/* 4. 이번 세션 3단계 코칭 로드맵 */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/20 to-indigo-950/20 border border-purple-500/20 space-y-2.5">
                            <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                                <Target size={14} className="text-purple-400" />
                                <span>1:1 세션 3단계 정밀 코칭 프로세스</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                    <span className="text-[10px] font-bold text-pink-400 font-mono">STEP 01</span>
                                    <div className="font-black text-white text-xs">Dark Code 감지</div>
                                    <p className="text-[11px] text-gray-400 leading-tight">자동화된 무의식 패턴과 방어기제를 포착합니다.</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                    <span className="text-[10px] font-bold text-cyan-400 font-mono">STEP 02</span>
                                    <div className="font-black text-white text-xs">메타인지 관찰자</div>
                                    <p className="text-[11px] text-gray-400 leading-tight">생각과 나를 분리하여 고요한 중심으로 복귀합니다.</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                    <span className="text-[10px] font-bold text-amber-400 font-mono">STEP 03</span>
                                    <div className="font-black text-white text-xs">신경망 재배선</div>
                                    <p className="text-[11px] text-gray-400 leading-tight">현실에서 즉각 실행할 1가지 행동 미션을 도출합니다.</p>
                                </div>
                            </div>
                        </div>

                        {/* 5. 💡 인터랙티브 코칭 첫 질문 3선 선택기 */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-pink-400" />
                                    <span>AI 코치에게 던질 첫 번째 질문을 선택하세요 (1초 탭)</span>
                                </span>
                                <span className="text-[10px] text-pink-300 font-bold">
                                    선택됨: #{selectedQuestionIndex + 1}
                                </span>
                            </div>

                            <div className="space-y-2">
                                {questionOptions.map((opt, idx) => {
                                    const isSelected = selectedQuestionIndex === idx;
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedQuestionIndex(idx)}
                                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative overflow-hidden ${
                                                isSelected
                                                    ? 'bg-gradient-to-r from-pink-950/50 via-purple-950/40 to-black border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                                                    : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                                            }`}
                                        >
                                            <div className="text-xl mt-0.5 shrink-0">
                                                {opt.icon}
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${opt.badgeBg}`}>
                                                        {opt.tag}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-300">
                                                        {opt.title}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-200 leading-relaxed font-medium break-keep">
                                                    "${opt.text}"
                                                </p>
                                            </div>

                                            <div className="mt-1 shrink-0">
                                                {isSelected ? (
                                                    <div className="size-5 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md shadow-pink-500/50">
                                                        <CheckCircle2 size={14} />
                                                    </div>
                                                ) : (
                                                    <div className="size-5 rounded-full border border-white/20" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* 6. 하단 액션 버튼 */}
                    <div className="pt-3 border-t border-white/10 flex items-center gap-2.5 relative z-10 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                        >
                            닫기
                        </button>
                        <button
                            type="button"
                            onClick={handleLaunch}
                            className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:via-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                        >
                            <MessageSquare size={16} />
                            <span>선택한 질문으로 1:1 AI 명심 코칭 시작하기</span>
                            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}
