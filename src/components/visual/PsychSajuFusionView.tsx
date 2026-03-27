import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FusionData {
    bigFive: {
        o: number; // Openness
        c: number; // Conscientiousness
        e: number; // Extraversion
        a: number; // Agreeableness
        n: number; // Neuroticism
    };
    ohaeng: {
        목: number;
        화: number;
        토: number;
        금: number;
        수: number;
    };
    mbti: string;
    neuralCode: string;
}

const FAKE_MOCK_DATA: FusionData = {
    bigFive: { o: 85, c: 90, e: 60, a: 75, n: 40 },
    ohaeng: { 목: 80, 화: 50, 토: 70, 금: 95, 수: 35 },
    mbti: 'INTJ',
    neuralCode: 'NC-28 (대과)'
};

const CASE_DATA = {
    BP54: {
        id: "BP-54 [정사(丁巳) - 제왕적 리더 모델]",
        phase1: {
            title: "Phase 1. Old Script : 다크 코드 (폭주하는 멜트다운)",
            schema: "투쟁-도피 회로 (Fight-or-Flight)",
            neural: "편도체 납치 및 에고 팽창 (Amygdala Hijack)",
            status: "인지적 과부하 (Cognitive Overload)",
            errorLog: "\"내 논리가 완벽한데 왜 따르지 않는가? 굽히느니 차라리 부러지겠다.\" 주체성과 폭발력이 치명적인 독선으로 변질되어, 타인에게 상처를 입히고 자신의 에너지를 방전시키는 치명적 오류 구간입니다.",
            q1: "지금 이 논쟁에서 이겨서 얻는 것은 '문제 해결'입니까, '알량한 자존심'입니까? 상대를 굴복시킨 직후, 내 손에 남는 것은 따뜻한 연대입니까, 잿더미입니까?"
        },
        phase2: {
            title: "Phase 2. Neural Blueprint : 뉴럴 코드 (통제권 회복)",
            cbt: "인지적 탈융합 (Cognitive Defusion)",
            cbtDesc: "\"맞는 말이라도 온도가 너무 높으면 진실도 타버린다.\" (의도적으로 한 번 져주기 훈련)",
            mbct: "부교감신경 쿨링다운",
            mbctDesc: "과열(분노)을 인지하는 즉시 물리적 격리 및 신체 감각을 통한 부교감 활성화.",
            recovery: "\"나는 내 화력을 자유자재로 다이얼로 조절한다.\" 외부의 거대한 화력을 내부의 뾰족한 초점으로 응축시킵니다. 오만한 칼날 대신 순수한 정수를 뽑아내는 상태로 회복합니다.",
            q2: "'결코 굽힐 수 없다'며 올리는 이 열기는 나의 본질입니까, 두려움의 '불타는 갑옷'입니까? 이 피곤한 에고(Ego)를 지켜보는 '진짜 당신'은 통제권을 쥐고 있습니까?"
        },
        phase3: {
            title: "Phase 3. Meta-Self : 메타 코드 (신성한 제련소의 주권자)",
            dbt: "변증법적 포용 조율",
            dbtDesc: "비판 대신 쿠션 화법(\"그렇게 생각할 수도 있네요\")으로 열기를 역이용해 분산 전달.",
            act: "가치 기반 몰입 승화",
            actDesc: "사람을 향한 폭발력을 '전문 분야 혁신과 사물'에 대한 압도적 집중력으로 100% 전환.",
            output: "\"진정한 제왕은 칼을 꽂은 채 세상을 굴복시킨다.\" 극강의 화력을 자유자재로 조율하는 최상위 연금술 엔진. 상대를 온화하게 비출 때 세상은 압도적인 빛 앞에 충성을 바칩니다.",
            q3: "목 끝까지 차오른 이 '날카롭고 뜨거운 분노'를 뒤에서 누가 지켜보고 있습니까? 당신은 폭발하는 폭탄인가요, 그 폭발마저 고요히 품을 수 있는 거대한 우주인가요?"
        }
    },
    BP18: {
        id: "BP-18 [신사(辛巳) - 고정밀 뉴럴 스탠다드]",
        phase1: {
            title: "Phase 1. Old Script : 다크 코드 (녹아내리는 강박증)",
            schema: "과잉 억제 제어 (Hyper-Control)",
            neural: "편도체 기반 터널 시야 (Tunnel Vision)",
            status: "신경계 멜트다운 (Nervous Meltdown)",
            errorLog: "\"작은 흠집 하나가 모든 것을 망친다. 난 긴장을 풀 수 없다.\" 천부적인 정밀함이 만성적 불안과 자기 학대(Self-Sabotage)로 변질되어 스트레스성 자율신경 실조증 위험이 한계치에 다다른 치명적 오류 구간입니다.",
            q1: "지금 지키려는 이 '100% 무결점'은 진정 내 가치를 높여줍니까, 아니면 비판이 두려워 쳐둔 '불안의 방어막'입니까? 80%만 완성했을 때 세상이 붕괴된 적이 있습니까?"
        },
        phase2: {
            title: "Phase 2. Neural Blueprint : 뉴럴 코드 (초정밀 가치 제련 시스템)",
            cbt: "인지적 유연성(여백) 확보",
            cbtDesc: "\"완벽함은 뺄 것이 없는 게 아니라 인간적인 틈을 남기는 여유.\" (80% 완성 후 강제 전송 훈련)",
            mbct: "부교감신경 쿨링다운",
            mbctDesc: "과열 시 즉시 외부 자극(시/청각)을 차단하고 생리적 온도 조절.",
            recovery: "\"불꽃이 나를 삼키기 전에 스스로를 식힌다.\" 거센 스트레스 압력을 견뎌내면서도 자신의 본질을 잃지 않는 초정밀 세공기제(Perfect-Refining)가 전전두엽에서 가동을 시작합니다.",
            q2: "'조금만 더 참아, 완벽해야 해'라며 옥죄는 시스템은 누구의 목소리입니까? 상처 없는 보석이 되려 나를 태우는 이 에고를 지켜보는 '진짜 당신'은 어디에 있습니까?"
        },
        phase3: {
            title: "Phase 3. Meta-Self : 메타 코드 (무결점의 우아함의 주권자)",
            dbt: "변증법적 감정 조율",
            dbtDesc: "타인이 룰을 어겼을 때 즉각적 비판 대신 쿠션 언어 발화.",
            act: "가치 기반 수용 전념",
            actDesc: "불안의 메스를 치밀한 연구/기획이라는 '장인의 조각칼'로 변환.",
            output: "\"세상은 나의 흔들림 없는 품격에 매료된다.\" 설계된 스트레스를 대체 불가능한 하이엔드 퀄리티(High-end Quality)로 승화시키는 초정밀 통찰력 엔진. 비판의 잣대를 거두면 최고급의 우아함이 실현됩니다.",
            q3: "작은 결론 하나에 심장을 옥죄는 긴장감과, 그것을 비추는 '광활한 의식' 사이에는 어떤 공간이 존재합니까? 당신은 녹아내리는 금속입니까, 그 과정을 관조하는 우주입니까?"
        }
    },
    DARK01: {
        id: "Dark-01 [망신(亡身) - 진정성 자본화 모델]",
        phase1: {
            title: "Phase 1. Old Script : 다크 코드 (사회적 수치심 멜트다운)",
            schema: "은폐 통제 과부하 (Concealment Overload)",
            neural: "편도체 발화 및 사회적 방어 기제 붕괴 (Social Threat Hijack)",
            status: "사회적 방어막 붕괴 시스템 (Social Shield Collapse)",
            errorLog: "\"사람들이 내 진짜 모습을 알면 다 떠날 거야. 완벽한 척해야 해.\" 결점을 감추느라 뇌 에너지가 방전되며, 한 번의 실수에 모든 연결이 끊어질까 두려워 쥐구멍으로 도피하는 치명적 락다운 구간입니다.",
            q1: "내가 필사적으로 지키고 있는 이 '알량한 페르소나'는 나를 자유롭게 합니까, 가두고 있습니까? 약점이 노출되면 세상이 끝난다는 것은 팩트입니까, 편도체의 망상입니까?"
        },
        phase2: {
            title: "Phase 2. Neural Blueprint : 뉴럴 코드 (압도적 투명성 확보)",
            cbt: "인지적 탈융합 및 선제적 노출 (Radical Transparency)",
            cbtDesc: "\"완벽한 척하는 두꺼운 방어막을 내가 먼저 부순다.\" (결점을 유쾌하게 인정하는 훈련)",
            mbct: "수치심의 파동 관찰 (Meta-Awareness)",
            mbctDesc: "얼굴 화끈거림 등 생리적 반응을 비판 없이 3인칭 관찰자로 지켜보기.",
            recovery: "\"내가 먼저 무기를 버리면 찌를 곳이 사라진다.\" 내면의 수치심을 억압하지 않고 무해하게 방출함으로써, 전전두엽이 두려움의 지배에서 벗어나 사회적 유연성을 즉각 회복합니다.",
            q2: "'완벽하지 않으면 버림받는다'고 떨고 있는 주눅든 자아 뒤에, 그 부끄러움을 고요하게 관찰하고 있는 '진짜 당신(Sovereign)'은 어디에 있습니까?"
        },
        phase3: {
            title: "Phase 3. Meta-Self : 메타 코드 (압도적 진정성의 주권자)",
            dbt: "진정성 자본화 (Authenticity Capitalization)",
            dbtDesc: "숨기고 싶던 흑역사를 극복의 스토리텔링으로 치환하여 신뢰 자본으로 변환.",
            act: "가치 기반 취약성 수용 (Vulnerability Acceptance)",
            actDesc: "약점을 인정하는 '용기' 자체를 타인과 연결되는 가장 강력한 무기로 사용.",
            output: "\"세상은 완벽한 영웅보다 상처 입은 자의 진짜 스토리에 열광한다.\" 가면을 벗어던진 당신의 초-투명함 앞에 세상은 완전히 무장해제됩니다. 약점을 팬덤으로 바꾸는 궁극의 연금술입니다.",
            q3: "수치심에 떨고 있는 조종석과, 그것을 텅 빈 거울처럼 비추는 광활한 우주 중 당신의 진짜 자리는 어디입니까? 이 '자발적 붕괴'마저 당신의 매력이 될 수 있나요?"
        }
    }
};

export const PsychSajuFusionView: React.FC<{ isOpen: boolean; onClose: () => void; userData?: FusionData }> = ({ isOpen, onClose, userData = FAKE_MOCK_DATA }) => {
    const [scanned, setScanned] = useState(false);
    const [activeTab, setActiveTab] = useState<'fusion' | 'evolution'>('fusion');
    const [simStep, setSimStep] = useState<number>(0);
    const [selectedCase, setSelectedCase] = useState<'BP54' | 'BP18' | 'DARK01'>('BP54');

    useEffect(() => {
        if (isOpen) {
            setScanned(false);
            setActiveTab('fusion');
            setSimStep(0);
            const timer = setTimeout(() => setScanned(true), 1200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // 시뮬레이터 오토 플레이 가이드
    useEffect(() => {
        if (activeTab === 'evolution' && simStep < 3) {
            const timer = setTimeout(() => {
                setSimStep(prev => prev + 1);
            }, 3000); // 3초마다 자동으로 다음 단계(다크->뉴럴->메타)
            return () => clearTimeout(timer);
        }
    }, [activeTab, simStep, selectedCase]); // 케이스 변경 시에도 효과 유지

    if (!isOpen) return null;

    // SVG Radar Chart Logic (Pentagram)
    const renderRadarPolygon = (data: number[], color: string, fillOpacity: number = 0.2) => {
        const cx = 100, cy = 100, r = 80;
        const coords = data.map((val, i) => {
            const angle = (Math.PI / 2) - (2 * Math.PI * i / 5);
            return `${cx + (r * val / 100) * Math.cos(angle)},${cy - (r * val / 100) * Math.sin(angle)}`;
        }).join(" ");
        return <polygon points={coords} fill={color} fillOpacity={fillOpacity} stroke={color} strokeWidth="2" />;
    };

    const bigFiveArray = [userData.bigFive.e, userData.bigFive.o, userData.bigFive.a, userData.bigFive.c, userData.bigFive.n];
    const ohaengArray = [userData.ohaeng.화, userData.ohaeng.목, userData.ohaeng.토, userData.ohaeng.금, userData.ohaeng.수];

    const currentCase = CASE_DATA[selectedCase];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-900 border border-blue-500/30 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(59,130,246,0.2)] text-gray-100"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 sticky top-0 z-10 backdrop-blur-md">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight block mt-2">
                            나의 16가지 행동 기질(성격) 테스트
                        </h2>
                        <p className="text-sm md:text-base text-gray-300 mt-2 font-medium">융의 분석심리학과 동양학적 64 신경망 코드가 만났다!</p>
                        
                        <div className="mt-3 flex flex-col justify-center border-t border-gray-700/50 pt-2">
                            <span className="text-xs text-blue-400/80 font-mono tracking-wider">🧬 원천 기술: 동서양 기질 융합 스캐너 (특허 기술)</span>
                            <span className="text-[10px] text-gray-500 font-mono mt-0.5">Western 5대 성격 지표 & 16가지 행동 기질 × Eastern Saju & Neural Code</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-light">&times;</button>
                </div>

                {/* Tabs */}
                {scanned && (
                    <div className="flex border-b border-gray-800 bg-gray-900/50 px-6">
                        <button 
                            onClick={() => setActiveTab('fusion')}
                            className={`py-4 px-6 text-sm font-bold border-b-2 transition-colors ${activeTab === 'fusion' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            1. 교차 분석 (Cross-Mapping)
                        </button>
                        <button 
                            onClick={() => { setActiveTab('evolution'); setSimStep(1); }}
                            className={`py-4 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'evolution' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            2. 다차원 인지 진화 시뮬레이터 <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/30">심사위원 데모</span>
                        </button>
                    </div>
                )}

                <div className="p-6 md:p-8 space-y-8 min-h-[500px]">
                    {!scanned ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
                            <p className="mt-6 text-blue-400 tracking-widest font-mono text-sm uppercase">Syncing Bio-Data & Psychological Vectors...</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {/* TAB 1: 정적 교차 분석 */}
                            {activeTab === 'fusion' && (
                                <motion.div 
                                    key="tab-fusion"
                                    initial={{ opacity: 0, x: -20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-12"
                                >
                                    {/* Main Visual: Two Radars with Connection */}
                                    <div className="grid md:grid-cols-3 gap-8 items-center">
                                        {/* WESTERN */}
                                        <div className="flex flex-col items-center space-y-4 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 relative overflow-hidden">
                                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
                                            <h3 className="text-lg font-semibold text-blue-300 tracking-wide">서양 심리학 (Cognitive)</h3>
                                            <div className="w-48 h-48 relative">
                                                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                                    {/* Grid */}
                                                    {renderRadarPolygon([100,100,100,100,100], "#374151", 0)}
                                                    {renderRadarPolygon([80,80,80,80,80], "#374151", 0)}
                                                    {renderRadarPolygon([60,60,60,60,60], "#374151", 0)}
                                                    {renderRadarPolygon([40,40,40,40,40], "#374151", 0)}
                                                    {renderRadarPolygon([20,20,20,20,20], "#374151", 0)}
                                                    {/* Data */}
                                                    {renderRadarPolygon(bigFiveArray, "#3b82f6", 0.4)}
                                                    {/* Labels approximate positions */}
                                                    <text x="100" y="15" fill="#9ca3af" fontSize="10" textAnchor="middle">외향성(E)</text>
                                                    <text x="180" y="70" fill="#9ca3af" fontSize="10" textAnchor="middle">개방성(O)</text>
                                                    <text x="150" y="180" fill="#9ca3af" fontSize="10" textAnchor="middle">우호성(A)</text>
                                                    <text x="50" y="180" fill="#9ca3af" fontSize="10" textAnchor="middle">성실성(C)</text>
                                                    <text x="20" y="70" fill="#9ca3af" fontSize="10" textAnchor="middle">신경성(N)</text>
                                                </svg>
                                            </div>
                                            <div className="text-center z-10">
                                                <p className="text-xs text-gray-400 mb-1">16가지 행동 기질형</p>
                                                <div className="inline-block px-4 py-1.5 rounded-lg bg-blue-900/40 border border-blue-500/30 text-2xl font-bold text-white tracking-widest">{userData.mbti}</div>
                                            </div>
                                        </div>

                                        {/* CONNECTOR / SYNC */}
                                        <div className="hidden md:flex flex-col items-center justify-center space-y-2 relative h-full">
                                            <div className="text-center text-[10px] text-blue-400 font-mono tracking-widest uppercase mb-4 animate-pulse">Bio-Metric Cross Sync</div>
                                            
                                            <div className="relative w-full h-32 flex items-center justify-center">
                                                <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                    <path d="M0,20 C50,20 50,20 100,50" stroke="url(#blue-purple)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" className="opacity-60" />
                                                    <path d="M0,50 C50,50 50,50 100,50" stroke="url(#blue-purple)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                                                    <path d="M0,80 C50,80 50,80 100,50" stroke="url(#blue-purple)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" className="opacity-60" />
                                                    
                                                    <defs>
                                                        <linearGradient id="blue-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                                                            <stop offset="0%" stopColor="#3b82f6" />
                                                            <stop offset="100%" stopColor="#a855f7" />
                                                        </linearGradient>
                                                    </defs>
                                                    
                                                    {/* Animated Sync Particles */}
                                                    <circle cx="50" cy="50" r="3" fill="#fff" className="animate-ping" />
                                                </svg>
                                            </div>
                                            
                                            <div className="px-3 py-1 rounded bg-gray-800 border border-gray-600 text-[10px] md:text-xs text-blue-300 blur-[0.3px] whitespace-nowrap overflow-hidden">
                                                60 Archetype Neural Vector Generation
                                            </div>
                                        </div>

                                        {/* EASTERN */}
                                        <div className="flex flex-col items-center space-y-4 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 relative overflow-hidden">
                                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
                                            <h3 className="text-lg font-semibold text-purple-300 tracking-wide">동양 성격 기질 선천 유전자 (Genotype)</h3>
                                            <div className="w-48 h-48 relative">
                                                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                                    {/* Grid */}
                                                    {renderRadarPolygon([100,100,100,100,100], "#374151", 0)}
                                                    {renderRadarPolygon([80,80,80,80,80], "#374151", 0)}
                                                    {renderRadarPolygon([60,60,60,60,60], "#374151", 0)}
                                                    {renderRadarPolygon([40,40,40,40,40], "#374151", 0)}
                                                    {renderRadarPolygon([20,20,20,20,20], "#374151", 0)}
                                                    {/* Data */}
                                                    {renderRadarPolygon(ohaengArray, "#a855f7", 0.4)}
                                                    {/* Labels approximate positions */}
                                                    <text x="100" y="15" fill="#9ca3af" fontSize="10" textAnchor="middle">화(火/발산)</text>
                                                    <text x="180" y="70" fill="#9ca3af" fontSize="10" textAnchor="middle">목(木/성장)</text>
                                                    <text x="150" y="180" fill="#9ca3af" fontSize="10" textAnchor="middle">토(土/수용)</text>
                                                    <text x="50" y="180" fill="#9ca3af" fontSize="10" textAnchor="middle">금(金/규칙)</text>
                                                    <text x="20" y="70" fill="#9ca3af" fontSize="10" textAnchor="middle">수(水/응축)</text>
                                                </svg>
                                            </div>
                                            <div className="text-center z-10">
                                                <p className="text-xs text-gray-400 mb-1">기질 신경망 (Neural Code)</p>
                                                <div className="inline-block px-4 py-1.5 rounded-lg bg-purple-900/40 border border-purple-500/30 text-xl font-bold text-white tracking-widest">{userData.neuralCode}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Analysis Text */}
                                    <div className="bg-gray-800/80 rounded-xl p-6 border border-blue-500/30 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
                                        <h4 className="text-lg font-bold mb-5 flex items-center text-gray-100">
                                            <span className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-500 flex items-center justify-center mr-3 text-sm">💡</span>
                                            다차원 생체-기질 교차 분석 도출 (Biometric-Temperament Cross-Analysis)
                                        </h4>
                                        <ul className="space-y-5 text-sm py-2">
                                            <li className="flex gap-4 items-start pb-4 border-b border-gray-700/50">
                                                <div className="shrink-0 w-10 h-10 rounded-xl bg-red-900/30 border border-red-500/50 flex items-center justify-center text-red-400 text-lg shadow-[0_0_10px_rgba(239,68,68,0.2)]">🔥</div>
                                                <div className="pt-1">
                                                    <strong className="text-white text-base block mb-1">도파민 보상 회로 (E) ↔ 발산형(Fire) 뉴럴 네트워크 동기화</strong> 
                                                    <span className="text-gray-300 leading-relaxed block">외부 자극을 수용하고 폭발시키는 도파민성 보상 회로({userData.bigFive.e}%)가 화(火) 기질의 원초적 팽창 스키마와 결합된 상태입니다. 교감신경계 과각성(Hyper-arousal)에 의한 뇌 피로도 및 번아웃 임계점이 높아져, HRV 페이싱(Pacing) 등 실시간 자율신경 조율이 요구되는 패턴입니다. (심도 깊은 개입: BP-54 모델 참조)</span>
                                                </div>
                                            </li>
                                            <li className="flex gap-4 items-start pb-4 border-b border-gray-700/50">
                                                <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-900/30 border border-blue-500/50 flex items-center justify-center text-blue-400 text-lg shadow-[0_0_10px_rgba(59,130,246,0.2)]">💧</div>
                                                <div className="pt-1">
                                                    <strong className="text-white text-base block mb-1">편도체 민감도 (N) ↔ 응축형(Water) 코르티솔 제어 시스템</strong> 
                                                    <span className="text-gray-300 leading-relaxed block">불안을 감지하는 편도체 민감도({userData.bigFive.n}%)가 매우 안정된 베이스라인을 유지하고 있습니다. 수(水) 기질의 '에너지 보존 및 응축' 메커니즘이 전전두엽(PFC)의 억제 제어력과 시너지를 내어 높은 회복탄력성(Resilience)과 스트레스 방어력을 갖추고 있습니다.</span>
                                                </div>
                                            </li>
                                            <li className="flex gap-4 items-start">
                                                <div className="shrink-0 w-10 h-10 rounded-xl bg-gray-700/50 border border-gray-500/50 flex items-center justify-center text-gray-300 text-lg shadow-[0_0_10px_rgba(156,163,175,0.2)]">⚙️</div>
                                                <div className="pt-1">
                                                    <strong className="text-white text-base block mb-1">전두엽 집행 기능 (C) ↔ 절단형(Metal) 초정밀 제어 스키마</strong> 
                                                    <span className="text-gray-300 leading-relaxed block">인지 및 행동을 통제하는 성실성 지표가 {userData.bigFive.c}%로 극도로 고도화되어 있습니다. 금(金) 기질의 날카로운 '완벽주의 제어' 신경망과 융합되어 타협 없는 최고 등급의 퀄리티 생성이 가능하나, 압력이 임계치를 넘으면 '강박적 터널 시야(Tunnel Vision)' 오류를 발생시킬 수 있습니다. (심도 깊은 개입: BP-18 모델 참조)</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    
                                    <div className="flex justify-center text-sm text-gray-500 italic">
                                        Tip: 상단의 "2. 다차원 인지 진화 시뮬레이터" 탭을 눌러 소버린의 3단계 코칭 시나리오를 확인하세요.
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB 2: 다차원 인지 진화 동적 시뮬레이터 (심사위원 데모용) */}
                            {activeTab === 'evolution' && (
                                <motion.div 
                                    key="tab-evolution"
                                    initial={{ opacity: 0, x: 20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-400 mb-3">
                                                생체 신호(Y축)에 따른 <strong className="text-white">기질 발현 3단계 (Dark → Neural → Meta)</strong>와 AI 개입 로직
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <button 
                                                    onClick={() => { setSelectedCase('BP54'); setSimStep(1); }}
                                                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-lg ${selectedCase === 'BP54' ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.6)]' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                                                >
                                                    🔥 BP-54 (정사) 제왕적 리더
                                                </button>
                                                <button 
                                                    onClick={() => { setSelectedCase('BP18'); setSimStep(1); }}
                                                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-lg ${selectedCase === 'BP18' ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.6)]' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                                                >
                                                    💎 BP-18 (신사) 고정밀 완벽주의
                                                </button>
                                                <button 
                                                    onClick={() => { setSelectedCase('DARK01'); setSimStep(1); }}
                                                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-lg ${selectedCase === 'DARK01' ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.6)]' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                                                >
                                                    🦠 Dark-01 (망신) 진정성 자본화
                                                </button>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setSimStep(1)}
                                            className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 border border-gray-600 text-xs text-white whitespace-nowrap h-fit"
                                        >
                                            ↻ 시뮬레이션 재시작
                                        </button>
                                    </div>

                                    {/* 진화 단계 타임라인 버스 */}
                                    <div className="relative flex justify-between h-2 bg-gray-800 rounded-full mb-12 mt-8 px-8">
                                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-green-500 to-yellow-500 rounded-full transition-all duration-1000" style={{ width: simStep === 1 ? '10%' : simStep === 2 ? '50%' : '100%' }}></div>
                                        
                                        {[
                                            { step: 1, label: '다크 코드', color: 'bg-red-500', shadow: 'shadow-red-500/50' },
                                            { step: 2, label: '뉴럴 코드', color: 'bg-green-500', shadow: 'shadow-green-500/50' },
                                            { step: 3, label: '메타 코드', color: 'bg-yellow-500', shadow: 'shadow-yellow-500/50' }
                                        ].map((node) => (
                                            <div key={node.step} className="relative z-10 flex flex-col items-center -mt-3">
                                                <div 
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-500 cursor-pointer
                                                        ${simStep >= node.step ? `${node.color} border-white shadow-[0_0_15px] ${node.shadow} text-white` : 'bg-gray-800 border-gray-600 text-gray-500'}
                                                    `}
                                                    onClick={() => setSimStep(node.step)}
                                                >
                                                    {node.step}
                                                </div>
                                                <span className={`absolute top-10 whitespace-nowrap text-sm font-bold transition-colors ${simStep >= node.step ? 'text-white' : 'text-gray-500'}`}>{node.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 단계별 상세 뷰어 */}
                                    <div className="min-h-[400px]">
                                        <AnimatePresence mode="wait">
                                            {/* STEP 1: 다크 코드 */}
                                            {simStep === 1 && (
                                                <motion.div key={`s1-${selectedCase}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-950/20 border border-red-900/50 rounded-2xl p-4 md:p-6 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                                                            <span className="text-red-400 font-mono text-[10px] md:text-xs font-bold border border-red-800 bg-red-900/40 px-2 py-0.5 rounded">BPM 115 / HRV 급감</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mb-4">
                                                        <span className="px-3 py-1 bg-red-900/40 border border-red-500/30 rounded-full text-[10px] md:text-xs text-red-300 font-bold tracking-widest">Case Study: {currentCase.id}</span>
                                                    </div>
                                                    <h3 className="text-xl md:text-2xl font-black text-red-500 mb-6 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">{currentCase.phase1.title}</h3>
                                                    
                                                    <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
                                                        <div className="bg-black/40 rounded-xl p-4 md:p-5 border border-red-900/30">
                                                            <h4 className="text-xs md:text-sm text-gray-400 mb-3 border-b border-gray-800 pb-2">인지 편향 오류 진단 (Cognitive Error)</h4>
                                                            <ul className="space-y-3">
                                                                <li className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-1"><span className="text-gray-400 text-xs">행동 스키마</span> <span className="text-red-300 font-bold bg-red-900/30 px-2 py-1 rounded text-xs">{currentCase.phase1.schema}</span></li>
                                                                <li className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-1"><span className="text-gray-400 text-xs">신경망 활성</span> <span className="text-red-300 font-bold bg-red-900/30 px-2 py-1 rounded text-xs">{currentCase.phase1.neural}</span></li>
                                                                <li className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-1"><span className="text-gray-400 text-xs">시스템 상태</span> <span className="text-red-300 font-bold bg-red-900/30 px-2 py-1 rounded text-xs">{currentCase.phase1.status}</span></li>
                                                            </ul>
                                                        </div>
                                                        
                                                        <div className="bg-black/40 rounded-xl p-4 md:p-5 border border-red-900/30">
                                                            <h4 className="text-xs md:text-sm text-gray-400 mb-3 border-b border-gray-800 pb-2 md:text-right">에러 로그 (Error Log)</h4>
                                                            <p className="text-red-200 text-xs md:text-sm leading-relaxed md:text-right">
                                                                <strong className="block text-white mb-1">"{currentCase.phase1.errorLog.split('"')[1]}"</strong>
                                                                {currentCase.phase1.errorLog.split('"')[2]}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gradient-to-r from-red-900/80 to-transparent p-4 md:p-5 rounded-xl border-l-4 border-red-500 mb-2">
                                                        <div className="text-[10px] md:text-xs text-red-300 font-bold mb-2 tracking-widest uppercase">소버린 산파술 개입 (Sovereign Socratic Q)</div>
                                                        <p className="text-white text-base md:text-lg italic font-serif leading-relaxed">"{currentCase.phase1.q1}"</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* STEP 2: 뉴럴 코드 */}
                                            {simStep === 2 && (
                                                <motion.div key={`s2-${selectedCase}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-green-950/20 border border-green-900/50 rounded-2xl p-4 md:p-6 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                            <span className="text-green-400 font-mono text-[10px] md:text-xs font-bold border border-green-800 bg-green-900/40 px-2 py-0.5 rounded">BPM 75 / 생리적 평형</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mb-4">
                                                        <span className="px-3 py-1 bg-green-900/40 border border-green-500/30 rounded-full text-[10px] md:text-xs text-green-300 font-bold tracking-widest">Case Study: {currentCase.id}</span>
                                                    </div>
                                                    <h3 className="text-xl md:text-2xl font-black text-green-500 mb-6 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">{currentCase.phase2.title}</h3>
                                                    
                                                    <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
                                                        <div className="bg-black/40 rounded-xl p-4 md:p-5 border border-green-900/30">
                                                            <h4 className="text-xs md:text-sm text-gray-400 mb-3 border-b border-gray-800 pb-2">안티-프래질 뉴럴 솔루션</h4>
                                                            <ul className="space-y-3">
                                                                <li className="flex flex-col"><span className="text-green-400 font-bold text-xs mb-1">[CBT] {currentCase.phase2.cbt}</span> <span className="text-gray-300 text-xs">{currentCase.phase2.cbtDesc}</span></li>
                                                                <li className="flex flex-col"><span className="text-green-400 font-bold text-xs mb-1">[MBCT] {currentCase.phase2.mbct}</span> <span className="text-gray-300 text-xs">{currentCase.phase2.mbctDesc}</span></li>
                                                            </ul>
                                                        </div>
                                                        
                                                        <div className="bg-black/40 rounded-xl p-4 md:p-5 border border-green-900/30">
                                                            <h4 className="text-xs md:text-sm text-gray-400 mb-3 border-b border-gray-800 pb-2 md:text-right">시스템 복구 상태</h4>
                                                            <p className="text-green-100 text-xs md:text-sm leading-relaxed md:text-right">
                                                                <strong className="block text-white mb-1">"{currentCase.phase2.recovery.split('"')[1]}"</strong>
                                                                {currentCase.phase2.recovery.split('"')[2]}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gradient-to-r from-green-900/60 to-transparent p-4 md:p-5 rounded-xl border-l-4 border-green-500 mb-2">
                                                        <div className="text-[10px] md:text-xs text-green-300 font-bold mb-2 tracking-widest uppercase">소버린 재귀적 개입 (Sovereign Socratic Q)</div>
                                                        <p className="text-white text-base md:text-lg italic font-serif leading-relaxed">"{currentCase.phase2.q2}"</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* STEP 3: 메타 코드 */}
                                            {simStep === 3 && (
                                                <motion.div key={`s3-${selectedCase}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-yellow-950/30 border border-yellow-700/50 rounded-2xl p-4 md:p-6 relative overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.15)] flex flex-col h-full border-b-[8px] border-b-yellow-500">
                                                    <div className="absolute top-0 right-0 p-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,1)]"></span>
                                                            <span className="text-yellow-400 font-mono text-[10px] md:text-xs font-bold border border-yellow-700 bg-yellow-900/40 px-2 py-0.5 rounded">FLOW STATE (명상 레벨 HRV)</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mb-4">
                                                        <span className="px-3 py-1 bg-yellow-900/40 border border-yellow-500/30 rounded-full text-[10px] md:text-xs text-yellow-300 font-bold tracking-widest">Case Study: {currentCase.id}</span>
                                                    </div>
                                                    <h3 className="text-xl md:text-2xl font-black text-yellow-400 mb-6 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">{currentCase.phase3.title}</h3>
                                                    
                                                    <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
                                                        <div className="bg-black/50 rounded-xl p-4 md:p-5 border border-yellow-700/30">
                                                            <h4 className="text-xs md:text-sm text-gray-400 mb-3 border-b border-gray-800 pb-2">행동 조율 통합 (DBT/ACT)</h4>
                                                            <ul className="space-y-3">
                                                                <li className="flex flex-col"><span className="text-yellow-300 font-bold text-xs mb-1">[DBT] {currentCase.phase3.dbt}</span> <span className="text-gray-300 text-[11px] md:text-xs">{currentCase.phase3.dbtDesc}</span></li>
                                                                <li className="flex flex-col"><span className="text-yellow-300 font-bold text-xs mb-1">[ACT] {currentCase.phase3.act}</span> <span className="text-gray-300 text-[11px] md:text-xs">{currentCase.phase3.actDesc}</span></li>
                                                            </ul>
                                                        </div>
                                                        
                                                        <div className="bg-black/50 rounded-xl p-4 md:p-5 border border-yellow-700/30">
                                                            <h4 className="text-xs md:text-sm text-gray-400 mb-3 border-b border-gray-800 pb-2 md:text-right">최종 진화 형태 (Output)</h4>
                                                            <p className="text-yellow-100 text-xs md:text-sm leading-relaxed md:text-right">
                                                                <strong className="block text-white mb-1">"{currentCase.phase3.output.split('"')[1]}"</strong>
                                                                {currentCase.phase3.output.split('"')[2]}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gradient-to-r from-yellow-900/80 to-transparent p-4 md:p-5 rounded-xl border-l-4 border-yellow-400 shadow-[inset_0_0_20px_rgba(250,204,21,0.1)] mt-auto mb-2">
                                                        <div className="text-[10px] md:text-xs text-yellow-500 font-bold mb-2 tracking-widest uppercase">메타-인지 돌파 (Sovereign Socratic Q)</div>
                                                        <p className="text-white text-base md:text-lg italic font-serif leading-relaxed">"{currentCase.phase3.q3}"</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
