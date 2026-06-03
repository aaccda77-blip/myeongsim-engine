'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { Send, ArrowRight, Brain, AlertCircle } from 'lucide-react';
import { calculateExpansionVoid } from '@/utils/sajuLogic';

interface HiddenSourceCodeChatProps {
    onComplete: (prompt: string) => void;
    onClose: () => void;
}

interface Message {
    id: string;
    sender: 'bot' | 'user';
    text: string;
}

const STEM_ELEMENTS: Record<string, { elem: string, pol: '+' | '-' }> = {
    '갑': { elem: '목', pol: '+' },
    '을': { elem: '목', pol: '-' },
    '병': { elem: '화', pol: '+' },
    '정': { elem: '화', pol: '-' },
    '무': { elem: '토', pol: '+' },
    '기': { elem: '토', pol: '-' },
    '경': { elem: '금', pol: '+' },
    '신': { elem: '금', pol: '-' },
    '임': { elem: '수', pol: '+' },
    '계': { elem: '수', pol: '-' }
};

const JIJANGGAN_MAP: Record<string, { main: string; initial: string; middle?: string }> = {
    '자': { main: '계', initial: '임' },
    '축': { main: '기', initial: '계', middle: '신' },
    '인': { main: '갑', initial: '무', middle: '병' },
    '묘': { main: '을', initial: '갑' },
    '진': { main: '무', initial: '을', middle: '계' },
    '사': { main: '병', initial: '무', middle: '경' },
    '오': { main: '정', initial: '병', middle: '기' },
    '미': { main: '기', initial: '정', middle: '을' },
    '신': { main: '경', initial: '무', middle: '임' },
    '유': { main: '신', initial: '경' },
    '술': { main: '무', initial: '신', middle: '정' },
    '해': { main: '임', initial: '무', middle: '갑' }
};

function getTenGod(dayMaster: string, stem: string): string {
    const dm = STEM_ELEMENTS[dayMaster];
    const target = STEM_ELEMENTS[stem];
    if (!dm || !target) return '';

    const me = dm.elem;
    const you = target.elem;
    const samePolarity = dm.pol === target.pol;

    const RELATIONS: Record<string, string> = {
        '목': '화', '화': '토', '토': '금', '금': '수', '수': '목'
    };
    const CONTROLS: Record<string, string> = {
        '목': '토', '화': '금', '토': '수', '금': '목', '수': '화'
    };

    if (me === you) {
        return samePolarity ? '비견' : '겁재';
    }
    if (RELATIONS[me] === you) {
        return samePolarity ? '식신' : '상관';
    }
    if (CONTROLS[me] === you) {
        return samePolarity ? '편재' : '정재';
    }
    if (CONTROLS[you] === me) {
        return samePolarity ? '편관' : '정관';
    }
    if (RELATIONS[you] === me) {
        return samePolarity ? '편인' : '정인';
    }
    return '';
}

export default function HiddenSourceCodeChat({ onComplete, onClose }: HiddenSourceCodeChatProps) {
    const { reportData } = useReportStore();
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const chatHistoryRef = useRef<{ question: string; answer: string }[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Saju Information Extraction
    const rawSaju = reportData?.saju as any;
    const dayMasterRaw = rawSaju?.dayMaster || '';
    const dayMasterChar = dayMasterRaw ? dayMasterRaw.charAt(0) : '';

    const getBranchChar = (pillar: any) => {
        if (!pillar) return '';
        const jiData = pillar.ji;
        if (typeof jiData === 'string') return jiData;
        if (jiData && typeof jiData === 'object') {
            return jiData.char || jiData.character || jiData.value || jiData.kor || Object.values(jiData)[0] || '';
        }
        return '';
    };

    const getGanChar = (pillar: any) => {
        if (!pillar) return '';
        const ganData = pillar.gan;
        if (typeof ganData === 'string') return ganData;
        if (ganData && typeof ganData === 'object') {
            return ganData.char || ganData.character || ganData.value || ganData.kor || Object.values(ganData)[0] || '';
        }
        return '';
    };

    const yearBranch = getBranchChar(rawSaju?.fourPillars?.year);
    const monthBranch = getBranchChar(rawSaju?.fourPillars?.month);
    const dayBranch = getBranchChar(rawSaju?.fourPillars?.day);
    const hourBranch = getBranchChar(rawSaju?.fourPillars?.time);

    // Calculate Gongmang and Jijanggan
    const dayMasterStem = getGanChar(rawSaju?.fourPillars?.day) || dayMasterChar;
    const gongmangList = dayMasterStem && dayBranch ? calculateExpansionVoid(dayMasterStem, dayBranch) : [];

    const getJijangganList = (branch: string) => {
        if (!branch) return [];
        const map = JIJANGGAN_MAP[branch];
        if (!map) return [];
        const list = [map.initial];
        if (map.middle) list.push(map.middle);
        list.push(map.main);
        return list;
    };

    const scanAllHiddenTenGods = () => {
        const list: { branch: string; stem: string; tenGod: string }[] = [];
        const branches = [
            { name: '년지', char: yearBranch },
            { name: '월지', char: monthBranch },
            { name: '일지', char: dayBranch },
            { name: '시지', char: hourBranch }
        ];

        branches.forEach(b => {
            if (b.char) {
                const stems = getJijangganList(b.char);
                stems.forEach(s => {
                    const tg = getTenGod(dayMasterChar, s);
                    if (tg) {
                        list.push({ branch: b.name, stem: s, tenGod: tg });
                    }
                });
            }
        });
        return list;
    };

    const hiddenTenGods = scanAllHiddenTenGods();
    const hasSanggwan = hiddenTenGods.some(item => item.tenGod === '상관');
    const sanggwanItem = hiddenTenGods.find(item => item.tenGod === '상관');

    const getSanggwanBranchChar = () => {
        if (!sanggwanItem) return '';
        const branchKey = sanggwanItem.branch === '년지' ? 'year' : sanggwanItem.branch === '월지' ? 'month' : sanggwanItem.branch === '일지' ? 'day' : 'time';
        return getBranchChar(rawSaju?.fourPillars?.[branchKey]);
    };

    const stepQuestions = [
        {
            text: `[1단계: 지장간(숨은 기운) 해독]\n\n당신의 내면 데이터베이스를 스캔한 결과, 지장간(숨겨진 성격 코드)이 감지되었습니다.\n\n${
                sanggwanItem 
                    ? `특히 **${sanggwanItem.branch}(${getSanggwanBranchChar()})**의 지장간 속에 **상관(傷官 - 壬/癸)** 에너지가 암장(숨겨짐)되어 있습니다.\n이는 겉으로는 잘 드러나지 않지만, 무의식의 영역에서 날카로운 통찰력, 임기응변, 그리고 창의적인 해킹 기질을 발휘하도록 하는 비밀 무기입니다. 이 숨겨진 기운을 평소에 언제 가장 강하게 체감하시나요?`
                    : `당신의 지장간 분석 결과, 무의식의 에너지 코드가 활성화되어 있습니다. 겉으로 드러나는 행동 유형과 달리, 내면에 숨겨진 진짜 나만의 무기(지장간 코드)를 평소에 언제 가장 강하게 체감하시나요?`
            }`,
            options: [
                '남들이 보지 못하는 시스템의 틈새나 모순을 꿰뚫어 볼 때',
                '혼자 창의적이고 예술적인 생각을 쏟아낼 때',
                '부당한 규칙이나 권위에 반발심이 강하게 일어날 때',
                '직접 자유롭게 입력하기'
            ]
        },
        {
            text: `[2단계: 공망(인생의 빈틈) 해독]\n\n당신의 일주를 기반으로 한 인생의 빈 공간(공망 - Void)은 **'${gongmangList.join(', ')}'**입니다.\n\n공망은 채워지지 않는 결손의 공간이자, 동시에 당신이 무한히 탐구하고 확장하려는 '디버깅 공간'입니다. 이 비어있는 영역이 삶에서 어떤 결핍이나 혹은 남다른 집중력으로 나타나고 있습니까?`,
            options: [
                '채워지지 않는 관계의 고독감이나 외로움으로 느껴집니다',
                '오히려 그 결핍을 채우기 위해 해당 분야에 더 강하게 몰입합니다',
                '비어있음을 있는 그대로 수용하고 메타인지적으로 성찰합니다',
                '직접 자유롭게 입력하기'
            ]
        },
        {
            text: `[3단계: 소스코드 최적화 튜닝]\n\n지장간의 숨은 에너지와 공망의 결손 공간을 모두 분석하여 내면의 소스코드를 해독했습니다.\n\n이 분석을 기반으로, 당신의 무의식 코딩을 100% 활성화하기 위한 최종 튜닝 리포트를 생성하시겠습니까?`,
            options: [
                '예, 최종 소스코드 튜닝 리포트를 받겠습니다',
                '조금 더 자세한 설명이 필요합니다'
            ]
        }
    ];

    useEffect(() => {
        if (reportData && rawSaju) {
            addBotMessage(`내면의 숨겨진 소스코드 해독 프로토콜을 시작합니다.\n\n입력하신 생년월일(${reportData.birthDate}) 데이터를 바탕으로 무의식의 엔진인 '지장간(숨은 기운)'과 '공망(결손의 방공호)'을 추적합니다.`);
            setTimeout(() => {
                addBotMessage(stepQuestions[0].text);
            }, 1200);
        } else {
            addBotMessage("사용자의 사주 데이터가 로드되지 않았습니다. 메인 화면에서 생년월일을 정확히 입력해 주세요.");
        }
    }, [reportData]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const addBotMessage = (text: string) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text }]);
            setIsTyping(false);
        }, 800);
    };

    const processUserAnswer = (answerText: string) => {
        // Add User Message
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: answerText }]);
        setInput('');

        // Save to History
        const currentQ = stepQuestions[currentStep];
        if (currentQ) {
            chatHistoryRef.current.push({ question: currentQ.text, answer: answerText });
        }

        // Proceed to next step
        setTimeout(() => {
            if (currentStep < stepQuestions.length - 1) {
                const nextStep = currentStep + 1;
                setCurrentStep(nextStep);
                addBotMessage(stepQuestions[nextStep].text);
            } else {
                setIsCompleted(true);
                addBotMessage("내면의 소스코드 디코딩이 완료되었습니다. 아래 버튼을 눌러 당신만을 위한 프리미엄 솔루션 리포트를 확인해 보세요.");
            }
        }, 800);
    };

    const handleSend = () => {
        if (!input.trim()) return;
        processUserAnswer(input.trim());
    };

    const handleOptionClick = (optionText: string) => {
        if (optionText === '직접 자유롭게 입력하기') {
            setInput('내가 느끼는 특별한 순간은... ');
            return;
        }
        processUserAnswer(optionText);
    };

    const handleHandoff = () => {
        if (!reportData) return;

        const structuredHistoryStr = chatHistoryRef.current
            .map((item, idx) => `[단계 ${idx + 1}] Q: ${item.question}\nA: ${item.answer}`)
            .join('\n\n');

        const prompt = `# System Prompt for 명심 AI 코치 (내면의 숨겨진 소스코드 해독 리포트)
사용자가 '내면의 숨겨진 소스코드 해독' 진단을 수행했습니다.

[사주 기본 정보]
일간: ${dayMasterChar}
년지: ${yearBranch}, 월지: ${monthBranch}, 일지: ${dayBranch}, 시지: ${hourBranch}
공망: ${gongmangList.join(', ')}

[대화 진행 내역]
${structuredHistoryStr}

[지시사항]
1. 사용자가 겉으로는 드러나지 않는 지장간의 숨은 에너지(특히 ${sanggwanItem ? '상관' : '지장간의 핵심 십신'})를 어떻게 자각하고 있는지 피드백을 주세요.
2. 일주 기준 공망(${gongmangList.join(', ')})으로 인한 내면적 결핍과 고독을 회피하지 않고, 이를 오히려 '창조적인 틈새' 및 메타인지 확장의 허브로 전환할 수 있는 구체적인 가이드를 제공해주세요.
3. 무의식의 낡은 다크 코드를 해체하고, 강력하게 정비할 수 있는 1% 프리미엄 코칭 리포트를 작성해 주세요.`;

        onComplete(prompt);
    };

    return (
        <div className="flex flex-col h-full bg-[#161a22] text-white overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="bg-[#0f121a] p-4 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span className="font-serif text-base text-gray-200">DECODE: 내면의 숨겨진 소스코드</span>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                            msg.sender === 'user'
                                ? 'bg-purple-600 text-white rounded-br-none'
                                : 'bg-[#212735] text-gray-200 rounded-bl-none border border-white/5'
                        } whitespace-pre-wrap`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-[#212735] p-3 rounded-xl rounded-bl-none flex gap-1 border border-white/5">
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-75" />
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input & Options Area */}
            <div className="p-4 bg-[#0f121a] border-t border-white/10">
                {!isCompleted ? (
                    <div className="flex flex-col gap-3">
                        {/* Options Buttons */}
                        {!isTyping && stepQuestions[currentStep]?.options && (
                            <div className="flex flex-col gap-2 mb-2 max-h-[160px] overflow-y-auto pr-1">
                                {stepQuestions[currentStep].options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionClick(opt)}
                                        className="px-4 py-2.5 bg-[#212735] border border-white/10 rounded-lg text-xs hover:bg-purple-900/40 hover:border-purple-500 transition-all text-gray-200 text-left w-full"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder="직접 의견을 작성하거나 위 선택지를 선택하세요..."
                                className="flex-1 bg-[#1a1f2c] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleHandoff}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 animate-pulse"
                    >
                        <span>내면 소스코드 튜닝 리포트 해독하기</span>
                        <ArrowRight size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
