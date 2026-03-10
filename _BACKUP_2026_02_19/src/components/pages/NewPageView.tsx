'use client';

import { motion } from 'framer-motion';
import { Rocket, Sparkles, PlusCircle } from 'lucide-react'; // 세련된 아이콘 사용

export default function NewPageView() {
    return (
        <div className="h-full flex flex-col pt-12 pb-8 px-4 relative overflow-hidden">

            {/* Background Decoration */}
            <div className="absolute top-[-20%] right-[-20%] w-[300px] h-[300px] bg-primary-olive/5 rounded-full blur-[80px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
            >
                {/* Header */}
                <div>
                    <span className="text-primary-olive text-[10px] font-bold tracking-widest uppercase border border-primary-olive/30 px-3 py-1 rounded-full bg-primary-olive/10">
                        Expansion
                    </span>
                    <h2 className="text-3xl font-serif text-white mt-4">New Chapter</h2>
                    <p className="text-sm text-gray-400 mt-2">무한한 확장의 가능성</p>
                </div>

                {/* Main Visual (Icon + Pulse Animation) */}
                <div className="relative">
                    {/* Outer Glow Ring */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-primary-olive rounded-full blur-xl"
                    />

                    {/* Icon Container */}
                    <div className="w-24 h-24 rounded-full bg-deep-slate border border-primary-olive/50 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(101,140,66,0.2)]">
                        <Rocket className="w-10 h-10 text-primary-olive" />

                        {/* Orbiting Sparkle */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-10px] rounded-full"
                        >
                            <Sparkles className="w-4 h-4 text-white absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </motion.div>
                    </div>
                </div>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-deep-slate/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-xs mx-auto shadow-lg"
                >
                    <div className="flex items-center justify-center gap-2 mb-4 text-white">
                        <PlusCircle className="w-5 h-5 text-primary-olive" />
                        <span className="font-bold">성공적으로 추가되었습니다</span>
                    </div>

                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                        <span className="text-primary-olive font-bold">`src/components/pages`</span> 폴더에<br />
                        새로운 컴포넌트를 생성하고 연결하면,<br />
                        당신의 우주(앱)는 계속 넓어집니다.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
