'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SajuWongukCard - 프리미엄 사주 원국 카드
 * 
 * 특징:
 * - 글래스모피즘 디자인
 * - 오행 그라데이션 색상
 * - 터치 인터랙션
 * - 사주 데이터 연동
 */

// 오행 그라데이션 스타일
const ELEMENT_GRADIENTS: Record<string, string> = {
    '목': 'bg-gradient-to-br from-emerald-500 to-green-400',
    '화': 'bg-gradient-to-br from-red-500 to-pink-500',
    '토': 'bg-gradient-to-br from-amber-500 to-yellow-400',
    '금': 'bg-gradient-to-br from-gray-400 to-slate-500',
    '수': 'bg-gradient-to-br from-cyan-500 to-blue-400',
    'wood': 'bg-gradient-to-br from-emerald-500 to-green-400',
    'fire': 'bg-gradient-to-br from-red-500 to-pink-500',
    'earth': 'bg-gradient-to-br from-amber-500 to-yellow-400',
    'metal': 'bg-gradient-to-br from-gray-400 to-slate-500',
    'water': 'bg-gradient-to-br from-cyan-500 to-blue-400',
};

const ELEMENT_SHADOWS: Record<string, string> = {
    '목': 'shadow-emerald-500/40',
    '화': 'shadow-red-500/40',
    '토': 'shadow-amber-500/40',
    '금': 'shadow-gray-400/40',
    '수': 'shadow-cyan-500/40',
    'wood': 'shadow-emerald-500/40',
    'fire': 'shadow-red-500/40',
    'earth': 'shadow-amber-500/40',
    'metal': 'shadow-gray-400/40',
    'water': 'shadow-cyan-500/40',
};

const ELEMENT_ICONS: Record<string, string> = {
    '목': '🌿',
    '화': '🔥',
    '토': '⛰️',
    '금': '⚔️',
    '수': '💧',
};

const PILLAR_LABELS: Record<string, string> = {
    'hour': '시주',
    'time': '시주',
    'day': '일주',
    'month': '월주',
    'year': '연주',
};

interface PillarData {
    gan: { char: string; element?: string };
    ji: { char: string; element?: string };
    stemTenGod?: string;
    branchTenGod?: string;
}

interface SajuWongukCardProps {
    userProfile?: any;
    onEditBirthdate?: () => void;
    onAnalyze?: () => void;
}

// 개별 기둥 컴포넌트
const PillarColumn = ({
    label,
    pillar,
    isMain = false,
    onTap
}: {
    label: string;
    pillar: PillarData;
    isMain?: boolean;
    onTap?: () => void;
}) => {
    const ganElement = pillar.gan?.element || '목';
    const jiElement = pillar.ji?.element || '토';

    const ganGradient = ELEMENT_GRADIENTS[ganElement] || ELEMENT_GRADIENTS['목'];
    const jiGradient = ELEMENT_GRADIENTS[jiElement] || ELEMENT_GRADIENTS['토'];
    const ganShadow = ELEMENT_SHADOWS[ganElement] || ELEMENT_SHADOWS['목'];
    const jiShadow = ELEMENT_SHADOWS[jiElement] || ELEMENT_SHADOWS['토'];

    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onTap}
            className={`
                flex flex-col gap-2 p-2 rounded-2xl 
                bg-white/5 border border-white/10 
                backdrop-blur-sm cursor-pointer
                hover:bg-white/10 transition-all duration-300
                ${isMain ? 'ring-2 ring-purple-500/50 ring-offset-2 ring-offset-transparent' : ''}
            `}
        >
            {/* 일주 표시 마커 */}
            {isMain && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-purple-500 rounded-b-lg shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
            )}

            {/* 기둥 레이블 */}
            <div className="text-center mb-1">
                <span className="text-xs font-serif text-purple-400 font-semibold tracking-widest">
                    {PILLAR_LABELS[label] || label}
                </span>
            </div>

            {/* 천간 */}
            <div className="flex flex-col items-center">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`
                        w-14 h-14 sm:w-16 sm:h-16 rounded-2xl 
                        ${ganGradient} 
                        flex items-center justify-center 
                        shadow-lg ${ganShadow}
                        relative overflow-hidden
                        ${isMain ? 'border-2 border-purple-400/50' : ''}
                    `}
                >
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity" />
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white drop-shadow-lg">
                        {pillar.gan?.char || '?'}
                    </span>
                </motion.div>
                <div className="mt-2 flex items-center gap-1">
                    <span className="text-[10px]">{ELEMENT_ICONS[ganElement] || '⚪'}</span>
                    <span className={`text-[10px] ${isMain ? 'font-bold text-purple-400' : 'text-gray-400'}`}>
                        {isMain ? '본원' : (pillar.stemTenGod || '-')}
                    </span>
                </div>
            </div>

            {/* 지지 */}
            <div className="flex flex-col items-center mt-2">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`
                        w-14 h-14 sm:w-16 sm:h-16 rounded-2xl 
                        ${jiGradient} 
                        flex items-center justify-center 
                        shadow-lg ${jiShadow}
                        relative overflow-hidden
                    `}
                >
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity" />
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white drop-shadow-lg">
                        {pillar.ji?.char || '?'}
                    </span>
                </motion.div>
                <div className="mt-2 flex items-center gap-1">
                    <span className="text-[10px]">{ELEMENT_ICONS[jiElement] || '⚪'}</span>
                    <span className="text-[10px] text-gray-400">
                        {pillar.branchTenGod || '-'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default function SajuWongukCard({
    userProfile,
    onEditBirthdate,
    onAnalyze
}: SajuWongukCardProps) {
    const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

    // 사주 데이터 추출 (pillars 또는 fourPillars 지원)
    const pillars = userProfile?.saju?.pillars || userProfile?.saju?.fourPillars;

    // 데모 데이터
    const demoPillars = {
        hour: { gan: { char: '정', element: '화' }, ji: { char: '미', element: '토' }, stemTenGod: '식신', branchTenGod: '편재' },
        day: { gan: { char: '을', element: '목' }, ji: { char: '축', element: '토' }, stemTenGod: '본원', branchTenGod: '편재' },
        month: { gan: { char: '병', element: '화' }, ji: { char: '인', element: '목' }, stemTenGod: '상관', branchTenGod: '겁재' },
        year: { gan: { char: '갑', element: '목' }, ji: { char: '자', element: '수' }, stemTenGod: '겁재', branchTenGod: '편인' },
    };

    // 실제 데이터 또는 데모 데이터 사용
    // [Fix] SajuCalculator stores element in 'label' field, not 'element'
    const effectivePillars = pillars ? {
        hour: {
            gan: {
                char: pillars.time?.gan?.char || pillars.hour?.stem || '?',
                element: pillars.time?.gan?.label || pillars.time?.gan?.element || pillars.hour?.stemElement || '목'
            },
            ji: {
                char: pillars.time?.ji?.char || pillars.hour?.branch || '?',
                element: pillars.time?.ji?.label || pillars.time?.ji?.element || pillars.hour?.branchElement || '토'
            },
            stemTenGod: pillars.hour?.stemTenGod || '',
            branchTenGod: pillars.hour?.branchTenGod || '',
        },
        day: {
            gan: {
                char: pillars.day?.gan?.char || pillars.day?.stem || '?',
                element: pillars.day?.gan?.label || pillars.day?.gan?.element || pillars.day?.stemElement || '목'
            },
            ji: {
                char: pillars.day?.ji?.char || pillars.day?.branch || '?',
                element: pillars.day?.ji?.label || pillars.day?.ji?.element || pillars.day?.branchElement || '토'
            },
            stemTenGod: '본원',
            branchTenGod: pillars.day?.branchTenGod || '',
        },
        month: {
            gan: {
                char: pillars.month?.gan?.char || pillars.month?.stem || '?',
                element: pillars.month?.gan?.label || pillars.month?.gan?.element || pillars.month?.stemElement || '화'
            },
            ji: {
                char: pillars.month?.ji?.char || pillars.month?.branch || '?',
                element: pillars.month?.ji?.label || pillars.month?.ji?.element || pillars.month?.branchElement || '목'
            },
            stemTenGod: pillars.month?.stemTenGod || '',
            branchTenGod: pillars.month?.branchTenGod || '',
        },
        year: {
            gan: {
                char: pillars.year?.gan?.char || pillars.year?.stem || '?',
                element: pillars.year?.gan?.label || pillars.year?.gan?.element || pillars.year?.stemElement || '목'
            },
            ji: {
                char: pillars.year?.ji?.char || pillars.year?.branch || '?',
                element: pillars.year?.ji?.label || pillars.year?.ji?.element || pillars.year?.branchElement || '수'
            },
            stemTenGod: pillars.year?.stemTenGod || '',
            branchTenGod: pillars.year?.branchTenGod || '',
        },
    } : demoPillars;

    // 일주 정보로 분석 요약 생성
    const dayMasterChar = effectivePillars.day.gan.char;
    const dayMasterElement = effectivePillars.day.gan.element;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            {/* 글래스 패널 컨테이너 */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 shadow-2xl relative overflow-hidden">
                {/* 배경 글로우 효과 */}
                <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-[60px] opacity-20 pointer-events-none" />

                {/* 헤더 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 relative z-10">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                            🏛️ 사주 원국
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 pl-7">
                            터치하여 상세 정보 확인
                        </p>
                    </div>

                    <div className="flex gap-2 self-end sm:self-auto w-full sm:w-auto">
                        {onEditBirthdate && (
                            <button
                                onClick={onEditBirthdate}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-full border border-gray-600 bg-black/20 text-xs text-gray-300 hover:bg-gray-700 transition-all"
                            >
                                ✏️ 생년월일 수정
                            </button>
                        )}
                        {onAnalyze && (
                            <button
                                onClick={onAnalyze}
                                className="flex-1 sm:flex-none px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-300 text-xs font-bold hover:bg-purple-500/30 transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                            >
                                팔자 분석
                            </button>
                        )}
                    </div>
                </div>

                {/* 4주 그리드 */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3 relative z-10">
                    <PillarColumn
                        label="hour"
                        pillar={effectivePillars.hour}
                        onTap={() => setSelectedPillar('hour')}
                    />
                    <PillarColumn
                        label="day"
                        pillar={effectivePillars.day}
                        isMain={true}
                        onTap={() => setSelectedPillar('day')}
                    />
                    <PillarColumn
                        label="month"
                        pillar={effectivePillars.month}
                        onTap={() => setSelectedPillar('month')}
                    />
                    <PillarColumn
                        label="year"
                        pillar={effectivePillars.year}
                        onTap={() => setSelectedPillar('year')}
                    />
                </div>

                {/* 구분선 */}
                <div className="mt-6 flex justify-center">
                    <div className="h-1 w-12 rounded-full bg-gray-700" />
                </div>
            </div>

            {/* 분석 요약 카드 */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
            >
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                        ✨
                    </div>
                    <div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            본원(일간)인 <span className={`font-bold ${getElementColor(dayMasterElement)}`}>
                                {dayMasterChar}{getElementKorean(dayMasterElement)}
                            </span>은(는) {getElementDescription(dayMasterElement)}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* 데모 모드 표시 */}
            {!pillars && (
                <div className="mt-3 text-center">
                    <span className="text-xs text-amber-500/70">
                        📌 데모 모드: 실제 분석은 생년월일 입력 후 확인하세요
                    </span>
                </div>
            )}
        </motion.div>
    );
}

// 헬퍼 함수들
function getElementColor(element: string): string {
    const colors: Record<string, string> = {
        '목': 'text-emerald-400',
        '화': 'text-red-400',
        '토': 'text-amber-400',
        '금': 'text-gray-300',
        '수': 'text-cyan-400',
        'wood': 'text-emerald-400',
        'fire': 'text-red-400',
        'earth': 'text-amber-400',
        'metal': 'text-gray-300',
        'water': 'text-cyan-400',
    };
    return colors[element] || 'text-white';
}

function getElementKorean(element: string): string {
    const korean: Record<string, string> = {
        '목': '목(木)',
        '화': '화(火)',
        '토': '토(土)',
        '금': '금(金)',
        '수': '수(水)',
        'wood': '목(木)',
        'fire': '화(火)',
        'earth': '토(土)',
        'metal': '금(金)',
        'water': '수(水)',
    };
    return korean[element] || '';
}

function getElementDescription(element: string): string {
    const descriptions: Record<string, string> = {
        '목': '유연하고 적응력이 뛰어나며, 성장과 발전을 추구하는 성향을 가집니다.',
        '화': '열정적이고 표현력이 좋으며, 밝은 에너지로 주변을 이끄는 성향을 가집니다.',
        '토': '포용력이 있고 신뢰감을 주며, 안정적인 기반을 만드는 성향을 가집니다.',
        '금': '결단력이 있고 원칙을 중시하며, 정확함과 의리를 추구하는 성향을 가집니다.',
        '수': '지혜롭고 통찰력이 뛰어나며, 깊은 사고와 유연한 대처 능력을 가집니다.',
        'wood': '유연하고 적응력이 뛰어나며, 성장과 발전을 추구하는 성향을 가집니다.',
        'fire': '열정적이고 표현력이 좋으며, 밝은 에너지로 주변을 이끄는 성향을 가집니다.',
        'earth': '포용력이 있고 신뢰감을 주며, 안정적인 기반을 만드는 성향을 가집니다.',
        'metal': '결단력이 있고 원칙을 중시하며, 정확함과 의리를 추구하는 성향을 가집니다.',
        'water': '지혜롭고 통찰력이 뛰어나며, 깊은 사고와 유연한 대처 능력을 가집니다.',
    };
    return descriptions[element] || '독특한 에너지와 성향을 가집니다.';
}
