'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Volume2, Sparkles } from 'lucide-react';
import MyeongsimDocentAvatar from './MyeongsimDocentAvatar';

interface ChunkedAssistantMessageProps {
    content: string;
    isLastMessage: boolean;
    onSelectQuestion: (question: string) => void;
    onSpeak?: (text: string) => void;
    isVoicePlaying?: boolean;
    ohaeng?: string;
}

export default function ChunkedAssistantMessage({
    content,
    isLastMessage,
    onSelectQuestion,
    onSpeak,
    isVoicePlaying,
    ohaeng = 'wood'
}: ChunkedAssistantMessageProps) {
    if (!content) return null;

    return (
        <div className="w-full animate-fadeIn">
            <div className="relative group backdrop-blur-xl bg-slate-950/80 border border-amber-500/30 rounded-3xl rounded-tl-sm text-gray-100 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                {/* Header: Avatar & Tech Patent Badge */}
                <div className="mb-4 pb-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <MyeongsimDocentAvatar ohaeng={ohaeng} size="sm" showTitle={true} />
                    
                    {/* 🧠 World-Class Master Wellness Patent Tech Badge */}
                    <div className="flex items-center gap-1.5 text-[11px] bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full font-semibold shadow-inner backdrop-blur-md tracking-tight">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>🧠 3rd-Gen Neuro-Psychology Patent Application</span>
                        <span className="text-gray-500">|</span>
                        <span className="font-mono text-[10px] text-amber-200/90">특허출원중 제10-2025-0166877호</span>
                    </div>
                </div>

                {/* Main Body: Markdown Formatted Content */}
                <div className="prose prose-invert prose-sm sm:prose-base max-w-none leading-relaxed tracking-normal font-sans space-y-3">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            strong: ({ node, ...props }) => (
                                <strong className="text-amber-300 font-black bg-amber-400/15 px-1.5 py-0.5 rounded border border-amber-400/20" {...props} />
                            ),
                            p: ({ node, ...props }) => (
                                <p className="mb-3 last:mb-0 leading-relaxed text-sm sm:text-base text-gray-200 break-keep font-medium" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                                <ul className="list-disc pl-5 mb-3 space-y-1.5 text-xs sm:text-sm text-gray-300" {...props} />
                            ),
                            li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
                            code: ({ node, ...props }) => (
                                <code className="bg-black/60 rounded px-1.5 py-0.5 text-amber-300 font-mono text-xs border border-white/10" {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                                <h2 className="text-base sm:text-lg font-black text-amber-400 mt-4 mb-2 flex items-center gap-2 border-b border-amber-400/20 pb-1" {...props} />
                            ),
                            h3: ({ node, ...props }) => (
                                <h3 className="text-sm sm:text-base font-black text-amber-300 mt-4 mb-2 flex items-center gap-2 border-l-2 border-amber-400 pl-2.5" {...props} />
                            ),
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>

                {/* TTS Audio Button */}
                {onSpeak && (
                    <button
                        onClick={() => onSpeak(content)}
                        className="absolute top-3.5 right-3.5 p-2 text-gray-400 hover:text-amber-300 transition-all opacity-70 hover:opacity-100 cursor-pointer rounded-xl hover:bg-white/10 border border-transparent hover:border-amber-400/30"
                        title="전체 음성 낭독 듣기"
                    >
                        <Volume2 className={`w-4 h-4 ${isVoicePlaying ? 'text-amber-400 animate-pulse' : ''}`} />
                    </button>
                )}
            </div>
        </div>
    );
}
