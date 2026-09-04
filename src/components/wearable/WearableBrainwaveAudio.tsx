'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Headphones, Disc3, Radio, Sparkles } from 'lucide-react';
import { getBrainwaveEngine, FrequencyPresetId } from '@/utils/brainwaveEngine';

interface WearableBrainwaveAudioProps {
    onNext?: () => void;
}

const WATCH_PRESETS: {
    id: FrequencyPresetId;
    name: string;
    hz: string;
    color: string;
    bgGlow: string;
    binauralText: string;
}[] = [
    {
        id: 'brown_noise',
        name: '딥 브라운',
        hz: 'Brownian',
        color: 'text-amber-400',
        bgGlow: 'from-amber-600/30',
        binauralText: 'L/R 3D 공간 분리 서라운드'
    },
    {
        id: '528hz',
        name: '528Hz 기적',
        hz: '528 Hz',
        color: 'text-emerald-400',
        bgGlow: 'from-emerald-600/30',
        binauralText: 'L 528Hz ↔ R 538Hz (10Hz 알파)'
    },
    {
        id: '432hz',
        name: '432Hz 안정',
        hz: '432 Hz',
        color: 'text-cyan-400',
        bgGlow: 'from-cyan-600/30',
        binauralText: 'L 432Hz ↔ R 442Hz (10Hz 집중)'
    },
    {
        id: 'schumann',
        name: '지구공명',
        hz: '7.83 Hz',
        color: 'text-indigo-400',
        bgGlow: 'from-indigo-600/30',
        binauralText: 'L 136Hz ↔ R 144Hz (7.8Hz 공명)'
    }
];

export function WearableBrainwaveAudio({ onNext }: WearableBrainwaveAudioProps) {
    const [selectedId, setSelectedId] = useState<FrequencyPresetId>('brown_noise');
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.45);
    const [isMcSquare, setIsMcSquare] = useState(true); // 기본적으로 엠씨스퀘어 입체 서라운드 활성화!
    const [pulseToggle, setPulseToggle] = useState(false);

    // 엠씨스퀘어 좌우 펄스 애니메이션 (L ↔ R 교차 점멸)
    useEffect(() => {
        if (!isPlaying || !isMcSquare) return;
        const timer = setInterval(() => {
            setPulseToggle((p) => !p);
        }, 500);
        return () => clearInterval(timer);
    }, [isPlaying, isMcSquare]);

    const handleTogglePlay = () => {
        const engine = getBrainwaveEngine();
        if (isPlaying) {
            engine.stop();
            setIsPlaying(false);
        } else {
            engine.setMcSquare(isMcSquare);
            engine.start(selectedId, 'none');
            engine.setMasterVolume(volume);
            setIsPlaying(true);
        }
    };

    const handleSelectPreset = (id: FrequencyPresetId) => {
        setSelectedId(id);
        if (isPlaying) {
            const engine = getBrainwaveEngine();
            engine.setMcSquare(isMcSquare);
            engine.start(id, 'none');
        }
    };

    const handleToggleMcSquare = () => {
        const nextState = !isMcSquare;
        setIsMcSquare(nextState);
        const engine = getBrainwaveEngine();
        engine.setMcSquare(nextState);
    };

    const handleToggleMute = () => {
        const engine = getBrainwaveEngine();
        if (volume > 0) {
            setVolume(0);
            engine.setMasterVolume(0);
        } else {
            setVolume(0.45);
            engine.setMasterVolume(0.45);
        }
    };

    const currentPreset = WATCH_PRESETS.find((p) => p.id === selectedId) || WATCH_PRESETS[0];

    return (
        <div className="flex flex-col items-center justify-between h-full py-1.5 px-2 text-center select-none font-sans w-full">
            {/* 상단 헤더: 라벨 + 볼륨 */}
            <div className="flex items-center justify-between w-full px-2 pt-0.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1">
                    <Headphones size={12} />
                    <span>WRIST SOUND LAB</span>
                </span>
                <button
                    onClick={handleToggleMute}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer p-0.5"
                    title={volume > 0 ? '음소거' : '소리 켜기'}
                >
                    {volume > 0 ? <Volume2 size={12} className="text-cyan-400" /> : <VolumeX size={12} className="text-red-400" />}
                </button>
            </div>

            {/* 엠씨스퀘어 3D 서라운드 원터치 토글 배너 */}
            <div className="w-full px-1">
                <button
                    onClick={handleToggleMcSquare}
                    className={`w-full py-1 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-between border ${
                        isMcSquare
                            ? 'bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                >
                    <div className="flex items-center gap-1">
                        <Radio size={11} className={isMcSquare ? 'text-amber-400 animate-pulse' : 'text-gray-500'} />
                        <span className={`text-[9.5px] font-mono font-black ${isMcSquare ? 'text-amber-300' : 'text-gray-400'}`}>
                            3D 엠씨스퀘어 서라운드
                        </span>
                    </div>
                    <span className={`text-[8.5px] font-mono font-black px-1.5 py-0.2 rounded ${
                        isMcSquare ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-gray-400'
                    }`}>
                        {isMcSquare ? 'L-R 분리 ON' : 'OFF'}
                    </span>
                </button>
            </div>

            {/* 중앙 인터랙티브 턴테이블 / 사운드 비주얼라이저 */}
            <div className="relative my-auto flex flex-col items-center justify-center">
                <div className="relative size-20 sm:size-24 flex items-center justify-center">
                    {/* 외곽 회전 네온 링 */}
                    <div
                        className={`absolute inset-0 rounded-full border-2 border-dashed transition-all duration-1000 ${
                            isPlaying
                                ? isMcSquare ? 'border-amber-400 animate-spin-slow shadow-[0_0_15px_rgba(251,191,36,0.4)]' : 'border-cyan-400 animate-spin-slow'
                                : 'border-white/10'
                        }`}
                    />

                    {/* 오디오 이퀄라이저 애니메이션 바 */}
                    <div className="flex items-center justify-center gap-1 z-10">
                        {[40, 75, 100, 60, 85].map((h, i) => (
                            <div
                                key={i}
                                className={`w-1.5 rounded-full transition-all duration-300 ${
                                    isPlaying ? isMcSquare ? 'bg-gradient-to-t from-amber-400 to-yellow-200' : 'bg-gradient-to-t from-cyan-400 to-teal-200' : 'bg-white/20'
                                }`}
                                style={{
                                    height: isPlaying ? `${Math.max(10, (h * (0.5 + Math.random() * 0.5)) * 0.35)}px` : '8px',
                                    animation: isPlaying ? `bounce 0.8s ease-in-out infinite alternate ${i * 0.15}s` : 'none'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* 현재 프리셋 이름 & L-R 분리 정보 */}
                <div className="mt-0.5">
                    <span className="text-[9px] font-mono text-gray-400 font-semibold">
                        {currentPreset.hz}
                    </span>
                    <h3 className={`text-xs sm:text-sm font-black ${currentPreset.color} tracking-tight -mt-0.5`}>
                        {currentPreset.name}
                    </h3>

                    {/* 엠씨스퀘어 L/R 실시간 펄스 인디케이터 */}
                    {isMcSquare ? (
                        <div className="flex items-center justify-center gap-1.5 mt-0.5">
                            <span className={`text-[8.5px] font-mono font-bold transition-opacity ${
                                pulseToggle ? 'text-amber-400 opacity-100' : 'text-gray-500 opacity-50'
                            }`}>
                                L [◀]
                            </span>
                            <span className="text-[8px] font-mono text-amber-200 bg-black/40 px-1 rounded border border-amber-500/30">
                                {currentPreset.binauralText}
                            </span>
                            <span className={`text-[8.5px] font-mono font-bold transition-opacity ${
                                !pulseToggle ? 'text-amber-400 opacity-100' : 'text-gray-500 opacity-50'
                            }`}>
                                [▶] R
                            </span>
                        </div>
                    ) : (
                        <p className="text-[8.5px] text-gray-500 font-mono mt-0.5">
                            일반 모노 출력 모드
                        </p>
                    )}
                </div>

                {/* 4대 주파수 퀵 칩 셀렉터 */}
                <div className="flex items-center justify-center gap-1 mt-1">
                    {WATCH_PRESETS.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => handleSelectPreset(p.id)}
                            className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold transition-all cursor-pointer ${
                                selectedId === p.id
                                    ? 'bg-white/25 text-white border border-white/40 shadow-sm'
                                    : 'bg-white/5 text-gray-400 hover:text-white border border-transparent'
                            }`}
                        >
                            {p.hz.replace(' Hz', 'H').replace('Brownian', 'Brown')}
                        </button>
                    ))}
                </div>
            </div>

            {/* 하단 재생/정지 버튼 */}
            <div className="w-full max-w-[210px] pb-1">
                <button
                    onClick={handleTogglePlay}
                    className={`w-full py-2 px-3 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${
                        isPlaying
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                            : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                    }`}
                >
                    {isPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
                    <span>{isPlaying ? '사운드 정지' : isMcSquare ? '🎧 엠씨스퀘어 입체 재생' : '손목 치유음 재생'}</span>
                </button>
            </div>
        </div>
    );
}

