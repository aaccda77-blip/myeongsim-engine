
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface SimpleCaptchaProps {
    onVerify: (isValid: boolean) => void;
}

export default function SimpleCaptcha({ onVerify }: SimpleCaptchaProps) {
    const [quiz, setQuiz] = useState({ q: 'Loading...', a: -1 });
    const [input, setInput] = useState('');

    const generateQuiz = () => {
        const a = Math.floor(Math.random() * 9) + 1; // 1-9
        const b = Math.floor(Math.random() * 9) + 1; // 1-9
        setQuiz({ q: `${a} + ${b}`, a: a + b });
        setInput('');
        onVerify(false);
    };

    useEffect(() => {
        generateQuiz();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const num = parseInt(val);
        setInput(val);

        if (!isNaN(num) && num === quiz.a) {
            onVerify(true);
        } else {
            onVerify(false);
        }
    };

    return (
        <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl mb-4">
            <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">보안 퀴즈</span>
                <div className="px-3 py-1 bg-white/10 rounded text-sm text-white font-mono font-bold">
                    {quiz.q} = ?
                </div>
            </div>

            <input
                type="number"
                value={input}
                onChange={handleChange}
                placeholder="정답"
                className="flex-1 bg-transparent text-white text-center border-b border-white/20 focus:border-green-500 outline-none py-1 w-16"
                autoComplete="off"
            />

            <button
                onClick={(e) => { e.preventDefault(); generateQuiz(); }}
                className="text-gray-500 hover:text-white transition-colors"
                title="새 문제"
            >
                <RefreshCw size={14} />
            </button>
        </div>
    );
}
