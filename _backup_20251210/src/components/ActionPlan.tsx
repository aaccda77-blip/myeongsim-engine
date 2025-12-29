'use client';

import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useState } from 'react';

interface ActionProps {
    data: {
        affirmation: string;
        todos: string[];
    };
}

export default function ActionPlan({ data }: ActionProps) {
    const [committed, setCommitted] = useState(false);

    const handleCommit = () => {
        if (committed) return;

        setCommitted(true);

        // Confetti explosion
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: NodeJS.Timeout = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    return (
        <section className="py-24 px-4 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-white mb-16">Part 4. 처방과 행동 (Action Plan)</h2>

            {/* Mantra */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mb-16 relative"
            >
                <Quote className="w-12 h-12 text-primary-gold/30 absolute -top-8 -left-8 rotate-180" />
                <p className="text-2xl md:text-4xl font-serif text-white italic leading-relaxed">
                    &quot;{data.affirmation}&quot;
                </p>
                <Quote className="w-12 h-12 text-primary-gold/30 absolute -bottom-8 -right-8" />
            </motion.div>

            {/* Action Items */}
            <div className="w-full max-w-xl space-y-4 mb-16">
                {data.todos.map((todo, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
                        <input type="checkbox" className="w-5 h-5 accent-primary-gold cursor-pointer" />
                        <span className="text-left text-gray-300">{todo}</span>
                    </div>
                ))}
            </div>

            {/* Commit Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCommit}
                disabled={committed}
                className={`px-12 py-5 rounded-full text-xl font-bold transition-all shadow-lg ${committed
                    ? 'bg-green-600 text-white cursor-default'
                    : 'bg-primary-gold text-deep-indigo hover:shadow-primary-gold/50'
                    }`}
            >
                {committed ? "약속되었습니다 ✨" : "나 자신과 약속하기"}
            </motion.button>
        </section>
    );
}
