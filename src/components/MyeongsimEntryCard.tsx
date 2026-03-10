import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function MyeongsimEntryCard() {
    return (
        <Link href="/onboarding" className="block w-full">
            <div className="relative overflow-hidden w-full bg-gradient-to-br from-[#1a1c29] to-[#0f111a] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(101,140,66,0.3)] group cursor-pointer">

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-olive/20 rounded-full blur-[50px] pointer-events-none group-hover:bg-primary-olive/30 transition-colors" />
                <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none" />

                <div className="relative z-10 flex items-start justifies-between gap-4">
                    {/* Icon Container */}
                    <div className="shrink-0 w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-primary-olive/20 group-hover:border-primary-olive/30 transition-colors shadow-inner">
                        <Sparkles className="w-6 h-6 text-primary-olive group-hover:rotate-12 transition-transform duration-500" />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 pt-1">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 tracking-tight">
                            나만의 맞춤형 명심코칭
                            <span className="px-2 py-0.5 rounded-full bg-primary-olive/20 text-primary-olive text-[10px] font-bold uppercase tracking-wider border border-primary-olive/30">
                                New
                            </span>
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-[90%] font-light">
                            사주 명리와 심리학을 결합한 나만의 전담 코치를 만나보세요.
                        </p>
                    </div>

                    {/* Action Arrow */}
                    <div className="shrink-0 self-center w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-olive transition-colors mt-2">
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
