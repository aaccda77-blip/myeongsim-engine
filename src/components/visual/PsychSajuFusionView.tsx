import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

    useEffect(() => {
        if (isOpen) {
            setScanned(false);
            const timer = setTimeout(() => setScanned(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-900 border border-blue-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(59,130,246,0.2)] text-gray-100"
            >
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                    <div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            🧬 동서양 기질 융합 스캐너 (특허 기술)
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">Western 5대 성격 지표 & 16가지 행동 기질 × Eastern Saju & Neural Code</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-light">&times;</button>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                    {!scanned ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
                            <p className="mt-6 text-blue-400 tracking-widest font-mono text-sm uppercase">Syncing Bio-Data & Psychological Vectors...</p>
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                            
                            {/* Main Visual: Two Radars with Connection */}
                            <div className="grid md:grid-cols-3 gap-8 items-center">
                                {/* WESTERN */}
                                <div className="flex flex-col items-center space-y-4 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                    <h3 className="text-lg font-semibold text-blue-300">서양 심리학 (Cognitive)</h3>
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
                                    <div className="text-center">
                                        <p className="text-sm text-gray-400">16가지 행동 기질형</p>
                                        <p className="text-3xl font-bold text-white tracking-widest">{userData.mbti}</p>
                                    </div>
                                </div>

                                {/* CONNECTOR / SYNC */}
                                <div className="hidden md:flex flex-col items-center justify-center space-y-4">
                                    <div className="text-center text-xs text-gray-500 font-mono tracking-widest uppercase mb-2">Cross-Mapping</div>
                                    <svg className="w-24 h-48" viewBox="0 0 100 200">
                                        <path d="M0,20 C50,20 50,20 100,20" stroke="#4b5563" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                                        <path d="M0,60 C50,60 50,60 100,60" stroke="#4b5563" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                                        <path d="M0,100 C50,100 50,100 100,100" stroke="#4b5563" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                                        <path d="M0,140 C50,140 50,140 100,140" stroke="#4b5563" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                                        <path d="M0,180 C50,180 50,180 100,180" stroke="#4b5563" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                                        
                                        {/* Animated Sync Particles */}
                                        <circle cx="50" cy="100" r="3" fill="#a855f7" className="animate-ping" />
                                    </svg>
                                </div>

                                {/* EASTERN */}
                                <div className="flex flex-col items-center space-y-4 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                    <h3 className="text-lg font-semibold text-purple-300">동양 명리학 (Genotype)</h3>
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
                                            <text x="100" y="15" fill="#9ca3af" fontSize="10" textAnchor="middle">화(火)</text>
                                            <text x="180" y="70" fill="#9ca3af" fontSize="10" textAnchor="middle">목(木)</text>
                                            <text x="150" y="180" fill="#9ca3af" fontSize="10" textAnchor="middle">토(土)</text>
                                            <text x="50" y="180" fill="#9ca3af" fontSize="10" textAnchor="middle">금(金)</text>
                                            <text x="20" y="70" fill="#9ca3af" fontSize="10" textAnchor="middle">수(水)</text>
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-400">신경망 코드 (Neural Code)</p>
                                        <p className="text-3xl font-bold text-white tracking-widest">{userData.neuralCode}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Analysis Text */}
                            <div className="bg-gray-800/80 rounded-xl p-6 border border-blue-500/30">
                                <h4 className="text-lg font-bold mb-4 flex items-center text-blue-200">
                                    <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
                                    인지/행동 X 오행 에너지 교차 분석 도출
                                </h4>
                                <ul className="space-y-4 text-sm text-gray-300">
                                    <li className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center text-red-400">🔥</div>
                                        <div>
                                            <strong className="text-white">외향성(E) ↔ 화(Fire) 에너지 동기화:</strong> 
                                            외부로 향하는 목표 지향적 에너지가 높은 수치({userData.bigFive.e}%)로 측정되었습니다. 화(火) 기운의 발산 작용과 완벽히 일치하며, 번아웃(과각성) 위험도가 높아 모니터링이 필요합니다.
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400">💧</div>
                                        <div>
                                            <strong className="text-white">신경성(N) ↔ 수(Water) 에너지 동기화:</strong> 
                                            신경성(불안도) 수직은 {userData.bigFive.n}%로 매우 안정적입니다. 명리학적 수(水) 에너지의 '응축 및 저장' 시스템이 전전두엽의 억제 기능과 조화롭게 작동하여 심리적 회복탄력성이 훌륭합니다.
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-300">⚙️</div>
                                        <div>
                                            <strong className="text-white">성실성(C) ↔ 금(Metal) 에너지 동기화:</strong> 
                                            성실성이 {userData.bigFive.c}%로 극도로 발달되어 있습니다. 이는 금(金) 특유의 단절/규칙 에너지와 결합되어, 스스로를 옭아매는 당위적 사고("~해야만 한다") 형태의 강박으로 발현될 수 있으나 업무적 성취도는 탁월합니다.
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="text-center pt-4">
                                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full font-bold text-white shadow-lg shadow-blue-500/25 transition-all">
                                    융합 데이터 기반 AI 코칭 시작하기
                                </button>
                            </div>

                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
