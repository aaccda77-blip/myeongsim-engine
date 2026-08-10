
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { Heart, Activity, Users, Zap, X, ChevronRight, MessageCircle, Frown, Smile, Lock, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as RadarComponent } from 'recharts';

interface MentalPrescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onComplete: (advice: string, context: any) => void;
}

const MOOD_KEYWORDS = [
    { id: 'headache', label: '🤕 두통/편두통', type: 'neg' },
    { id: 'refreshing', label: '🌿 상쾌함', type: 'pos' },
    { id: 'anxiety', label: '😰 막연한 불안', type: 'neg' },
    { id: 'focused', label: '🧠 집중 잘됨', type: 'pos' },
    { id: 'peaceful', label: '🕊️ 평온함', type: 'pos' },
    { id: 'insomnia', label: '😴 수면 부족', type: 'neg' },
    { id: 'flutter', label: '💓 설렘', type: 'pos' },
    { id: 'lethargy', label: '🫠 무기력', type: 'neg' },
    { id: 'grateful', label: '🙏 감사함', type: 'pos' },
    { id: 'anger', label: '😡 분노/짜증', type: 'neg' },
];

export default function MentalPrescriptionV2({ isOpen, onClose, userId, onComplete }: MentalPrescriptionModalProps) {
    const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
    const [scores, setScores] = useState({ ul_mind: 0, ur_body: 0, ll_relation: 0, lr_system: 0 });
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [showValidation, setShowValidation] = useState(false);
    const [resultData, setResultData] = useState<{ advice: string, context: any } | null>(null);

    // [Accordion State]
    const [isCoreCodeOpen, setIsCoreCodeOpen] = useState(true); // Default open to show "Killer Content"

    const handleScoreChange = (key: keyof typeof scores, value: number) => {
        setScores(prev => ({ ...prev, [key]: value }));
    };

    const toggleSymptom = (id: string) => {
        setSelectedSymptoms(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
        if (showValidation) setShowValidation(false);
    };

    const isValid = selectedSymptoms.length > 0;

    const handleSubmit = async () => {
        if (!isValid) { setShowValidation(true); return; }
        setStep('loading');
        try {
            const res = await fetch('/api/integral/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, dailyState: { ...scores, symptoms: selectedSymptoms } })
            });
            const data = await res.json();
            if (data.success) {
                setResultData(data.data);
                setStep('result');
            } else {
                alert(`[Server Error] ${data.message || JSON.stringify(data)}`);
                setStep('input');
            }
        } catch (e) {
            console.error(e);
            alert("Network Error");
            setStep('input');
        }
    };

    const handleStartChat = () => {
        if (resultData) {
            const scoreDetails = `
- 몸(Body): ${scores.ur_body}/10
- 마음(Mind): ${scores.ul_mind}/10
- 관계(Relation): ${scores.ll_relation}/10
- 환경(Environment): ${scores.lr_system}/10
- 키워드: ${selectedSymptoms.map(s => MOOD_KEYWORDS.find(k => k.id === s)?.label || s).join(', ')}
            `.trim();
            const richPrompt = `[마음 가이드 데이터 수신]\n\n나의 현재 상태:\n${scoreDetails}\n\nAI 1차 분석:\n"${resultData.advice}"\n\n위 수치와 상태를 바탕으로, 특히 점수가 낮은 영역을 케어할 수 있는 구체적이고 실천 가능한 행동 가이드를 '용한 코치' 페르소나로 제시해줘.`;
            onComplete(resultData.advice, { ...resultData.context, initialPrompt: richPrompt });
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            setShowValidation(false);
            setStep('input');
            setScores({ ul_mind: 0, ur_body: 0, ll_relation: 0, lr_system: 0 });
            setSelectedSymptoms([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-md bg-[#11131a] sm:rounded-2xl border-none sm:border border-gray-800 shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header: [FIX] Larger padding-top for Safe Area */}
                <div className="flex justify-between items-center px-6 pt-10 pb-4 border-b border-gray-800 shrink-0 bg-[#11131a]/95 backdrop-blur-xl z-20">
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                        🩺 통합 체크인 <span className="text-xs text-green-400 font-bold border border-green-500/50 px-2 rounded-full">v2.0 New</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 pb-10">
                    {step === 'input' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                            <div className="text-center space-y-1">
                                <p className="text-sm text-gray-400">"머리가 아닌 <b>몸(Body)</b>이 느끼는 그대로"</p>
                            </div>
                            <div className="space-y-6">
                                <ScoreSlider label="몸 (Body)" icon={<Activity size={16} className="text-emerald-400" />} value={scores.ur_body} onChange={(v: number) => handleScoreChange('ur_body', v)} accentColor="accent-emerald-500" />
                                <ScoreSlider label="마음 (Mind)" icon={<Heart size={16} className="text-purple-400" />} value={scores.ul_mind} onChange={(v: number) => handleScoreChange('ul_mind', v)} accentColor="accent-purple-500" />
                                <ScoreSlider label="관계 (Relation)" icon={<Users size={16} className="text-pink-400" />} value={scores.ll_relation} onChange={(v: number) => handleScoreChange('ll_relation', v)} accentColor="accent-pink-500" />
                                <ScoreSlider label="환경/성취 (Env)" icon={<Zap size={16} className="text-blue-400" />} value={scores.lr_system} onChange={(v: number) => handleScoreChange('lr_system', v)} accentColor="accent-blue-500" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-200 mb-3 block">지금 내 기분은?</label>
                                <div className="flex flex-wrap gap-2">
                                    {MOOD_KEYWORDS.map(sym => {
                                        const isSelected = selectedSymptoms.includes(sym.id);
                                        return (
                                            <motion.button key={sym.id} whileTap={{ scale: 0.95 }} onClick={() => toggleSymptom(sym.id)}
                                                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${isSelected ? (sym.type === 'pos' ? 'bg-green-500/20 text-green-300 border-green-500/50' : 'bg-red-500/20 text-red-300 border-red-500/50') : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                                                {sym.label}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                            <motion.button onClick={handleSubmit} disabled={!isValid}
                                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 ${isValid ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gray-700 cursor-not-allowed'}`}>
                                {isValid ? <><Zap size={20} /> 내 마음 가이드받기</> : <><Lock size={18} /> 키워드를 선택해주세요</>}
                            </motion.button>
                        </div>
                    )}

                    {step === 'loading' && (
                        <div className="flex flex-col items-center justify-center h-full py-12 space-y-6">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center"><Activity size={20} className="text-purple-400 animate-pulse" /></div>
                            </div>
                            <p className="text-white font-bold text-lg animate-pulse">상태를 분석하고 있습니다...</p>
                        </div>
                    )}

                    {step === 'result' && resultData && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Chart */}
                            <div className="bg-[#1a1d26] rounded-2xl p-4 border border-gray-800 shadow-inner relative overflow-hidden">
                                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider text-center mb-2">Integral Balance</h3>
                                <div className="h-56 w-full relative z-10">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                            { subject: '몸 (Body)', A: scores.ur_body * 10, fullMark: 100 },
                                            { subject: '마음 (Mind)', A: scores.ul_mind * 10, fullMark: 100 },
                                            { subject: '관계 (Rel)', A: scores.ll_relation * 10, fullMark: 100 },
                                            { subject: '환경 (Env)', A: scores.lr_system * 10, fullMark: 100 },
                                        ]}>
                                            <PolarGrid stroke="#374151" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: '600' }} />
                                            <RadarComponent name="My Status" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.4} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                                {/* [FIX] Wearable Pulse Animation */}
                                <div className="absolute bottom-2 left-0 right-0 text-center flex items-center justify-center gap-2">
                                    <div className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </div>
                                    <span className="text-[10px] text-green-500/80 font-mono tracking-wider">
                                        웨어러블 심박 연동: 연결 대기 중 (v2.0)
                                    </span>
                                </div>
                            </div>

                            {/* Core Code Accordion (Premium Highlight) */}
                            <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${isCoreCodeOpen ? 'bg-gradient-to-br from-gray-900 to-black border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'bg-gray-900 border-gray-800'}`}>
                                <button
                                    onClick={() => setIsCoreCodeOpen(!isCoreCodeOpen)}
                                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Sparkles className={`w-4 h-4 ${isCoreCodeOpen ? 'text-yellow-400' : 'text-gray-400'}`} />
                                        <h3 className={`text-sm font-bold ${isCoreCodeOpen ? 'text-white' : 'text-gray-400'}`}>핵심 코드 분석 (Core Code)</h3>
                                    </div>
                                    {isCoreCodeOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                </button>

                                <AnimatePresence>
                                    {isCoreCodeOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-4 pb-4 pt-2 space-y-3"
                                        >
                                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                                <p className="text-xs text-yellow-500 font-bold mb-1">👑 당신의 숨겨진 천재성 (Gift)</p>
                                                <p className="text-sm text-gray-200">
                                                    {resultData.context?.gene_keys?.lifes_work
                                                        ? `Gene Key ${resultData.context.gene_keys.lifes_work.toFixed(1)}: 당신은 위기 상황에서 본능적으로 해결책을 찾아내는 직관력이 뛰어납니다.`
                                                        : "지금 바로 전체 리포트를 확인하여 당신의 '천직 코드'를 발견하세요."}
                                                </p>
                                            </div>
                                            <button onClick={() => window.location.href = '/report/soul-archive'} className="w-full text-xs text-center text-gray-400 hover:text-white underline py-1">
                                                전체 리포트에서 내 천직 확인하기 →
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Insight Card */}
                            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-5 shadow-inner">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white font-bold text-lg">Daily Insight</h3>
                                    <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded">
                                        <span className="text-[10px] text-gray-400">ENERGY</span>
                                        <div className={`w-2 h-4 rounded-sm ${resultData.context?.saju?.energy_level === 'Critical_Heat' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                        <div className={`w-2 h-4 rounded-sm bg-gray-700`}></div>
                                    </div>
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">"{resultData.advice}"</p>
                            </div>

                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleStartChat}
                                className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg shadow-white/10">
                                <MessageCircle size={20} /> 코치와 깊이 상담하기
                            </motion.button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

function ScoreSlider({ label, icon, value, onChange, accentColor }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-200 font-bold flex gap-2 items-center">{icon} {label}</span>
                <span className={`font-mono font-bold text-lg ${value > 0 ? 'text-white' : 'text-gray-600'}`}>{value > 0 ? value : '-'}</span>
            </div>
            <div className="relative h-10 flex items-center">
                <Frown size={16} className={`absolute left-0 -ml-1 ${value > 0 && value <= 3 ? 'text-red-400' : 'text-gray-600'}`} />
                <input type="range" min="0" max="10" step="1" value={value} onChange={(e) => onChange(parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer z-10 mx-6 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ background: value === 0 ? '#374151' : `linear-gradient(to right, ${value <= 3 ? '#ef4444' : value <= 7 ? '#eab308' : '#22c55e'} 0%, ${value <= 3 ? '#ef4444' : value <= 7 ? '#eab308' : '#22c55e'} ${(value / 10) * 100}%, #374151 ${(value / 10) * 100}%, #374151 100%)` }} />
                <Smile size={16} className={`absolute right-0 -mr-1 ${value >= 8 ? 'text-green-400' : 'text-gray-600'}`} />
            </div>
            <style jsx>{`input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 24px; width: 24px; border-radius: 50%; background: #fff; cursor: pointer; margin-top: -8px; box-shadow: 0 0 10px rgba(0,0,0,0.5); border: 2px solid rgba(255,255,255,0.1); }`}</style>
        </div>
    );
}
