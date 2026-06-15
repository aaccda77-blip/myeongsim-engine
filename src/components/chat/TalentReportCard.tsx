'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Briefcase, Sparkles, Target, Zap, X, Heart, Eye } from 'lucide-react';

interface TalentReportCardProps {
    data: {
        coreStrength: {
            title: string;
            description: string;
        };
        keywords: string[];
        jobAptitude: string[];
        elements: {
            wood: number;
            fire: number;
            earth: number;
            metal: number;
            water: number;
        };
    };
    saju?: any;
}

type ElementKey = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export default function TalentReportCard({ data, saju }: TalentReportCardProps) {
    const {
        coreStrength = { title: '분석 중...', description: '데이터를 불러오는 중입니다.' },
        keywords = [],
        jobAptitude = [],
        elements = { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 }
    } = data || {};

    const [selectedElement, setSelectedElement] = useState<ElementKey | null>(null);

    // 1. Ganji Parsing Helper (DrillDownIconMenu Logic)
    const getChar = (obj: any, part: 'stem' | 'branch') => {
        if (!obj) return '?';
        if (part === 'stem') {
            if (typeof obj.gan === 'string') return obj.gan;
            if (typeof obj.ganKor === 'string') return obj.ganKor;
            if (obj.gan && typeof obj.gan === 'object' && obj.gan.char) return obj.gan.char;
        }
        if (part === 'branch') {
            if (typeof obj.ji === 'string') return obj.ji;
            if (typeof obj.jiKor === 'string') return obj.jiKor;
            if (obj.ji && typeof obj.ji === 'object' && obj.ji.char) return obj.ji.char;
        }
        return '?';
    };

    // 사주 원국 8글자 추출 및 간지 매핑
    const pillars = saju?.pillars || {};
    const ganjiData = useMemo(() => {
        const year = pillars.year ? `${getChar(pillars.year, 'stem')}${getChar(pillars.year, 'branch')}` : '';
        const month = pillars.month ? `${getChar(pillars.month, 'stem')}${getChar(pillars.month, 'branch')}` : '';
        const day = pillars.day ? `${getChar(pillars.day, 'stem')}${getChar(pillars.day, 'branch')}` : '';
        const hour = pillars.time ? `${getChar(pillars.time, 'stem')}${getChar(pillars.time, 'branch')}` : '';

        return {
            year,
            month,
            day,
            hour,
            raw: {
                year: pillars.year,
                month: pillars.month,
                day: pillars.day,
                hour: pillars.time
            }
        };
    }, [pillars]);

    // 일간(Day Master) 구하기
    const dayMaster = useMemo(() => {
        return pillars.day ? getChar(pillars.day, 'stem') : '';
    }, [pillars]);

    // 오행 매핑 딕셔너리
    const OHAENG_INFO: Record<ElementKey, {
        name: string;
        emoji: string;
        color: string;
        barColor: string;
        glowColor: string;
        themeColor: string;
        description: string;
        quote: string;
        cbtTips: string;
    }> = {
        wood: {
            name: '목 (Wood)',
            emoji: '🌱',
            color: 'text-emerald-400',
            barColor: 'bg-emerald-500',
            glowColor: 'shadow-[0_0_12px_rgba(16,185,129,0.4)]',
            themeColor: '#10b981',
            description: '목(木)은 단단한 흙을 뚫고 솟구치는 강력한 생명력이자, 푸르른 새봄의 새싹처럼 무한히 팽창하는 창조의 에너지입니다. 사용자님의 재능 설계도 내에서 새로운 일을 기획하고, 두려움 없이 기꺼이 첫발을 내디디며, 쑥쑥 자라나 아이디어를 구체화하는 핵심적인 생명력의 원천이 되어 줍니다.',
            quote: '“차가운 대지 아래 숨죽였던 씨앗이 마침내 하늘을 향해 첫 잎을 활짝 여는 눈부신 시작의 주파수입니다.”',
            cbtTips: '새로운 기획이나 배움을 시작할 때 가장 큰 만족을 느낍니다. 다만 시작에 비해 마무리가 흔들릴 때가 있으니, 하루 10분씩 조용히 생각을 다듬는 마인드셋 훈련을 곁들여보세요.'
        },
        fire: {
            name: '화 (Fire)',
            emoji: '🔥',
            color: 'text-rose-400',
            barColor: 'bg-rose-500',
            glowColor: 'shadow-[0_0_12px_rgba(244,63,94,0.4)]',
            themeColor: '#f43f5e',
            description: '화(火)는 하늘을 붉게 물들이는 태양이자 심장 깊은 곳의 뜨거운 정열처럼, 자신의 존재감을 외부로 아낌없이 확산시키고 표현하는 에너지입니다. 사용자님의 재능 속에서 사람들을 하나로 묶어주는 강력한 공감과 예술성, 그리고 무대나 강단에서 세상을 밝히는 찬란한 매력이자 열정의 엔진입니다.',
            quote: '“어둠을 몰아내고 세상을 따스하고 밝게 물들이는 등대이자, 가슴속에서 활활 타오르는 진실한 열정의 주파수입니다.”',
            cbtTips: '표현하고 주목받을 때 삶의 에너지가 급속도로 충전됩니다. 가끔 감정이 파도처럼 요동칠 때는, 차가운 물 한 잔을 천천히 마시며 지금 이 순간의 신체 감각에 집중해 보세요.'
        },
        earth: {
            name: '토 (Earth)',
            emoji: '⛰️',
            color: 'text-amber-400',
            barColor: 'bg-amber-500',
            glowColor: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]',
            themeColor: '#f59e0b',
            description: '토(土)는 우주의 모든 만물을 묵묵히 품어 안고 키워내는 비옥한 어머니의 대지이자, 계절과 계절의 교차점마다 균형과 조화를 잡아주는 신뢰의 주파수입니다. 사용자님의 삶에서 흔들리지 않는 든든한 안정감, 주변 사람들의 마음을 평안하게 다독여주는 깊은 포용력, 그리고 위기의 상황에서도 갈등을 완벽히 중재해내는 성숙한 조율의 힘입니다.',
            quote: '“비바람 속에서도 말없이 제자리를 지키며, 지친 생명들에게 안식처를 내어주는 깊고 고요한 대지의 주파수입니다.”',
            cbtTips: '사람들의 안식처 역할을 하나, 정작 본인의 마음에 피로가 누적될 수 있습니다. 하루 중 짧게라도 숲길을 걸으며 오롯이 자신만을 향해 수용전념하는 시간을 가지는 것이 필요합니다.'
        },
        metal: {
            name: '금 (Metal)',
            emoji: '🛡️',
            color: 'text-slate-300',
            barColor: 'bg-slate-400',
            glowColor: 'shadow-[0_0_12px_rgba(148,163,184,0.4)]',
            themeColor: '#94a3b8',
            description: '금(金)은 수없이 단련되어 바위 속에 깃든 단단한 보석이자 가을의 서늘하고 냉철한 서리처럼, 불필요한 것을 잘라내고 핵심만을 남기는 결단의 에너지입니다. 사용자님의 지능 속에서 정확무비한 냉철한 분석력, 약속을 하늘처럼 지키는 흔들림 없는 원칙주의, 그리고 정의를 향해 올곧게 나아가는 순수하고 강력한 의지의 칼날이 됩니다.',
            quote: '“불필요한 혼란을 일도양단하고, 가장 맑고 명확한 본질의 보석만을 냉철하게 걸러내는 눈부신 정의의 주파수입니다.”',
            cbtTips: '완벽주의 기질로 인해 스스로에게 과한 통제감을 부과할 수 있습니다. \"완벽하지 않아도 이대로 충분히 가치 있다\"는 자기 수용 마인드셋을 일상 속에서 반복해서 속삭여 주세요.'
        },
        water: {
            name: '수 (Water)',
            emoji: '🌊',
            color: 'text-sky-400',
            barColor: 'bg-sky-500',
            glowColor: 'shadow-[0_0_12px_rgba(56,189,248,0.4)]',
            themeColor: '#38bdf8',
            description: '수(水)는 만물이 흘러가는 시내이자 만물의 형태에 부드럽게 적응하면서도 깊은 바다처럼 세상 온갖 진리를 고요히 담고 흐르는 유연한 지혜의 에너지입니다. 사용자님의 내면 속에서 남들이 보지 못하는 깊은 이면을 한눈에 꿰뚫어 보는 탁월한 직관력과 통찰력, 어떠한 환경에도 부드럽게 융화되는 유연한 대처 능력이 됩니다.',
            quote: '“강요하지 않으나 결국 모든 골짜기를 채우고 흐르며, 바위에 부딪혀도 유연하게 비껴가는 무궁무진한 지혜의 주파수입니다.”',
            cbtTips: '깊은 통찰력만큼 가끔 과도한 생각의 늪(반추)에 빠질 수 있습니다. 머릿속 생각들이 거품처럼 흘러가도록 내버려 둔 채, 지금 눈앞의 마이크로 행동 하나에 몰입하는 훈련을 해보세요.'
        }
    };

    // 사주 원국 속 각 글자별 오행 판별 헬퍼
    const getOhaengOfChar = (char: string): ElementKey | '' => {
        if (!char) return '';
        if (['甲', '乙', '寅', '卯', '목'].includes(char)) return 'wood';
        if (['丙', '丁', '巳', '午', '화'].includes(char)) return 'fire';
        if (['戊', '己', '辰', '戌', '丑', '未', '토'].includes(char)) return 'earth';
        if (['庚', '辛', '申', '酉', '금'].includes(char)) return 'metal';
        if (['壬', '癸', '亥', '子', '수'].includes(char)) return 'water';
        return '';
    };

    // 일간의 오행 구하기
    const dayMasterOhaeng = useMemo(() => {
        if (!dayMaster) return '';
        return getOhaengOfChar(dayMaster);
    }, [dayMaster]);

    // 사용자의 4주 8글자 내 각 오행 글자 개수 동적 연산
    const ohaengCountsInSaju = useMemo(() => {
        const counts: Record<ElementKey, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
        const rawPillars = [pillars.year, pillars.month, pillars.day, pillars.time];
        
        rawPillars.forEach(p => {
            if (!p) return;
            const stem = getChar(p, 'stem');
            const branch = getChar(p, 'branch');

            const stemOhaeng = getOhaengOfChar(stem);
            const branchOhaeng = getOhaengOfChar(branch);

            if (stemOhaeng) counts[stemOhaeng]++;
            if (branchOhaeng) counts[branchOhaeng]++;
        });

        return counts;
    }, [pillars]);

    // Normalize for bar chart
    const validElements = elements || { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
    const maxVal = Math.max(...Object.values(validElements), 1);
    const getPercent = (val: number) => Math.min(100, (val / maxVal) * 100);

    const activeMeta = selectedElement ? OHAENG_INFO[selectedElement] : null;
    const isSajuLinked = !!(saju && saju.pillars);

    return (
        <div className="w-full max-w-sm mx-auto bg-gray-900/60 border border-amber-500/30 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg my-4 relative">
            {/* Header: Core Archetype */}
            <div className="bg-gradient-to-r from-amber-900/40 to-gray-900/40 p-5 border-b border-amber-500/20 relative">
                <div className="absolute top-0 right-0 p-3 opacity-20">
                    <Trophy size={64} className="text-amber-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded uppercase tracking-wider">Core Talent</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{coreStrength.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed opacity-90">
                    {coreStrength.description}
                </p>
            </div>

            <div className="p-5 space-y-6">
                {/* Element Balance Bars */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-1 flex items-center gap-1">
                        <Zap size={12} /> 에너지 밸런스 (Energy OS)
                    </h4>
                    <p className="text-[10px] text-amber-400/80 mb-3 pl-4 flex items-center gap-1 animate-pulse">
                        <Eye size={10} /> 오행 게이지를 클릭하면 감동적인 사주 연동 해설 팝업이 열립니다.
                    </p>
                    <div className="space-y-3">
                        {(['wood', 'fire', 'earth', 'metal', 'water'] as ElementKey[]).map((key) => {
                            const meta = OHAENG_INFO[key];
                            const val = validElements[key];
                            const percentage = getPercent(val);
                            const sajuCount = ohaengCountsInSaju[key];
                            const isMyDayMaster = dayMasterOhaeng === key;

                            return (
                                <div 
                                    key={key} 
                                    onClick={() => setSelectedElement(key)}
                                    className="flex flex-col gap-1 p-2 rounded-xl bg-white/0 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-gray-300 font-medium flex items-center gap-1">
                                            <span>{meta.emoji}</span>
                                            <span>{meta.name}</span>
                                            {isSajuLinked && sajuCount > 0 && (
                                                <span className="text-[9px] bg-slate-800 text-amber-300 border border-amber-500/20 px-1.5 py-0.2 rounded-full font-bold">
                                                    {sajuCount}글자
                                                </span>
                                            )}
                                            {isSajuLinked && isMyDayMaster && (
                                                <span className="text-[8px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded-full font-black tracking-tighter">
                                                    일간 (나)
                                                </span>
                                            )}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-mono group-hover:text-amber-300 transition-colors">{val}pt</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-gray-950 border border-white/5 rounded-full overflow-hidden relative">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-full ${meta.barColor} ${meta.glowColor} rounded-full`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Keywords Grid */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-1">
                        <Sparkles size={12} /> 강점 키워드
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {keywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-amber-200">
                                #{kw}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Job Aptitude */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-1">
                        <Briefcase size={12} /> 추천 직무 분야
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {jobAptitude.map((job, i) => (
                            <div key={i} className="bg-gray-800/50 p-2 rounded text-center text-xs text-gray-300 border border-gray-700/50">
                                {job}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 🌌 오행 상세 설명 감동 팝업창 (모달) */}
            <AnimatePresence>
                {selectedElement && activeMeta && (
                    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
                        {/* Backdrop Click to Close */}
                        <div 
                            className="absolute inset-0 cursor-default" 
                            onClick={() => setSelectedElement(null)}
                        />
                        
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="relative w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] space-y-5 z-10 max-h-[85vh] overflow-y-auto"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedElement(null)}
                                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Header */}
                            <div className="border-b border-white/5 pb-3">
                                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block mb-1">Ohaeng Energy Blueprint</span>
                                <h3 className="text-lg font-black text-white flex items-center gap-2">
                                    <span>{activeMeta.emoji}</span>
                                    <span>{activeMeta.name} 주파수 해독</span>
                                </h3>
                            </div>

                            {/* 4주 8글자 미니 대시보드 */}
                            {isSajuLinked && (
                                <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-white/5 space-y-2.5">
                                    <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                        <span>🧬</span>
                                        <span>나의 우주적 만세력 설계도</span>
                                    </h4>
                                    <div className="grid grid-cols-4 gap-2 text-center">
                                        {[
                                            { label: '시주', val: ganjiData.hour, raw: ganjiData.raw.hour },
                                            { label: '일주', val: ganjiData.day, raw: ganjiData.raw.day },
                                            { label: '월주', val: ganjiData.month, raw: ganjiData.raw.month },
                                            { label: '년주', val: ganjiData.year, raw: ganjiData.raw.year },
                                        ].map((item, idx) => {
                                            const stem = getChar(item.raw, 'stem');
                                            const branch = getChar(item.raw, 'branch');
                                            
                                            const stemOhaeng = getOhaengOfChar(stem);
                                            const branchOhaeng = getOhaengOfChar(branch);

                                            const isSelectedStem = stemOhaeng === selectedElement;
                                            const isSelectedBranch = branchOhaeng === selectedElement;

                                            return (
                                                <div key={idx} className="flex flex-col gap-1 p-1 bg-slate-900 border border-white/5 rounded-xl">
                                                    <span className="text-[8px] text-gray-500 font-bold">{item.label}</span>
                                                    <div className="flex flex-col text-xs font-black tracking-wider leading-tight">
                                                        <span className={isSelectedStem ? `${activeMeta.color} animate-pulse scale-110 duration-500` : 'text-slate-300'}>
                                                            {stem || '?'}
                                                        </span>
                                                        <span className={isSelectedBranch ? `${activeMeta.color} animate-pulse scale-110 duration-500` : 'text-slate-400'}>
                                                            {branch || '?'}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Poetic metaphor */}
                            <div className="bg-slate-950/40 p-4 rounded-2xl border border-amber-500/10 text-center italic text-xs text-amber-200/90 leading-relaxed font-serif">
                                {activeMeta.quote}
                            </div>

                            {/* Core Description */}
                            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                                <h4 className="font-bold text-white text-[11px] flex items-center gap-1">
                                    <Sparkles size={12} className="text-amber-400" />
                                    <span>기질적 본질 분석</span>
                                </h4>
                                <p className="break-keep">{activeMeta.description}</p>
                            </div>

                            {/* Personal Saju Feedback */}
                            {isSajuLinked && (
                                <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-2xl space-y-1.5 text-[11px] text-slate-300 leading-normal">
                                    <h4 className="font-black text-purple-300 flex items-center gap-1.5">
                                        <Trophy size={11} />
                                        <span>사용자 사주팔자 내 배치 분석</span>
                                    </h4>
                                    <p className="break-keep">
                                        사용자님의 8글자 속에 이 기운은 총{' '}
                                        <span className="text-amber-300 font-extrabold text-xs">
                                            {ohaengCountsInSaju[selectedElement]}개
                                        </span>{' '}
                                        배치되어 있습니다.{' '}
                                        {ohaengCountsInSaju[selectedElement] >= 3 ? (
                                            <span className="text-emerald-400 font-medium">
                                                이 기운이 아주 풍부하게 내장되어 있어, 평생 동안 꺼내 쓸 수 있는 가장 신뢰할 수 있는 전천후 강점 무기입니다. ✨
                                            </span>
                                        ) : ohaengCountsInSaju[selectedElement] === 0 ? (
                                            <span className="text-rose-400 font-medium">
                                                이 기운이 원국(년/월/일/시)에 직접 나타나지 않아 결핍으로 보일 수 있으나, 오히려 비어있기에 타인의 지혜를 겸손히 수용하고 조화롭게 상생해야 할 아름다운 조화의 공터입니다. 🤝
                                            </span>
                                        ) : (
                                            <span className="text-sky-300 font-medium">
                                                이 기운이 원국 속에 적절히 조화를 이루어, 사용자님의 다른 기운들이 과도하게 쏠리지 않도록 든든한 균형추 역할을 수행하고 있습니다. ⚖️
                                            </span>
                                        )}
                                    </p>
                                    {dayMasterOhaeng === selectedElement && (
                                        <p className="text-rose-300 font-semibold border-t border-purple-500/10 pt-1.5 mt-1.5 break-keep">
                                            🌟 특히 이 오행은 바로 사용자님 본인(일간: {dayMaster})을 상징하는 본질의 에너지입니다. 이 기운을 올바르게 자각하고 가꿀 때, 영혼의 주권이 바로 섭니다.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Cognitive Behavioral Tips */}
                            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex gap-2.5 items-start">
                                <Heart className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-[11px] font-black text-emerald-300">이 기운을 품는 명심 행동 강령 (ACT)</h4>
                                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed break-keep">
                                        {activeMeta.cbtTips}
                                    </p>
                                </div>
                            </div>

                            {/* Close Button CTA */}
                            <button
                                onClick={() => setSelectedElement(null)}
                                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all text-center"
                            >
                                주파수의 지혜를 품고 돌아가기
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
