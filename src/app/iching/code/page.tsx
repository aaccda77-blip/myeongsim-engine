'use client';

import React, { useState, useRef, Suspense } from 'react';
import { ArrowLeft, Share, Play, Pause, Save, History, Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { NEURAL_CODE_DATABASE } from '@/data/NeuralCodeDB';

function NeuralCodeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const codeNumber = parseInt(searchParams.get('code') || '1');

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [journalEntry, setJournalEntry] = useState('');
    const [selectedTab, setSelectedTab] = useState<'dark' | 'gift' | 'meta'>('gift');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const code = NEURAL_CODE_DATABASE.find(c => c.number === codeNumber) || NEURAL_CODE_DATABASE[0];

    const renderHexagram = (lines: number[]) => {
        return lines.map((line, idx) => (
            <div
                key={idx}
                className={`h-3 w-[120px] rounded-md mb-2.5 transition-all duration-700 hover:scale-105 ${line === 1
                    ? 'bg-current shadow-[0_0_8px_rgba(19,127,236,0.4)]'
                    : 'flex justify-between'
                    }`}
            >
                {line === 0 && (
                    <>
                        <div className="h-full w-[52px] bg-current rounded-md shadow-[0_0_8px_rgba(19,127,236,0.4)]"></div>
                        <div className="h-full w-[52px] bg-current rounded-md shadow-[0_0_8px_rgba(19,127,236,0.4)]"></div>
                    </>
                )}
            </div>
        ));
    };

    const playAudioNarration = async () => {
        if (isPlaying && audioRef.current) {
            // Pause if already playing
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }

        setIsLoading(true);

        try {
            // Step 1: Generate AI meditation script
            console.log('Step 1: Generating meditation script...');
            const scriptResponse = await fetch('/api/meditation/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    codeNumber: code.number,
                    title: code.title,
                    subtitle: code.subtitle,
                    darkCode: code.darkCode,
                    gift: code.gift,
                    metaCode: code.metaCode,
                    journalPrompt: code.journalPrompt,
                }),
            });

            if (!scriptResponse.ok) {
                const errorData = await scriptResponse.json().catch(() => ({ error: 'Unknown error' }));
                console.error('Script generation failed:', errorData);
                throw new Error(`명상 스크립트 생성 실패: ${errorData.error || scriptResponse.statusText}`);
            }

            const { script } = await scriptResponse.json();
            console.log('Script generated successfully:', script.substring(0, 100) + '...');

            // Step 2: Convert script to speech using TTS
            console.log('Step 2: Converting to speech...');
            const ttsResponse = await fetch('/api/tts/supertone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: script,
                    voiceId: 'coach', // Deep, authoritative voice
                }),
            });

            if (!ttsResponse.ok) {
                const errorData = await ttsResponse.json().catch(() => ({ error: 'Unknown error' }));
                console.error('TTS failed:', errorData);
                throw new Error(`음성 변환 실패: ${errorData.error || ttsResponse.statusText}`);
            }

            const audioBlob = await ttsResponse.blob();
            console.log('Audio blob created:', audioBlob.size, 'bytes');
            const audioUrl = URL.createObjectURL(audioBlob);

            // Create and play audio
            if (audioRef.current) {
                audioRef.current.pause();
            }

            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.onplay = () => setIsPlaying(true);
            audio.onpause = () => setIsPlaying(false);
            audio.onended = () => {
                setIsPlaying(false);
                URL.revokeObjectURL(audioUrl);
            };
            audio.onerror = (e) => {
                console.error('Audio playback error:', e);
                alert('오디오 재생 중 오류가 발생했습니다.');
                setIsPlaying(false);
            };

            console.log('Starting audio playback...');
            await audio.play();
        } catch (error: any) {
            console.error('Audio playback error:', error);
            alert(`음성 재생 실패: ${error.message || '알 수 없는 오류'}`);
            setIsPlaying(false);
        } finally {
            setIsLoading(false);
        }
    };

    const saveJournal = () => {
        // TODO: Implement journal save to Supabase
        alert('사색 기록이 저장되었습니다.');
    };

    const tabContent = {
        dark: {
            label: '다크코드',
            name: code.darkCode.name,
            description: code.darkCode.description,
            color: 'red'
        },
        gift: {
            label: '뉴럴코드',
            name: code.gift.name,
            description: code.gift.description,
            color: 'blue'
        },
        meta: {
            label: '메타코드',
            name: code.metaCode.name,
            description: code.metaCode.description,
            color: 'purple'
        }
    };

    const currentContent = tabContent[selectedTab];

    return (
        <div className="relative w-full max-w-md mx-auto bg-[#0A0F14] min-h-screen flex flex-col text-white overflow-hidden border-x border-white/5">
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-500/15 blur-[120px] rounded-full pointer-events-none z-0"></div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between p-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center size-10 rounded-full bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-50">THE 64 코드</span>
                    <span className="text-xs font-medium">대화형 오라클</span>
                </div>
                <button className="flex items-center justify-center size-10 rounded-full bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors">
                    <Share className="w-5 h-5" />
                </button>
            </header>

            {/* Main Content - Hexagram & Title */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-4">
                <div className="flex flex-col items-center justify-center mb-8 transform transition-transform duration-700 hover:scale-110">
                    {/* Hexagram */}
                    <div className="text-blue-500 flex flex-col items-center">
                        {renderHexagram(code.hexagram)}
                    </div>

                    {/* Title */}
                    <div className="mt-8 text-center">
                        <div className="inline-block px-4 py-1 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-widest mb-3">
                            코드 {String(code.number).padStart(2, '0')}
                        </div>
                        <h1 className="text-5xl font-bold mb-2 tracking-tight">{code.title}</h1>
                        <p className="text-gray-400 text-sm italic">"{code.subtitle}"</p>
                    </div>
                </div>

                {/* Audio Player */}
                <div className="w-full bg-[#161E26]/50 backdrop-blur-lg rounded-2xl p-4 border border-white/10 flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={playAudioNarration}
                            disabled={isLoading}
                            className={`size-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${isLoading
                                ? 'bg-gray-500 cursor-not-allowed'
                                : isPlaying
                                    ? 'bg-orange-500 shadow-orange-500/30 hover:bg-orange-600'
                                    : 'bg-blue-500 shadow-blue-500/30 hover:bg-blue-600'
                                }`}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : isPlaying ? (
                                <Pause className="w-6 h-6" />
                            ) : (
                                <Play className="w-6 h-6" />
                            )}
                        </button>
                        <div>
                            <h3 className="text-xs font-bold">가이드 명상</h3>
                            <p className="text-[10px] text-gray-400">
                                {isLoading ? '음성 생성 중...' : isPlaying ? '재생 중' : '명심 AI 낭독'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-1 items-end h-6 opacity-60">
                        {[3, 5, 2, 4].map((h, i) => (
                            <div
                                key={i}
                                className="w-1 bg-blue-500 rounded-full"
                                style={{ height: `${h * 4}px` }}
                            ></div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Bottom Card Section */}
            <section className="relative z-20 bg-[#161E26] rounded-t-[2.5rem] border-t border-white/10 pt-8 pb-10 px-6 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                {/* Tab Buttons */}
                <div className="flex justify-between items-center mb-8 gap-3">
                    <button
                        onClick={() => setSelectedTab('dark')}
                        className={`flex-1 flex flex-col items-center p-3 rounded-2xl border transition-all ${selectedTab === 'dark'
                            ? 'bg-red-500/20 border-red-500/50 ring-1 ring-red-500/50'
                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                            }`}
                    >
                        <span className={`text-[10px] font-bold mb-1 ${selectedTab === 'dark' ? 'text-red-400' : 'text-gray-400'}`}>
                            다크코드
                        </span>
                        <span className="text-sm font-bold">{code.darkCode.name}</span>
                    </button>

                    <button
                        onClick={() => setSelectedTab('gift')}
                        className={`flex-1 flex flex-col items-center p-3 rounded-2xl border transition-all ${selectedTab === 'gift'
                            ? 'bg-blue-500/20 border-blue-500/50 ring-1 ring-blue-500/50'
                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                            }`}
                    >
                        <span className={`text-[10px] font-bold mb-1 ${selectedTab === 'gift' ? 'text-blue-400' : 'text-gray-400'}`}>
                            뉴럴코드
                        </span>
                        <span className="text-sm font-bold text-white">{code.gift.name}</span>
                    </button>

                    <button
                        onClick={() => setSelectedTab('meta')}
                        className={`flex-1 flex flex-col items-center p-3 rounded-2xl border transition-all ${selectedTab === 'meta'
                            ? 'bg-purple-500/20 border-purple-500/50 ring-1 ring-purple-500/50'
                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                            }`}
                    >
                        <span className={`text-[10px] font-bold mb-1 ${selectedTab === 'meta' ? 'text-purple-400' : 'text-gray-400'}`}>
                            메타코드
                        </span>
                        <span className="text-sm font-bold">{code.metaCode.name}</span>
                    </button>
                </div>

                {/* Content Description */}
                <div className="mb-8 min-h-[80px]">
                    <p className="text-gray-300 text-sm leading-relaxed text-center">
                        {currentContent.description}
                    </p>
                </div>

                {/* Journal Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            내 안의 성찰
                        </label>
                        <button className="text-[10px] text-blue-400 flex items-center gap-1 hover:underline">
                            <History className="w-3 h-3" />
                            기록 보기
                        </button>
                    </div>

                    <div className="relative group">
                        <textarea
                            value={journalEntry}
                            onChange={(e) => setJournalEntry(e.target.value)}
                            className="w-full bg-black/30 rounded-2xl p-5 text-sm text-white placeholder-gray-500/40 border border-white/5 focus:border-blue-500/50 focus:ring-0 transition-all min-h-[140px] leading-relaxed resize-none focus:outline-none"
                            placeholder={code.journalPrompt}
                        />
                        <div className="absolute bottom-4 right-4 flex items-center gap-2">
                            <button
                                onClick={saveJournal}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 rounded-xl text-white text-xs font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all hover:bg-blue-600"
                            >
                                <Sparkles className="w-4 h-4" />
                                저장하기
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className="mt-8 flex justify-center gap-1.5">
                    <div className="size-1.5 rounded-full bg-white/10"></div>
                    <div className="w-6 h-1.5 rounded-full bg-blue-500"></div>
                    <div className="size-1.5 rounded-full bg-white/10"></div>
                </div>
            </section>

            {/* Bottom Spacer */}
            <div className="h-6 w-full bg-[#161E26]"></div>
        </div>
    );
}

export default function NeuralCodeContemplationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <NeuralCodeContent />
        </Suspense>
    );
}
