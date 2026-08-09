'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StrengthForceField from './StrengthForceField';
import TalentProfileBars from './TalentProfileBars';
import CooperationProfile from './CooperationProfile';
import PowerbaseDonut from './PowerbaseDonut';
import SpecificTalentCards from './SpecificTalentCards';
import StrengthExplainModal from './StrengthExplainModal';
import { useReportStore } from '@/store/useReportStore';
import { StrengthReportData } from '@/types/strength-report';
import { ArrowLeft, Download, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * [Myeongsim Branding]
 * 강점/재능 (인적자원) 리포트 브랜딩
 * Force Field -> 본질 에너지 포스필드
 */

// 모달 상태 타입
interface ModalState {
    isOpen: boolean;
    category: 'forceField' | 'talentProfile' | 'cooperation' | 'powerbase' | 'specificTalent';
    itemKey: string;
    itemLabel: string;
    itemValue: number;
}

const INITIAL_MODAL_STATE: ModalState = {
    isOpen: false,
    category: 'forceField',
    itemKey: '',
    itemLabel: '',
    itemValue: 0,
};

// 사주 데이터로부터 강점/재능 리포트 데이터 계산
function calculateStrengthData(reportData: any): StrengthReportData {
    const { saju, stats: rawStats } = reportData;
    const elements = saju?.elements || { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
    const tenGods = saju?.tenGods || { resource: 2, output: 2, self: 2, power: 2, wealth: 2 };
    const stats = rawStats || { creativity: 60, leadership: 60, empathy: 60, wealth: 60, execution: 60 };

    // 1. [십성 지표] 정량 역량화 (0~100점 스케일링)
    const resourceScore = Math.min(100, Math.max(30, tenGods.resource * 25 + 20)); // 인성 (지혜, 수용)
    const outputScore = Math.min(100, Math.max(30, tenGods.output * 25 + 20));     // 식상 (표현, 발산)
    const selfScore = Math.min(100, Math.max(30, tenGods.self * 25 + 20));         // 비겁 (자아, 주체성)
    const powerScore = Math.min(100, Math.max(30, tenGods.power * 25 + 20));       // 관성 (절제, 통제)
    const wealthScore = Math.min(100, Math.max(30, tenGods.wealth * 25 + 20));     // 재성 (성과, 설계)

    // 2. [오행 기운] 정량 역량화
    const woodScore = Math.min(100, Math.max(30, Math.round(elements.wood * 2.5)));
    const fireScore = Math.min(100, Math.max(30, Math.round(elements.fire * 2.5)));
    const earthScore = Math.min(100, Math.max(30, Math.round(elements.earth * 2.5)));
    const metalScore = Math.min(100, Math.max(30, Math.round(elements.metal * 2.5)));
    const waterScore = Math.min(100, Math.max(30, Math.round(elements.water * 2.5)));

    // 3. [본질 에너지 포스필드] 8대 축 도출
    // 외/내향 밸런스와 오행 십성의 유기적 결합
    const forceField = {
        axisLabels: ['의지력 (비겁)', '감정 (식상)', '생명력 (비겁)', '추진력 (관성)', '직관 (인성)', '설계 (재성)', '영감 (인성)', '아이디어 (식상)'],
        outward: [
            // 의지력: 비겁(self) + 금(metal) + 실행력
            Math.round(selfScore * 0.4 + metalScore * 0.3 + stats.execution * 0.3),
            // 감정: 식상(output) + 화(fire) + 공감력
            Math.round(outputScore * 0.4 + fireScore * 0.3 + stats.empathy * 0.3),
            // 생명력: 비겁(self) + 목(wood) + 공감(신체 활력)
            Math.round(selfScore * 0.3 + woodScore * 0.5 + stats.empathy * 0.2),
            // 추진력: 관성(power) + 금/화(실행 돌파) + 실행력
            Math.round(powerScore * 0.4 + Math.max(metalScore, fireScore) * 0.3 + stats.execution * 0.3),
            // 직관: 인성(resource) + 수(water) + 창의성
            Math.round(resourceScore * 0.4 + waterScore * 0.4 + stats.creativity * 0.2),
            // 설계: 재성(wealth) + 토(earth) + 재물운
            Math.round(wealthScore * 0.4 + earthScore * 0.3 + stats.wealth * 0.3),
            // 영감: 인성(resource) + 수/화(정신 에너지) + 창의성
            Math.round(resourceScore * 0.3 + Math.max(waterScore, fireScore) * 0.4 + stats.creativity * 0.3),
            // 아이디어: 식상(output) + 목(wood) + 창의성
            Math.round(outputScore * 0.4 + woodScore * 0.3 + stats.creativity * 0.3),
        ],
        inward: [
            // 내면 의지력: 비겁(자아 안정) + 금(단단함) + 실행
            Math.min(100, Math.round(selfScore * 0.3 + metalScore * 0.5 + stats.execution * 0.2)),
            // 내면 감정: 식상(감성) + 화(열정 내면화) + 공감
            Math.min(100, Math.round(outputScore * 0.3 + fireScore * 0.5 + stats.empathy * 0.2)),
            // 내면 생명력: 목(뿌리성) + 비겁(신체 기초) + 공감
            Math.min(100, Math.round(selfScore * 0.4 + woodScore * 0.4 + stats.empathy * 0.2)),
            // 내면 추진력: 관성(규율) + 금/화(절제 통제) + 실행
            Math.min(100, Math.round(powerScore * 0.3 + metalScore * 0.4 + stats.execution * 0.3)),
            // 내면 직관: 인성(사색) + 수(명상적 지혜) + 창의
            Math.min(100, Math.round(resourceScore * 0.5 + waterScore * 0.3 + stats.creativity * 0.2)),
            // 내면 설계: 재성(꼼꼼함) + 토(뿌리 내림) + 재물
            Math.min(100, Math.round(wealthScore * 0.3 + earthScore * 0.5 + stats.wealth * 0.2)),
            // 내면 영감: 인성(학문/수용) + 수(통찰력) + 창의
            Math.min(100, Math.round(resourceScore * 0.4 + waterScore * 0.4 + stats.creativity * 0.2)),
            // 내면 아이디어: 식상(사유) + 목(구상) + 창의
            Math.min(100, Math.round(outputScore * 0.3 + woodScore * 0.5 + stats.creativity * 0.2)),
        ],
    };

    // Talent Profile: 업무 성향 프로필
    const talentProfile = {
        transformation: Math.round(outputScore * 0.5 + fireScore * 0.2 + stats.creativity * 0.3),
        dissemination: Math.round(selfScore * 0.3 + outputScore * 0.4 + stats.empathy * 0.3),
        contact: Math.round(wealthScore * 0.4 + fireScore * 0.2 + stats.empathy * 0.4),
        realization: Math.round(powerScore * 0.5 + metalScore * 0.2 + stats.execution * 0.3),
        development: Math.round(resourceScore * 0.4 + earthScore * 0.3 + stats.wealth * 0.3),
        analysis: Math.round(wealthScore * 0.3 + waterScore * 0.4 + stats.creativity * 0.3),
    };

    // Cooperation Profile: 협력 스타일
    const cooperationProfile = {
        largeOrganization: Math.round(powerScore * 0.5 + earthScore * 0.2 + stats.leadership * 0.3),
        networks: Math.round(selfScore * 0.4 + wealthScore * 0.4 + stats.empathy * 0.2),
        communities: Math.round(selfScore * 0.3 + resourceScore * 0.4 + stats.empathy * 0.3),
        partnership: Math.round(wealthScore * 0.5 + waterScore * 0.2 + stats.empathy * 0.3),
        autonomous: Math.round(selfScore * 0.5 + metalScore * 0.2 + stats.execution * 0.3),
        flexible: Math.round(outputScore * 0.4 + waterScore * 0.4 + stats.creativity * 0.2),
    };

    // Powerbase: 조직 기여 에너지
    const powerbase = {
        communication: Math.round(outputScore * 0.4 + fireScore * 0.2 + stats.empathy * 0.4),
        innovation: Math.round(outputScore * 0.3 + waterScore * 0.3 + stats.creativity * 0.4),
        management: Math.round(powerScore * 0.4 + earthScore * 0.2 + stats.leadership * 0.4),
        marketSuccess: Math.round(wealthScore * 0.4 + metalScore * 0.2 + stats.execution * 0.4),
        sustainability: Math.round(resourceScore * 0.4 + earthScore * 0.3 + stats.wealth * 0.3),
        structure: Math.round(powerScore * 0.4 + metalScore * 0.3 + stats.execution * 0.3),
    };

    // 가장 높은 파워베이스로 팀 역할 결정
    const powerbaseEntries = Object.entries(powerbase) as [keyof typeof powerbase, number][];
    const topPowerbase = powerbaseEntries.sort((a, b) => b[1] - a[1])[0][0];

    const teamRoleMap: Record<string, { role: any; description: string }> = {
        communication: { role: 'TEAM_SUPPORTER', description: '소통과 상호작용을 촉진하는 연결자' },
        innovation: { role: 'CREATIVE_INNOVATOR', description: '혁신과 변화를 이끄는 창조자' },
        management: { role: 'STRATEGIC_LEADER', description: '체계적인 관리와 운영의 달인' },
        marketSuccess: { role: 'EXECUTION_DRIVER', description: '목표를 향해 달려가는 실행가' },
        sustainability: { role: 'ANALYTICAL_EXPERT', description: '지속가능한 성장을 설계하는 분석가' },
        structure: { role: 'RELATIONSHIP_BUILDER', description: '신뢰와 구조를 쌓아가는 건축가' },
    };

    const { role: teamRole, description: teamRoleDescription } = teamRoleMap[topPowerbase];

    // 4대 핵심 강점 (오행과 십성 가중치를 조합하여 사용자 사주에 최적화된 4대 핵심 역량을 동적 선별)
    const talentCandidates = [
        { text: '신념에 기반한 주체적 돌파력', weight: selfScore * 30 + woodScore * 0.5 + metalScore * 0.5 },
        { text: '독립적 목표 완수와 자율성', weight: selfScore * 30 + metalScore * 0.8 },
        { text: '창의적 아이디어 및 기획 능력', weight: outputScore * 30 + woodScore * 0.8 },
        { text: '임기응변과 유연한 즉흥 대처', weight: outputScore * 25 + fireScore * 0.5 + waterScore * 0.5 },
        { text: '치밀한 자원 관리 및 설계 역량', weight: wealthScore * 30 + earthScore * 0.8 },
        { text: '비즈니스적 성과 창출 직관력', weight: wealthScore * 30 + metalScore * 0.5 + fireScore * 0.5 },
        { text: '책임감과 신뢰의 위기 극복력', weight: powerScore * 30 + metalScore * 0.8 },
        { text: '조직 질서와 균형 조율 능력', weight: powerScore * 25 + earthScore * 0.5 + metalScore * 0.5 },
        { text: '본질을 꿰뚫는 통찰과 분석력', weight: resourceScore * 30 + waterScore * 0.8 },
        { text: '내면 성찰과 강한 멘탈 회복력', weight: resourceScore * 25 + waterScore * 0.5 + earthScore * 0.5 }
    ];

    const specificTalents = talentCandidates
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 4)
        .map(item => item.text);

    return {
        forceField,
        talentProfile,
        cooperationProfile,
        powerbase,
        teamRole,
        teamRoleDescription,
        specificTalents,
        leadershipStyle: elements.fire > elements.water ? 'CONFIDENT / 주도적 의사결정' : 'ANALYTICAL / 신중한 성찰',
        motivation: elements.metal > elements.wood ? '지적인 안정과 보안 확보' : '열정적인 변화와 혁신 지향',
    };
}

export default function StrengthReportContainer() {
    const router = useRouter();
    const { reportData } = useReportStore();

    // 모달 상태 관리
    const [modalState, setModalState] = useState<ModalState>(INITIAL_MODAL_STATE);

    const openModal = (
        category: ModalState['category'],
        itemKey: string,
        itemLabel: string,
        itemValue: number
    ) => {
        setModalState({ isOpen: true, category, itemKey, itemLabel, itemValue });
    };

    const closeModal = () => {
        setModalState(INITIAL_MODAL_STATE);
    };

    const handleDownloadPDF = () => {
        window.print();
    };

    // 데모 데이터 (reportData가 없을 때 사용)
    const demoReportData = {
        userName: '명심가',
        saju: {
            elements: { wood: 35, fire: 65, earth: 40, metal: 25, water: 45 },
            keywords: ['협력적 창조 능력', '새로운 시도의 용기', '관계 구축과 신뢰', '즉흥적 대처 능력']
        },
        stats: { creativity: 75, leadership: 60, empathy: 85, wealth: 55, execution: 70 }
    };

    // 데이터가 없으면 데모 데이터 사용
    const effectiveData = reportData || demoReportData;
    const strengthData = calculateStrengthData(effectiveData);

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden">
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    header {
                        display: none !important;
                    }
                    body, html, main {
                        background-color: #0A0A0F !important;
                        color: #ffffff !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    main {
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    .bg-white\\/5 {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                        background-color: rgba(255, 255, 255, 0.05) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    }
                }
            `}} />
            {/* Premium Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm">돌아가기</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <span className="text-lg font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                            강점/재능(인적자원) 리포트
                        </span>
                    </div>

                    <button 
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 hover:bg-amber-500/20 transition-colors text-sm"
                    >
                        <Download size={16} />
                        PDF 저장
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">

                {/* Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono mb-3">
                        <Sparkles size={13} className="text-amber-400 animate-pulse" />
                        <span>3세대 최신 심리 과학적 도구 & 기질 융합 역량 진단</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                        <span className="text-amber-400">{effectiveData.userName}</span>님의 강점/재능 리포트
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">당신만의 본질 에너지를 시각화하고 최적의 성장 스케일업을 도출합니다</p>
                    
                    {!reportData && (
                        <p className="text-xs text-amber-500/70 mt-2">📌 데모 모드: 실제 분석은 리포트 입력 후 확인하세요</p>
                    )}

                    {/* ━━━ 👑 세계 최고 360° AI 강점 심층 통찰 버튼 ━━━ */}
                    <div className="mt-6 flex justify-center">
                        <button
                            type="button"
                            onClick={() => openModal(
                                'forceField',
                                'total360',
                                `${effectiveData.userName}님의 세계 최고 360° 강점 심층 통찰 총평`,
                                98
                            )}
                            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-black text-sm md:text-base shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer border border-amber-300/40"
                        >
                            <Sparkles className="w-5 h-5 text-slate-950 animate-spin" style={{ animationDuration: '6s' }} />
                            <span>✨ [세계 최고 360° AI 강점 심층 통찰 보고서 받기]</span>
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">💡 개별 카드를 클릭하셔도 항목별 다각도 AI 심층 분석을 확인하실 수 있습니다.</p>
                </motion.div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Force Field (본질 에너지 포스필드) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <StrengthForceField data={strengthData.forceField} onItemClick={openModal} />
                    </motion.div>

                    {/* Right Column: Profiles */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <TalentProfileBars data={strengthData.talentProfile} onItemClick={openModal} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <CooperationProfile data={strengthData.cooperationProfile} onItemClick={openModal} />
                        </motion.div>
                    </div>
                </div>

                {/* Specific Talents Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12"
                >
                    <SpecificTalentCards talents={strengthData.specificTalents} onItemClick={openModal} />
                </motion.div>

                {/* Bottom Section: Powerbase + Role */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <PowerbaseDonut
                            data={strengthData.powerbase}
                            teamRole={strengthData.teamRole}
                            teamRoleDescription={strengthData.teamRoleDescription}
                            onItemClick={openModal}
                        />
                    </motion.div>

                    {/* Leadership & Motivation */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 cursor-pointer hover:border-amber-500/30 transition-colors"
                        onClick={() => openModal(
                            'forceField',
                            'leadership',
                            `리더십: ${strengthData.leadershipStyle}`,
                            strengthData.leadershipStyle.includes('CONFIDENT') ? 75 : 60
                        )}
                    >
                        <h3 className="text-lg font-bold text-white mb-6">나의 리더십 & 동기</h3>

                        <div className="space-y-6">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">MY LEADERSHIP STYLE</p>
                                <p className="text-xl font-bold text-amber-400">{strengthData.leadershipStyle}</p>
                            </div>

                            <div className="border-t border-white/10 pt-6">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">MY MOTIVATION</p>
                                <p className="text-lg text-white">{strengthData.motivation}</p>
                            </div>
                        </div>

                        <p className="text-[10px] text-amber-400 mt-4 text-center font-bold">👉 클릭하면 360° AI 리더십 심층 해설</p>
                    </motion.div>
                </div>

                {/* ━━━ 🎯 나의 강점 레버리지 3대 실행 로드맵 ━━━ */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-indigo-950/80 to-slate-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-400/40 text-amber-300">
                                <Sparkles className="w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">🎯 {effectiveData.userName}님을 위한 강점 레버리지 3대 실행 로드맵</h3>
                                <p className="text-xs text-gray-400">타고난 본질 에너지를 현실의 압도적 성과로 전환하는 최적 경로 (카드 터치 시 AI 심층 해설)</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* STEP 01 */}
                        <div
                            onClick={() => openModal(
                                'forceField',
                                'step01_scaleup',
                                `로드맵 STEP 01: 핵심 강점 스케일업 (${effectiveData.userName}님 맞춤형)`,
                                95
                            )}
                            className="p-5 rounded-2xl bg-white/5 hover:bg-amber-400/10 border border-white/10 hover:border-amber-400/50 space-y-2.5 transition-all transform hover:-translate-y-1 cursor-pointer group shadow-lg relative overflow-hidden"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">STEP 01</span>
                                <span className="text-[10px] text-amber-300 group-hover:underline font-bold">✨ AI 심층 분석 ➔</span>
                            </div>
                            <h4 className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors">핵심 강점 스케일업</h4>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                본질 포스필드에서 가장 높은 에너지 축을 직무 메인 미션에 100% 집중 배치하세요.
                            </p>
                            <p className="text-[10px] text-amber-400/80 pt-1 font-mono">👉 클릭 시 360° AI 가속 처방 호출</p>
                        </div>

                        {/* STEP 02 */}
                        <div
                            onClick={() => openModal(
                                'cooperation',
                                'step02_partnership',
                                `로드맵 STEP 02: 상보적 팀 파트너십 (${effectiveData.userName}님 맞춤형)`,
                                92
                            )}
                            className="p-5 rounded-2xl bg-white/5 hover:bg-indigo-400/10 border border-white/10 hover:border-indigo-400/50 space-y-2.5 transition-all transform hover:-translate-y-1 cursor-pointer group shadow-lg relative overflow-hidden"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded border border-indigo-400/30">STEP 02</span>
                                <span className="text-[10px] text-indigo-300 group-hover:underline font-bold">✨ AI 심층 분석 ➔</span>
                            </div>
                            <h4 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">상보적 팀 파트너십</h4>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                내가 취약한 에너지를 보완해 줄 수 있는 파트너와 협력 구조를 형성하세요.
                            </p>
                            <p className="text-[10px] text-indigo-400/80 pt-1 font-mono">👉 클릭 시 360° AI 시너지 처방 호출</p>
                        </div>

                        {/* STEP 03 */}
                        <div
                            onClick={() => openModal(
                                'talentProfile',
                                'step03_metacognition',
                                `로드맵 STEP 03: 1분 메타인지 리셋 (${effectiveData.userName}님 맞춤형)`,
                                96
                            )}
                            className="p-5 rounded-2xl bg-white/5 hover:bg-emerald-400/10 border border-white/10 hover:border-emerald-400/50 space-y-2.5 transition-all transform hover:-translate-y-1 cursor-pointer group shadow-lg relative overflow-hidden"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/30">STEP 03</span>
                                <span className="text-[10px] text-emerald-300 group-hover:underline font-bold">✨ AI 심층 분석 ➔</span>
                            </div>
                            <h4 className="text-sm font-bold text-white group-hover:text-emerald-200 transition-colors">1분 메타인지 리셋</h4>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                스트레스 발생 시 인지 탈융합 성찰로 다크코드를 해제하고 본래의 맑은 상태를 유지하세요.
                            </p>
                            <p className="text-[10px] text-emerald-400/80 pt-1 font-mono">👉 클릭 시 360° AI 리셋 처방 호출</p>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Tagline */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-12 pb-8"
                >
                    <p className="text-gray-500 text-sm">
                        Powered by <span className="text-amber-400 font-bold">명심코칭</span> · 3세대 최신 심리 과학적 도구 & 사주명리학 기질 기반 과학적 역량 분석
                    </p>
                </motion.div>
            </main>

            {/* ━━━ Gemini AI 상세 해설 모달 ━━━ */}
            <StrengthExplainModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                category={modalState.category}
                itemKey={modalState.itemKey}
                itemLabel={modalState.itemLabel}
                itemValue={modalState.itemValue}
            />
        </div>
    );
}
