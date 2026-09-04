'use client';

import React, { useState, useEffect } from 'react';
import { 
    X, Volume2, VolumeX, Play, Square, Sparkles, Sliders, Clock, 
    Wind, CloudRain, Waves, BellOff, Info, Check, ShieldCheck, Heart
} from 'lucide-react';
import { 
    getBrainwaveEngine, 
    FREQUENCY_PRESETS, 
    FrequencyPresetId, 
    AmbientSoundId 
} from '@/utils/brainwaveEngine';

interface BrainwaveSoundLabModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStateChange?: (isPlaying: boolean, currentPresetName: string) => void;
}

export default function BrainwaveSoundLabModal({
    isOpen,
    onClose,
    onStateChange
}: BrainwaveSoundLabModalProps) {
    const [engine, setEngine] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<FrequencyPresetId>('528hz');
    const [selectedAmbient, setSelectedAmbient] = useState<AmbientSoundId>('none');
    
    // 볼륨
    const [masterVol, setMasterVol] = useState(70);
    const [freqVol, setFreqVol] = useState(60);
    const [ambientVol, setAmbientVol] = useState(50);

    // 타이머
    const [timerMinutes, setTimerMinutes] = useState(0); // 0 = 무제한
    const [secondsLeft, setSecondsLeft] = useState(0);

    // 호흡 가이드 단계
    const [breathPhase, setBreathPhase] = useState<'들숨' | '잠시 멈춤' | '날숨' | '비움'>('들숨');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const eng = getBrainwaveEngine();
            setEngine(eng);
            setIsPlaying(eng.isPlaying());
            setSelectedPreset(eng.getCurrentPreset());
            setSelectedAmbient(eng.getCurrentAmbient());
            const vols = eng.getVolumes();
            setMasterVol(Math.round(vols.master * 100));
            setFreqVol(Math.round(vols.freq * 100));
            setAmbientVol(Math.round(vols.ambient * 100));
        }
    }, []);

    // 호흡 페이서 인터벌
    useEffect(() => {
        if (!isPlaying) return;
        const phases: ('들숨' | '잠시 멈춤' | '날숨' | '비움')[] = ['들숨', '잠시 멈춤', '날숨', '비움'];
        let idx = 0;
        const interval = setInterval(() => {
            idx = (idx + 1) % phases.length;
            setBreathPhase(phases[idx]);
        }, 4000); // 4초마다 전환 (박스 호흡법)

        return () => clearInterval(interval);
    }, [isPlaying]);

    if (!isOpen) return null;

    const handleTogglePlay = () => {
        if (!engine) return;
        if (isPlaying) {
            engine.stop();
            setIsPlaying(false);
            if (onStateChange) onStateChange(false, '');
        } else {
            engine.setMasterVolume(masterVol / 100);
            engine.setFrequencyVolume(freqVol / 100);
            engine.setAmbientVolume(ambientVol / 100);
            engine.start(selectedPreset, selectedAmbient);
            if (timerMinutes > 0) {
                engine.setTimer(timerMinutes, (left: number) => {
                    setSecondsLeft(left);
                    if (left <= 0) {
                        setIsPlaying(false);
                        if (onStateChange) onStateChange(false, '');
                    }
                });
            }
            setIsPlaying(true);
            const activePresetObj = FREQUENCY_PRESETS.find(p => p.id === selectedPreset);
            if (onStateChange) onStateChange(true, activePresetObj ? activePresetObj.hzDisplay : '528Hz');
        }
    };

    const handleSelectPreset = (id: FrequencyPresetId) => {
        setSelectedPreset(id);
        if (engine && isPlaying) {
            engine.start(id, selectedAmbient);
            const activePresetObj = FREQUENCY_PRESETS.find(p => p.id === id);
            if (onStateChange) onStateChange(true, activePresetObj ? activePresetObj.hzDisplay : '528Hz');
        }
    };

    const handleSelectAmbient = (ambient: AmbientSoundId) => {
        setSelectedAmbient(ambient);
        if (engine && isPlaying) {
            engine.start(selectedPreset, ambient);
        }
    };

    const handleMasterVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setMasterVol(val);
        if (engine) engine.setMasterVolume(val / 100);
    };

    const handleFreqVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setFreqVol(val);
        if (engine) engine.setFrequencyVolume(val / 100);
    };

    const handleAmbientVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setAmbientVol(val);
        if (engine) engine.setAmbientVolume(val / 100);
    };

    const handleSetTimer = (mins: number) => {
        setTimerMinutes(mins);
        if (engine && isPlaying) {
            if (mins === 0) {
                engine.clearTimer();
                setSecondsLeft(0);
            } else {
                engine.setTimer(mins, (left: number) => {
                    setSecondsLeft(left);
                    if (left <= 0) {
                        setIsPlaying(false);
                        if (onStateChange) onStateChange(false, '');
                    }
                });
            }
        }
    };

    const formatTimer = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const currentPresetInfo = FREQUENCY_PRESETS.find(p => p.id === selectedPreset) || FREQUENCY_PRESETS[0];

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 select-none">
            <div className="w-full max-w-lg bg-[#0e0a22] border-t sm:border border-cyan-400/40 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
                
                {/* ── 1. Header ── */}
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 text-cyan-300">
                            <Sparkles size={18} className={isPlaying ? 'animate-spin' : ''} />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h2 className="text-sm font-black text-white">ZERO POINT 뇌파 사운드 랩</h2>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-bold border border-amber-400/30">
                                    PRO AUDIO
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-400">뇌과학 기반 솔페지오 주파수 & 자연음 실시간 합성</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── 2. Scrollable Body ── */}
                <div className="p-5 space-y-5 overflow-y-auto flex-1 text-left">
                    
                    {/* 🧘‍♂️ 호흡 동조 비주얼라이저 (Breathing Visualizer Card) */}
                    <div className="p-4 rounded-2xl bg-gradient-to-b from-[#181238] to-[#100b26] border border-cyan-500/25 flex items-center justify-between gap-4">
                        <div className="relative size-20 shrink-0 flex items-center justify-center">
                            {/* 펄스 링 */}
                            <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                                isPlaying 
                                    ? (breathPhase === '들숨' ? 'scale-110 bg-cyan-400/20 border-2 border-cyan-400/60' : 'scale-90 bg-indigo-500/15 border-2 border-indigo-400/40')
                                    : 'bg-white/5 border border-white/10'
                            }`} />
                            <div className={`size-12 rounded-full flex items-center justify-center text-xs font-bold transition-transform duration-1000 ${
                                isPlaying ? 'scale-105 text-cyan-200' : 'text-gray-500'
                            }`}>
                                {isPlaying ? breathPhase : '대기'}
                            </div>
                        </div>

                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black text-white">{currentPresetInfo.name}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 font-bold">
                                    {currentPresetInfo.hzDisplay}
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-300 leading-relaxed">
                                {currentPresetInfo.description}
                            </p>
                            {isPlaying && timerMinutes > 0 && (
                                <p className="text-[10px] font-mono text-amber-300 flex items-center gap-1 pt-1 font-bold">
                                    <Clock size={11} />
                                    <span>자동 종료까지 남은 시간: {formatTimer(secondsLeft)}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── 3. 6대 주파수 프리셋 선택 그리드 ── */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                            <span className="flex items-center gap-1.5">
                                <span>🎯 치유 주파수 선택</span>
                                <span className="text-[10px] text-gray-500 font-normal">(6개 테마)</span>
                            </span>
                            <span className="text-[10px] text-cyan-400 font-mono">
                                선택: {currentPresetInfo.hzDisplay}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {FREQUENCY_PRESETS.map((preset) => {
                                const isSelected = selectedPreset === preset.id;
                                return (
                                    <button
                                        key={preset.id}
                                        onClick={() => handleSelectPreset(preset.id)}
                                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                                            isSelected 
                                                ? 'bg-gradient-to-br from-cyan-950/60 to-purple-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-400' 
                                                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-gray-400'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1">
                                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                                isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-gray-300'
                                            }`}>
                                                {preset.hzDisplay}
                                            </span>
                                            <span className="text-[9px] text-gray-400 font-medium">
                                                {preset.tag}
                                            </span>
                                        </div>

                                        <p className="text-xs font-bold text-white line-clamp-1 mt-0.5">
                                            {preset.name.split(' ')[0]}
                                        </p>
                                        <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                                            {preset.subtitle}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── 4. 자연음 레이어 믹서 (Ambient Layer) ── */}
                    <div className="space-y-2 pt-1 border-t border-white/10">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                            <span className="flex items-center gap-1.5">
                                <span>🌿 자연의 소리 레이어</span>
                                <span className="text-[10px] text-gray-500 font-normal">(주파수와 동시 재생)</span>
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono">
                                {selectedAmbient === 'none' ? '순수 주파수' : selectedAmbient.toUpperCase()}
                            </span>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            <button
                                onClick={() => handleSelectAmbient('none')}
                                className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                                    selectedAmbient === 'none'
                                        ? 'bg-white/20 border-white text-white shadow-sm'
                                        : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06]'
                                }`}
                            >
                                <BellOff size={15} />
                                <span className="text-[10px]">자연음 끔</span>
                            </button>

                            <button
                                onClick={() => handleSelectAmbient('rain')}
                                className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                                    selectedAmbient === 'rain'
                                        ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-sm shadow-blue-500/20'
                                        : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06]'
                                }`}
                            >
                                <CloudRain size={15} />
                                <span className="text-[10px]">포근한 밤비</span>
                            </button>

                            <button
                                onClick={() => handleSelectAmbient('waves')}
                                className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                                    selectedAmbient === 'waves'
                                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20'
                                        : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06]'
                                }`}
                            >
                                <Waves size={15} />
                                <span className="text-[10px]">깊은 파도</span>
                            </button>

                            <button
                                onClick={() => handleSelectAmbient('wind')}
                                className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                                    selectedAmbient === 'wind'
                                        ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-sm shadow-teal-500/20'
                                        : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06]'
                                }`}
                            >
                                <Wind size={15} />
                                <span className="text-[10px]">숲속 바람</span>
                            </button>
                        </div>
                    </div>

                    {/* ── 5. 정밀 볼륨 컨트롤러 슬라이더 ── */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                            <span className="flex items-center gap-1.5">
                                <Sliders size={13} className="text-cyan-400" />
                                <span>정밀 볼륨 믹싱</span>
                            </span>
                            <span className="text-[11px] font-mono text-cyan-300">마스터: {masterVol}%</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-xs">
                                <span className="w-16 text-[11px] text-gray-400 shrink-0">마스터 볼륨</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={masterVol}
                                    onChange={handleMasterVolume}
                                    className="flex-1 accent-cyan-400 cursor-pointer h-1.5 rounded-lg bg-white/10"
                                />
                                <span className="text-[10px] font-mono text-gray-300 w-7 text-right">{masterVol}%</span>
                            </div>

                            <div className="flex items-center gap-3 text-xs">
                                <span className="w-16 text-[11px] text-gray-400 shrink-0">치유 주파수</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={freqVol}
                                    onChange={handleFreqVolume}
                                    className="flex-1 accent-purple-400 cursor-pointer h-1.5 rounded-lg bg-white/10"
                                />
                                <span className="text-[10px] font-mono text-gray-300 w-7 text-right">{freqVol}%</span>
                            </div>

                            {selectedAmbient !== 'none' && (
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="w-16 text-[11px] text-gray-400 shrink-0">자연의 소리</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={ambientVol}
                                        onChange={handleAmbientVolume}
                                        className="flex-1 accent-emerald-400 cursor-pointer h-1.5 rounded-lg bg-white/10"
                                    />
                                    <span className="text-[10px] font-mono text-gray-300 w-7 text-right">{ambientVol}%</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── 6. 수면 & 명상 타이머 ── */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                            <span className="flex items-center gap-1.5">
                                <Clock size={13} className="text-amber-400" />
                                <span>명상 & 수면 타이머</span>
                            </span>
                            <span className="text-[11px] font-mono text-amber-300">
                                {timerMinutes === 0 ? '연속 재생 (무제한)' : `${timerMinutes}분 후 자동 종료`}
                            </span>
                        </div>

                        <div className="grid grid-cols-5 gap-1.5">
                            {[0, 15, 30, 45, 60].map((mins) => (
                                <button
                                    key={mins}
                                    onClick={() => handleSetTimer(mins)}
                                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        timerMinutes === mins
                                            ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                                            : 'bg-white/5 hover:bg-white/10 text-gray-400'
                                    }`}
                                >
                                    {mins === 0 ? '연속' : `${mins}분`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── 7. Bottom Action Bar ── */}
                <div className="p-4 border-t border-white/10 bg-[#0a0718] flex items-center gap-3">
                    <button
                        onClick={handleTogglePlay}
                        className={`flex-1 py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl transition-all active:scale-98 cursor-pointer ${
                            isPlaying
                                ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-500/25'
                                : 'bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 text-slate-950 shadow-cyan-500/30 hover:opacity-95'
                        }`}
                    >
                        {isPlaying ? <Square size={16} /> : <Play size={16} />}
                        <span>{isPlaying ? '치유 사운드 정지하기' : `🔊 [${currentPresetInfo.hzDisplay}] 사운드 재생하기`}</span>
                    </button>
                    
                    <button
                        onClick={onClose}
                        className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-bold cursor-pointer"
                    >
                        창 닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
