'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Message {
    id: string;
    speaker: 'facilitator' | 'brain' | 'mind' | 'ux' | 'builder' | 'marketer' | 'hr' | 'life' | 'admin' | 'creator' | 'user';
    content: string;
    timestamp: Date;
}

import { useReportStore } from '@/store/useReportStore';
import { useVoice } from '@/hooks/useVoice'; // [Feature] Voice

export default function MastermindPage() {
    const router = useRouter();
    const { reportData } = useReportStore();
    const { speak, isPlaying: isVoicePlaying, stop: stopVoice } = useVoice(); // [Feature] Voice

    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [canInterrupt, setCanInterrupt] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Global indicator (including speech sequence)
    const [isFetching, setIsFetching] = useState(false); // HTTP API indicator
    const sequenceVersionRef = useRef(0); // Track sequence to allow aborting old speech loops
    const [radioStage, setRadioStage] = useState(0);
    const [isRadioActive, setIsRadioActive] = useState(false);
    const radioTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [showTopicSelector, setShowTopicSelector] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const STARTUP_TOPICS = [
        {
            id: 'ITEM_FIT',
            title: '아이템 선정 & 사주 정체성',
            desc: '내 사주 강점에 최적화된 사업 아이템 발굴부터 기운 검증까지',
            keywords: ['#아이템선정', '#에너지적합성', '#비즈니스운'],
            icon: 'lightbulb_circle',
            color: 'from-amber-400 to-orange-500'
        },
        {
            id: 'PERSONAL_BRAND',
            title: '사주 기반 마케팅 & 브랜딩',
            desc: '타고난 기운을 활용한 나만의 독보적 마케팅 방법 및 팬덤 구축',
            keywords: ['#마케팅방법', '#퍼스널브랜딩', '#기운활용'],
            icon: 'campaign',
            color: 'from-pink-400 to-rose-500'
        },
        {
            id: 'HABIT_SOL',
            title: '마이크로 습관 & 실천 코칭',
            desc: '아이템 선정 후 실질적 성장을 위한 작은 습관 실천 솔루션',
            keywords: ['#마이크로습관', '#실천솔루션', '#작은습관코칭'],
            icon: 'bolt',
            color: 'from-emerald-400 to-teal-500'
        },
        {
            id: 'PEOPLE_ADMIN',
            title: '인사 행정 & 조직 관리',
            desc: '내 기질에 맞는 인재 영입(PEOPLE) 및 창업 행정 리스크 관리',
            keywords: ['#인적자원', '#행정분야', '#조직시스템'],
            icon: 'groups',
            color: 'from-cyan-400 to-blue-500'
        }
    ];

    // [Auto-TTS] Removed in favor of manual sequential processing in parseAndAddMessages

    // [Radio Mode Loop]
    // Automatically trigger next discussion after a short delay once speaking ends
    useEffect(() => {
        if (!isRadioActive || isLoading || isVoicePlaying) return;

        // Clear existing timer
        if (radioTimeoutRef.current) clearTimeout(radioTimeoutRef.current);

        // Start 3s timer before next auto-continue
        radioTimeoutRef.current = setTimeout(() => {
            handleAutoContinue();
        }, 3000);

        return () => {
            if (radioTimeoutRef.current) clearTimeout(radioTimeoutRef.current);
        };
    }, [isRadioActive, isLoading, isVoicePlaying, messages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const startSession = async (topicId: string) => {
        const topic = STARTUP_TOPICS.find(t => t.id === topicId);
        setSelectedTopic(topic?.title || topicId);
        setIsSessionActive(true);
        setShowTopicSelector(false);
        setCanInterrupt(true);
        setIsRadioActive(true);
        await generateOpeningRemarks(topic?.title || topicId);
    };

    const generateOpeningRemarks = async (topicTitle: string) => {
        setIsFetching(true);
        setIsLoading(true);

        const currentVersion = ++sequenceVersionRef.current;
        const userName = reportData?.userName || '대표님';

        try {
            const SYSTEM_PROMPT = `
[MASTERMIND OPENING - MAKE IT ADDICTIVE]
주제: "${topicTitle}"

진행자(Mirror)는 TED 토크처럼 시작하세요:
- 충격적인 통계나 질문으로 시작 (예: "한국 스타트업 10개 중 9개가 3년 안에 망합니다. 왜일까요?")
- 추상적 개념 금지. 구체적 사례 사용 (예: "작년에 제가 만난 한 대표님은...")

전문가들은 각자의 렌즈로 '한 문장 인사이트'를 던지세요:
- STRATEGIST: 비즈니스 사례 ("넷플릭스는 이 문제를 이렇게 풀었죠...")
- PSYCHOLOGIST: 인간 본성 ("우리 뇌는 불확실성을 위협으로 인식해요...")
- ORBITER: 시스템 관점 ("이건 개인 문제가 아니라 구조 문제예요...")
- FORTUNE_TELLER: 에너지 패턴 ("당신의 사주를 보면, 지금 이 시기는...")
- INNOVATOR: 창의적 해법 ("역발상으로 생각해보면...")

[CRITICAL RULES]
- ❌ "좋은 질문입니다" / "정확한 지적입니다" 금지
- ❌ :::BREAK::: 절대 사용 금지
- ✅ 한 명씩 순차적으로 (진행자 → 전문가 1~2명)
- ✅ 각 발언은 30초 분량 (간결하게)

[FORMAT - CRITICAL]
You MUST respond in JSON format:
{
  "dialogue": [
    {"role": "FACILITATOR", "content": "충격적 오프닝"},
    {"role": "STRATEGIST", "content": "구체적 인사이트 1"},
    {"role": "INNOVATOR", "content": "구체적 인사이트 2"}
  ]
}

Available roles: FACILITATOR, STRATEGIST, PSYCHOLOGIST, ORBITER, FORTUNE_TELLER, INNOVATOR
`;
            // [API Call]
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'facility-mastermind',
                    message: "토론을 시작해 주세요.",
                    clientSystemPrompt: SYSTEM_PROMPT,
                    userName: userName,
                    sajuData: reportData?.saju || null
                })
            });

            if (!response.ok) throw new Error('API Error');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    fullContent += decoder.decode(value, { stream: true });
                }
            }
            setIsFetching(false);
            await parseAndAddMessages(fullContent, currentVersion);

        } catch (e) {
            console.error(e);
            setMessages([
                {
                    id: '1',
                    speaker: 'facilitator',
                    content: '전문가 패널을 연결하는 중 오류가 발생했습니다. 다시 시도해 주세요.',
                    timestamp: new Date()
                }
            ]);
        } finally {
            setIsFetching(false);
            if (currentVersion === sequenceVersionRef.current) {
                setIsLoading(false);
            }
        }
    };

    const handleAutoContinue = async () => {
        if (isFetching) return;
        setIsFetching(true);
        setIsLoading(true);

        const currentVersion = ++sequenceVersionRef.current;
        try {
            const stages = [
                {
                    name: "BRAIN_MIND_LINK",
                    instruction: "[진행자]는 뇌과학적 특징과 심리적 무의식을 연결하는 질문을 던지세요. [BRAIN]과 [MIND]가 서로의 의견을 부완하며 토론하세요."
                },
                {
                    name: "BUILDER_UX_FUSION",
                    instruction: "[BUILDER]는 시스템의 견고함을, [UX]는 사용자의 감성적 경험을 강조하며 창업자의 에너지를 비즈니스 구조로 변환하는 방법을 제안하세요."
                },
                {
                    name: "MARKET_EXPANSION",
                    instruction: "[MARKETER]가 주도하여 현재의 역량을 시장에서 어떻게 폭발시킬지 논의하고, [FACILITATOR]는 창업자의 '관점 변화'를 유도하는 마무리를 하세요."
                },
                {
                    name: "UNEXPECTED_INSIGHT",
                    instruction: "대표님이 전혀 생각지 못했을 법한 '역설적인 조언'을 하나씩 던져주세요. 분위기를 반전시키세요."
                }
            ];

            const currentStageInfo = stages[radioStage % stages.length];
            setRadioStage(prev => prev + 1);

            const SYSTEM_PROMPT = `
[MASTERMIND CONTINUATION - DEEPEN THE HOOK]

진행자는 '악마의 대변인' 역할:
- 이전 발언에 도전 ("그런데 그게 정말 현실적일까요?")
- 구체적 시나리오 제시 ("만약 내일 투자자를 만난다면?")

전문가들은 '건설적 충돌'을 만드세요:
- 한 명은 '이상', 다른 한 명은 '현실'
- 예: STRATEGIST "장기적으로는..." vs PSYCHOLOGIST "하지만 지금은..."

[BANNED - 절대 사용 금지]
- "좋은 질문입니다" / "정확한 지적입니다"
- "사주의 원리로 보면" / "균형을 맞춰야"

[MUST USE]
- 실제 사례 ("일론 머스크는..." / "카카오는...")
- 구체적 숫자 ("3일 안에" / "10분만")
- 물리적 감각 ("가슴이 답답한가요?")

[CURRENT STAGE]
${currentStageInfo.instruction}

[FORMAT - CRITICAL]
You MUST respond in JSON format:
{
  "dialogue": [
    {"role": "FACILITATOR", "content": "도전적 질문"},
    {"role": "EXPERT_ROLE", "content": "사례 기반 인사이트"},
    {"role": "EXPERT_ROLE", "content": "다른 관점 (선택)"}
  ]
}

Available roles: FACILITATOR, STRATEGIST, PSYCHOLOGIST, ORBITER, FORTUNE_TELLER, INNOVATOR
`;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'facility-mastermind',
                    message: "토론을 계속 진행해 주세요.",
                    clientSystemPrompt: SYSTEM_PROMPT,
                    userName: reportData?.userName || '대표님',
                    sajuData: reportData?.saju || null,
                    messages: messages.map(m => ({ role: m.speaker === 'user' ? 'user' : 'assistant', content: m.content }))
                })
            });

            if (!response.ok) throw new Error('API Error');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    fullContent += decoder.decode(value, { stream: true });
                }
            }
            setIsFetching(false);
            await parseAndAddMessages(fullContent, currentVersion);

        } catch (e) {
            console.error(e);
            setMessages([
                {
                    id: '1',
                    speaker: 'facilitator',
                    content: '전문가 패널을 연결하는 중 오류가 발생했습니다. 다시 시도해 주세요.',
                    timestamp: new Date()
                }
            ]);
        } finally {
            setIsFetching(false);
            if (currentVersion === sequenceVersionRef.current) {
                setIsLoading(false);
            }
        }
    };

    const handleUserMessage = async () => {
        if (!userInput.trim() || isFetching) return;

        const userMsgContent = userInput;
        const newUserMessage: Message = {
            id: Date.now().toString(),
            speaker: 'user',
            content: userMsgContent,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsFetching(true);
        setIsLoading(true);

        const currentVersion = ++sequenceVersionRef.current;
        stopVoice();

        try {
            const SYSTEM_PROMPT = `
[USER INTERJECTION - MAKE IT PERSONAL]
사용자가 직접 질문했습니다. 이건 골드입니다!

진행자는 사용자의 말을 '거울처럼 반사'하세요:
- 사용자가 쓴 단어를 그대로 사용 ("당신이 '힘들다'고 했는데...")
- 숨겨진 감정 파악 ("그 말 뒤에 '두려움'이 느껴지는데, 맞나요?")

전문가는 사용자의 '구체적 상황'에 맞춰 답변:
- 일반론 금지. 사용자의 사주/상황 기반으로만 말하기
- 예: "당신의 사주를 보면, 당신은 '과정'보다 '결과'를 먼저 보는 사람이에요. 그래서 팀원들이..."

[RESPONSE STRATEGY]
1. 진행자: 사용자 질문의 '진짜 의도' 파악 ("당신이 정말 묻고 싶은 건, 이게 아닐까요?")
2. 전문가 1: 패턴 분석 + 구체적 사례 ("당신과 비슷한 케이스를 봤어요. 그 사람은...")
3. 전문가 2 (선택): 즉시 실행 가능한 한 가지 행동 ("오늘 저녁, 이것만 해보세요...")

[CRITICAL]
- ❌ "좋은 질문입니다" 금지
- ❌ :::BREAK::: 금지
- ✅ 사용자의 실제 단어 인용
- ✅ 한 명씩 순차 발언
- ✅ 30초 분량 (간결하게)

[FORMAT - CRITICAL]
You MUST respond in JSON format:
{
  "dialogue": [
    {"role": "FACILITATOR", "content": "사용자 질문 재해석"},
    {"role": "EXPERT_ROLE", "content": "패턴 + 사례"},
    {"role": "EXPERT_ROLE", "content": "실행 방법 (선택)"}
  ]
}

Available roles: FACILITATOR, STRATEGIST, PSYCHOLOGIST, ORBITER, FORTUNE_TELLER, INNOVATOR
`;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'facility-mastermind',
                    message: userMsgContent,
                    clientSystemPrompt: SYSTEM_PROMPT,
                    userName: reportData?.userName || '대표님',
                    sajuData: reportData?.saju || null,
                    messages: messages.map(m => ({ role: m.speaker === 'user' ? 'user' : 'assistant', content: m.content }))
                })
            });

            if (!response.ok) throw new Error('API Error');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    fullContent += decoder.decode(value, { stream: true });
                }
            }
            setIsFetching(false);
            await parseAndAddMessages(fullContent, currentVersion);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                speaker: 'facilitator',
                content: '잠시 통신 장애가 발생했습니다. 다시 말씀해 주시겠습니까?',
                timestamp: new Date()
            }]);
        } finally {
            setIsFetching(false);
            if (currentVersion === sequenceVersionRef.current) {
                setIsLoading(false);
            }
        }
    };

    const parseAndAddMessages = async (fullContent: string, version: number) => {
        // [Critical Fix] Force remove :::BREAK::: tag if it appears despite prompt instructions
        const cleanContent = fullContent
            .replace(/:::BREAK:::/g, '')
            .split(':::DATA_SEPARATOR:::')[0];

        console.log('[Mastermind Debug] Raw response:', cleanContent.substring(0, 500));

        // [FIX] Updated regex to include underscores in role tags (e.g., FORTUNE_TELLER)
        const parts = cleanContent.split(/(:::[A-Z_]+:::)/g).filter(p => p.trim());

        console.log('[Mastermind Debug] Parsed parts:', parts.length, parts.slice(0, 4));

        // [Fallback 1] If parsing fails completely, display raw content as facilitator message
        if (parts.length === 0 && cleanContent.trim().length > 0) {
            console.log('[Mastermind Debug] Fallback 1: No parts found, displaying raw content');
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                speaker: 'facilitator',
                content: cleanContent.trim(),
                timestamp: new Date()
            }]);
            setIsLoading(false);
            return;
        }

        // Track if we successfully added any messages
        let messagesAdded = 0;

        for (let i = 0; i < parts.length; i += 2) {
            const roleTag = parts[i];
            const content = parts[i + 1];

            if (!roleTag || !content) continue;

            const roleMap: Record<string, Message['speaker']> = {
                ':::FACILITATOR:::': 'facilitator',
                ':::BRAIN:::': 'brain',
                ':::MIND:::': 'mind',
                ':::UX:::': 'ux',
                ':::BUILDER:::': 'builder',
                ':::MARKETER:::': 'marketer',
                ':::PEOPLE:::': 'hr',
                ':::LIFE:::': 'life',
                ':::ADMIN:::': 'admin',
                ':::CREATOR:::': 'creator',
                // [Fix] Add all expert role aliases from prompts
                ':::STRATEGIST:::': 'builder',
                ':::PSYCHOLOGIST:::': 'mind',
                ':::ORBITER:::': 'ux',
                ':::FORTUNE_TELLER:::': 'life',
                ':::INNOVATOR:::': 'creator',
                ':::EXPERT_ROLE:::': 'facilitator', // Fallback for placeholder
                ':::EXPERT_1:::': 'facilitator',
                ':::EXPERT_2:::': 'facilitator'
            };

            const speaker = roleMap[roleTag] || 'facilitator';
            const cleanText = content.trim();

            if (cleanText.length > 0) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString() + Math.random(),
                    speaker,
                    content: cleanText,
                    timestamp: new Date()
                }]);
                messagesAdded++;

                const textToSpeak = cleanText.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\[.*?\]/g, '').trim();
                await speak(textToSpeak, speaker, { interrupt: false });

                if (version !== sequenceVersionRef.current) return;
            }
        }

        // [Fallback 2] If we parsed parts but added no messages, display raw content
        if (messagesAdded === 0 && cleanContent.trim().length > 0) {
            console.log('[Mastermind Debug] Fallback 2: Parts found but no messages added, displaying raw content');
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                speaker: 'facilitator',
                content: cleanContent.trim(),
                timestamp: new Date()
            }]);
            await speak(cleanContent.trim(), 'facilitator', { interrupt: false });
        }

        // Always turn off loading after parsing completes
        setIsLoading(false);
    };

    const getSpeakerInfo = (speaker: Message['speaker']) => {
        switch (speaker) {
            case 'facilitator':
                return { name: '진행자 (Mirror)', icon: 'record_voice_over', color: 'from-slate-500 to-slate-700', bgColor: 'bg-slate-500/10', textColor: 'text-slate-400' };
            case 'brain':
                return { name: 'Dr. Brain (뇌과학)', icon: 'neurology', color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-500/10', textColor: 'text-pink-400' };
            case 'mind':
                return { name: 'Prof. Mind (심리)', icon: 'psychology_alt', color: 'from-indigo-500 to-violet-500', bgColor: 'bg-indigo-500/10', textColor: 'text-indigo-400' };
            case 'ux':
                return { name: 'Creative (UX)', icon: 'palette', color: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-500/10', textColor: 'text-orange-400' };
            case 'builder':
                return { name: 'Builder (설계)', icon: 'terminal', color: 'from-cyan-500 to-blue-500', bgColor: 'bg-cyan-500/10', textColor: 'text-cyan-400' };
            case 'marketer':
                return { name: 'CMO (확장)', icon: 'campaign', color: 'from-emerald-500 to-green-500', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400' };
            case 'hr':
                return { name: 'People (인사)', icon: 'groups', color: 'from-amber-400 to-yellow-600', bgColor: 'bg-amber-500/10', textColor: 'text-amber-400' };
            case 'life':
                return { name: 'Life Coach (케어)', icon: 'favorite', color: 'from-purple-400 to-pink-600', bgColor: 'bg-purple-500/10', textColor: 'text-purple-400' };
            case 'admin':
                return { name: 'Admin (행정)', icon: 'gavel', color: 'from-slate-400 to-slate-600', bgColor: 'bg-slate-500/10', textColor: 'text-slate-300' };
            case 'creator':
                return { name: 'Youtube (미디어)', icon: 'smart_display', color: 'from-red-500 to-orange-600', bgColor: 'bg-red-500/10', textColor: 'text-red-400' };
            case 'user':
                return { name: '나', icon: 'person', color: 'from-emerald-500 to-teal-500', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400' };
            default:
                return { name: 'Unknown', icon: 'help', color: 'from-gray-500 to-gray-700', bgColor: 'bg-gray-500/10', textColor: 'text-gray-400' };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={() => router.push('/startup')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="text-sm font-medium">대시보드</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                            <span className="material-symbols-outlined text-white text-2xl">diversity_3</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold text-white">Mastermind Group <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full ml-2">PREMIUM</span></h1>
                            <p className="text-[10px] uppercase text-slate-400 font-bold">World-Class Expert Panel</p>
                        </div>
                    </div>
                    <div className="w-24"></div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-10 mb-20 md:mb-0">
                {!isSessionActive ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center size-20 md:size-24 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-2">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-indigo-400">diversity_3</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white">마스터마인드 드림팀 코칭</h2>
                            <p className="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto px-4">
                                10인의 전문가가 하나가 되어 당신의 사주 에너지를 보살핍니다.<br />
                                <span className="text-indigo-400 font-bold">오늘 어떤 분야의 집중 케어를 받으시겠습니까?</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
                            {STARTUP_TOPICS.map((topic) => (
                                <button
                                    key={topic.id}
                                    onClick={() => startSession(topic.id)}
                                    className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 rounded-2xl p-6 md:p-8 text-left transition-all hover:scale-[1.02] overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-6xl md:text-8xl">{topic.icon}</span>
                                    </div>
                                    <div className={`size-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center mb-6 shadow-lg shadow-black/20`}>
                                        <span className="material-symbols-outlined text-white text-2xl">{topic.icon}</span>
                                    </div>
                                    <h3 className="text-white font-extrabold text-xl mb-2">{topic.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{topic.desc}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {topic.keywords.map(kw => (
                                            <span key={kw} className="text-[10px] md:text-xs font-bold text-indigo-400/80 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-sm">info</span>
                                사주 기운과 연동된 1:1 맞춤형 전문가 티키타카 토론이 시작됩니다.
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 h-[50vh] md:h-[650px] overflow-y-auto custom-scrollbar">
                            <AnimatePresence>
                                {messages.map((message) => {
                                    const info = getSpeakerInfo(message.speaker);
                                    return (
                                        <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mb-6 flex gap-3 md:gap-4 ${message.speaker === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`flex-shrink-0 size-10 md:size-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg shadow-black/30`}>
                                                <span className="material-symbols-outlined text-white text-xl md:text-2xl">{info.icon}</span>
                                            </div>
                                            <div className={`flex-1 min-w-0 ${message.speaker === 'user' ? 'text-right' : ''}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-xs md:text-sm font-bold ${info.textColor}`}>{info.name}</span>
                                                    <span className="text-[10px] md:text-xs text-slate-500 truncate">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className={`inline-block ${info.bgColor} border border-white/10 rounded-2xl px-4 md:px-6 py-3 md:py-4 max-w-[90%] md:max-w-2xl text-left shadow-inner`}>
                                                    <p className="text-sm md:text-base text-white leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                {isLoading && (
                                    <div className="text-center py-4 text-slate-500 flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                                        <span className="text-xs">전문가들이 토론 중입니다...</span>
                                    </div>
                                )}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>
                        {canInterrupt && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex gap-2 md:gap-3">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleUserMessage()}
                                    placeholder="토론에 끼어들기..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm md:text-base text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                                    disabled={isFetching}
                                />
                                <button onClick={handleUserMessage} disabled={!userInput.trim() || isFetching} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 md:px-6 rounded-xl font-bold transition-all flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl md:text-2xl">send</span>
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
