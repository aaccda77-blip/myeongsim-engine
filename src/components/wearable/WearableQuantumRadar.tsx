'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, Waves, Box, Zap, Compass, Clock, Activity, ArrowRight, ShieldAlert } from 'lucide-react';
import { useWatchData } from '@/services/health/WatchDataService';

// 3대 킬러 모드
type KillerGraphMode = 'OHAENG_RADAR' | 'MIND_SPACE_3S' | 'META_CODE_WAVE';

interface WearableQuantumRadarProps {
    onGoToBreath?: () => void;
    onGoToSoundLab?: () => void;
}

export function WearableQuantumRadar({ onGoToBreath, onGoToSoundLab }: WearableQuantumRadarProps) {
    const [mode, setMode] = useState<KillerGraphMode>('OHAENG_RADAR');
    const [scanAngle, setScanAngle] = useState(0);
    const [waveOffset, setWaveOffset] = useState(0);
    const watchData = useWatchData();
    const { bpm, hrv, stressLevel, zeroPointAlignment, autonomicBalance } = watchData;

    // 실시간 회전 및 파동 애니메이션
    useEffect(() => {
        const timer = setInterval(() => {
            setScanAngle((prev) => (prev + 3) % 360);
            setWaveOffset((prev) => (prev + 0.15) % (Math.PI * 2));
        }, 50);
        return () => clearInterval(timer);
    }, []);

    // 1. 오행(목화토금수) 실시간 수치 (HRV 및 자율신경계와 실시간 연동)
    const ohaengValues = {
        wood: Math.min(95, Math.max(30, 68 + Math.round((autonomicBalance.parasympathetic - 50) * 0.4))), // 목(간/성장)
        fire: Math.min(98, Math.max(25, 45 + Math.round((bpm - 65) * 1.1))), // 화(심장/열정)
        earth: Math.min(92, Math.max(35, 72 - Math.round((stressLevel === 'HIGH' ? 25 : stressLevel === 'MODERATE' ? 10 : 0)))), // 토(비위/중심)
        metal: Math.min(95, Math.max(20, Math.round((hrv / 70) * 80))), // 금(폐/호흡/절제)
        water: Math.min(96, Math.max(35, zeroPointAlignment)) // 수(신장/지혜/영점)
    };

    // 5각형 버텍스 좌표 계산 (중심: 50, 50, 반경: 38)
    const getPentagonPoints = (scale = 1) => {
        const center = 50;
        const radius = 38 * scale;
        const angles = [-90, -18, 54, 126, 198]; // 상(목), 우상(화), 우하(토), 좌하(금), 좌상(수)
        return angles.map((ang) => {
            const rad = (ang * Math.PI) / 180;
            return {
                x: center + radius * Math.cos(rad),
                y: center + radius * Math.sin(rad)
            };
        });
    };

    // 오행 수치 반영 버텍스 좌표
    const getDynamicOhaengPoints = () => {
        const center = 50;
        const maxR = 38;
        const angles = [-90, -18, 54, 126, 198];
        const vals = [
            ohaengValues.wood / 100,
            ohaengValues.fire / 100,
            ohaengValues.earth / 100,
            ohaengValues.metal / 100,
            ohaengValues.water / 100
        ];
        return angles.map((ang, idx) => {
            const r = maxR * Math.max(0.2, vals[idx]);
            const rad = (ang * Math.PI) / 180;
            return `${center + r * Math.cos(rad)},${center + r * Math.sin(rad)}`;
        }).join(' ');
    };

    // 2. 3S 의식 공간 체적 계산 (X: 자각, Y: 방하착, Z: 주체성)
    const sensingScore = Math.min(99, Math.max(30, Math.round((hrv / 70) * 90)));
    const surrenderScore = Math.min(99, Math.max(25, autonomicBalance.parasympathetic));
    const sovereignScore = Math.min(99, Math.max(35, zeroPointAlignment));
    // 3차원 체적 지수 (0 ~ 100%)
    const mindVolumePercent = Math.round((sensingScore * surrenderScore * sovereignScore) / 10000);

    // 3. 다크코드 -> 뉴럴코드 -> 메타코드 양자 주파수 (골든 타임)
    const darkFreqHz = 396; // 붉은 저주파
    const neuralFreqHz = 432; // 청록 중주파
    const metaFreqHz = 528; // 황금빛 고주파
    const goldenTimeHour = '16:00 ~ 17:30'; // 오늘의 골든 타임

    return (
        <div className="relative flex flex-col items-center justify-between h-full py-1.5 px-2 text-center select-none font-sans w-full overflow-hidden">
            {/* 상단 3대 킬러 모드 스위처 */}
            <div className="w-full flex items-center justify-between px-1 pt-0.5 z-20">
                <div className="flex items-center gap-1 bg-white/[0.06] p-0.5 rounded-lg border border-white/10 mx-auto">
                    <button
                        onClick={() => setMode('OHAENG_RADAR')}
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                            mode === 'OHAENG_RADAR'
                                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        오행레이더
                    </button>
                    <button
                        onClick={() => setMode('MIND_SPACE_3S')}
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                            mode === 'MIND_SPACE_3S'
                                ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-400/40 shadow-[0_0_8px_rgba(99,102,241,0.4)]'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        3S의식공간
                    </button>
                    <button
                        onClick={() => setMode('META_CODE_WAVE')}
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                            mode === 'META_CODE_WAVE'
                                ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40 shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        메타파동
                    </button>
                </div>
            </div>

            {/* ======================================================== */}
            {/* 모드 1: 오행 퀀텀 생체 펜타곤 레이더 (5-Elements Bio Radar) */}
            {/* ======================================================== */}
            {mode === 'OHAENG_RADAR' && (
                <div className="relative my-auto flex flex-col items-center justify-center w-full">
                    {/* 펜타곤 레이더 SVG */}
                    <div className="relative size-32 sm:size-36 flex items-center justify-center">
                        <svg className="absolute inset-0 size-full" viewBox="0 0 100 100">
                            {/* 외곽 및 동심원 펜타곤 그리드 */}
                            {[1, 0.7, 0.4].map((s, idx) => (
                                <polygon
                                    key={idx}
                                    points={getPentagonPoints(s).map((p) => `${p.x},${p.y}`).join(' ')}
                                    className="stroke-white/15 fill-none"
                                    strokeWidth="0.8"
                                    strokeDasharray={idx === 1 ? '2 2' : 'none'}
                                />
                            ))}

                            {/* 5개 축 방사형 기준선 */}
                            {getPentagonPoints(1).map((p, idx) => (
                                <line
                                    key={idx}
                                    x1="50"
                                    y1="50"
                                    x2={p.x}
                                    y2={p.y}
                                    className="stroke-white/15"
                                    strokeWidth="0.8"
                                />
                            ))}

                            {/* 회전 레이더 스캐닝 빔 */}
                            <line
                                x1="50"
                                y1="50"
                                x2={50 + 40 * Math.cos((scanAngle * Math.PI) / 180)}
                                y2={50 + 40 * Math.sin((scanAngle * Math.PI) / 180)}
                                stroke="rgba(0, 240, 255, 0.4)"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />

                            {/* 실시간 생체 오행 다이나믹 네온 폴리곤 */}
                            <polygon
                                points={getDynamicOhaengPoints()}
                                className="stroke-cyan-400 fill-cyan-500/25 transition-all duration-700"
                                strokeWidth="1.8"
                                style={{ filter: 'drop-shadow(0 0 6px rgba(0,240,255,0.7))' }}
                            />

                            {/* 5개 꼭짓점 라벨 (목화토금수) */}
                            <text x="50" y="8" fill="#10B981" fontSize="6.5" fontWeight="bold" textAnchor="middle">목(간)</text>
                            <text x="92" y="38" fill="#EF4444" fontSize="6.5" fontWeight="bold" textAnchor="middle">화(심)</text>
                            <text x="76" y="93" fill="#F59E0B" fontSize="6.5" fontWeight="bold" textAnchor="middle">토(비)</text>
                            <text x="24" y="93" fill="#E2E8F0" fontSize="6.5" fontWeight="bold" textAnchor="middle">금(폐)</text>
                            <text x="8" y="38" fill="#38BDF8" fontSize="6.5" fontWeight="bold" textAnchor="middle">수(신)</text>
                        </svg>

                        {/* 중심점 점멸 펄스 */}
                        <div className="absolute size-2 bg-cyan-400 rounded-full animate-ping" />
                    </div>

                    {/* 실시간 장부 밸런싱 처방 바 */}
                    <div className="mt-1 w-full max-w-[210px] bg-black/50 border border-white/10 rounded-xl p-1 px-2 text-left flex items-center justify-between">
                        <div>
                            <span className="text-[9px] font-mono text-cyan-300 font-bold block">
                                {ohaengValues.metal < 50 ? '⚠️ 금(폐) 호흡 에너지 저하' : '✨ 5대 장부 밸런스 최적'}
                            </span>
                            <span className="text-[8.5px] text-gray-400">
                                {ohaengValues.metal < 50 ? '4-4-4-4 박스호흡으로 폐기운 강화' : '순환과 자율신경계가 안정 상태입니다'}
                            </span>
                        </div>
                        {ohaengValues.metal < 50 && (
                            <button
                                onClick={onGoToBreath}
                                className="px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[9px] font-bold shrink-0 cursor-pointer"
                            >
                                호흡 처방
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* 모드 2: 3S 의식 공간 3D 체적 텐서 그래프 (Mind-Space Tensor) */}
            {/* ======================================================== */}
            {mode === 'MIND_SPACE_3S' && (
                <div className="relative my-auto flex flex-col items-center justify-center w-full">
                    <div className="relative size-32 sm:size-36 flex items-center justify-center">
                        <svg className="absolute inset-0 size-full" viewBox="0 0 100 100">
                            {/* 3D 큐브 와이어프레임 기하학 (회전 애니메이션) */}
                            {(() => {
                                const angle = (scanAngle * Math.PI) / 180;
                                const r = 24 * (mindVolumePercent / 100);
                                const cosA = Math.cos(angle);
                                const sinA = Math.sin(angle);

                                // 3차원 축 투영점
                                const p1 = { x: 50 + r * cosA, y: 50 + r * sinA * 0.5 - r * 0.7 };
                                const p2 = { x: 50 - r * sinA, y: 50 + r * cosA * 0.5 - r * 0.7 };
                                const p3 = { x: 50 - r * cosA, y: 50 - r * sinA * 0.5 - r * 0.7 };
                                const p4 = { x: 50 + r * sinA, y: 50 - r * cosA * 0.5 - r * 0.7 };

                                const p5 = { x: p1.x, y: p1.y + r * 1.4 };
                                const p6 = { x: p2.x, y: p2.y + r * 1.4 };
                                const p7 = { x: p3.x, y: p3.y + r * 1.4 };
                                const p8 = { x: p4.x, y: p4.y + r * 1.4 };

                                return (
                                    <g stroke="rgba(99, 102, 241, 0.7)" strokeWidth="1.2" fill="none">
                                        <polygon points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`} fill="rgba(99, 102, 241, 0.12)" />
                                        <polygon points={`${p5.x},${p5.y} ${p6.x},${p6.y} ${p7.x},${p7.y} ${p8.x},${p8.y}`} fill="rgba(16, 185, 129, 0.15)" />
                                        <line x1={p1.x} y1={p1.y} x2={p5.x} y2={p5.y} stroke="rgba(0, 240, 255, 0.8)" />
                                        <line x1={p2.x} y1={p2.y} x2={p6.x} y2={p6.y} stroke="rgba(0, 240, 255, 0.8)" />
                                        <line x1={p3.x} y1={p3.y} x2={p7.x} y2={p7.y} stroke="rgba(0, 240, 255, 0.8)" />
                                        <line x1={p4.x} y1={p4.y} x2={p8.x} y2={p8.y} stroke="rgba(0, 240, 255, 0.8)" />
                                    </g>
                                );
                            })()}

                            {/* 3대 축 레이더 좌표 */}
                            <text x="50" y="12" fill="#818CF8" fontSize="6.5" fontWeight="bold" textAnchor="middle">Z: 주체성 {sovereignScore}%</text>
                            <text x="12" y="85" fill="#38BDF8" fontSize="6" fontWeight="bold" textAnchor="middle">X: 자각 {sensingScore}%</text>
                            <text x="88" y="85" fill="#34D399" fontSize="6" fontWeight="bold" textAnchor="middle">Y: 방하착 {surrenderScore}%</text>
                        </svg>

                        {/* 중앙 체적 점수 */}
                        <div className="flex flex-col items-center justify-center z-10">
                            <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight drop-shadow-md">
                                {mindVolumePercent}%
                            </span>
                            <span className="text-[9px] font-bold text-indigo-300">
                                의식 그릇 체적
                            </span>
                        </div>
                    </div>

                    <div className="mt-1 w-full max-w-[210px] bg-black/50 border border-white/10 rounded-xl p-1 px-2.5 text-center">
                        <span className="text-[9px] text-gray-300 font-medium">
                            {mindVolumePercent > 70 ? '내면의 그릇이 넓어져 어떤 스트레스도 흡수합니다' : '마음 공간이 수축되어 있습니다. 1초 영점 리셋 추천'}
                        </span>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* 모드 3: 64 다크코드 ➔ 뉴럴코드 ➔ 메타코드 양자 주파수 파동 */}
            {/* ======================================================== */}
            {mode === 'META_CODE_WAVE' && (
                <div className="relative my-auto flex flex-col items-center justify-center w-full">
                    {/* 3중 실시간 오실로스코프 파동 SVG */}
                    <div className="relative w-[230px] h-28 sm:h-32 bg-black/60 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center p-1">
                        {/* 그리드 라인 */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px]" />

                        <svg className="w-full h-full" viewBox="0 0 200 100">
                            {/* 1. 다크코드 (Dark Code: 붉은 저주파 파동) */}
                            <path
                                d={Array.from({ length: 40 }).map((_, i) => {
                                    const x = (i / 39) * 200;
                                    const y = 50 + 16 * Math.sin((i * 0.3) + waveOffset);
                                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                                }).join(' ')}
                                fill="none"
                                stroke="#EF4444"
                                strokeWidth="1.2"
                                strokeOpacity="0.5"
                            />

                            {/* 2. 뉴럴코드 (Neural Code: 청록 중주파 파동) */}
                            <path
                                d={Array.from({ length: 40 }).map((_, i) => {
                                    const x = (i / 39) * 200;
                                    const y = 50 + 22 * Math.sin((i * 0.6) - waveOffset * 1.2);
                                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                                }).join(' ')}
                                fill="none"
                                stroke="#00F0FF"
                                strokeWidth="1.6"
                                strokeOpacity="0.8"
                                style={{ filter: 'drop-shadow(0 0 4px rgba(0,240,255,0.6))' }}
                            />

                            {/* 3. 메타코드 (Meta Code: 황금빛 고주파 파동) */}
                            <path
                                d={Array.from({ length: 40 }).map((_, i) => {
                                    const x = (i / 39) * 200;
                                    const y = 50 + 14 * Math.sin((i * 1.1) + waveOffset * 1.8);
                                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                                }).join(' ')}
                                fill="none"
                                stroke="#FBBF24"
                                strokeWidth="2"
                                style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.8))' }}
                            />
                        </svg>

                        {/* 우상단 Hz 표시 */}
                        <div className="absolute top-1.5 right-2 flex items-center gap-1.5 text-[8.5px] font-mono">
                            <span className="text-red-400 font-bold">Dark 396</span>
                            <span className="text-cyan-300 font-bold">Neural 432</span>
                            <span className="text-amber-300 font-bold">Meta 528</span>
                        </div>
                    </div>

                    {/* 오늘 몰입 골든 타임 안내 */}
                    <div className="mt-1 w-full max-w-[220px] bg-gradient-to-r from-amber-500/15 via-cyan-500/15 to-amber-500/15 border border-amber-400/30 rounded-xl p-1 px-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Clock size={11} className="text-amber-400 animate-spin-slow" />
                            <span className="text-[9px] font-mono font-bold text-amber-200">
                                골든 몰입: <strong className="text-white">{goldenTimeHour}</strong>
                            </span>
                        </div>
                        <button
                            onClick={onGoToSoundLab}
                            className="text-[8.5px] font-bold text-cyan-300 hover:underline cursor-pointer flex items-center gap-0.5"
                        >
                            <span>치유음</span>
                            <ArrowRight size={8} />
                        </button>
                    </div>
                </div>
            )}

            {/* 하단 공통 모드 전환 안내 */}
            <div className="w-full pb-0.5 text-center">
                <span className="text-[8.5px] text-gray-500 font-mono">
                    상단 탭을 눌러 오행 레이더 · 3S 의식공간 · 메타파동을 전환하세요
                </span>
            </div>
        </div>
    );
}
