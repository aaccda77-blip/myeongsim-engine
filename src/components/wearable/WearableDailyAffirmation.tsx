'use client';

import React, { useState, useEffect } from 'react';
import { Star, Sparkles, RefreshCw, BookmarkCheck, Headphones, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import { DailyLuckEngine } from '@/lib/saju/DailyLuckEngine';
import { useWearableContext } from './WearableAppShell';

interface WearableDailyAffirmationProps {
    onGoToSoundLab?: () => void;
}

// 10대 일간별 기본 고품격 선언문 라이브러리
const DEFAULT_AFFIRMATIONS: Record<string, { title: string; element: string; quote: string; theme: string }> = {
    '갑': {
        title: '푸른 거목의 기상',
        element: '갑목(甲木)',
        theme: '대지 위로 뻗어나가는 개척의 힘',
        quote: '나는 거친 풍파 속에서도 깊게 뿌리내린 거목처럼, 오늘 나에게 주어지는 모든 도전을 성장의 영양분으로 삼는다. 내 안의 푸른 생명력은 흔들림 없이 하늘을 향해 뻗어나간다.'
    },
    '을': {
        title: '유연한 덩굴의 지혜',
        element: '을목(乙木)',
        theme: '부드러움으로 세상을 품는 적응력',
        quote: '나는 봄바람에 유연하게 춤추는 꽃잎처럼, 주변의 흐름에 부드럽게 조응하며 최고의 기회를 빚어낸다. 부드러움이 강함을 이기는 내 안의 유연성이 오늘 모든 문을 연다.'
    },
    '병': {
        title: '찬란한 태양의 열정',
        element: '병화(丙火)',
        theme: '세상 만물을 비추는 따뜻한 온기',
        quote: '나는 온 세상을 막힘없이 비추는 태양처럼, 내 안의 밝은 열정과 긍정 에너지를 오늘 만나는 모든 이들에게 아낌없이 비춘다. 내 밝음이 어둠을 걷어내고 길을 밝힌다.'
    },
    '정': {
        title: '따뜻한 촛불의 응집력',
        element: '정화(丁火)',
        theme: '어둠을 밝히는 한결같은 헌신',
        quote: '나는 고요한 밤을 은은하게 밝히는 등불처럼, 작은 디테일 속에 깊은 진심을 담아 기적을 빚어낸다. 나의 섬세하고 따뜻한 불꽃은 사람들의 마음을 치유하고 영감을 준다.'
    },
    '무': {
        title: '웅장한 태산의 중심',
        element: '무토(戊土)',
        theme: '어떤 흔들림도 품어내는 광활함',
        quote: '나는 비바람에도 흔들리지 않는 거대한 태산처럼, 나의 깊은 중심을 굳건히 지키며 모든 변화를 여유롭게 관조한다. 나의 침묵과 무게감은 세상에 든든한 신뢰를 선물한다.'
    },
    '기': {
        title: '비옥한 대지의 포용',
        element: '기토(己土)',
        theme: '온갖 생명을 길러내는 모성의 품',
        quote: '나는 모든 씨앗을 품어 싹을 틔우는 비옥한 텃밭처럼, 내게 찾아온 모든 인연과 기회를 정성으로 가꾸어 풍성한 결실로 맺어낸다. 나의 너그러움이 풍요를 부른다.'
    },
    '경': {
        title: '예리한 강철의 결단',
        element: '경금(庚金)',
        theme: '불필요한 군더더기를 쳐내는 명료함',
        quote: '나는 용광로를 거쳐 단련된 명검처럼, 번잡한 잡념을 단칼에 베어내고 본질에만 집중한다. 나의 단호한 결단력과 정의로운 에너지는 오늘 최고의 성과를 창조한다.'
    },
    '신': {
        title: '영롱한 보석의 통찰',
        element: '신금(辛金)',
        theme: '어둠 속에서도 빛을 발하는 순수성',
        quote: '나는 견고한 대지 위, 햇살 아래 영롱하게 빛나는 보석처럼, 내 안의 진귀한 통찰력을 오늘 세상에 아낌없이 발산한다. 내 존재의 깊이에서 우러나오는 그 빛은 모든 것을 명료하게 밝힌다.'
    },
    '임': {
        title: '광활한 바다의 지혜',
        element: '임수(壬水)',
        theme: '모든 경계를 넘어 흐르는 자유',
        quote: '나는 거침없이 도도하게 흐르는 깊은 강물처럼, 세상의 어떤 장애물도 유연하게 넘어서며 더 큰 바다로 나아간다. 나의 끝없는 상상력과 포용력은 거대한 혁신을 이끈다.'
    },
    '계': {
        title: '맑은 옹달샘의 영성',
        element: '계수(癸水)',
        theme: '마른 대지를 적시는 생명의 이슬',
        quote: '나는 만물을 소리 없이 적시는 새벽이슬처럼, 맑고 투명한 직관력으로 사람들의 영혼을 적시고 치유한다. 나의 섬세한 흐름은 깊은 평화와 자각을 세상에 흘려보낸다.'
    }
};

export function WearableDailyAffirmation({ onGoToSoundLab }: WearableDailyAffirmationProps) {
    const { reportData } = useReportStore();
    const { isLargeText } = useWearableContext();
    const [dayMasterKey, setDayMasterKey] = useState('신'); // 기본: 신금(辛金)
    const [affirmation, setAffirmation] = useState(DEFAULT_AFFIRMATIONS['신'].quote);
    const [isImprinted, setIsImprinted] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [todayGanji, setTodayGanji] = useState('갑진(甲辰)');

    // 1. 사용자 일간 및 오늘 일진 계산
    useEffect(() => {
        try {
            // 사용자 프로필에서 일간 추출
            let extractedDayMaster = '신';
            if (reportData?.saju?.dayMaster) {
                extractedDayMaster = reportData.saju.dayMaster;
            } else if ((reportData as any)?.sajuData?.dayMaster) {
                extractedDayMaster = (reportData as any).sajuData.dayMaster;
            }

            // 한글 한 글자 정규화
            extractedDayMaster = extractedDayMaster.replace(/[^가-힣]/g, '')[0] || '신';
            if (DEFAULT_AFFIRMATIONS[extractedDayMaster]) {
                setDayMasterKey(extractedDayMaster);
                setAffirmation(DEFAULT_AFFIRMATIONS[extractedDayMaster].quote);
            }

            // 오늘 일진 계산
            const bio = DailyLuckEngine.calculate(extractedDayMaster);
            if (bio?.ganji) {
                setTodayGanji(bio.ganji);
            }
        } catch (e) {
            console.error('Failed to load user day master:', e);
        }
    }, [reportData]);

    // 2. AI 1:1 맞춤 일진 선언문 생성 요청 (동적 API 호출)
    const handleGenerateAiAffirmation = async () => {
        setIsGenerating(true);
        try {
            const currentItem = DEFAULT_AFFIRMATIONS[dayMasterKey] || DEFAULT_AFFIRMATIONS['신'];
            const res = await fetch('/api/coaching/daily-affirmation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dayMaster: `${currentItem.element} (${dayMasterKey})`,
                    todayGanji: todayGanji,
                    relation: 'FLOW 발산',
                    defaultAffirmation: currentItem.quote
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.affirmation) {
                    setAffirmation(data.affirmation);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    // 3. 가슴에 각인하기 (햅틱 + 골드 플래시 피드백)
    const handleImprint = () => {
        setIsImprinted(true);
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            try {
                navigator.vibrate([40, 80, 40]);
            } catch (e) {}
        }
        setTimeout(() => {
            setIsImprinted(false);
        }, 800);
    };

    const currentConfig = DEFAULT_AFFIRMATIONS[dayMasterKey] || DEFAULT_AFFIRMATIONS['신'];

    return (
        <div className="relative flex flex-col items-center justify-between h-full py-1.5 px-2 text-center select-none font-sans w-full overflow-hidden">
            {/* 각인 골드 플래시 오버레이 */}
            {isImprinted && (
                <div className="absolute inset-0 bg-amber-400/30 backdrop-blur-sm z-30 flex items-center justify-center animate-ping pointer-events-none" />
            )}

            {/* 상단 라벨 & 오늘 일진 뱃지 */}
            <div className="flex items-center justify-between w-full px-1.5 pt-0.5 z-10">
                <span className={`${isLargeText ? 'text-[11px] text-amber-300 font-black' : 'text-[10px] text-amber-400 font-bold'} font-mono tracking-wider flex items-center gap-1`}>
                    <Star size={isLargeText ? 13 : 11} className="text-amber-400 fill-amber-400 animate-pulse" />
                    <span>오늘의 선언문</span>
                </span>
                <span className={`${isLargeText ? 'text-[9.5px] px-2 py-0.5' : 'text-[8.5px] px-1.5 py-0.5'} rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30`}>
                    {currentConfig.element} · {todayGanji}
                </span>
            </div>

            {/* 중앙 1:1 일진 맞춤 선언문 본문 (최고급 글래스모피즘 카드) */}
            <div className={`relative my-auto flex flex-col items-center justify-center w-full ${isLargeText ? 'max-w-[275px]' : 'max-w-[245px]'} z-10`}>
                <div className={`p-3 rounded-2xl bg-gradient-to-b from-amber-500/15 via-black/70 to-black/90 border ${isLargeText ? 'border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.25)]' : 'border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.15)]'} relative overflow-hidden`}>
                    {/* 상단 큰따옴표 데코 */}
                    <div className="text-amber-400/25 text-2xl font-serif font-black absolute top-1 left-2 select-none leading-none">
                        “
                    </div>

                    <p className={`${isLargeText ? 'text-[14px] sm:text-[15px] leading-[1.75] font-black text-amber-100 tracking-tight' : 'text-[11.5px] sm:text-[12px] font-bold text-amber-50 italic leading-[1.65]'} break-keep relative z-10 px-1 pt-1`}>
                        &ldquo;{affirmation}&rdquo;
                    </p>

                    <div className={`flex items-center justify-between mt-2 pt-1.5 border-t border-amber-500/20 ${isLargeText ? 'text-[9.5px] text-amber-200 font-bold' : 'text-[8.5px] text-amber-300/80 font-mono'}`}>
                        <span>{currentConfig.title}</span>
                        <span>{currentConfig.theme}</span>
                    </div>
                </div>
            </div>

            {/* 하단 3대 인터랙티브 버튼 바 */}
            <div className={`w-full ${isLargeText ? 'max-w-[245px]' : 'max-w-[225px]'} pb-1 space-y-1 z-10`}>
                <div className="flex items-center gap-1.5">
                    {/* 가슴에 각인하기 버튼 */}
                    <button
                        onClick={handleImprint}
                        className={`flex-1 ${isLargeText ? 'py-2 px-3 text-[12px]' : 'py-1.5 px-2.5 text-[11px]'} rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(251,191,36,0.5)] active:scale-95 transition-all cursor-pointer`}
                    >
                        <BookmarkCheck size={isLargeText ? 14 : 12} strokeWidth={2.5} />
                        <span>가슴에 각인</span>
                    </button>

                    {/* AI 선언문 갱신 */}
                    <button
                        onClick={handleGenerateAiAffirmation}
                        disabled={isGenerating}
                        className={`${isLargeText ? 'size-8' : 'size-7'} rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/15 shrink-0 disabled:opacity-50`}
                        title="새로운 영감 선언문 생성"
                    >
                        <RefreshCw size={isLargeText ? 13 : 11} className={isGenerating ? 'animate-spin text-amber-400' : ''} />
                    </button>

                    {/* 엠씨스퀘어 연동 이동 */}
                    {onGoToSoundLab && (
                        <button
                            onClick={onGoToSoundLab}
                            className={`${isLargeText ? 'size-8' : 'size-7'} rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 flex items-center justify-center transition-all cursor-pointer border border-cyan-400/30 shrink-0`}
                            title="엠씨스퀘어 몰입 사운드 재생"
                        >
                            <Headphones size={isLargeText ? 13 : 11} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
