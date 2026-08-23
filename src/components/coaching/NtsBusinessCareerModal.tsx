'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Sparkles, Briefcase, Copy, Check, ChevronRight,
    TrendingUp, Shield, FileText, CheckCircle2, Crown,
    Award, ArrowRight, Building, HelpCircle, Layers, Zap,
    Cpu, BookOpen, Compass, Globe, Server, Database, BarChart3,
    HeartPulse, Clock, AlertTriangle, MessageSquare, Flame, CheckCheck,
    Users, DollarSign, Target, Rocket, RefreshCw, Landmark, ExternalLink,
    Send, Download, CheckSquare, Edit3
} from 'lucide-react';
import {
    generateNtsBusinessArchitecture,
    generatePersonalizedPsstArchitecture,
    PRE_STARTUP_REPORT,
    EARLY_STARTUP_REPORT,
    RE_FOUNDER_REPORT,
    NtsBusinessArchitectureReport,
    StartupStageType,
    StartupIntakeAnswers,
    PersonalizedPsstReport
} from '@/lib/engine/ntsBusinessRecommender';
import { useReportStore } from '@/store/useReportStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface NtsBusinessCareerModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile?: any;
    onStartChatCoaching?: (prompt: string) => void;
}

export default function NtsBusinessCareerModal({
    isOpen,
    onClose,
    userProfile,
    onStartChatCoaching
}: NtsBusinessCareerModalProps) {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'step1' | 'step2' | 'step3' | 'step4' | 'step5'>('step1');
    const [selectedStage, setSelectedStage] = useState<StartupStageType>('solo_pre');
    const [viewRoleModel, setViewRoleModel] = useState<boolean>(false);
    const [copiedPsst, setCopiedPsst] = useState<boolean>(false);

    // 1분 창업 진단 Intake Form 상태
    const [intakeAnswers, setIntakeAnswers] = useState<StartupIntakeAnswers>({
        stage: 'pre_startup',
        businessType: 'knowledge_ip',
        problemKeyword: '기존 솔루션의 추상성과 높은 비용, 실행 공백(Execution Gap)',
        solutionKeyword: '기질 데이터 기반 표준 행정 코드 자동 매핑 및 3초 사업화 로드맵 AI',
        biggestBottleneck: 'funding_plan'
    });

    const [showIntakeEdit, setShowIntakeEdit] = useState<boolean>(false);

    // 명심 사업적성 AI 코치 인라인 챗봇 상태
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        {
            role: 'assistant',
            content: `반갑습니다, ${userProfile?.userName || '대표'}님! 명심코칭의 3S(Scan-Sync-Shift) 인지과학 기질 분석 엔진을 탑재한 [명심 사업적성 1:1 맞춤 AI 코치]입니다. 국세청 업종 매핑, 중기부 PSST 사업계획서, 정부지원사업(예창패/초창패) 합격 전략에 대해 무엇이든 질문해 주세요.`
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoadingChat, setIsLoadingChat] = useState(false);
    const [copiedMsgIdx, setCopiedMsgIdx] = useState<number | null>(null);
    const chatBottomRef = useRef<HTMLDivElement>(null);

    // 새 메시지가 들어오면 자동으로 하단 스크롤
    useEffect(() => {
        if (chatBottomRef.current) {
            chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages, isLoadingChat]);

    if (!isOpen) return null;

    // 글로벌 스토어의 reportData와 props userProfile을 안전하게 병합
    const globalReportData = useReportStore.getState().reportData;
    const effectiveProfile = {
        ...globalReportData,
        ...userProfile,
        saju: userProfile?.saju || globalReportData?.saju
    };

    const currentProfile: NtsBusinessArchitectureReport = viewRoleModel
        ? (selectedStage === 'early_team' ? EARLY_STARTUP_REPORT : selectedStage === 're_founder' ? RE_FOUNDER_REPORT : PRE_STARTUP_REPORT)
        : generateNtsBusinessArchitecture(effectiveProfile, selectedStage);

    // 개인화된 PSST 리포트 생성
    const personalizedPsst: PersonalizedPsstReport = generatePersonalizedPsstArchitecture(
        effectiveProfile,
        intakeAnswers
    );

    const handleCopyCode = (code: string, label: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(`${label} [${code}]`);
        setTimeout(() => setCopiedCode(null), 2200);
    };

    const handleCopyPsstBlueprint = () => {
        const p = personalizedPsst;
        const text = `[중소벤처기업부 표준 PSST 사업계획서 뼈대]\n`
            + `■ 비즈니스명: ${p.identityTitle}\n`
            + `■ 기질 프로파일: ${p.sajuSummaryText}\n\n`
            + `1. 문제 인식 (Problem & Motivation)\n`
            + `- ${p.problem.marketPainPoint}\n`
            + `- ${p.problem.founderMotivation}\n`
            + `- 해결의 시급성: ${p.problem.urgency}\n\n`
            + `2. 실현 가능성 (Solution & Architecture)\n`
            + `- ${p.solution.coreMvp}\n`
            + `- ${p.solution.differentiation}\n`
            + `- 개발 마일스톤: ${p.solution.techMilestone}\n\n`
            + `3. 성장 전략 & 수익 모델 (Scale-up & BM)\n`
            + `- B2C: ${p.scaleUp.businessModel.b2c}\n`
            + `- B2B: ${p.scaleUp.businessModel.b2b}\n`
            + `- B2G: ${p.scaleUp.businessModel.b2g}\n`
            + `- 시장 진입 전략: ${p.scaleUp.gtmStrategy}\n\n`
            + `4. 팀 구성 및 조직 역량 (Team & HR)\n`
            + `- ${p.team.founderStrength}\n`
            + `- ${p.team.hrComplementPlan}\n\n`
            + `[명심 행정·세무 1-Point 비즈니스 체크]\n`
            + `• 추천 주업종 코드: ${p.onePointCheck.recommendedMainCode} (${p.onePointCheck.recommendedMainTitle})\n`
            + `• 세액감면 혜택: ${p.onePointCheck.taxBenefitStatus}\n`
            + `• 필수 인허가: ${p.onePointCheck.requiredPermits.join(', ')}\n`
            + `• 추천 지원사업: ${p.onePointCheck.recommendedGovPrograms.map(g => `${g.name} (${g.targetFunding})`).join(' / ')}`;
        
        navigator.clipboard.writeText(text);
        setCopiedPsst(true);
        setTimeout(() => setCopiedPsst(false), 2500);
    };

    const handleDownloadPsst = () => {
        const p = personalizedPsst;
        const text = `[중소벤처기업부 표준 PSST 사업계획서]\n`
            + `대표자: ${userProfile?.userName || '대표'}\n`
            + `기질 요약: ${p.sajuSummaryText}\n\n`
            + `========================================================\n`
            + `1. 문제 인식 (Problem & Motivation)\n`
            + `========================================================\n`
            + `■ 시장 결핍: ${p.problem.marketPainPoint}\n`
            + `■ 창업자 필연적 동기: ${p.problem.founderMotivation}\n`
            + `■ 해결 시급성: ${p.problem.urgency}\n\n`
            + `========================================================\n`
            + `2. 실현 가능성 (Solution & Architecture)\n`
            + `========================================================\n`
            + `■ 핵심 솔루션 (MVP): ${p.solution.coreMvp}\n`
            + `■ 차별화 경쟁력: ${p.solution.differentiation}\n`
            + `■ 개발 마일스톤: ${p.solution.techMilestone}\n\n`
            + `========================================================\n`
            + `3. 성장 전략 & 수익 모델 (Scale-up & BM)\n`
            + `========================================================\n`
            + `■ B2C 수익모델: ${p.scaleUp.businessModel.b2c}\n`
            + `■ B2B 수익모델: ${p.scaleUp.businessModel.b2b}\n`
            + `■ B2G 수익모델: ${p.scaleUp.businessModel.b2g}\n`
            + `■ 시장 진입 (GTM): ${p.scaleUp.gtmStrategy}\n\n`
            + `========================================================\n`
            + `4. 팀 구성 및 조직 역량 (Team & HR)\n`
            + `========================================================\n`
            + `■ 대표자 코어 역량: ${p.team.founderStrength}\n`
            + `■ HR 보완 전략: ${p.team.hrComplementPlan}\n\n`
            + `========================================================\n`
            + `[명심 행정 · 세무 1-Point 비즈니스 체크]\n`
            + `========================================================\n`
            + `■ 추천 국세청 주업종: ${p.onePointCheck.recommendedMainCode} (${p.onePointCheck.recommendedMainTitle})\n`
            + `■ 세무 감면 혜택: ${p.onePointCheck.taxBenefitStatus}\n`
            + `■ 필수 인허가: ${p.onePointCheck.requiredPermits.join(', ')}\n`
            + `■ 타겟 정부지원사업:\n${p.onePointCheck.recommendedGovPrograms.map(g => `  - ${g.name} [지원 규모: ${g.targetFunding}] (TIP: ${g.tip})`).join('\n')}\n`;
        
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `명심코칭_PSST사업계획서_${userProfile?.userName || '대표'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleSendMessage = async (customPrompt?: string) => {
        const textToSend = customPrompt || inputMessage;
        if (!textToSend.trim() || isLoadingChat) return;

        const newMessages = [...chatMessages, { role: 'user' as const, content: textToSend }];
        setChatMessages(newMessages);
        if (!customPrompt) setInputMessage('');
        setIsLoadingChat(true);

        try {
            const res = await fetch('/api/coaching/business-consultant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: textToSend,
                    history: newMessages.slice(0, -1),
                    sajuSummary: currentProfile.sajuSummaryText,
                    intakeAnswers,
                    userName: userProfile?.userName || '대표'
                })
            });

            const data = await res.json();
            if (data.success && data.reply) {
                setChatMessages([...newMessages, { role: 'assistant', content: data.reply }]);
            } else {
                setChatMessages([...newMessages, { role: 'assistant', content: data.error || '답변을 불러오지 못했습니다.' }]);
            }
        } catch (err) {
            setChatMessages([...newMessages, { role: 'assistant', content: '서버 연결에 실패했습니다. 다시 시도해 주세요.' }]);
        } finally {
            setIsLoadingChat(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 font-sans animate-fade-in text-left">
                <div className="bg-[#0c101c] border-2 border-amber-500/40 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-4 sm:p-7 shadow-[0_0_90px_rgba(245,158,11,0.25)] relative text-white space-y-4 custom-scrollbar">
                    
                    {/* Top Status & Role Model Switch */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[11px] font-mono font-bold text-amber-400">
                                🏛️ [명심 사업적성 1:1 맞춤코칭] PSST 사업계획서 & B2B 비즈니스 아키텍처
                            </span>
                        </div>

                        {/* Switch: 내 명식 ↔ 베스트 롤모델 예시 */}
                        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10.5px] font-bold">
                            <button
                                onClick={() => setViewRoleModel(false)}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                    !viewRoleModel
                                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                ✨ 내 명식 분석
                            </button>
                            <button
                                onClick={() => setViewRoleModel(true)}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                                    viewRoleModel
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                👑 롤모델 예시 (辛巳)
                            </button>
                        </div>
                    </div>

                    {/* Stage Selector: 3대 창업 생애주기 탭 */}
                    <div className="p-1 rounded-2xl bg-slate-950/90 border border-slate-800 grid grid-cols-3 gap-1 text-center text-xs font-bold">
                        <button
                            onClick={() => {
                                setSelectedStage('solo_pre');
                                setIntakeAnswers(prev => ({ ...prev, stage: 'pre_startup' }));
                            }}
                            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                selectedStage === 'solo_pre'
                                    ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-300 border border-amber-500/50 shadow-md'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>1인 지식 / 예비창업</span>
                        </button>
                        <button
                            onClick={() => {
                                setSelectedStage('early_team');
                                setIntakeAnswers(prev => ({ ...prev, stage: 'early_stage' }));
                            }}
                            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                selectedStage === 'early_team'
                                    ? 'bg-gradient-to-r from-emerald-500/30 to-teal-600/30 text-emerald-300 border border-emerald-500/50 shadow-md'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            <Rocket className="w-3.5 h-3.5" />
                            <span>초기 스타트업 창업</span>
                        </button>
                        <button
                            onClick={() => {
                                setSelectedStage('re_founder');
                                setIntakeAnswers(prev => ({ ...prev, stage: 're_founder' }));
                            }}
                            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                selectedStage === 're_founder'
                                    ? 'bg-gradient-to-r from-purple-500/30 to-indigo-600/30 text-purple-300 border border-purple-500/50 shadow-md'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>재창업 · 피봇팅</span>
                        </button>
                    </div>

                    {/* Header Banner */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shrink-0 mt-0.5">
                                {selectedStage === 'early_team' ? '🚀' : selectedStage === 're_founder' ? '🔄' : '💼'}
                            </div>
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/40">
                                        {currentProfile.sajuSummaryText}
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 font-bold">
                                        {selectedStage === 'early_team' ? '중기부 초창패·TIPS 연계' : selectedStage === 're_founder' ? '재도전성공패키지 연계' : '예비창업패키지 연계'}
                                    </span>
                                </div>
                                <h3 className="text-base sm:text-xl font-black text-white tracking-tight">
                                    {currentProfile.userName}님의 [{currentProfile.identityTitle}]
                                </h3>
                                <p className="text-xs text-amber-200/90 font-medium">
                                    💡 {currentProfile.slogan}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* 5-Step Navigation Tabs */}
                    <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold text-center">
                        <button
                            onClick={() => setActiveTab('step1')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step1'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            1. 아키타입
                        </button>
                        <button
                            onClick={() => setActiveTab('step2')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step2'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            2. 국세청 매핑
                        </button>
                        <button
                            onClick={() => setActiveTab('step3')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step3'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            3. 비즈니스 4대실행
                        </button>
                        <button
                            onClick={() => setActiveTab('step4')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step4'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            4. PSST 계획서
                        </button>
                        <button
                            onClick={() => setActiveTab('step5')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step5'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            5. 행정&스케일업
                        </button>
                    </div>

                    {/* ========================================================
                        STEP 1: 인지 하드웨어 & 비즈니스 아키타입 진단
                        ======================================================== */}
                    {activeTab === 'step1' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/40 space-y-1.5 shadow-inner">
                                <div className="text-amber-400 font-mono font-black flex items-center gap-1.5 text-[11px]">
                                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                                    <span>비즈니스 페르소나 도출 ({selectedStage === 'early_team' ? '팀 빌딩 리더' : selectedStage === 're_founder' ? '피봇팅 마스터' : '1인 기업가'})</span>
                                </div>
                                <h4 className="text-base sm:text-lg font-black text-white">
                                    &quot;{currentProfile.identityTitle}&quot;
                                </h4>
                                <p className="text-gray-300 leading-relaxed">
                                    {currentProfile.slogan}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="font-bold text-gray-200 flex items-center gap-1.5 text-xs">
                                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                                    <span>기질 프로파일링: 십신과 오행의 에너지 흐름</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {currentProfile.pillarBreakdowns.map((p, idx) => (
                                        <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-amber-500/30 transition-all">
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="font-bold text-amber-300">{p.pillarName}</span>
                                                <span className="font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                                                    {p.ganji}
                                                </span>
                                            </div>
                                            <div className="text-white font-bold text-xs leading-snug">
                                                {p.corePower}
                                            </div>
                                            <p className="text-gray-400 text-[11px] leading-relaxed">
                                                {p.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* [SPECIAL] 공망(空亡)의 역설: 내담자 60갑자 맞춤 클라우드 플랫폼 전환 */}
                            {(() => {
                                const gw = currentProfile.gongwangArchitecture || {
                                    title: '공망(空亡)의 역설 — 온프레미스를 버리고 클라우드 플랫폼으로',
                                    quote: '“공망(空亡)은 채우지 못해 비어 있는 것이 아니라, 전 세계를 담기 위해 비워둔 클라우드 서버입니다.”',
                                    point1Title: '1. 결핍이 아닌 무한 대역폭(Bandwidth)',
                                    point1Desc: '사옥과 직원을 물리적으로 묶으려 하면 결속력이 약해집니다. 서버·AI·지식 IP처럼 실체 없는 디지털 클라우드 시스템에 사람들을 담을 때 무한한 확장성을 갖습니다.',
                                    point2Title: '2. 플레이어가 아닌 플랫폼(Platform) 설계',
                                    point2Desc: '직접 통제하는 오너가 아닌 "누구나 들어와 활동하는 열린 마당(플랫폼)"의 설계자가 되세요. 분산 네트워크로 확장할 때 스케일업 잠재력이 폭발합니다.',
                                    gongwangTag: '명심 3S 기질 전환'
                                };

                                return (
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/50 via-slate-900 to-indigo-950/60 border-2 border-purple-500/40 space-y-3 shadow-lg relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                                                    <Server className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-purple-400 font-mono font-bold tracking-wider">COGNITIVE SHIFT ARCHITECTURE</span>
                                                    <h5 className="text-sm font-black text-white flex items-center gap-1.5">
                                                        <span>{gw.title}</span>
                                                    </h5>
                                                </div>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-400/30 font-bold">
                                                {gw.gongwangTag}
                                            </span>
                                        </div>

                                        <blockquote className="p-2.5 rounded-xl bg-slate-950/80 border border-purple-500/30 text-amber-200 text-xs italic font-medium leading-relaxed">
                                            {gw.quote}
                                        </blockquote>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                                            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                                                <div className="font-bold text-indigo-300 flex items-center gap-1">
                                                    <Globe className="w-3.5 h-3.5" />
                                                    <span>{gw.point1Title}</span>
                                                </div>
                                                <p className="text-gray-300 leading-relaxed text-[10.5px]">
                                                    {gw.point1Desc}
                                                </p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                                                <div className="font-bold text-amber-300 flex items-center gap-1">
                                                    <Cpu className="w-3.5 h-3.5" />
                                                    <span>{gw.point2Title}</span>
                                                </div>
                                                <p className="text-gray-300 leading-relaxed text-[10.5px]">
                                                    {gw.point2Desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                                <div className="font-bold text-gray-200 flex items-center gap-1.5 text-xs">
                                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                                    <span>현대 인지과학적 3대 비즈니스 강점</span>
                                </div>
                                <div className="space-y-2">
                                    {currentProfile.coreCompetencies.map((comp, idx) => (
                                        <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                                            <div className="flex items-center justify-between text-[11.5px]">
                                                <span className="font-bold text-white">{comp.title}</span>
                                                <span className="font-mono text-amber-400 text-[10.5px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                                                    {comp.tenGodFormula}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-[11px] leading-relaxed">
                                                {comp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        STEP 2: 국가 표준 업태 · 종목 최적화 매핑 (Taxonomy Mapping)
                        ======================================================== */}
                    {activeTab === 'step2' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                                        <Building className="w-4 h-4 text-emerald-400" />
                                        <span>국세청 업태·종목 최적화 매핑 (4대 분류 체계)</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-mono">코드 클릭 시 즉시 복사</span>
                                </div>

                                <div className="space-y-2.5">
                                    {currentProfile.taxonomyTable.map((tax, idx) => (
                                        <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[10.5px] font-black px-2 py-0.5 rounded-md ${
                                                    tax.colorTheme === 'emerald' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                                    tax.colorTheme === 'cyan' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                                                    tax.colorTheme === 'purple' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                }`}>
                                                    {tax.classification}
                                                </span>
                                                <span className="font-bold text-white text-xs">{tax.mainIndustry}</span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                                {tax.subIndustryAndCodes.map((item, cIdx) => (
                                                    <button
                                                        key={cIdx}
                                                        onClick={() => handleCopyCode(item.code, item.name)}
                                                        className="p-2 rounded-lg bg-slate-900/90 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between text-left transition-all cursor-pointer group"
                                                    >
                                                        <span className="text-gray-300 text-[11px] truncate pr-2 group-hover:text-emerald-200">
                                                            {item.name}
                                                        </span>
                                                        <span className="font-mono font-bold text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded text-[10px] shrink-0 flex items-center gap-1">
                                                            {item.code} <Copy className="w-2.5 h-2.5 text-gray-500 group-hover:text-amber-300" />
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="text-[10.5px] text-gray-400 bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
                                                🚀 <strong>비즈니스 모델 연계:</strong> {tax.businessModel}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/40 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-emerald-400 font-bold">{currentProfile.primaryBusiness1.sectionTitle}</span>
                                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                                        {currentProfile.primaryBusiness1.badge}
                                    </span>
                                </div>
                                <p className="text-gray-300 text-[11px]">
                                    {currentProfile.primaryBusiness1.realWorldApplication}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        STEP 3: 명심 비즈니스 4대 핵심 실행 영역 융합 진단
                        ======================================================== */}
                    {activeTab === 'step3' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/40 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-blue-400" />
                                    <span className="font-bold text-blue-200">명심 비즈니스 4대 핵심 실행 영역 (마케팅·조직·재무·지원사업)</span>
                                </div>
                                <span className="text-[10px] text-blue-300 font-mono font-bold bg-blue-900/60 px-2 py-0.5 rounded">
                                    명심 3S 체계
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                                            <Target className="w-3.5 h-3.5" />
                                            <span>1. 마케팅 & 시장성</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                                            {currentProfile.consultant4Areas.marketing.sajuEngine}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-[11px]">
                                        <p className="text-gray-300">🎯 <strong>타깃 고객:</strong> {currentProfile.consultant4Areas.marketing.targetCustomer}</p>
                                        <p className="text-gray-300">📢 <strong>세일즈 채널:</strong> {currentProfile.consultant4Areas.marketing.salesChannel}</p>
                                        <p className="text-emerald-300 bg-emerald-950/30 p-1.5 rounded border border-emerald-500/20">
                                            💡 <strong>전환 전략:</strong> {currentProfile.consultant4Areas.marketing.conversionStrategy}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                            <Users className="w-3.5 h-3.5" />
                                            <span>2. 인사 & 조직 관리 (공망 아키텍처)</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                            {currentProfile.consultant4Areas.hrOrg.sajuEngine}
                                        </span>
                                    </div>
                                    <div className="space-y-1.5 text-[11px]">
                                        <p className="text-gray-300">👥 <strong>이상적 팀 역할:</strong> {currentProfile.consultant4Areas.hrOrg.idealTeamRole}</p>
                                        <p className="text-rose-300">⚠️ <strong>갈등 유발 요인:</strong> {currentProfile.consultant4Areas.hrOrg.conflictTrigger}</p>
                                        <p className="text-cyan-300 bg-cyan-950/30 p-1.5 rounded border border-cyan-500/20">
                                            🛡️ <strong>위임 프로토콜:</strong> {currentProfile.consultant4Areas.hrOrg.delegationProtocol}
                                        </p>

                                        {/* 시스템 아키텍처 행동 지침 */}
                                        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[10px]">
                                            <div className="font-bold text-gray-300 flex items-center gap-1">
                                                <Layers className="w-3 h-3 text-emerald-400" />
                                                <span>공망(空亡) 리프레이밍 행동 지침</span>
                                            </div>
                                            <div className="text-rose-400 flex items-start gap-1">
                                                <span className="font-bold">❌ 지양:</span>
                                                <span>대규모 고정비 오프라인 사업장, 수직적 위계 조직, 지분 중심 동업</span>
                                            </div>
                                            <div className="text-emerald-400 flex items-start gap-1">
                                                <span className="font-bold">⭕ 권장:</span>
                                                <span>SaaS/AI 기반 자동화 시스템, 지식/IP 라이선싱, 느슨한 전문가 커뮤니티</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                                            <DollarSign className="w-3.5 h-3.5" />
                                            <span>3. 재무 & 세무 제도</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                                            {currentProfile.consultant4Areas.financeTax.sajuEngine}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-[11px]">
                                        <p className="text-emerald-300 font-bold">💰 <strong>세액감면:</strong> {currentProfile.consultant4Areas.financeTax.taxReductionRate}</p>
                                        <p className="text-gray-300">📍 <strong>최적 사업장:</strong> {currentProfile.consultant4Areas.financeTax.recommendedLocation}</p>
                                        <p className="text-gray-300">🏛️ <strong>법인 구조:</strong> {currentProfile.consultant4Areas.financeTax.legalStructure}</p>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                                            <Landmark className="w-3.5 h-3.5" />
                                            <span>4. 정부지원사업 타겟팅</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                                            경쟁력 {currentProfile.consultant4Areas.govSupportTarget.competitivenessScore}점
                                        </span>
                                    </div>
                                    <div className="space-y-1.5 text-[11px]">
                                        {currentProfile.consultant4Areas.govSupportTarget.recommendedPrograms.map((prog, pIdx) => (
                                            <div key={pIdx} className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-0.5">
                                                <div className="flex items-center justify-between font-bold text-white">
                                                    <span>{prog.name}</span>
                                                    <span className="text-amber-400 font-mono text-[10px]">{prog.targetFunding}</span>
                                                </div>
                                                <p className="text-gray-400 text-[10px]">📌 {prog.tip}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        STEP 4: 1분 창업 진단 & 개인화 PSST 사업계획서 뼈대 (NEW)
                        ======================================================== */}
                    {activeTab === 'step4' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-rose-500/40 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-xs border border-rose-500/30">
                                            📝
                                        </span>
                                        <div>
                                            <h4 className="font-black text-white text-sm">1분 완성 창업 진단 (Intake Form)</h4>
                                            <p className="text-[10.5px] text-gray-300">내 창업 단계와 아이템을 선택하면 중기부 PSST와 국세청 코드가 즉시 재계산됩니다.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowIntakeEdit(!showIntakeEdit)}
                                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                                    >
                                        <Edit3 className="w-3 h-3" />
                                        <span>{showIntakeEdit ? '진단 폼 접기' : '5문항 진단 수정하기'}</span>
                                    </button>
                                </div>

                                {showIntakeEdit && (
                                    <div className="space-y-3 pt-2 border-t border-slate-800 text-[11px] animate-fade-in">
                                        <div className="space-y-1">
                                            <label className="text-amber-300 font-bold">Q1. 창업 준비 단계</label>
                                            <div className="grid grid-cols-3 gap-1.5">
                                                {[
                                                    { id: 'pre_startup', label: '① 예비 창업 (아이디어)' },
                                                    { id: 'early_stage', label: '② 초기 창업 (3년 이내)' },
                                                    { id: 're_founder', label: '③ 재창업 / 피봇팅' }
                                                ].map(item => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => setIntakeAnswers(prev => ({ ...prev, stage: item.id as any }))}
                                                        className={`p-2 rounded-lg text-left transition-all border ${
                                                            intakeAnswers.stage === item.id
                                                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                                                                : 'bg-slate-950 text-gray-400 border-slate-800 hover:text-white'
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-emerald-300 font-bold">Q2. 비즈니스 형태</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                                {[
                                                    { id: 'knowledge_ip', label: '1인 지식·IP·콘텐츠' },
                                                    { id: 'platform_it', label: '플랫폼·앱/웹 서비스' },
                                                    { id: 'b2b_consulting', label: 'B2B 용역·컨설팅·교육' },
                                                    { id: 'commerce_goods', label: '제조·유통·이커머스' }
                                                ].map(item => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => setIntakeAnswers(prev => ({ ...prev, businessType: item.id as any }))}
                                                        className={`p-2 rounded-lg text-left transition-all border ${
                                                            intakeAnswers.businessType === item.id
                                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                                                                : 'bg-slate-950 text-gray-400 border-slate-800 hover:text-white'
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-cyan-300 font-bold">Q3. 해결할 시장 문제점 (Problem)</label>
                                            <div className="flex flex-wrap gap-1 mb-1">
                                                {[
                                                    '기존 솔루션의 비싼 비용과 정보 비대칭',
                                                    '1회성 조언 후 실행 불가능한 실행 공백',
                                                    '높은 고정비와 인건비 부담'
                                                ].map((tag, tIdx) => (
                                                    <button
                                                        key={tIdx}
                                                        onClick={() => setIntakeAnswers(prev => ({ ...prev, problemKeyword: tag }))}
                                                        className="px-2 py-0.5 rounded bg-slate-950 hover:bg-cyan-950 text-[10px] text-cyan-300 border border-cyan-500/30"
                                                    >
                                                        + {tag}
                                                    </button>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                value={intakeAnswers.problemKeyword}
                                                onChange={e => setIntakeAnswers(prev => ({ ...prev, problemKeyword: e.target.value }))}
                                                placeholder="시장에서 가장 해결하고 싶은 결핍을 입력하세요"
                                                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 text-xs"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-rose-300 font-bold">Q4. 핵심 가치 솔루션 (Solution)</label>
                                            <div className="flex flex-wrap gap-1 mb-1">
                                                {[
                                                    '기질 데이터 기반 표준 행정 코드 자동 매핑',
                                                    '자동화 알고리즘 기반 SaaS 진단 도구',
                                                    '1:1 맞춤형 웰니스 코칭 & 턴어라운드'
                                                ].map((tag, tIdx) => (
                                                    <button
                                                        key={tIdx}
                                                        onClick={() => setIntakeAnswers(prev => ({ ...prev, solutionKeyword: tag }))}
                                                        className="px-2 py-0.5 rounded bg-slate-950 hover:bg-rose-950 text-[10px] text-rose-300 border border-rose-500/30"
                                                    >
                                                        + {tag}
                                                    </button>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                value={intakeAnswers.solutionKeyword}
                                                onChange={e => setIntakeAnswers(prev => ({ ...prev, solutionKeyword: e.target.value }))}
                                                placeholder="고객에게 제공할 핵심 가치를 입력하세요"
                                                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500 text-xs"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-purple-300 font-bold">Q5. 현재 가장 큰 결핍 (명심 1:1 처방 영역)</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                                {[
                                                    { id: 'funding_plan', label: '자금 조달 & 사업계획서' },
                                                    { id: 'team_hr', label: '팀 빌딩 & R&R (HR)' },
                                                    { id: 'marketing_sales', label: '마케팅 & 첫 고객 확보' },
                                                    { id: 'mental_burnout', label: '멘탈 & 번아웃 극복' }
                                                ].map(item => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => setIntakeAnswers(prev => ({ ...prev, biggestBottleneck: item.id as any }))}
                                                        className={`p-2 rounded-lg text-left transition-all border ${
                                                            intakeAnswers.biggestBottleneck === item.id
                                                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold'
                                                                : 'bg-slate-950 text-gray-400 border-slate-800 hover:text-white'
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-rose-400" />
                                    <span className="font-bold text-rose-200">
                                        중소벤처기업부 표준 PSST 사업계획서 자동 뼈대
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleDownloadPsst}
                                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-gray-300 hover:text-white font-bold text-[10.5px] flex items-center gap-1 transition-all cursor-pointer"
                                    >
                                        <Download className="w-3 h-3" />
                                        <span>TXT 다운로드</span>
                                    </button>
                                    <button
                                        onClick={handleCopyPsstBlueprint}
                                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/40 text-rose-300 font-bold text-[10.5px] flex items-center gap-1 transition-all cursor-pointer"
                                    >
                                        {copiedPsst ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                        <span>{copiedPsst ? '복사 완료!' : 'PSST 전체 복사'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                                            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono text-[10px] border border-amber-500/40">P</span>
                                            <span>{personalizedPsst.problem.title}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                                            월주 (사회적 결핍 포착)
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-[11px] pl-7">
                                        <p className="text-gray-300">⚠️ <strong>시장 결핍:</strong> {personalizedPsst.problem.marketPainPoint}</p>
                                        <p className="text-amber-200/90">💡 <strong>창업자 필연적 동기:</strong> {personalizedPsst.problem.founderMotivation}</p>
                                        <p className="text-gray-400 text-[10px]">⏱️ <strong>시급성:</strong> {personalizedPsst.problem.urgency}</p>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono text-[10px] border border-emerald-500/40">S</span>
                                            <span>{personalizedPsst.solution.title}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                            일주 (핵심 전문성 & IP)
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-[11px] pl-7">
                                        <p className="text-gray-300">💡 <strong>핵심 솔루션:</strong> {personalizedPsst.solution.coreMvp}</p>
                                        <p className="text-emerald-300">✨ <strong>차별화 요소:</strong> {personalizedPsst.solution.differentiation}</p>
                                        <p className="text-gray-400 text-[10px]">🎯 <strong>기술 마일스톤:</strong> {personalizedPsst.solution.techMilestone}</p>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                                            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono text-[10px] border border-cyan-500/40">S</span>
                                            <span>{personalizedPsst.scaleUp.title}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                                            시주 (수익 모델 & 자산화)
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-[11px] pl-7">
                                        <p className="text-gray-300">📈 <strong>B2C (기본 엔진):</strong> {personalizedPsst.scaleUp.businessModel.b2c}</p>
                                        <p className="text-gray-300">🏢 <strong>B2B (수익 극대화):</strong> {personalizedPsst.scaleUp.businessModel.b2b}</p>
                                        <p className="text-gray-300">🏛️ <strong>B2G (스케일업):</strong> {personalizedPsst.scaleUp.businessModel.b2g}</p>
                                        <p className="text-cyan-300">🚀 <strong>시장 진입 (GTM):</strong> {personalizedPsst.scaleUp.gtmStrategy}</p>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                                            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-[10px] border border-purple-500/40">T</span>
                                            <span>{personalizedPsst.team.title}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                                            년주 (인프라 & HR 보완)
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-[11px] pl-7">
                                        <p className="text-gray-300">👑 <strong>대표자 코어 역량:</strong> {personalizedPsst.team.founderStrength}</p>
                                        <p className="text-purple-300">👥 <strong>HR 보완 전략:</strong> {personalizedPsst.team.hrComplementPlan}</p>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/40 space-y-2 text-[11px]">
                                    <div className="flex items-center gap-2 text-blue-300 font-bold">
                                        <Award className="w-4 h-4 text-blue-400" />
                                        <span>명심 행정 · 세무 1-Point 비즈니스 체크</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
                                        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                                            📌 <strong>추천 주업종 코드:</strong> <span className="text-amber-400 font-mono font-bold">{personalizedPsst.onePointCheck.recommendedMainCode}</span> ({personalizedPsst.onePointCheck.recommendedMainTitle})
                                        </div>
                                        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                                            💰 <strong>세제 혜택:</strong> <span className="text-emerald-300">{personalizedPsst.onePointCheck.taxBenefitStatus}</span>
                                        </div>
                                        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                                            📋 <strong>필수 인허가:</strong> {personalizedPsst.onePointCheck.requiredPermits.join(', ')}
                                        </div>
                                        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                                            🏛️ <strong>추천 정부지원사업:</strong> {personalizedPsst.onePointCheck.recommendedGovPrograms.map(g => `${g.name}`).join(', ')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        STEP 5: 번아웃 방지, 실전 행정 & 스케일업 로드맵
                        ======================================================== */}
                    {activeTab === 'step5' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                                <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>지자체 인허가 ➔ 홈택스 ➔ 통신판매업 3단계 순서도</span>
                                </div>
                                <div className="space-y-2">
                                    {currentProfile.hometaxRegistrationGuide.adminChecklist.map((chk, idx) => (
                                        <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                                            <div className="flex items-center justify-between text-[11.5px]">
                                                <span className="font-black text-amber-300">{chk.step}</span>
                                                <span className="font-mono text-gray-400 text-[10px] bg-slate-800 px-2 py-0.5 rounded">
                                                    {chk.place}
                                                </span>
                                            </div>
                                            <p className="text-gray-200 text-[11px] leading-relaxed">
                                                {chk.action}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                                <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                                    <Clock className="w-4 h-4 text-amber-400" />
                                    <span>창업가 일일 리듬 최적화 프로토콜 (Burnout Prevention)</span>
                                </div>

                                <div className="space-y-2">
                                    {currentProfile.burnoutGuide.dailyRhythmProtocol.map((slot, idx) => (
                                        <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                                            <div className="flex items-center justify-between text-[11.5px]">
                                                <span className="font-black text-amber-300">{slot.timeSlot}</span>
                                                <span className="font-mono text-emerald-300 text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                                    {slot.sajuElement}
                                                </span>
                                            </div>
                                            <div className="text-white font-bold text-xs">{slot.energyFocus}</div>
                                            <p className="text-gray-300 text-[11px] leading-relaxed">
                                                {slot.action}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="font-bold text-purple-300 flex items-center gap-1.5 text-xs">
                                    <TrendingUp className="w-4 h-4 text-purple-400" />
                                    <span>3단계 스케일업 로드맵 (Zero to Infinity)</span>
                                </div>
                                <div className="space-y-2">
                                    {currentProfile.scaleUpRoadmap.map((step, idx) => (
                                        <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                                            <div className="flex items-center justify-between text-amber-300 font-bold">
                                                <span className="text-white font-black">{step.phase}</span>
                                                <span className="text-[10px] font-mono text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded">
                                                    {step.keyword}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-[11px]">
                                                🎯 <strong>핵심 액션:</strong> {step.coreAction}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {copiedCode && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 text-xs font-bold text-center animate-fade-in shadow-lg">
                            ✨ {copiedCode}가 클립보드에 복사되었습니다! 홈택스 신청서에 바로 붙여넣으세요.
                        </div>
                    )}

                    {/* 명심 사업적성 1:1 AI 비즈니스 자문실 (Interactive Chat) */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border-2 border-indigo-500/40 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                                <MessageSquare className="w-4 h-4 text-indigo-400" />
                                <span>명심 사업적성 1:1 AI 비즈니스 자문실</span>
                            </div>
                        </div>

                        {/* Chat Messages Log */}
                        <div className="max-h-96 sm:max-h-[440px] overflow-y-auto space-y-3 p-3.5 rounded-xl bg-slate-950/95 border border-slate-800 text-xs custom-scrollbar">
                            {chatMessages.map((msg, mIdx) => (
                                <div
                                    key={mIdx}
                                    className={`p-3.5 rounded-2xl leading-relaxed relative group transition-all shadow-sm ${
                                        msg.role === 'user'
                                            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 ml-8 text-right'
                                            : 'bg-slate-900/90 text-gray-200 border border-slate-800 mr-4 sm:mr-8'
                                    }`}
                                >
                                    <div className="flex items-center justify-between text-[10.5px] font-bold mb-2 text-gray-400 border-b border-white/5 pb-1">
                                        <span className="flex items-center gap-1">
                                            {msg.role === 'user' ? '👤 대표님' : '🏛️ 명심 비즈니스 AI 코치'}
                                        </span>
                                        {msg.role === 'assistant' && (
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(msg.content);
                                                    setCopiedMsgIdx(mIdx);
                                                    setTimeout(() => setCopiedMsgIdx(null), 2000);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-gray-300 flex items-center gap-1 text-[10px] cursor-pointer"
                                                title="답변 전체 복사"
                                            >
                                                {copiedMsgIdx === mIdx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                                <span>{copiedMsgIdx === mIdx ? '복사됨' : '복사'}</span>
                                            </button>
                                        )}
                                    </div>
                                    
                                    {msg.role === 'user' ? (
                                        <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-left font-medium">
                                            {msg.content}
                                        </p>
                                    ) : (
                                        <div className="prose prose-invert prose-xs max-w-none text-left text-[12px] leading-relaxed space-y-2">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    h1: ({ node, ...props }) => <h1 className="text-sm font-black text-amber-300 mt-2 mb-1 border-b border-amber-500/20 pb-1" {...props} />,
                                                    h2: ({ node, ...props }) => <h2 className="text-[13px] font-bold text-indigo-300 mt-2 mb-1" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-xs font-bold text-emerald-300 mt-2 mb-1" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-bold text-amber-200" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 my-1 text-gray-300" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 my-1 text-gray-300" {...props} />,
                                                    li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                                                    p: ({ node, ...props }) => <p className="mb-1.5 leading-relaxed text-gray-200" {...props} />,
                                                    hr: ({ node, ...props }) => <hr className="my-2 border-slate-800" {...props} />,
                                                    code: ({ node, ...props }) => <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300 font-mono text-[11px]" {...props} />,
                                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-indigo-500/50 pl-2.5 my-1.5 italic text-indigo-200 bg-indigo-950/20 py-1 rounded-r" {...props} />
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoadingChat && (
                                <div className="p-3 rounded-2xl bg-slate-900 text-indigo-300 border border-slate-800 mr-8 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                                    <span className="text-xs">명심 비즈니스 AI 코치가 사업적성과 행정 코드를 분석 중입니다...</span>
                                </div>
                            )}
                            <div ref={chatBottomRef} />
                        </div>

                        {/* Quick Prompts */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                            {[
                                { title: '예창패/초창패 통과 전략', prompt: '내 기질과 비즈니스 형태를 바탕으로, 정부지원사업 서류 심사에서 가산점을 받는 차별화 스토리라인을 작성해줘.' },
                                { title: '국세청 100% 감면 행정', prompt: '국세청 사업자등록 시 주업종 724000과 부업종을 어떻게 등록해야 5개년 소득세 100% 감면을 안전하게 받는지 알려줘.' },
                                { title: '1인 MVP 30일 로드맵', prompt: '직원 채용 없이 초기 30일 안에 최소기능제품(MVP)을 론칭하고 첫 유료 고객을 만드는 실행 계획을 짜줘.' },
                                { title: '공망 ➔ 클라우드 플랫폼', prompt: '공망(비움)의 기질을 결핍이 아닌 무한 대역폭의 클라우드 플랫폼으로 전환하여 1인 기업을 스케일업하는 3단계 실행 전략을 짜줘.' }
                            ].map((cp, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(cp.prompt)}
                                    disabled={isLoadingChat}
                                    className="p-2 rounded-lg bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-400/50 text-left transition-all cursor-pointer text-[10.5px] group disabled:opacity-50"
                                >
                                    <span className="font-bold text-white group-hover:text-indigo-300">💡 {cp.title}</span>
                                </button>
                            ))}
                        </div>

                        {/* Chat Input */}
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={e => setInputMessage(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="사업계획서 작성, 정부지원사업, 국세청 코드 관련 질문을 입력하세요..."
                                className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-400 text-xs"
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={isLoadingChat || !inputMessage.trim()}
                                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center shadow-md"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="space-y-2 pt-1 border-t border-slate-800">
                        <button
                            onClick={() => {
                                handleSendMessage(
                                    `내 비즈니스명("${personalizedPsst.identityTitle}")과 국세청 코드(${personalizedPsst.onePointCheck.recommendedMainCode})를 바탕으로, PSST 사업계획서 [1. 문제 인식]과 [2. 실현 가능성] 항목을 심사위원 기준에서 가장 매력적인 문장으로 정밀 작성해 줘!`
                                );
                            }}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                        >
                            <Briefcase className="w-4 h-4 fill-slate-950" />
                            <span>💼 이 아키텍처로 1:1 맞춤 사업계획서 코칭 시작하기 ↗</span>
                        </button>

                        <p className="text-[10px] text-gray-500 text-center">
                            💡 내면의 본질(Being)을 정의하고 현실의 행동(Doing)을 표준 행정 체계로 풀어내는 글로벌 웰니스 솔루션
                        </p>
                    </div>
                </div>
            </div>
        </AnimatePresence>
    );
}
