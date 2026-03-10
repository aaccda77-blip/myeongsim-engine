'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
    userName: string;
}

export default function HeroSection({ userName }: HeroSectionProps) {
    const [displayText, setDisplayText] = useState('');
    const fullText = `안녕하세요, ${userName}님.\n당신의 계절은 지금\n어디쯤 와 있을까요?`;

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayText(fullText.slice(0, index));
            index++;
            if (index > fullText.length) {
                clearInterval(interval);
            }
        }, 100); // Typing speed
        return () => clearInterval(interval);
    }, [fullText]);

    const handleScrollDown = () => {
        const nextSection = document.getElementById('part1-energy');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="h-screen flex flex-col items-center justify-center relative p-6 text-center">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-deep-indigo opacity-80 z-0 pointer-events-none" />

            {/* Awakening Text */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10"
            >
                <h1 className="text-4xl md:text-5xl font-bold leading-relaxed whitespace-pre-line text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-gold mb-8">
                    {displayText}
                    <span className="animate-pulse">|</span>
                </h1>
            </motion.div>

            {/* Start Button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
                onClick={handleScrollDown}
                className="z-10 mt-12 px-8 py-4 border border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-deep-indigo transition-all duration-300 rounded-full text-lg tracking-widest flex items-center gap-2 group"
            >
                분석 시작하기
                <ChevronDown className="group-hover:translate-y-1 transition-transform" />
            </motion.button>
        </section>
    );
}
