'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Sparkles, Briefcase, Copy, Check, ChevronRight,
    TrendingUp, Shield, FileText, CheckCircle2, Crown,
    Award, ArrowRight, Building, HelpCircle, Layers, Zap,
    Cpu, BookOpen, Compass, Globe, Server, Database, BarChart3,
    HeartPulse, Clock, AlertTriangle, MessageSquare, Flame, CheckCheck,
    Users, DollarSign, Target, Rocket, RefreshCw, Landmark, ExternalLink,
    Send, Download, CheckSquare, Edit3, Code, CheckCircle, Info
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
import {
    evaluateDeterministicRules,
    DEFAULT_BUSINESS_FACT,
    BusinessFactSchema,
    SEVEN_CORE_QUESTIONS,
    FinalBusinessArchitectureResponse
} from '@/lib/engine/BusinessFactRuleEngine';
import {
    OFFICIAL_MASTER_META,
    OFFICIAL_INDUSTRY_MASTER_DATA
} from '@/data/OfficialIndustryMasterDB';
import { useReportStore } from '@/store/useReportStore';
import { formatFriendlyErrorMessage } from '@/utils/errorMessage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AdminBizAuthModal from '@/components/modals/AdminBizAuthModal';

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
    const [activeTab, setActiveTab] = useState<'step1' | 'step2' | 'step3' | 'step4' | 'step5'>('step2');
    const [selectedStage, setSelectedStage] = useState<StartupStageType>('solo_pre');
    const [viewRoleModel, setViewRoleModel] = useState<boolean>(false);
    const [copiedPsst, setCopiedPsst] = useState<boolean>(false);

    // [엔진 2: Business Fact Extractor 상태]
    const [businessFacts, setBusinessFacts] = useState<BusinessFactSchema>(DEFAULT_BUSINESS_FACT);
    const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number>(0);
    const [showFactJson, setShowFactJson] = useState<boolean>(false);

    // 1분 창업 진단 Intake Form 상태
    const [intakeAnswers, setIntakeAnswers] = useState<StartupIntakeAnswers>({
        stage: 'pre_startup',
        businessType: 'knowledge_ip',
        problemKeyword: '기존 솔루션의 추상성과 높은 비용, 실행 공백(Execution Gap)',
        solutionKeyword: '기질 데이터 기반 표준 행정 코드 자동 매핑 및 3초 사업화 로드맵 AI',
        biggestBottleneck: 'funding_plan'
    });

    const [showIntakeEdit, setShowIntakeEdit] = useState<boolean>(false);

    // [엔진 3 & 5: Deterministic Rule Engine & Verification Gate 실시간 평가]
    const deterministicResult: FinalBusinessArchitectureResponse = useMemo(() => {
        return evaluateDeterministicRules(businessFacts);
    }, [businessFacts]);

    // 명심 사업적성 AI 코치 인라인 챗봇 상태
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        {
            role: 'assistant',
            content: `반갑습니다, ${userProfile?.userName || '대표'}님! 

인지행동 프레임워크와 3단계 분리 엔진(①사주 맞춤분석 ➔ ②실제 사업모델 Fact ➔ ③제11차 KSIC 공식 DB 판정) 기반의 [명심 비즈니스 아키텍트 AI]입니다.

AI가 임의로 코드를 지어내지 않고, 대표님이 실제로 판매하시는 상품과 수익모델에 기반하여 제11차 한국표준산업분류(KSIC) 및 국세청 공식 Master DB에서 검증된 주·부업종만을 안내해 드립니다.`
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

    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsUnlocked(sessionStorage.getItem('myeongsim_biz_admin_unlocked') === 'true');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    if (!isUnlocked) {
        return (
            <AdminBizAuthModal
                isOpen={isOpen}
                onClose={onClose}
                onSuccess={() => setIsUnlocked(true)}
            />
        );
    }

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
            + `- 시장 진입: ${p.scaleUp.gtmStrategy}\n\n`
            + `4. 팀 구성 (Team)\n`
            + `- ${p.team.founderStrength}\n`
            + `- ${p.team.hrComplementPlan}\n\n`
            + `[공식 주업종 권장안]\n`
            + `■ ${p.onePointCheck.recommendedMainCode} (${p.onePointCheck.recommendedMainTitle})\n`
            + `■ 세액감면: ${p.onePointCheck.taxBenefitStatus}`;
        
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
            + `[공식 업종코드 판정 결과 (제11차 KSIC Master DB)]\n`
            + `========================================================\n`
            + `■ 판정 상태: ${deterministicResult.status}\n`
            + `■ 주업종 1순위: ${deterministicResult.primary_candidates[0]?.tax_name || '온라인정보제공업'} [${deterministicResult.primary_candidates[0]?.tax_code || '724000'}]\n`
            + `■ 선정 근거: ${deterministicResult.primary_candidates[0]?.reason || ''}\n`
            + `■ 권장 부업종: ${deterministicResult.secondary_candidates.map(s => `${s.tax_name} [${s.tax_code}]`).join(', ')}\n`
            + `■ 데이터 출처: ${OFFICIAL_MASTER_META.ksic_version} (시행일: ${OFFICIAL_MASTER_META.effective_date})\n`;
        
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
                    businessFacts,
                    userName: userProfile?.userName || '대표'
                })
            });

            const data = await res.json();
            if (data.success && data.reply) {
                setChatMessages([...newMessages, { role: 'assistant', content: data.reply }]);
            } else {
                const friendlyMessage = formatFriendlyErrorMessage(data.error) || '현재 AI 코칭 엔진 트래픽이 많아 일시적으로 연결이 지연되었습니다. 잠시 후 다시 질문해 주시면 성심껏 답변해 드리겠습니다.';
                setChatMessages([...newMessages, { role: 'assistant', content: friendlyMessage }]);
            }
        } catch (err) {
            setChatMessages([...newMessages, { role: 'assistant', content: '현재 AI 코칭 엔진 트래픽이 많아 일시적으로 연결이 지연되었습니다. 잠시 후 다시 질문해 주시면 성심껏 답변해 드리겠습니다.' }]);
        } finally {
            setIsLoadingChat(false);
        }
    };

    // 문진 답변 선택 시 Fact 패치 핸들러
    const handleApplyFactOption = (patch: Partial<BusinessFactSchema>) => {
        setBusinessFacts(prev => ({
            ...prev,
            ...patch
        }));
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 font-sans animate-fade-in text-left">
                <div className="bg-[#0c101c] border-2 border-amber-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-4 sm:p-7 shadow-[0_0_90px_rgba(245,158,11,0.25)] relative text-white space-y-4 custom-scrollbar">
                    
                    {/* Top Status & Role Model Switch */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[11px] font-mono font-bold text-amber-400">
                                🏛️ [명심 비즈니스 아키텍트] 제11차 KSIC 기반 3단계 분리 판정 솔루션
                            </span>
                        </div>

                        {/* Switch: 내 인지 프로파일 ↔ 베스트 롤모델 벤치마크 */}
                        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10.5px] font-bold">
                            <button
                                onClick={() => setViewRoleModel(false)}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                    !viewRoleModel
                                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                ✨ 내 인지 프로파일 분석
                            </button>
                            <button
                                onClick={() => setViewRoleModel(true)}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                                    viewRoleModel
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                👑 롤모델 벤치마크 (표준 모델)
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
                                        {selectedStage === 'early_team' ? '초창패·TIPS 연계' : selectedStage === 're_founder' ? '재도전패키지 연계' : '예비창업패키지 연계'}
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
                            1. 인지 아키타입
                        </button>
                        <button
                            onClick={() => setActiveTab('step2')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step2'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            2. 업종 판정 (3층 분리)
                        </button>
                        <button
                            onClick={() => setActiveTab('step3')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step3'
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            3. 4대 비즈니스 영역
                        </button>
                        <button
                            onClick={() => setActiveTab('step4')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step4'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            4. PSST 사업계획서
                        </button>
                        <button
                            onClick={() => setActiveTab('step5')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step5'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            5. 홈택스 등록
                        </button>
                    </div>

                    {/* Copied Alert Toast */}
                    {copiedCode && (
                        <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-fade-in flex items-center justify-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            <span>{copiedCode} 복사되었습니다! 국세청 홈택스 사업자등록 시 입력하세요.</span>
                        </div>
                    )}

                    {/* ========================================================
                        STEP 1: 인지 아키타입 및 4주 정밀 분석 (Scan)
                        ======================================================== */}
                    {activeTab === 'step1' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                                        <Compass className="w-4 h-4 text-amber-400" />
                                        <span>선천적 인지 하드웨어 기반 4주 분석 (Scan)</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-mono">인지행동 프레임워크 3S</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {currentProfile.pillarBreakdowns.map((p, idx) => (
                                        <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                                            <div className="flex items-center justify-between text-[11.5px]">
                                                <span className="font-bold text-gray-300">{p.pillarName}</span>
                                                <span className="font-mono text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                                                    {p.ganji}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-emerald-300 font-semibold">{p.tenGodLabel}</div>
                                            <div className="text-[11px] text-white font-medium">⚡ {p.corePower}</div>
                                            <p className="text-gray-400 text-[10.5px] leading-relaxed pt-1 border-t border-slate-800/80">
                                                {p.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

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
                        STEP 2: [NEW] 3단계 분리 판정 엔진 & 3층 구조화 리포트
                        ======================================================== */}
                    {activeTab === 'step2' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            
                            {/* 안내 배너: 3단계 분리 아키텍처 원칙 */}
                            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/40 flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div className="space-y-1 text-[11px]">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-white text-xs">AI 환각 0% 차단 3단계 분리 판정 시스템</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                                            {OFFICIAL_MASTER_META.ksic_version}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed text-[10.5px]">
                                        사주는 <strong>“사업 전략 및 코칭 방향”</strong>을 개인화하고, 국세청 코드는 대표님이 실제로 판매하시는 <strong>“사업모델 Fact”</strong>로만 결정됩니다. AI가 임의로 코드를 지어내지 못하도록 <strong>공식 Master DB 검증 게이트</strong>가 100% 작동 중입니다.
                                    </p>
                                </div>
                            </div>

                            {/* --------------------------------------------------
                                1층: [명심 맞춤 분석 (Scan & Sync)]
                                -------------------------------------------------- */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                        <span>① 1층: 명심 맞춤 기질 분석 (사주 개인화 프레임)</span>
                                    </div>
                                    <span className="text-[10px] text-amber-400/80 font-mono bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/20">
                                        기질 ➔ 사업 방향 추천
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                                    <div className="text-[11.5px] font-bold text-white flex items-center gap-1">
                                        <span>💡 추천 비즈니스 아키타입:</span>
                                        <span className="text-amber-300 font-extrabold">{deterministicResult.saju_business_guidance.recommended_model_archetype}</span>
                                    </div>
                                    <p className="text-gray-300 text-[11px] leading-relaxed">
                                        {deterministicResult.saju_business_guidance.summary}
                                    </p>
                                    <div className="text-[10px] text-gray-400 italic pt-1 border-t border-slate-800/80">
                                        ※ 사주는 업무 스타일과 린(Lean) 확장 전략을 가이드하며, 업종코드를 직접 결정하지 않습니다.
                                    </div>
                                </div>
                            </div>

                            {/* --------------------------------------------------
                                2층: [실제 사업모델 Fact Extractor (7대 핵심 문진)]
                                -------------------------------------------------- */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-bold text-indigo-300 flex items-center gap-1.5 text-xs">
                                        <Layers className="w-4 h-4 text-indigo-400" />
                                        <span>② 2층: 실제 사업모델 구조화 (7대 핵심 문진 Fact)</span>
                                    </div>
                                    <button
                                        onClick={() => setShowFactJson(!showFactJson)}
                                        className="text-[10.5px] text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30"
                                    >
                                        <Code className="w-3 h-3" />
                                        <span>{showFactJson ? 'JSON 닫기' : 'Fact JSON 보기'}</span>
                                    </button>
                                </div>

                                {/* 문진 탭 버튼 리스트 */}
                                <div className="grid grid-cols-7 gap-1 text-[10px] font-bold text-center">
                                    {SEVEN_CORE_QUESTIONS.map((q, idx) => (
                                        <button
                                            key={q.id}
                                            onClick={() => setSelectedQuestionIdx(idx)}
                                            className={`py-1.5 px-1 rounded-lg transition-all cursor-pointer truncate ${
                                                selectedQuestionIdx === idx
                                                    ? 'bg-indigo-600 text-white shadow'
                                                    : 'bg-slate-950 text-gray-400 hover:text-white border border-slate-800'
                                            }`}
                                        >
                                            Q{q.id}. {q.title}
                                        </button>
                                    ))}
                                </div>

                                {/* 선택된 문진 인터랙션 카드 */}
                                {(() => {
                                    const currentQ = SEVEN_CORE_QUESTIONS[selectedQuestionIdx];
                                    return (
                                        <div className="p-3.5 rounded-xl bg-slate-950/90 border border-indigo-500/40 space-y-2.5">
                                            <div className="space-y-0.5">
                                                <div className="text-xs font-black text-indigo-200">
                                                    질문 {currentQ.id}: {currentQ.question}
                                                </div>
                                                <div className="text-[10.5px] text-gray-400">
                                                    {currentQ.description}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                                                {currentQ.options.map((opt, oIdx) => (
                                                    <button
                                                        key={oIdx}
                                                        onClick={() => handleApplyFactOption(opt.factPatch)}
                                                        className="p-2.5 rounded-lg bg-slate-900/90 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/60 text-left transition-all cursor-pointer group flex items-start gap-2"
                                                    >
                                                        <div className="w-4 h-4 rounded-full border border-indigo-400/50 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-indigo-300">
                                                            <div className="w-2 h-2 rounded-full bg-indigo-400 opacity-80" />
                                                        </div>
                                                        <span className="text-gray-200 text-[11px] leading-tight group-hover:text-white font-medium">
                                                            {opt.label}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* JSON 디버거 뷰 */}
                                {showFactJson && (
                                    <pre className="p-3 rounded-xl bg-black/90 border border-slate-800 text-[10px] font-mono text-emerald-400 overflow-x-auto">
                                        {JSON.stringify(businessFacts, null, 2)}
                                    </pre>
                                )}

                                {/* 현재 Fact 요약 칩 */}
                                <div className="flex flex-wrap items-center gap-1.5 text-[10.5px]">
                                    <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-gray-300">
                                        고객: <strong className="text-white">{businessFacts.customer_types.join(', ')}</strong>
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-gray-300">
                                        전달: <strong className="text-white">{businessFacts.delivery_modes.join(', ')}</strong>
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-gray-300">
                                        자동화: <strong className="text-white">{businessFacts.software_is_product ? '웹 SaaS/자동' : '직접 용역'}</strong>
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-gray-300">
                                        컨설팅 비중: <strong className="text-amber-300">{businessFacts.consulting_revenue_share_percent || 0}%</strong>
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-gray-300">
                                        실물 배송: <strong className={businessFacts.physical_goods ? 'text-amber-300' : 'text-gray-400'}>{businessFacts.physical_goods ? '있음' : '없음'}</strong>
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-gray-300">
                                        미래예측 표방: <strong className={businessFacts.future_prediction_claim ? 'text-rose-400' : 'text-emerald-400'}>{businessFacts.future_prediction_claim ? '표방함' : '표방안함 (자기이해 코칭)'}</strong>
                                    </span>
                                </div>
                            </div>

                            {/* --------------------------------------------------
                                3층: [공식 업종코드 검토 (Deterministic Rule Engine & Verification Gate)]
                                -------------------------------------------------- */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                                        <Building className="w-4 h-4 text-emerald-400" />
                                        <span>③ 3층: 공식 업종코드 검토 (제11차 KSIC Master DB)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                            deterministicResult.status === 'VERIFIED'
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                                : deterministicResult.status === 'CLARIFICATION_REQUIRED'
                                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                        }`}>
                                            ● {deterministicResult.status}
                                        </span>
                                    </div>
                                </div>

                                {/* 판정 상태 사유 및 질문 안내 */}
                                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                                    <div className="text-gray-300">
                                        {deterministicResult.status_reason}
                                    </div>
                                    {deterministicResult.clarification_question && (
                                        <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-[10.5px] font-semibold flex items-center gap-1.5">
                                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                            <span>{deterministicResult.clarification_question}</span>
                                        </div>
                                    )}
                                </div>

                                {/* 1. 주업종 1순위 후보 카드 */}
                                <div className="space-y-2">
                                    <div className="text-xs font-black text-emerald-300 flex items-center gap-1">
                                        <Award className="w-3.5 h-3.5" />
                                        <span>주업종 1순위 후보 (코어 엔진)</span>
                                    </div>

                                    {deterministicResult.primary_candidates.map((cand, idx) => (
                                        <div key={idx} className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/30 via-slate-950 to-slate-950 border-2 border-emerald-500/50 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-extrabold text-white text-sm">{cand.tax_name}</span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/40">
                                                        신뢰도: {cand.match_level === 'HIGH' ? '높음' : '보통'}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleCopyCode(cand.tax_code, cand.tax_name)}
                                                    className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-mono font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow"
                                                >
                                                    코드 {cand.tax_code} <Copy className="w-3 h-3" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                                                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                                                    <div className="text-gray-400 font-medium">제11차 KSIC 연계 세세분류</div>
                                                    <div className="font-bold text-white pt-0.5">{cand.ksic_name} ({cand.ksic_code})</div>
                                                </div>
                                                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                                                    <div className="text-gray-400 font-medium">조특법 제6조 청년창업감면</div>
                                                    <div className={`font-bold pt-0.5 ${cand.tax_benefit.applicable ? 'text-emerald-300' : 'text-rose-400'}`}>
                                                        {cand.tax_benefit.applicable ? '적격 (비과밀 100% 감면)' : '제외 대상'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-[11px] text-gray-300 leading-relaxed bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80">
                                                <strong>선정 근거:</strong> {cand.reason}
                                            </div>

                                            <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono pt-1 border-t border-slate-800/60">
                                                <span>출처: {cand.source.agency} ({cand.source.version})</span>
                                                <span>시행일: {cand.source.effective_date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 2. 권장 부업종 카드 리스트 */}
                                <div className="space-y-2 pt-2">
                                    <div className="text-xs font-black text-cyan-300 flex items-center gap-1">
                                        <Layers className="w-3.5 h-3.5" />
                                        <span>권장 부업종 후보 (병기 등록 권장)</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {deterministicResult.secondary_candidates.map((sec, idx) => (
                                            <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-white text-xs">{sec.tax_name}</span>
                                                    <button
                                                        onClick={() => handleCopyCode(sec.tax_code, sec.tax_name)}
                                                        className="font-mono font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 px-2 py-0.5 rounded text-[10.5px] border border-cyan-500/30 flex items-center gap-1 cursor-pointer transition-all"
                                                    >
                                                        {sec.tax_code} <Copy className="w-2.5 h-2.5" />
                                                    </button>
                                                </div>
                                                <p className="text-gray-300 text-[10.5px] leading-relaxed">
                                                    {sec.reason}
                                                </p>
                                                <div className="text-[9.5px] text-gray-400 font-mono">
                                                    KSIC: {sec.ksic_name} ({sec.ksic_code})
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. 배제/주의된 코드 및 사유 */}
                                {deterministicResult.excluded_candidates.length > 0 && (
                                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-[10.5px]">
                                        <div className="font-bold text-gray-400 flex items-center gap-1">
                                            <Info className="w-3 h-3" />
                                            <span>실질 불부합으로 자동 배제된 코드 및 사유</span>
                                        </div>
                                        <div className="space-y-1">
                                            {deterministicResult.excluded_candidates.map((exc, idx) => (
                                                <div key={idx} className="text-gray-400 flex items-start gap-1.5">
                                                    <span className="text-rose-400 font-mono font-bold shrink-0">✕ [{exc.tax_code} {exc.tax_name}]:</span>
                                                    <span>{exc.exclusion_reason}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Master DB 메타데이터 감사 카드 */}
                                <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 text-[10px] text-gray-400 flex flex-wrap items-center justify-between gap-2 font-mono">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                                        <span>Master DB: {OFFICIAL_MASTER_META.ksic_version} (시행일: {OFFICIAL_MASTER_META.effective_date})</span>
                                    </div>
                                    <span className="text-emerald-400 font-bold">
                                        검증 게이트: 활성 코드 {deterministicResult.rule_engine_audit.verified_count}건 정합 / 가짜 코드 0% 차단
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        STEP 3: 4대 비즈니스 영역 융합 진단
                        ======================================================== */}
                    {activeTab === 'step3' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                                        <Target className="w-4 h-4 text-cyan-400" />
                                        <span>명심 4대 핵심 비즈니스 실행 영역</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-mono">마케팅 · 인사 · 세무 · 정부지원</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                                                <TrendingUp className="w-3.5 h-3.5" />
                                                <span>1. 마케팅 · 시장성</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                                                {currentProfile.consultant4Areas.marketing.sajuEngine}
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-gray-300 space-y-1">
                                            <div><strong>타겟 고객:</strong> {currentProfile.consultant4Areas.marketing.targetCustomer}</div>
                                            <div><strong>영업 채널:</strong> {currentProfile.consultant4Areas.marketing.salesChannel}</div>
                                            <div className="text-gray-400 text-[10.5px]">💡 {currentProfile.consultant4Areas.marketing.conversionStrategy}</div>
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                                                <Users className="w-3.5 h-3.5" />
                                                <span>2. 인사 · 팀 빌딩</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                                {currentProfile.consultant4Areas.hrOrg.sajuEngine}
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-gray-300 space-y-1">
                                            <div><strong>최적 역할:</strong> {currentProfile.consultant4Areas.hrOrg.idealTeamRole}</div>
                                            <div><strong>갈등 트리거:</strong> {currentProfile.consultant4Areas.hrOrg.conflictTrigger}</div>
                                            <div className="text-gray-400 text-[10.5px]">🤝 {currentProfile.consultant4Areas.hrOrg.delegationProtocol}</div>
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                                                <Landmark className="w-3.5 h-3.5" />
                                                <span>3. 재무 · 세무 최적화</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                                                {currentProfile.consultant4Areas.financeTax.sajuEngine}
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-gray-300 space-y-1">
                                            <div><strong>감면 혜택:</strong> {currentProfile.consultant4Areas.financeTax.taxReductionRate}</div>
                                            <div><strong>추천 소재지:</strong> {currentProfile.consultant4Areas.financeTax.recommendedLocation}</div>
                                            <div className="text-gray-400 text-[10.5px]">🏛️ {currentProfile.consultant4Areas.financeTax.legalStructure}</div>
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="font-bold text-purple-300 flex items-center gap-1.5 text-xs">
                                                <Award className="w-3.5 h-3.5" />
                                                <span>4. 정부지원사업 타겟팅</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                                                적합도 {currentProfile.consultant4Areas.govSupportTarget.competitivenessScore}점
                                            </span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {currentProfile.consultant4Areas.govSupportTarget.recommendedPrograms.map((prog, pIdx) => (
                                                <div key={pIdx} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[10.5px] space-y-0.5">
                                                    <div className="flex items-center justify-between font-bold text-white">
                                                        <span>{prog.name}</span>
                                                        <span className="text-amber-400">{prog.targetFunding}</span>
                                                    </div>
                                                    <div className="text-gray-400">{prog.tip}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        STEP 4: 중소벤처기업부 표준 PSST 사업계획서 뼈대
                        ======================================================== */}
                    {activeTab === 'step4' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-bold text-purple-300 flex items-center gap-1.5 text-xs">
                                        <FileText className="w-4 h-4 text-purple-400" />
                                        <span>중소벤처기업부 표준 PSST 사업계획서 스토리라인</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleCopyPsstBlueprint}
                                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10.5px] flex items-center gap-1 transition-all cursor-pointer shadow"
                                        >
                                            {copiedPsst ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            <span>{copiedPsst ? '복사 완료' : '전체 복사'}</span>
                                        </button>
                                        <button
                                            onClick={handleDownloadPsst}
                                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-[10.5px] flex items-center gap-1 transition-all cursor-pointer border border-purple-500/30"
                                        >
                                            <Download className="w-3 h-3" />
                                            <span>다운로드</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                                        <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                                            <span>1. Problem (문제 인식 & 개발 동기)</span>
                                        </div>
                                        <p className="text-gray-300 text-[11px] leading-relaxed">
                                            {personalizedPsst.problem.marketPainPoint}
                                        </p>
                                        <p className="text-gray-400 text-[10.5px] italic">
                                            💡 창업자 동기: {personalizedPsst.problem.founderMotivation}
                                        </p>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                                        <div className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                                            <span>2. Solution (실현 가능성 & 핵심 솔루션)</span>
                                        </div>
                                        <p className="text-gray-300 text-[11px] leading-relaxed">
                                            {personalizedPsst.solution.coreMvp}
                                        </p>
                                        <p className="text-gray-400 text-[10.5px]">
                                            ⚡ 차별성: {personalizedPsst.solution.differentiation}
                                        </p>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                                        <div className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                                            <span>3. Scale-up (성장 전략 & 수익 모델)</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10.5px] pt-1">
                                            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                                                <div className="text-cyan-400 font-bold">B2C 모델</div>
                                                <div className="text-gray-300 pt-0.5">{personalizedPsst.scaleUp.businessModel.b2c}</div>
                                            </div>
                                            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                                                <div className="text-cyan-400 font-bold">B2B 모델</div>
                                                <div className="text-gray-300 pt-0.5">{personalizedPsst.scaleUp.businessModel.b2b}</div>
                                            </div>
                                            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                                                <div className="text-cyan-400 font-bold">GTM 진입</div>
                                                <div className="text-gray-300 pt-0.5">{personalizedPsst.scaleUp.gtmStrategy}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                                        <div className="text-xs font-bold text-purple-300 flex items-center gap-1">
                                            <span>4. Team (팀 구성 및 조직 역량)</span>
                                        </div>
                                        <p className="text-gray-300 text-[11px] leading-relaxed">
                                            {personalizedPsst.team.founderStrength}
                                        </p>
                                        <p className="text-gray-400 text-[10.5px]">
                                            👥 보완 계획: {personalizedPsst.team.hrComplementPlan}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        STEP 5: 원클릭 실전 행정 & 홈택스 사업자등록 블루프린트
                        ======================================================== */}
                    {activeTab === 'step5' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-bold text-rose-300 flex items-center gap-1.5 text-xs">
                                        <Landmark className="w-4 h-4 text-rose-400" />
                                        <span>국세청 홈택스 사업자등록 실전 매뉴얼</span>
                                    </div>
                                    <a
                                        href="https://www.hometax.go.kr"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10.5px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
                                    >
                                        홈택스 바로가기 <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>

                                <div className="space-y-2.5">
                                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                                        <div className="text-gray-400 font-medium">추천 주업종 등록안</div>
                                        <div className="text-white font-bold text-[11.5px] text-emerald-300">
                                            {currentProfile.hometaxRegistrationGuide.mainSelection}
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                                        <div className="text-gray-400 font-medium">추천 부업종 등록안 (병기 권장)</div>
                                        <div className="space-y-0.5 text-gray-300 text-[11px]">
                                            {currentProfile.hometaxRegistrationGuide.subSelections.map((sub, sIdx) => (
                                                <div key={sIdx}>• {sub}</div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 pt-1">
                                        <div className="font-bold text-gray-300">3단계 행정 체크리스트</div>
                                        {currentProfile.hometaxRegistrationGuide.adminChecklist.map((chk, cIdx) => (
                                            <div key={cIdx} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5">
                                                <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                                    {cIdx + 1}
                                                </div>
                                                <div className="space-y-0.5 text-[10.5px]">
                                                    <div className="font-bold text-white flex items-center gap-1.5">
                                                        <span>{chk.step}</span>
                                                        <span className="text-amber-400 font-normal">({chk.place})</span>
                                                    </div>
                                                    <div className="text-gray-300">{chk.action}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        명심 사업적성 1:1 맞춤 AI 코치 인라인 채팅창
                        ======================================================== */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-[#0c101c] border border-amber-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="font-bold text-white text-xs flex items-center gap-1.5">
                                        <span>명심 비즈니스 아키텍트 1:1 맞춤 AI 코치</span>
                                        <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                                            공식 DB 연동 검증
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-gray-400">
                                        표준산업분류(KSIC), 세액감면 요건, PSST 사업계획서에 대해 실시간으로 상담하세요.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages Log */}
                        <div className="max-h-60 overflow-y-auto space-y-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs custom-scrollbar">
                            {chatMessages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-2 ${
                                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                                            🏛️
                                        </div>
                                    )}
                                    <div
                                        className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                                            msg.role === 'user'
                                                ? 'bg-amber-500 text-slate-950 font-bold ml-4'
                                                : 'bg-slate-900 border border-slate-800 text-gray-200'
                                        }`}
                                    >
                                        <div className="prose prose-invert prose-xs max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoadingChat && (
                                <div className="flex items-center gap-2 text-gray-400 text-[11px] p-2">
                                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                                    <span>비즈니스 아키텍트 AI가 제11차 KSIC Master DB와 대조 검증 중입니다...</span>
                                </div>
                            )}
                            <div ref={chatBottomRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="예: '웹 SaaS와 1:1 컨설팅을 병행할 때 홈택스 주업종과 부업종을 어떻게 넣어야 하나요?'"
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!inputMessage.trim() || isLoadingChat}
                                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>전송</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </AnimatePresence>
    );
}
