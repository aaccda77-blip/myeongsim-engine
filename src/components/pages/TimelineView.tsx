'use client';

import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, Wind, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useReportStore } from '@/store/useReportStore';

// [Deep Tech Logic] 날씨 아이콘 매핑
const WEATHER_CONFIG = {
    sun: { icon: <Sun className="w-8 h-8" />, color: 'text-orange-400', bg: 'bg-orange-400/10', label: '맑음 (호운)' },
    cloud: { icon: <Cloud className="w-8 h-8" />, color: 'text-gray-400', bg: 'bg-gray-400/10', label: '흐림 (평운)' },
    rain: { icon: <CloudRain className="w-8 h-8" />, color: 'text-blue-400', bg: 'bg-blue-400/10', label: '비 (조심)' },
    wind: { icon: <Wind className="w-8 h-8" />, color: 'text-primary-olive', bg: 'bg-primary-olive/10', label: '바람 (변화)' },
};

export default function TimelineView() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentYear] = useState(new Date().getFullYear());
    const { reportData } = useReportStore();

    // [Fix 1] 데이터 가드 & 로딩 상태
    if (!reportData) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary-olive animate-spin mb-2" />
                <p className="text-gray-500 text-sm">운의 흐름을 읽고 있습니다...</p>
            </div>
        );
    }

    // [Fix 2] 실제 데이터 연동 준비 (Mock은 Fallback으로 사용)
    // useMemo를 사용하여 리렌더링 시 불필요한 연산 방지
    const timelineData = useMemo(() => {
        // 실제 API 데이터가 있으면 그것을 사용
        if (reportData.timeline && reportData.timeline.length > 0) {
            return reportData.timeline;
        }

        // Fallback: Mock Data Generation (실제 앱에서는 제거하거나 비상용으로 유지)
        return Array.from({ length: 12 }, (_, i) => {
            const year = currentYear - 1 + i; // 작년부터 보여줌
            const weathers: ('sun' | 'cloud' | 'rain' | 'wind')[] = ['sun', 'cloud', 'wind', 'rain', 'cloud', 'sun', 'sun', 'wind', 'cloud', 'sun'];
            const descriptions = [
                "지나간 흐름을 정리하는 시기입니다.",
                "새로운 기회가 찾아오는 강력한 호운입니다.",
                "잠시 멈추어 내실을 다져야 할 때입니다.",
                "변화의 바람이 붑니다. 유연함이 필요합니다.",
                "예상치 못한 비를 만날 수 있으니 대비하세요.",
                "구름 뒤에 태양이 있습니다. 조금만 인내하세요.",
                "물 들어올 때 노 저어야 하는 최적의 시기!",
                "그동안의 노력이 결실을 맺습니다.",
                "새로운 방향으로 전환점이 찾아옵니다.",
                "평온함 속에서 다음 도약을 준비하세요."
            ];

            return {
                year,
                weather: weathers[i % weathers.length],
                description: descriptions[i % descriptions.length]
            };
        });
    }, [reportData, currentYear]);

    // [Fix 3] Deep Tech UX: 현재 연도로 자동 스크롤 (Auto Focus)
    useEffect(() => {
        if (scrollRef.current) {
            const currentIndex = timelineData.findIndex(item => item.year === currentYear);

            if (currentIndex !== -1) {
                // 모바일/PC 카드 너비 고려 (평균값 혹은 동적 계산)
                const cardWidth = 300; // 대략적인 카드 너비 + 갭
                const containerWidth = scrollRef.current.clientWidth;

                // 화면 중앙에 오도록 계산
                const scrollPos = (currentIndex * cardWidth) - (containerWidth / 2) + (cardWidth / 2);

                // 부드럽게 이동
                setTimeout(() => {
                    scrollRef.current?.scrollTo({
                        left: scrollPos,
                        behavior: 'smooth'
                    });
                }, 500); // 렌더링 후 약간의 딜레이
            }
        }
    }, [timelineData, currentYear]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="h-full py-4 px-2 flex flex-col items-center justify-center relative">

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-center mb-6 shrink-0"
            >
                <span className="text-xs text-primary-olive font-bold tracking-widest uppercase border border-primary-olive/30 px-3 py-1 rounded-full bg-primary-olive/10">
                    Part 3. Flow of Fate
                </span>
                <h2 className="text-2xl font-serif font-bold text-white mt-4">운의 흐름과 타이밍</h2>
                <p className="text-sm text-gray-400 mt-2">당신의 12년 흐름을 미리 확인하세요.</p>
            </motion.div>

            <div className="relative w-full max-w-7xl flex-1 flex items-center min-h-0">
                {/* PC Navigation Buttons */}
                <button
                    onClick={() => scroll('left')}
                    className="hidden md:flex absolute left-0 z-20 p-3 rounded-full bg-deep-slate/80 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors shadow-xl"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-400" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="hidden md:flex absolute right-0 z-20 p-3 rounded-full bg-deep-slate/80 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors shadow-xl"
                >
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                </button>

                {/* Timeline Container */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory scrollbar-hide px-[50vw] md:px-16 w-full items-center pb-8"
                    style={{ scrollPaddingLeft: '0px' }} // CSS 중앙 정렬 보조
                >
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10 hidden md:block" />

                    {timelineData.map((item, idx) => {
                        const config = WEATHER_CONFIG[item.weather] || WEATHER_CONFIG.cloud;
                        const isCurrent = item.year === currentYear;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ margin: "-20%" }} // 화면 중앙에 올 때 애니메이션
                                transition={{ delay: idx * 0.05 }}
                                className={`
                                flex-shrink-0 w-[260px] md:w-[320px] p-6 rounded-3xl border snap-center flex flex-col items-center text-center relative transition-all duration-500
                                ${isCurrent
                                        ? 'bg-deep-slate border-primary-olive shadow-[0_0_40px_rgba(101,140,66,0.15)] scale-105 z-10'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10 grayscale-[0.5] hover:grayscale-0'
                                    }
                            `}
                            >
                                {/* Current Badge */}
                                {isCurrent && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary-olive bg-deep-slate px-3 py-1 rounded-full border border-primary-olive uppercase tracking-wider shadow-lg z-20">
                                        Current
                                    </div>
                                )}

                                {/* Year */}
                                <div className={`text-5xl font-black mb-4 transition-colors font-serif ${isCurrent ? 'text-white/20' : 'text-white/5'}`}>
                                    {item.year}
                                </div>

                                {/* Weather Icon */}
                                <div className={`mb-6 p-4 rounded-full ${config.bg} ${config.color} ring-1 ring-inset ring-white/5 shadow-inner`}>
                                    {config.icon}
                                </div>

                                {/* Description */}
                                <h4 className={`text-sm font-bold mb-2 ${config.color}`}>{config.label}</h4>
                                <p className="text-xs md:text-sm text-gray-300 leading-relaxed word-keep-all h-[40px] flex items-center justify-center">
                                    {item.description}
                                </p>

                                {/* Mobile Connector */}
                                <div className="md:hidden mt-6 w-0.5 h-6 bg-gradient-to-b from-white/10 to-transparent" />
                            </motion.div>
                        );
                    })}

                    {/* Right Padding for Center Scroll */}
                    <div className="min-w-[50vw] md:hidden" />
                </div>
            </div>
        </section>
    );
}
