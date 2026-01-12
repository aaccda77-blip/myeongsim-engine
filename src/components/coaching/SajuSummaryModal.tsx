import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

interface SajuSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile: any;
    onStartChat: (intent: string) => void;
}

// Helper: 일간별 특성 매핑
const getDayMasterTrait = (stem: string) => {
    const traits: Record<string, string> = {
        '甲': '곧게 뻗은 나무처럼 성장과 시작을 주도하는 리더',
        '乙': '유연한 덩굴처럼 어디서든 살아남는 끈기의 적응가',
        '丙': '태양처럼 온 세상을 비추며 열정을 전파하는 아이콘',
        '丁': '촛불처럼 어둠을 밝히고 사람을 모으는 따뜻한 멘토',
        '戊': '거대한 산처럼 흔들리지 않는 신뢰와 포용의 중심',
        '己': '비옥한 땅처럼 만물을 길러내고 실속을 챙기는 현실가',
        '庚': '다듬어지지 않은 원석처럼 강한 신념과 의리의 혁명가',
        '辛': '잘 세공된 보석처럼 섬세하고 예리하며 완벽을 추구하는 장인',
        '壬': '드넓은 바다처럼 지혜롭고 유연하게 흐르는 전략가',
        '癸': '봄비처럼 조용히 스며들어 생명을 키우는 감성 지성인'
    };
    // 한자만 추출 (예: '甲(갑목)' -> '甲')
    const key = stem.charAt(0);
    return traits[key] || '무한한 잠재력을 가진 미지의 탐험가';
};

// Helper: 오행 계산 (간이)
const calculateOhaeng = (ganji: any) => {
    // 천간/지지 오행 매핑
    const elementMap: Record<string, string> = {
        '甲': 'wood', '乙': 'wood', '寅': 'wood', '卯': 'wood',
        '丙': 'fire', '丁': 'fire', '巳': 'fire', '午': 'fire',
        '戊': 'earth', '己': 'earth', '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth',
        '庚': 'metal', '辛': 'metal', '申': 'metal', '酉': 'metal',
        '壬': 'water', '癸': 'water', '子': 'water', '亥': 'water'
    };

    const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    const pillars = [ganji.year, ganji.month, ganji.day, ganji.hour];

    pillars.forEach(p => {
        if (!p) return;
        const stemEl = elementMap[p.stem?.charAt(0)];
        const branchEl = elementMap[p.branch?.charAt(0)];
        if (stemEl) counts[stemEl as keyof typeof counts]++;
        if (branchEl) counts[branchEl as keyof typeof counts]++;
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return {
        wood: Math.round((counts.wood / total) * 100),
        fire: Math.round((counts.fire / total) * 100),
        earth: Math.round((counts.earth / total) * 100),
        metal: Math.round((counts.metal / total) * 100),
        water: Math.round((counts.water / total) * 100),
        raw: counts
    };
};

export default function SajuSummaryModal({ isOpen, onClose, userProfile, onStartChat }: SajuSummaryModalProps) {
    if (!isOpen) return null;

    const saju = userProfile?.saju || {};

    // Safety check: Ensure pillar objects exist
    // [Fix] Data Structure Mismatch Resolution: Map 'fourPillars' (ReportData) to 'saju' (Component)
    const ganji = useMemo(() => {
        const pillars = saju.fourPillars || {};
        const mapPillar = (p: any, type: string) => ({
            stem: p?.gan || '?',
            branch: p?.ji || '?',
            // TODO: Implement proper TenGod calculation if missing in data
            tenGod: p?.tenGod || (type === 'day' ? 'Me' : '-'),
            ganColor: p?.ganColor,
            jiColor: p?.jiColor
        });

        return {
            year: mapPillar(pillars.year, 'year'),
            month: mapPillar(pillars.month, 'month'),
            day: mapPillar(pillars.day, 'day'),
            hour: mapPillar(pillars.time, 'hour'), // ReportData uses 'time', component used 'hour'
        };
    }, [saju]);

    const ohaeng = useMemo(() => calculateOhaeng(ganji), [ganji]);
    const dayMasterDesc = getDayMasterTrait(ganji.day.stem);

    // Dynamic coloring helper
    const getPowerLabel = (percent: number) => {
        if (percent > 40) return { text: '과다', color: 'text-red-400' };
        if (percent < 15) return { text: '약함', color: 'text-gray-500' };
        return { text: '적정', color: 'text-green-400' };
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="bg-[#1a1a2e] w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-2xl sm:rounded-2xl border border-purple-500/20 shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        📊 나의 사주 핵심 요약
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">

                    {/* 1. 4주 8자 시각화 */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="space-y-2">
                            <span className="text-xs text-gray-500">시주(말년)</span>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <div className="text-xl font-bold text-gray-300">{ganji.hour.stem}</div>
                                <div className="text-xl font-bold text-gray-300">{ganji.hour.branch}</div>
                                <div className="text-[10px] text-gray-400 mt-1">{ganji.hour.tenGod}</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs text-purple-400 font-bold">일주(본원)</span>
                            <div className="bg-purple-900/30 p-3 rounded-xl border border-purple-500/50 relative overflow-hidden">
                                <div className="absolute inset-0 bg-purple-500/10 animate-pulse"></div>
                                <div className="text-xl font-bold text-white relative z-10">{ganji.day.stem}</div>
                                <div className="text-xl font-bold text-white relative z-10">{ganji.day.branch}</div>
                                <div className="text-[10px] text-purple-300 mt-1 relative z-10">Me</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs text-gray-500">월주(사회)</span>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <div className="text-xl font-bold text-gray-300">{ganji.month.stem}</div>
                                <div className="text-xl font-bold text-gray-300">{ganji.month.branch}</div>
                                <div className="text-[10px] text-gray-400 mt-1">{ganji.month.tenGod}</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs text-gray-500">년주(뿌리)</span>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <div className="text-xl font-bold text-gray-300">{ganji.year.stem}</div>
                                <div className="text-xl font-bold text-gray-300">{ganji.year.branch}</div>
                                <div className="text-[10px] text-gray-400 mt-1">{ganji.year.tenGod}</div>
                            </div>
                        </div>
                    </div>

                    {/* 2. 핵심 요약 텍스트 (Dynamic) */}
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <h3 className="text-sm font-bold text-purple-300 mb-2">💎 당신의 타고난 기질 (Blueprint)</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            당신은 <span className="text-white font-bold">'{ganji.day.stem}'</span> 일간으로 태어났습니다.
                            {dayMasterDesc}입니다.
                            {ganji.month.branch && ` 월지(${ganji.month.branch})의 영향으로 사회적 환경과의 조화도 중요하게 작용합니다.`}
                        </p>
                    </div>

                    {/* 3. 오행 균형 (Dynamic Visualization) */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-white">오행 에너지 분포</h3>
                        <div className="space-y-2">
                            {/* 목(Wood) */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-green-400 w-4">목</span>
                                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: `${ohaeng.wood}%` }}></div>
                                </div>
                                <span className={`text-xs ${getPowerLabel(ohaeng.wood).color}`}>{getPowerLabel(ohaeng.wood).text}</span>
                            </div>
                            {/* 화(Fire) */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-red-400 w-4">화</span>
                                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500" style={{ width: `${ohaeng.fire}%` }}></div>
                                </div>
                                <span className={`text-xs ${getPowerLabel(ohaeng.fire).color}`}>{getPowerLabel(ohaeng.fire).text}</span>
                            </div>
                            {/* 토(Earth) */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-yellow-400 w-4">토</span>
                                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500" style={{ width: `${ohaeng.earth}%` }}></div>
                                </div>
                                <span className={`text-xs ${getPowerLabel(ohaeng.earth).color}`}>{getPowerLabel(ohaeng.earth).text}</span>
                            </div>
                            {/* 금(Metal) */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white w-4">금</span>
                                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-300" style={{ width: `${ohaeng.metal}%` }}></div>
                                </div>
                                <span className={`text-xs ${getPowerLabel(ohaeng.metal).color}`}>{getPowerLabel(ohaeng.metal).text}</span>
                            </div>
                            {/* 수(Water) */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-blue-400 w-4">수</span>
                                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${ohaeng.water}%` }}></div>
                                </div>
                                <span className={`text-xs ${getPowerLabel(ohaeng.water).color}`}>{getPowerLabel(ohaeng.water).text}</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            * 입력하신 생년월일시를 바탕으로 분석된 에너지 분포입니다.
                        </p>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="p-4 border-t border-white/10 bg-white/5">
                    <button
                        onClick={() => {
                            onClose();
                            onStartChat('day_master_deep'); // 일간 심층 분석으로 연결
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-purple-500/30"
                    >
                        <MessageCircle size={18} />
                        AI 코드 코치와 대화 시작하기
                    </button>
                    <p className="text-[10px] text-gray-500 text-center mt-2">
                        당신의 잠재력을 깨우는 108가지 자각의 대화를 시작해보세요.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
