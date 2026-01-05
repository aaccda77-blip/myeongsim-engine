'use client';

import React from 'react';
import { motion } from 'framer-motion';
import StrengthForceField from './StrengthForceField';
import TalentProfileBars from './TalentProfileBars';
import CooperationProfile from './CooperationProfile';
import PowerbaseDonut from './PowerbaseDonut';
import SpecificTalentCards from './SpecificTalentCards';
import { useReportStore } from '@/store/useReportStore';
import { StrengthReportData } from '@/types/strength-report';
import { ArrowLeft, Download, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * [Myeongsim Branding]
 * 강점/재능 (인적자원) 리포트 브랜딩
 * Force Field -> 본질 에너지 포스필드
 */

// 사주 데이터로부터 강점/재능 리포트 데이터 계산
function calculateStrengthData(reportData: any): StrengthReportData {
    const { saju, stats } = reportData;
    const elements = saju?.elements || { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };

    // Force Field: 8각 레이더 데이터 (오행 기반 매핑)
    const forceField = {
        axisLabels: ['의지력', '감정', '생명력', '추진력', '직관', '설계', '영감', '아이디어'],
        outward: [
            Math.min(100, elements.metal + elements.wood * 0.5),
            Math.min(100, elements.fire + elements.water * 0.3),
            Math.min(100, elements.fire + elements.wood * 0.5),
            Math.min(100, elements.metal + elements.fire * 0.4),
            Math.min(100, elements.water + elements.earth * 0.3),
            Math.min(100, elements.earth + elements.metal * 0.4),
            Math.min(100, elements.water + elements.fire * 0.3),
            Math.min(100, elements.wood + elements.water * 0.4),
        ],
        inward: [
            Math.min(100, elements.metal * 0.8),
            Math.min(100, elements.fire * 0.9),
            Math.min(100, elements.fire * 0.7 + elements.wood * 0.3),
            Math.min(100, elements.metal * 0.6 + elements.fire * 0.3),
            Math.min(100, elements.water * 0.9),
            Math.min(100, elements.earth * 0.8),
            Math.min(100, elements.water * 0.7 + elements.fire * 0.2),
            Math.min(100, elements.wood * 0.8 + elements.water * 0.2),
        ],
    };

    // Talent Profile: 재능 막대 그래프
    const talentProfile = {
        transformation: Math.min(100, elements.fire * 0.8 + elements.water * 0.4),
        dissemination: Math.min(100, elements.wood * 0.7 + elements.fire * 0.3),
        contact: Math.min(100, elements.fire * 0.6 + elements.earth * 0.4),
        realization: Math.min(100, elements.metal * 0.7 + elements.fire * 0.5),
        development: Math.min(100, elements.earth * 0.6 + elements.metal * 0.5),
        analysis: Math.min(100, elements.water * 0.8 + elements.metal * 0.3),
    };

    // Cooperation Profile: 협력 스타일
    const cooperationProfile = {
        largeOrganization: Math.min(100, elements.earth * 0.8 + elements.metal * 0.3),
        networks: Math.min(100, elements.fire * 0.7 + elements.wood * 0.4),
        communities: Math.min(100, elements.fire * 0.5 + elements.earth * 0.5),
        partnership: Math.min(100, elements.water * 0.6 + elements.metal * 0.4),
        autonomous: Math.min(100, elements.wood * 0.8 + elements.metal * 0.2),
        flexible: Math.min(100, elements.water * 0.7 + elements.wood * 0.3),
    };

    // Powerbase: 조직 기여 에너지
    const powerbase = {
        communication: Math.min(100, elements.fire * 0.9 + elements.wood * 0.3),
        innovation: Math.min(100, elements.water * 0.7 + elements.fire * 0.4),
        management: Math.min(100, elements.earth * 0.8 + elements.metal * 0.3),
        marketSuccess: Math.min(100, elements.metal * 0.7 + elements.fire * 0.4),
        sustainability: Math.min(100, elements.earth * 0.7 + elements.water * 0.3),
        structure: Math.min(100, elements.metal * 0.8 + elements.earth * 0.3),
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

    // 4대 핵심 강점 (키워드에서 추출 또는 기본값)
    const specificTalents = saju?.keywords?.slice(0, 4) || [
        '협력적 창조 능력',
        '새로운 시도의 용기',
        '관계 구축과 신뢰',
        '즉흥적 대처 능력',
    ];

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

                    <button className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 hover:bg-amber-500/20 transition-colors text-sm">
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
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                        <span className="text-amber-400">{effectiveData.userName}</span>님의 강점/재능 리포트
                    </h1>
                    <p className="text-gray-400">당신만의 본질 에너지를 시각화합니다</p>
                    {!reportData && (
                        <p className="text-xs text-amber-500/70 mt-2">📌 데모 모드: 실제 분석은 리포트 입력 후 확인하세요</p>
                    )}
                </motion.div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Force Field (본질 에너지 포스필드) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <StrengthForceField data={strengthData.forceField} />
                    </motion.div>

                    {/* Right Column: Profiles */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <TalentProfileBars data={strengthData.talentProfile} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <CooperationProfile data={strengthData.cooperationProfile} />
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
                    <SpecificTalentCards talents={strengthData.specificTalents} />
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
                        />
                    </motion.div>

                    {/* Leadership & Motivation */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
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
                    </motion.div>
                </div>

                {/* Footer Tagline */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-16 pb-8"
                >
                    <p className="text-gray-500 text-sm">
                        Powered by <span className="text-amber-400">명심코칭</span> · 사주 기반 과학적 역량 분석
                    </p>
                </motion.div>
            </main>
        </div>
    );
}
