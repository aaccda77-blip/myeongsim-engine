
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, X } from 'lucide-react';

interface HealingMusicPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HEALING_SONGS = [
    {
        id: 1,
        title: "그냥 두는 연습",
        file: "/audio/그냥두는연습.wav",
        lyrics: "생각이 떠오르면\n그냥 두세요\n\n감정이 밀려오면\n그냥 두세요\n\n모든 것은 지나갑니다\n구름처럼, 파도처럼\n\n지금 이 순간\n그냥 여기에\n있어주세요"
    },
    {
        id: 2,
        title: "거울 속의 거울",
        file: "/audio/거울속의거울.wav",
        lyrics: "나를 바라보는 나\n그 안에 또 다른 나\n\n무한히 펼쳐지는\n내면의 우주\n\n거울 속의 거울처럼\n끝없이 깊어지는\n나와의 만남"
    },
    {
        id: 3,
        title: "그저 바라보다",
        file: "/audio/그저바라보다.wav",
        lyrics: "아무것도 하지 않아도\n괜찮아요\n\n그저 바라보세요\n지금 이 순간을\n\n있는 그대로\n완벽한 당신을\n\n숨을 쉬고\n존재하세요"
    }
];

export default function HealingMusicPlayerModal({ isOpen, onClose }: HealingMusicPlayerModalProps) {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const currentSong = HEALING_SONGS[currentSongIndex];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-gray-900 border border-green-500/30 rounded-2xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto text-center shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="absolute top-0 right-0 p-3">
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                            <Music size={28} className="text-green-400" />
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">🌿 명심 힐링 음악</h3>
                        <p className="text-xs text-green-300/70 mb-4">마음을 편안하게 하는 명상 음악</p>

                        {/* Song Selector */}
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                            {HEALING_SONGS.map((song, index) => (
                                <button
                                    key={song.id}
                                    onClick={() => setCurrentSongIndex(index)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${currentSongIndex === index
                                            ? 'bg-green-500 text-black'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                        }`}
                                >
                                    🎵 {song.title}
                                </button>
                            ))}
                        </div>

                        {/* Audio Player */}
                        <div className="bg-black/40 rounded-xl p-3 border border-white/5 shadow-inner mb-4">
                            <p className="text-sm text-green-300 mb-2 font-medium">♪ {currentSong.title}</p>
                            <audio
                                key={currentSong.id}
                                controls
                                autoPlay
                                controlsList="nodownload"
                                className="w-full accent-green-500"
                                style={{ filter: 'hue-rotate(90deg)' }}
                            >
                                <source src={currentSong.file} type="audio/wav" />
                                브라우저가 오디오 재생을 지원하지 않습니다.
                            </audio>
                        </div>

                        {/* EMDR Visual Stimulation */}
                        <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20 mb-4">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <span className="text-lg">👁️</span>
                                <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
                                    EMDR 시선 안정화
                                </p>
                            </div>

                            {/* Instructions */}
                            <div className="bg-cyan-900/20 rounded-lg p-2 mb-3 text-left">
                                <p className="text-[10px] text-cyan-300/90 leading-relaxed">
                                    💡 <strong>사용법:</strong> 노래를 들으며 아래 움직이는 공을 <strong>눈으로만</strong> 따라가세요.
                                    머리는 고정하고 눈동자만 좌우로 움직입니다.
                                    잡생각이 떠오르면 그냥 흘려보내세요.
                                </p>
                            </div>

                            {/* Moving Ball */}
                            <div className="relative h-10 bg-gradient-to-r from-cyan-900/30 via-black/50 to-cyan-900/30 rounded-full overflow-hidden border border-cyan-500/30">
                                <motion.div
                                    className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-cyan-400 to-green-400 rounded-full shadow-lg shadow-cyan-500/50"
                                    animate={{
                                        x: ["0%", "calc(100% - 24px)", "0%"]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>

                            <p className="text-[9px] text-gray-500 mt-3 text-center leading-relaxed">
                                🧠 <strong className="text-cyan-400/80">과학적 원리:</strong> 눈이 좌우로 움직이면 뇌의 '작업 기억(Working Memory)'이 활성화됩니다.<br />
                                작업 기억은 용량이 제한되어 있어, 시선 추적에 집중하면 걱정/잡생각이 차지할 공간이 줄어듭니다.<br />
                                또한 양측성 자극은 편도체(스트레스 중추)를 진정시켜 불안을 낮춥니다. <em className="text-cyan-300/60">(WHO 공인 심리치료 기법)</em>
                            </p>
                        </div>

                        {/* Lyrics Display */}
                        <div className="bg-gradient-to-b from-green-900/20 to-black/30 rounded-xl p-4 border border-green-500/10 text-left max-h-40 overflow-y-auto">
                            <p className="text-[10px] text-green-400/60 uppercase tracking-wider mb-2">가사 / Lyrics</p>
                            <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                                {currentSong.lyrics}
                            </p>
                        </div>

                        <p className="text-[10px] text-gray-600 mt-3">
                            눈을 감고 편안하게 호흡하며 소리의 파동을 느껴보세요.
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
