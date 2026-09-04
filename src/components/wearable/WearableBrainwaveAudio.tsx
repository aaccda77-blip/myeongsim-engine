'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Headphones, Disc3 } from 'lucide-react';
import { getBrainwaveEngine, FrequencyPresetId } from '@/utils/brainwaveEngine';

interface WearableBrainwaveAudioProps {
    onNext?: () => void;
}

const WATCH_PRESETS: { id: FrequencyPresetId; name: string; hz: string; color: string; bgGlow: string }[] = [
    { id: 'brown_noise', name: '딥 브라운', hz: 'Brownian', color: 'text-amber-400', bgGlow: 'from-amber-600/30' },
    { id: '528hz', name: '528Hz 기적', hz: '528 Hz', color: 'text-emerald-400', bgGlow: 'from-emerald-600/30' },
    { id: '432hz', name: '432Hz 안정', hz: '432 Hz', color: 'text-cyan-400', bgGlow: 'from-cyan-600/30' },
    { id: 'schumann', name: '지구공명', hz: '7.83 Hz', color: 'text-indigo-400', bgGlow: 'from-indigo-600/30' }
];

export function WearableBrainwaveAudio({ onNext }: WearableBrainwaveAudioProps) {
    const [selectedId, setSelectedId] = useState<FrequencyPresetId>('brown_noise');
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.4);

    useEffect(() => {
        return () => {
            // 컴포넌트 언마운트 시 필요시 정리
        };
    }, []);

    const handleTogglePlay = () => {
        const engine = getBrainwaveEngine();
        if (isPlaying) {
            engine.stop();
            setIsPlaying(false);
        } else {
            engine.start(selectedId, 'none');
            engine.setMasterVolume(volume);
            setIsPlaying(true);
        }
    };

    const handleSelectPreset = (id: FrequencyPresetId) => {
        setSelectedId(id);
        if (isPlaying) {
            const engine = getBrainwaveEngine();
            engine.start(id, 'none');
        }
    };


    const handleToggleMute = () => {
        const engine = getBrainwaveEngine();
        if (volume > 0) {
            setVolume(0);
            engine.setMasterVolume(0);
        } else {
            setVolume(0.4);
            engine.setMasterVolume(0.4);
        }
    };

    const currentPreset = WATCH_PRESETS.find((p) => p.id === selectedId) || WATCH_PRESETS[0];


    return (
        <div className="flex flex-col items-center justify-between h-full py-2 px-2 text-center select-none font-sans w-full">
            {/* 상단 라벨 */}
            <div className="flex items-center justify-between w-full px-2 pt-1">
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

            {/* 중앙 인터랙티브 턴테이블 / 사운드 비주얼라이저 */}
            <div className="relative my-auto flex flex-col items-center justify-center">
                <div className="relative size-24 sm:size-28 flex items-center justify-center">
                    {/* 외곽 회전 네온 링 */}
                    <div
                        className={`absolute inset-0 rounded-full border-2 border-dashed transition-all duration-1000 ${
                            isPlaying
                                ? 'border-amber-400/60 animate-spin-slow'
                                : 'border-white/10'
                        }`}
                    />

                    {/* 오디오 이퀄라이저 애니메이션 바 */}
                    <div className="flex items-center justify-center gap-1 z-10">
                        {[40, 75, 100, 60, 85].map((h, i) => (
                            <div
                                key={i}
                                className={`w-1.5 rounded-full transition-all duration-300 ${
                                    isPlaying ? 'bg-gradient-to-t from-amber-400 to-cyan-300' : 'bg-white/20'
                                }`}
                                style={{
                                    height: isPlaying ? `${Math.max(10, (h * (0.5 + Math.random() * 0.5)) * 0.35)}px` : '8px',
                                    animation: isPlaying ? `bounce 0.8s ease-in-out infinite alternate ${i * 0.15}s` : 'none'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* 현재 선택된 주파수 이름 & 배지 */}
                <div className="mt-1">
                    <span className="text-[10px] font-mono text-gray-400 font-semibold">
                        {currentPreset.hz}
                    </span>
                    <h3 className={`text-xs sm:text-sm font-black ${currentPreset.color} tracking-tight -mt-0.5`}>
                        {currentPreset.name}
                    </h3>
                </div>

                {/* 4대 주파수 퀵 칩 셀렉터 */}
                <div className="flex items-center justify-center gap-1 mt-1.5">
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
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.4)]'
                            : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                    }`}
                >
                    {isPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
                    <span>{isPlaying ? '사운드 정지' : '손목 치유음 재생'}</span>
                </button>
            </div>
        </div>
    );
}
