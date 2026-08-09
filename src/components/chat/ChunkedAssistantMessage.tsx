'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Volume2, Sparkles, ArrowRight, Compass } from 'lucide-react';
import MyeongsimDocentAvatar from './MyeongsimDocentAvatar';

interface ChunkedAssistantMessageProps {
    content: string;
    isLastMessage: boolean;
    onSelectQuestion: (question: string) => void;
    onSpeak?: (text: string) => void;
    isVoicePlaying?: boolean;
    ohaeng?: string;
}

/**
 * [Smart Follow-up Question Generator]
 * AI 답변 내용과 맥락에 맞춰 명심코칭 감동 톤앤매너로 추천 질문 2개를 동적 도출
 */



export default function ChunkedAssistantMessage({
    content,
    isLastMessage,
    onSelectQuestion,
    onSpeak,
    isVoicePlaying,
    ohaeng = 'wood'
}: ChunkedAssistantMessageProps) {
    // No longer extracting follow-up questions
    const parsedContent = content;

    // Split content by double newlines or major paragraph breaks
    const rawChunks = parsedContent.split(/\n\s*\n/).map(c => c.trim()).filter(Boolean);
    const chunks = rawChunks.length > 0 ? rawChunks : [parsedContent];

    return (
        <div className="space-y-3 w-full animate-fadeIn">
            {/* 1. Split Speech Bubbles */}
            {chunks.map((chunk, idx) => (
                <div
                    key={idx}
                    className="relative group backdrop-blur-xl bg-slate-950/70 border border-amber-500/20 rounded-2xl rounded-tl-sm text-gray-100 px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-amber-400/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]"
                >
                    {idx === 0 && (
                        <div className="mb-3 pb-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
                            <MyeongsimDocentAvatar ohaeng={ohaeng} size="sm" showTitle={true} />
                            
                            {/* 🧠 World-Class Master Wellness Patent Tech Badge */}
                            <div className="flex items-center gap-1.5 text-[10px] bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 border border-amber-400/30 text-amber-300 px-2.5 py-1 rounded-full font-semibold shadow-inner backdrop-blur-md tracking-tight">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                <span>🧠 3rd-Gen Neuro-Psychology Patent Application</span>
                                <span className="text-gray-500">|</span>
                                <span className="font-mono text-[9px] text-amber-200/80">특허출원중 제10-2025-0166877호</span>
                            </div>
                        </div>
                    )}
                    <div className="prose prose-invert prose-sm max-w-none leading-relaxed tracking-normal font-sans">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                strong: ({ node, ...props }) => <strong className="text-amber-300 font-black bg-amber-400/10 px-1 py-0.5 rounded border border-amber-400/20" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed text-[14px] text-gray-200" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1 text-xs text-gray-300" {...props} />,
                                li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
                                code: ({ node, ...props }) => <code className="bg-black/50 rounded px-1.5 py-0.5 text-amber-300 font-mono text-xs border border-white/10" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-sm font-black text-amber-300 mt-3 mb-1.5 flex items-center gap-1.5 border-l-2 border-amber-400 pl-2" {...props} />,
                            }}
                        >
                            {chunk}
                        </ReactMarkdown>
                    </div>

                    {/* Speaker Button on the First Chunk */}
                    {idx === 0 && onSpeak && (
                        <button
                            onClick={() => onSpeak(content)}
                            className="absolute top-2.5 right-2.5 p-1.5 text-gray-400 hover:text-amber-300 transition-all opacity-70 hover:opacity-100 cursor-pointer rounded-lg hover:bg-white/5"
                            title="전체 낭독 듣기"
                        >
                            <Volume2 className={`w-4 h-4 ${isVoicePlaying ? 'text-amber-400 animate-pulse' : ''}`} />
                        </button>
                    )}
                </div>
            ))}


        </div>
    );
}
