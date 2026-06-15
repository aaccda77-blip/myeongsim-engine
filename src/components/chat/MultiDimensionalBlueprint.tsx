import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// [MODULE] 3단계 셀프 코칭 모달 (lazy load — 기존 시스템 영향 0)
const NeuralCodeCoachingModal = dynamic(() => import('@/components/coaching/NeuralCodeCoachingModal'), { ssr: false });

// [MODULE] 오늘의 뉴럴 코드 액션 플랜 (lazy load)
const DailyNeuralMissionCard = dynamic(() => import('@/components/coaching/DailyNeuralMissionCard'), { ssr: false });

// [MODULE] 월간 명심 리포트 (lazy load)
const MonthlyMindReport = dynamic(() => import('@/components/coaching/MonthlyMindReport'), { ssr: false });

/**
 * [모듈식 UI] 다차원 마음 설계도 컴포넌트 (Multi-Dimensional Blueprint View)
 *
 * 특장점:
 * 1. 기존 챗봇/AI 로직과 분리된 순수 View Component 입니다.
 * 2. 다크 코드(⚠️), 뉴럴 코드(✨), 메타 코드(👑) 3단계 상태를 토글할 수 있습니다.
 * 3. FlutterFlow/앱 이식 시 참고할 수 있도록 Tailwind CSS로 패럴랙스, 그라데이션, 글래스모피즘 효과를 적용했습니다.
 */

// --- 타입 정의 ---
export type BlueprintLevel = 'dark' | 'neural' | 'meta';

export interface CodeData {
    id: string;
    title: string;                 // 예: "지향점: 을미"
    subtitle: string;              // 예: "척박한 땅에서도 결국 꽃을 피우는 끈기"
    darkCode: { name: string; desc: string };
    neuralCode: { name: string; desc: string };
    metaCode: { name: string; desc: string };
}

// --- 하드코딩된 예시 데이터 (실제 연동 시 props로 주입) ---
const mockData: CodeData[] = [
    {
        id: 'vision',
        title: "🚀 지향점 (Future Vision)",
        subtitle: "척박한 땅에서도 결국 꽃을 피우는 끈기",
        darkCode: { name: "[생존 강박]", desc: "미래가 불안하여 쉴 새 없이 일만 하거나, 결과가 당장 나오지 않으면 초조해하는 상태." },
        neuralCode: { name: "[사막의 꽃]", desc: "어떤 악조건에서도 유연하게 적응하며, 결국에는 실속과 결과를 만들어내는 끈기의 아이콘." },
        metaCode: { name: "[생태계 건축가]", desc: "나 혼자 살아남는 것을 넘어, 죽어있는 땅을 개척하여 모두가 살 수 있는 옥토로 바꾸는 위대한 결실." },
    },
    {
        id: 'identity',
        title: "👤 핵심 자아 (Core Identity)",
        subtitle: "냉철한 이성과 뜨거운 열정의 완벽한 밸런스",
        darkCode: { name: "[예민한 면도날]", desc: "완벽주의에 갇혀 자신과 타인을 날카롭게 비판하거나, 작은 실수에도 밤잠을 설치는 상태." },
        neuralCode: { name: "[세련된 엘리트]", desc: "감정에 휘둘리지 않는 냉철함과 목표를 향한 열정을 동시에 발휘하여, 품격 있게 리드하는 모습." },
        metaCode: { name: "[고귀한 권위]", desc: "힘으로 누르지 않아도 저절로 고개가 숙여지는 인격적 권위를 완성하여, 세상의 기준이 되는 존재." },
    },
    {
        id: 'social',
        title: "💼 사회적 환경 (Social Interface)",
        subtitle: "메마른 세상에 생기를 불어넣는 치유의 힘",
        darkCode: { name: "[희생의 늪]", desc: "남을 챙기느라 정작 자신은 고갈되거나, 타인의 감정 쓰레기통이 되어 우울감에 빠진 상태." },
        neuralCode: { name: "[치유의 단비]", desc: "삭막한 조직이나 프로젝트에 꼭 필요한 활력을 불어넣고, 사람들의 마음을 움직이는 기획자." },
        metaCode: { name: "[생명 소생자]", desc: "실패한 사람, 망해가는 프로젝트, 죽어가는 가치를 다시 살려내어 기적을 만드는 구원 투수." },
    },
    {
        id: 'base',
        title: "🌳 배경 에너지 (Base Energy)",
        subtitle: "타협하지 않는 뚝심과 거대한 스케일",
        darkCode: { name: "[고집불통 독재자]", desc: "내 방식만 옳다고 우기며 주변과 소통을 단절하거나, 힘으로 모든 것을 통제하려다 고립된 상태." },
        neuralCode: { name: "[강철의 사령관]", desc: "흔들리지 않는 주관과 강력한 추진력으로 조직을 장악하고 목표를 향해 돌진하는 리더." },
        metaCode: { name: "[제국의 건설자]", desc: "개인의 성공을 넘어, 후대까지 이어질 거대한 시스템과 유산을 남기는 역사의 주역." },
    }
];

// --- 메인 컴포넌트 ---
export default function MultiDimensionalBlueprint({ 
    data = mockData,
    showActionButton = true,
    onActionClick
}: { 
    data?: CodeData[];
    showActionButton?: boolean;
    onActionClick?: () => void;
}) {

    // 글로벌 뷰어 레벨 (한 번에 다크/뉴럴/메타 상태를 전환)
    const [globalLevel, setGlobalLevel] = useState<BlueprintLevel>('neural');

    // [MODULE] 코칭 모달 상태
    const [coachingOpen, setCoachingOpen] = useState(false);
    const [coachingData, setCoachingData] = useState<any>(null);

    // 햅틱 피드백 트리거 (웹 환경용 진동 처리)
    const triggerHaptic = () => {
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50); // 50ms 짧은 진동
        }
    };

    const handleLevelChange = (level: BlueprintLevel) => {
        triggerHaptic();
        setGlobalLevel(level);
    };

    // [MODULE] 카드 클릭 → 코칭 모달 열기
    const handleCardClick = (item: CodeData) => {
        triggerHaptic();
        // item.id에서 간지 추출 (id는 내부적으로 "을미", "신사" 등 갑자 코드를 유지)
        const ganChar = item.id.length >= 2 ? item.id[0] : '';
        const jiChar = item.id.length >= 2 ? item.id[1] : '';
        // 타이틀에서 이모지 뒤 라벨 추출 (예: "🚀 지향점 (Future Vision)" → "🚀 지향점")
        const pillarLabel = item.title.replace(/\s*\(.*?\)\s*$/, '').trim();

        setCoachingData({
            pillarLabel,
            ganChar,
            jiChar,
            darkCode: { ...item.darkCode, body_symptom: '' },
            neuralCode: { ...item.neuralCode, action: '' },
            metaCode: item.metaCode,
        });
        setCoachingOpen(true);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl overflow-hidden relative border border-slate-700">

            {/* 배경 파티클 요소 (CSS 그라데이션) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-20 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10">
                {/* 헤더 타이틀 */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 mb-2">
                        나의 기질 설계도
                    </h2>
                    <p className="text-slate-400 text-sm tracking-widest">MULTI-DIMENSIONAL BLUEPRINT</p>
                </div>

                {/* 차원 선택 컨트롤러 (Haptic Toggle) */}
                <div className="flex justify-center space-x-2 mb-8 bg-slate-800/50 p-1.5 rounded-full border border-slate-700/50 backdrop-blur-sm">
                    <button
                        onClick={() => handleLevelChange('dark')}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 w-1/3 flex items-center justify-center space-x-2
                            ${globalLevel === 'dark' ? 'bg-rose-900/80 text-rose-200 shadow-[0_0_15px_rgba(225,29,72,0.3)]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'}`}
                    >
                        <span>⚠️</span> <span>Dark</span>
                    </button>
                    <button
                        onClick={() => handleLevelChange('neural')}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 w-1/3 flex items-center justify-center space-x-2
                            ${globalLevel === 'neural' ? 'bg-blue-900/80 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'}`}
                    >
                        <span>✨</span> <span>Neural</span>
                    </button>
                    <button
                        onClick={() => handleLevelChange('meta')}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 w-1/3 flex items-center justify-center space-x-2
                            ${globalLevel === 'meta' ? 'bg-amber-700/80 text-amber-100 shadow-[0_0_15px_rgba(217,119,6,0.3)]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'}`}
                    >
                        <span>👑</span> <span>Meta</span>
                    </button>
                </div>

                {/* 코드 리스트 렌더링 (다차원 뷰어) */}
                <div className="space-y-6">
                    {data.map((item, index) => (
                        <div key={item.id}
                            className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-md"
                            style={{ animationDelay: `${index * 100}ms` }}>

                            <h3 className="text-lg font-bold text-slate-200 mb-1">{item.title}</h3>
                            <p className="text-slate-400 text-sm mb-4 leading-relaxed font-medium">"{item.subtitle}"</p>

                            {/* 상태별 동적 컴포넌트 */}
                            <div className="transform transition-all duration-500 ease-in-out">
                                {globalLevel === 'dark' && (
                                    <div className="bg-rose-950/30 border-l-4 border-rose-500 p-4 rounded-r-lg">
                                        <p className="font-bold text-rose-300 mb-2">{item.darkCode.name}</p>
                                        <p className="text-rose-100/70 text-sm leading-relaxed">{item.darkCode.desc}</p>
                                    </div>
                                )}
                                {globalLevel === 'neural' && (
                                    <div className="bg-blue-950/30 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                        <p className="font-bold text-blue-300 mb-2">{item.neuralCode.name}</p>
                                        <p className="text-blue-100/70 text-sm leading-relaxed">{item.neuralCode.desc}</p>
                                    </div>
                                )}
                                {globalLevel === 'meta' && (
                                    <div className="bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg relative overflow-hidden">
                                        {/* 메타코드 반짝임 효과 */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/5 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]"></div>
                                        <p className="font-bold text-amber-400 mb-2 relative z-10">{item.metaCode.name}</p>
                                        <p className="text-amber-100/80 text-sm leading-relaxed relative z-10">{item.metaCode.desc}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 코치의 노트 (Coach's Note) */}
                <div className="mt-10 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-2xl border border-indigo-500/20">
                    <div className="flex items-center mb-3">
                        <span className="text-indigo-400 mr-2 text-xl">💡</span>
                        <h4 className="font-bold text-indigo-200">Coach's Note (그림자를 다루는 아름다운 연금술)</h4>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                        주의: 이 분석은 당신을 억지로 깎아내거나 인위적으로 개조하려는 차가운 지침이 아닙니다. 내면의 날씨를 포근히 품고 내 삶의 방향타를 맑게 쥐기 위한 <strong>'존엄한 관점의 대전환'</strong>을 향한 따뜻한 초대입니다.
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                        시스템의 역설은, 가슴속 ⚠️ <strong>[다크 코드(그림자)]</strong>를 억지로 도려내어 삭제하거나 부정하려 할수록, 온 신경계가 아프게 울부짖으며 충돌과 오류(Error)를 더 자주 일으킨다는 점입니다.
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                        그림자는 없애고 정복해야 할 가여운 적이 아니며, 그렇다고 그 차가운 어둠에 끌려다니며 나 자신과 맹목적으로 동일시해야 할 감옥도 아닙니다.
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3 font-semibold text-indigo-200">
                        오히려 내면에 드리운 어두운 그림자야말로, 진정한 인생의 주체(Subject)로 당당히 서기 위해 늘 펼쳐져 있는 <strong>'가장 눈부시고 고귀한 창조의 밑거름이자 재료'</strong>입니다.
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        나의 예민함, 고집, 불안조차 <strong>"나를 보호하기 위해 작동하던 신성한 초기 설정(Default)"</strong>이었음을 있는 그대로 온전히 <strong>승인(Accept)</strong>하고, 이 그림자를 찬란한 삶을 빚어낼 위대한 연료로 변환하여 귀하게 써 내려갈 때, 비로소 강력한 ✨ <strong>[뉴럴 코드]</strong>의 활성화와 함께 진정한 나로서 살아갈 수 있는 거대한 우주적 원동력이 깨어납니다.
                    </p>
                </div>

                {/* 하단 액션 버튼 */}
                {showActionButton && (
                    <button 
                        onClick={onActionClick}
                        className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] flex justify-center items-center group active:scale-95"
                    >
                        <span>🚀 나의 강점 활용법 코칭받기</span>
                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                )}

                {/* [MODULE] 오늘의 뉴럴 코드 액션 플랜 */}
                <DailyNeuralMissionCard data={data} />

                {/* [MODULE] 월간 명심 리포트 */}
                <MonthlyMindReport />
            </div>

            {/* Tailwind CSS for Custom Animations in this file scope if global not available */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes shimmer {
                    100% { transform: translateX(150%); }
                }
            `}</style>

            {/* [MODULE] 3단계 셀프 코칭 모달 */}
            <NeuralCodeCoachingModal
                isOpen={coachingOpen}
                onClose={() => setCoachingOpen(false)}
                data={coachingData}
            />
        </div>
    );
}
