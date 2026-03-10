import React, { useState } from 'react';
import { Check, Clock, Sparkles, ChevronDown, ChevronUp, Calendar, Target } from 'lucide-react';
import { AccountabilityService } from '@/modules/AccountabilityService';

interface MissionStep {
    day: string; // "1일차"
    time: string; // "아침"
    action: string; // "창문 열고 호흡하기"
    duration: string; // "5분"
    benefit: string; // "전두엽 활성화"
}

interface ActionPlanCardProps {
    plan: MissionStep[];
}

const ActionPlanCard: React.FC<ActionPlanCardProps> = ({ plan }) => {
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [expanded, setExpanded] = useState<boolean>(true);
    const [hasCommitted, setHasCommitted] = useState(false);

    const handleCommit = () => {
        if (plan.length > 0) {
            AccountabilityService.saveMission(plan[0].action); // Save the first mission for check-in
            setHasCommitted(true);
        }
    };

    const toggleComplete = (idx: number) => {
        setCompletedSteps(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    if (!plan || plan.length === 0) return null;

    return (
        <div className="w-full max-w-md mx-auto my-4 overflow-hidden rounded-2xl bg-gray-900/90 border border-gray-700/50 shadow-2xl backdrop-blur-md animate-fade-in-up">
            {/* Header */}
            <div
                className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 flex items-center justify-between cursor-pointer border-b border-gray-700/50"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-gold/20 flex items-center justify-center border border-primary-gold/30">
                        <Calendar className="w-5 h-5 text-primary-gold" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg leading-none">3일 실천 플랜</h3>
                        <p className="text-xs text-primary-gold/80 mt-1 font-medium">Small Steps, Big Change</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                    {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>

            {/* Content Timeline */}
            {expanded && (
                <div className="p-5 space-y-6 relative">
                    {/* Vertical Connecting Line */}
                    <div className="absolute left-[29px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary-gold/50 via-gray-700 to-transparent z-0"></div>

                    {plan.map((step, idx) => {
                        const isCompleted = completedSteps.includes(idx);
                        return (
                            <div key={idx} className="relative z-10 pl-2">
                                <div className="flex gap-4 group">
                                    {/* Timeline Node */}
                                    <div className="flex flex-col items-center gap-2">
                                        <button
                                            onClick={() => toggleComplete(idx)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${isCompleted
                                                ? 'bg-primary-gold border-primary-gold scale-110'
                                                : 'bg-gray-800 border-gray-600 hover:border-primary-gold/70'
                                                }`}
                                        >
                                            {isCompleted ? <Check className="w-4 h-4 text-black font-bold" /> : <span className="text-xs text-gray-500 font-mono">{idx + 1}</span>}
                                        </button>
                                        {/* Day Badge */}
                                        <div className="text-[10px] font-bold text-gray-500 bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">
                                            DAY {idx + 1}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div
                                        className={`flex-1 rounded-xl p-4 border transition-all duration-300 ${isCompleted
                                            ? 'bg-primary-gold/5 border-primary-gold/30'
                                            : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${step.time.includes('아침') ? 'bg-orange-900/40 text-orange-300' :
                                                step.time.includes('저녁') ? 'bg-indigo-900/40 text-indigo-300' :
                                                    'bg-gray-700 text-gray-300'
                                                }`}>
                                                {step.time}
                                            </span>
                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                <Clock className="w-3 h-3" />
                                                {step.duration}
                                            </div>
                                        </div>

                                        <h4 className={`text-sm md:text-base font-bold mb-2 transition-colors ${isCompleted ? 'text-primary-gold line-through decoration-primary-gold/50' : 'text-gray-100'}`}>
                                            {step.action}
                                        </h4>

                                        <div className="flex items-start gap-2 bg-black/20 p-2 rounded-lg">
                                            <Sparkles className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                                            <p className="text-xs text-purple-200/80 leading-relaxed">
                                                {step.benefit}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Footer Progress */}
            {expanded && (
                <div className="px-5 pb-5 pt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Progress</span>
                        <span>{Math.round((completedSteps.length / plan.length) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-gold to-yellow-300 transition-all duration-500 ease-out"
                            style={{ width: `${(completedSteps.length / plan.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Commit Button */}
            {expanded && !hasCommitted && (
                <div className="px-5 pb-5">
                    <button
                        onClick={handleCommit}
                        className="w-full py-3 rounded-xl bg-primary-gold text-black font-bold flex items-center justify-center gap-2 hover:bg-yellow-400 transition shadow-lg shadow-primary-gold/20"
                    >
                        <Target className="w-4 h-4" />
                        이 플랜으로 시작하기
                    </button>
                    <p className="text-[10px] text-gray-500 text-center mt-2">
                        * 내일 앱을 켜면 실천 여부를 확인해드립니다.
                    </p>
                </div>
            )}

            {/* Commit Success Message */}
            {expanded && hasCommitted && (
                <div className="px-5 pb-5 text-center">
                    <div className="py-2 px-4 bg-green-500/10 border border-green-500/30 rounded-xl inline-block mx-auto">
                        <p className="text-green-400 text-xs font-bold flex items-center gap-2">
                            <Check className="w-3 h-3" />
                            미션이 등록되었습니다!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionPlanCard;
