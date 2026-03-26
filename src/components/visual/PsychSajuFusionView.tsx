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

export const PsychSajuFusionView: React.FC<{ isOpen: boolean; onClose: () => void; userData?: FusionData }> = ({ isOpen, onClose, userData = FAKE_MOCK_DATA }) => {
    const [scanned, setScanned] = useState(false);
    const [activeTab, setActiveTab] = useState<'fusion' | 'evolution'>('fusion');
    const [simStep, setSimStep] = useState<number>(0);

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
    }, [activeTab, simStep]);

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
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            🧬 동서양 기질 융합 스캐너 (특허 기술)
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">Western 5대 성격 지표 & 16가지 행동 기질 × Eastern Saju & Neural Code</p>
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
                                            
                                            <div className="px-3 py-1 rounded bg-gray-800 border border-gray-600 text-xs text-gray-300 blur-[0.3px]">60갑자 기반 벡터 생성</div>
                                        </div>

                                        {/* EASTERN */}
                                        <div className="flex flex-col items-center space-y-4 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 relative overflow-hidden">
                                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
                                            <h3 className="text-lg font-semibold text-purple-300 tracking-wide">동양 명리학 (Genotype)</h3>
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
                                            인지행동 (Cognitive) × 오행 (Ohaeng) 에너지 교차 분석 도출
                                        </h4>
                                        <ul className="space-y-5 text-sm py-2">
                                            <li className="flex gap-4 items-start pb-4 border-b border-gray-700/50">
                                                <div className="shrink-0 w-10 h-10 rounded-xl bg-red-900/30 border border-red-500/50 flex items-center justify-center text-red-400 text-lg shadow-[0_0_10px_rgba(239,68,68,0.2)]">🔥</div>
                                                <div className="pt-1">
                                                    <strong className="text-white text-base block mb-1">외향성(E) ↔ 화(Fire) 에너지 동기화</strong> 
                                                    <span className="text-gray-300 leading-relaxed block">외부로 향하는 목표 지향적 에너지가 높은 수치({userData.bigFive.e}%)로 측정되었습니다. 화(火) 기운의 팽창성과 결합되어, 번아웃 위험도(과각성)가 높아 스마트워치 모니터링이 필수입니다.</span>
                                                </div>
                                            </li>
                                            <li className="flex gap-4 items-start pb-4 border-b border-gray-700/50">
                                                <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-900/30 border border-blue-500/50 flex items-center justify-center text-blue-400 text-lg shadow-[0_0_10px_rgba(59,130,246,0.2)]">💧</div>
                                                <div className="pt-1">
                                                    <strong className="text-white text-base block mb-1">신경성(N) ↔ 수(Water) 에너지 동기화</strong> 
                                                    <span className="text-gray-300 leading-relaxed block">신경성(불안도) 수치는 {userData.bigFive.n}%로 안정적 범위입니다. 수(水) 에너지의 '응축 및 저장' 시스템이 전전두엽 억제 제어력과 조화롭게 작동하여 뛰어난 회복탄력성을 보입니다.</span>
                                                </div>
                                            </li>
                                            <li className="flex gap-4 items-start">
                                                <div className="shrink-0 w-10 h-10 rounded-xl bg-gray-700/50 border border-gray-500/50 flex items-center justify-center text-gray-300 text-lg shadow-[0_0_10px_rgba(156,163,175,0.2)]">⚙️</div>
                                                <div className="pt-1">
                                                    <strong className="text-white text-base block mb-1">성실성(C) ↔ 금(Metal) 에너지 동기화</strong> 
                                                    <span className="text-gray-300 leading-relaxed block">성실성이 {userData.bigFive.c}%로 극도로 발달되어 있습니다. 이는 금(金) 특유의 단절/규정 에너지와 충돌할 경우 강박적 사고("~해야만 한다")로 왜곡될 수 있으나, 집중 시 탁월한 성취를 냅니다.</span>
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
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-sm text-gray-400">
                                            생체 신호(Y축)에 따른 <strong className="text-white">사주 기질의 발현 3단계 (Dark → Neural → Meta)</strong>와 AI 개입 로직
                                        </p>
                                        <button 
                                            onClick={() => setSimStep(1)}
                                            className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-600 text-xs text-white"
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
                                                <span className={`absolute top-10 whitespace-nowrap text-sm font-bold ${simStep >= node.step ? 'text-white' : 'text-gray-500'}`}>{node.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 단계별 상세 뷰어 */}
                                    <div className="min-h-[400px]">
                                        {/* STEP 1: 다크 코드 */}
                                        {simStep === 1 && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-950/20 border border-red-900/50 rounded-2xl p-6 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                                                        <span className="text-red-400 font-mono text-xs font-bold border border-red-800 bg-red-900/40 px-2 py-0.5 rounded">BPM 115 / HRV 급감</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-4">
                                                    <span className="px-3 py-1 bg-red-900/40 border border-red-500/30 rounded-full text-xs text-red-300 font-bold tracking-widest">Case Study: BP-54 [정사(丁巳)]</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-red-500 mb-6 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">Phase 1. Old Script : 다크 코드 (모든 것을 태우는 독재자)</h3>
                                                
                                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                                    <div className="bg-black/40 rounded-xl p-5 border border-red-900/30">
                                                        <h4 className="text-sm text-gray-400 mb-3 border-b border-gray-800 pb-2">동양기질 진단 (사주 매핑)</h4>
                                                        <ul className="space-y-3">
                                                            <li className="flex justify-between items-center"><span className="text-gray-400">10대 인지행동 (십신)</span> <span className="text-red-300 font-bold bg-red-900/30 px-2 py-1 rounded">겁재 (경쟁/투쟁심의 폭주)</span></li>
                                                            <li className="flex justify-between items-center"><span className="text-gray-400">생체 에너지 (12운성)</span> <span className="text-red-300 font-bold bg-red-900/30 px-2 py-1 rounded">제왕(帝王) (오만한 절대권력)</span></li>
                                                            <li className="flex justify-between items-center"><span className="text-gray-400">시스템 오류 상태</span> <span className="text-red-300 font-bold bg-red-900/30 px-2 py-1 rounded">멜트다운 (Meltdown)</span></li>
                                                        </ul>
                                                    </div>
                                                    
                                                    <div className="bg-black/40 rounded-xl p-5 border border-red-900/30">
                                                        <h4 className="text-sm text-gray-400 mb-3 border-b border-gray-800 pb-2 text-right">에러 로그 (Error Log)</h4>
                                                        <p className="text-red-200 text-sm leading-relaxed text-right">
                                                            <strong className="block text-white mb-1">"내 논리가 완벽한데 왜 따르지 않는가? 굽히느니 차라리 부러지겠다."</strong>
                                                            압도적인 집중력과 주체성이 '치명적인 독선'으로 변질되었습니다. 옳고 그름을 따지다가 정작 소중한 사람들에게 회복 불가능한 화상(상처)을 입히고 에너지를 방전시키는 치명적 오류 구간입니다.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-r from-red-900/80 to-transparent p-5 rounded-xl border-l-4 border-red-500 mb-4">
                                                    <div className="text-xs text-red-300 font-bold mb-2 tracking-widest uppercase">능동형 개입 (Sovereign Socratic Q - Step 1. 자각)</div>
                                                    <p className="text-white text-lg italic font-serif">"내가 지금 이 논쟁에서 이겨서 얻으려는 것은 '문제 해결'인가요, 아니면 '알량한 자존심'인가요? 상대를 굴복시킨 직후, 내 손에 남는 것은 따뜻한 연대입니까, 잿더미입니까?"</p>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* STEP 2: 뉴럴 코드 */}
                                        {simStep === 2 && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-950/20 border border-green-900/50 rounded-2xl p-6 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                        <span className="text-green-400 font-mono text-xs font-bold border border-green-800 bg-green-900/40 px-2 py-0.5 rounded">BPM 75 / 생리적 평형</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-4">
                                                    <span className="px-3 py-1 bg-green-900/40 border border-green-500/30 rounded-full text-xs text-green-300 font-bold tracking-widest">Case Study: BP-54 [정사(丁巳)]</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-green-500 mb-6 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">Phase 2. Neural Blueprint : 뉴럴 코드 (핵심 회로)</h3>
                                                
                                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                                    <div className="bg-black/40 rounded-xl p-5 border border-green-900/30">
                                                        <h4 className="text-sm text-gray-400 mb-3 border-b border-gray-800 pb-2">뉴럴 솔루션 (4대 치료 통합)</h4>
                                                        <ul className="space-y-3">
                                                            <li className="flex flex-col"><span className="text-green-400 font-bold text-xs mb-1">[CBT] '옳음'보다 '연결' 선택하기</span> <span className="text-gray-300 text-xs">"맞는 말이라도 온도가 너무 높으면 진실도 타버린다."</span></li>
                                                            <li className="flex flex-col"><span className="text-green-400 font-bold text-xs mb-1">[MBCT] 인공 냉각수 투입</span> <span className="text-gray-300 text-xs">얼굴로 열이 뻗칠 때 제왕의 폭주 회로를 인지하고 물리적 냉각.</span></li>
                                                        </ul>
                                                    </div>
                                                    
                                                    <div className="bg-black/40 rounded-xl p-5 border border-green-900/30">
                                                        <h4 className="text-sm text-gray-400 mb-3 border-b border-gray-800 pb-2 text-right">시스템 복구 상태</h4>
                                                        <p className="text-green-100 text-sm leading-relaxed text-right">
                                                            <strong className="block text-white mb-1">"나는 내 화력을 자유자재로 다이얼로 조절한다."</strong>
                                                            외부의 거대한 화력(巳)을 내부의 뾰족한 초점(丁)으로 조절합니다. 상대방을 베어버리는 오만한 칼날 대신, 불순물을 태워 순수한 정수를 뽑아내는 '진리의 연금술사'로 회귀합니다.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-r from-green-900/60 to-transparent p-5 rounded-xl border-l-4 border-green-500">
                                                    <div className="text-xs text-green-300 font-bold mb-2 tracking-widest uppercase">능동형 개입 (Sovereign Socratic Q - Step 2. 재귀적 관찰)</div>
                                                    <p className="text-white text-lg italic font-serif">"'결코 굽힐 수 없다'며 올리는 이 열기는 나의 본질인가요, 두려움의 '불타는 갑옷'인가요? 이 피곤한 에고(Ego)를 지켜보는 당신의 주권자(Sovereign)는 이를 어떻게 평가합니까?"</p>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* STEP 3: 메타 코드 */}
                                        {simStep === 3 && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-950/30 border border-yellow-700/50 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.15)] flex flex-col h-full">
                                                <div className="absolute top-0 right-0 p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,1)]"></span>
                                                        <span className="text-yellow-400 font-mono text-xs font-bold border border-yellow-700 bg-yellow-900/40 px-2 py-0.5 rounded">FLOW STATE (명상 레벨 HRV)</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-4">
                                                    <span className="px-3 py-1 bg-yellow-900/40 border border-yellow-500/30 rounded-full text-xs text-yellow-300 font-bold tracking-widest">Case Study: BP-54 [정사(丁巳)]</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-yellow-400 mb-6 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">Phase 3. Meta-Self : 메타 코드 (신성한 제련소의 주권자)</h3>
                                                
                                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                                    <div className="bg-black/50 rounded-xl p-5 border border-yellow-700/30">
                                                        <h4 className="text-sm text-gray-400 mb-3 border-b border-gray-800 pb-2">통합 액션 (DBT/ACT)</h4>
                                                        <ul className="space-y-3">
                                                            <li className="flex flex-col"><span className="text-yellow-300 font-bold text-xs mb-1">[DBT] 샌드위치 화법</span> <span className="text-gray-300 text-xs text-tight">직설화법 대신 포용의 여유를 담아 열기를 분산시켜 전달.</span></li>
                                                            <li className="flex flex-col"><span className="text-yellow-300 font-bold text-xs mb-1">[ACT] 진리의 횃불 실천</span> <span className="text-gray-300 text-xs text-tight">끓어오르는 경쟁심을 사람 대신 '사물과 일(혁신)'에 100% 쏟아붓기.</span></li>
                                                        </ul>
                                                    </div>
                                                    
                                                    <div className="bg-black/50 rounded-xl p-5 border border-yellow-700/30">
                                                        <h4 className="text-sm text-gray-400 mb-3 border-b border-gray-800 pb-2 text-right">최종 진화 형태 (Output)</h4>
                                                        <p className="text-yellow-100 text-sm leading-relaxed text-right">
                                                            <strong className="block text-white mb-1">"진정한 제왕은 칼을 꽂은 채 세상을 굴복시킨다."</strong>
                                                            거친 쇳덩이를 베어내는 최상위 연금술 엔진. 논쟁의 칼을 거두고 세상을 온화하게 비출 때, 모두가 그 압도적인 빛 앞에 스스로 무기를 내려놓고 충성을 바칩니다.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-r from-yellow-900/80 to-transparent p-5 rounded-xl border-l-4 border-yellow-400 shadow-[inset_0_0_20px_rgba(250,204,21,0.1)] mt-auto">
                                                    <div className="text-xs text-yellow-500 font-bold mb-2 tracking-widest uppercase">능동형 개입 (Sovereign Socratic Q - Step 3. 메타 초월)</div>
                                                    <p className="text-white text-lg italic font-serif">"목 끝까지 차오른 이 '날카롭고 뜨거운 분노'를 뒤에서 누가 지켜보고 있습니까? 나는 폭발하는 폭탄인가요, 아니면 그 폭발마저 고요히 품을 수 있는 거대한 우주인가요?"</p>
                                                </div>
                                            </motion.div>
                                        )}
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
