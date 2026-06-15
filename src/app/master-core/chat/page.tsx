'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useReportStore } from '@/store/useReportStore';
import { saju60Data, detectUserState, GapjaModule } from '@/modules/saju60Modules';
import { ArrowLeft, Send, Sparkles, User, HelpCircle, Compass, Sparkle } from 'lucide-react';

type SystemState = 'DARK' | 'NEURAL' | 'META' | 'IDLE';

interface Message {
  id: string;
  sender: 'user' | 'master';
  text: string;
  state?: SystemState;
}

const KOR_TO_HAN_STEM: Record<string, string> = {
  '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊',
  '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸'
};

const KOR_TO_HAN_ZHI: Record<string, string> = {
  '자': '子', '축': '丑', '인': '寅', '묘': '卯', '진': '辰', '사': '巳',
  '오': '午', '미': '未', '신': '申', '유': '酉', '술': '戌', '해': '亥'
};

export default function MasterCoreChatRoom() {
  const router = useRouter();
  const { reportData } = useReportStore();
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const [selectedStem, setSelectedStem] = useState<string>('甲');
  
  // Filter gapjas by selected stem
  const filteredGapjas = saju60Data.filter(d => d.name.startsWith(selectedStem));
  
  const [selectedGapjaId, setSelectedGapjaId] = useState<string>(filteredGapjas[0]?.id || 'BP-01');
  const [currentState, setCurrentState] = useState<SystemState>('IDLE');
  
  const userName = reportData?.userName || '명심가';
  const saju = reportData?.saju;

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'master', 
      text: `안녕하세요, ${userName}님. 당신의 고유한 마음 기질에 맞추어 깊은 내면의 목소리를 함께 들여다보는 명심(明心) 기질 치유 라운지입니다.\n\n먼저 상단에서 오늘 상담하고 싶은 당신의 기질(60갑자 일주)을 선택한 뒤, 마음속 깊은 곳의 고민이나 감정을 편안하게 말씀해 주세요.` 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 사용자 만세력 일주 정보 자동 감지 및 포커싱 동기화
  useEffect(() => {
    if (saju) {
      const dayPillar = saju.fourPillars?.day;
      if (dayPillar) {
        let gan = dayPillar.gan;
        let ji = dayPillar.ji;

        if (KOR_TO_HAN_STEM[gan]) gan = KOR_TO_HAN_STEM[gan];
        if (KOR_TO_HAN_ZHI[ji]) ji = KOR_TO_HAN_ZHI[ji];

        if (gan && ji) {
          setSelectedStem(gan);
          const fullName = `${gan}${ji}`;
          const matchedGapja = saju60Data.find(d => d.name.startsWith(fullName));
          if (matchedGapja) {
            setSelectedGapjaId(matchedGapja.id);
            setMessages([
              {
                id: '1',
                sender: 'master',
                text: `반가워요, ${userName}님. 당신의 영혼과 연결된 일주 기질인 [${fullName}]의 치유 방에 자동으로 연결되었습니다.\n\n당신은 "${matchedGapja.title}"의 귀한 본성을 안고 이 세상에 오셨답니다. 🌿\n\n요즘 일상에서 당신의 마음을 흔들리게 하거나 답답하게 만드는 감정, 혹은 고민이 있다면 아래 챗방에 편안하게 털어놓아 보세요. 명심 AI 코치가 정성을 다해 함께 성찰할게요.`
              }
            ]);
          }
        }
      }
    }
  }, [reportData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || inputValue;
    if (!messageText.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: messageText };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    if (!textToSend) {
      setInputValue('');
    }
    setIsTyping(true);

    // 사용자 발화에 근거한 기질 치유 상태 감지
    const detectedState = detectUserState(messageText);
    setCurrentState(detectedState);

    try {
      const response = await fetch('/api/coaching/master-core-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          selectedGapjaId,
          userMessage: messageText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const masterMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'master',
          text: data.text,
          state: detectedState,
        };
        setMessages(prev => [...prev, masterMsg]);
      } else {
        throw new Error('API Response Error');
      }
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'master',
        text: '마음을 보살피는 지혜의 안테나가 잠시 미세한 흔들림을 겪었어요. 크게 심호흡을 한 번 하시고 다시 한번 당신의 이야기를 들려주세요. ✨',
        state: 'IDLE',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectedModule = saju60Data.find(d => d.id === selectedGapjaId) || saju60Data[0];

  // Korean Status Indicators
  const stateDetails = {
    DARK: {
      label: '⚠️ 내면 디버깅',
      style: 'text-rose-400 border-rose-500/30 bg-rose-950/20 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
      gradient: 'from-rose-500/10 via-red-950/5 to-transparent'
    },
    NEURAL: {
      label: '🌀 에너지 정렬',
      style: 'text-sky-400 border-sky-500/30 bg-sky-950/20 shadow-[0_0_15px_rgba(14,165,233,0.3)]',
      gradient: 'from-indigo-500/10 via-purple-950/5 to-transparent'
    },
    META: {
      label: '🌟 의식 확장',
      style: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
      gradient: 'from-emerald-500/10 via-teal-950/5 to-transparent'
    },
    IDLE: {
      label: '💤 평온한 대기',
      style: 'text-gray-400 border-gray-700/50 bg-gray-900/20',
      gradient: 'from-blue-500/5 via-slate-900/5 to-transparent'
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#05070A] text-gray-200 font-sans mx-auto max-w-2xl border-x border-white/5 shadow-2xl relative overflow-hidden">
      {/* Dynamic Background Aura Glow according to current mood state */}
      <div className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000">
        <motion.div 
          animate={{
            scale: currentState === 'DARK' ? [1, 1.1, 1] : [1, 1.05, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-[-20%] right-[-20%] w-[90vw] h-[90vw] max-w-[500px] rounded-full blur-[100px] transition-colors duration-1000 ${stateDetails[currentState].gradient}`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40"></div>
      </div>

      {/* --- Top Header --- */}
      <header className="relative z-10 flex flex-col gap-3 p-4 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/master-core')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors duration-200 border border-white/5"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight">명심 기질 치유 라운지</h1>
              <p className="text-[10px] text-gray-400 font-medium">나의 60갑자 기질과 교감하는 깊은 내면 대화</p>
            </div>
          </div>
          {/* State Indicator */}
          <div className={`transition-all duration-500 px-3 py-1.5 rounded-full border text-[10px] font-black tracking-wider flex items-center gap-1.5 ${stateDetails[currentState].style}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
            <span>{stateDetails[currentState].label}</span>
          </div>
        </div>

        {/* 천간 셀렉터 */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1 border-b border-white/5 pb-2">
          {stems.map(stem => (
            <button
              key={stem}
              onClick={() => {
                setSelectedStem(stem);
                const firstOfStem = saju60Data.find(d => d.name.startsWith(stem));
                if(firstOfStem) setSelectedGapjaId(firstOfStem.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedStem === stem 
                ? 'bg-indigo-600/30 border-indigo-500/40 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.25)]' 
                : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'
              }`}
            >
              {stem}
            </button>
          ))}
        </div>

        {/* 지지 6갑자 셀렉터 */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
          {filteredGapjas.map(gapja => (
            <button
              key={gapja.id}
              onClick={() => setSelectedGapjaId(gapja.id)}
              className={`flex flex-col items-center px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all border ${
                selectedGapjaId === gapja.id 
                ? 'bg-sky-600/20 border-sky-500/40 text-sky-300 shadow-[0_0_12px_rgba(14,165,233,0.25)]' 
                : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="font-extrabold">{gapja.name.split('(')[0]}</span>
              <span className="text-[9px] font-mono opacity-60 mt-0.5">{gapja.id}</span>
            </button>
          ))}
        </div>
      </header>

      {/* --- 기질 요약 및 물상 카드 (Redesigned) --- */}
      <div className="relative z-10 w-full px-4 pt-3.5">
        <motion.div 
          key={selectedGapjaId}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-4 rounded-2xl shadow-lg backdrop-blur-md relative overflow-hidden"
        >
          {/* Card Aurora */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none"></div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-white/10 flex items-center justify-center text-base font-black text-indigo-200 select-none">
                {selectedModule.name.substring(0,2)}
              </div>
              <div>
                <h2 className="text-xs font-black text-gray-200 tracking-tight">{selectedModule.title}</h2>
                <p className="text-[9px] text-gray-500 font-mono tracking-wider">MYEONGSIM ARCHETYPE: {selectedModule.id}</p>
              </div>
            </div>
            {/* Compass badge */}
            <div className="text-[9px] bg-white/5 text-indigo-300 border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1 font-mono">
              <Compass size={10} className="animate-spin-slow" />
              <span>ALIGN_OK</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-300 italic leading-relaxed border-l-2 border-indigo-500/30 pl-3 py-0.5 break-keep mb-3">
            "{selectedModule.quote}"
          </p>
          <div className="text-[10px] text-gray-400 bg-white/5 rounded-lg p-2.5 border border-white/5 flex gap-1.5 items-start">
            <Sparkle size={12} className="text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <span className="leading-relaxed"><strong className="text-gray-300 font-semibold">마음 처방:</strong> {selectedModule.phase1.meditationGuide}</span>
          </div>
        </motion.div>
      </div>

      {/* --- Chat Messages Area --- */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10 scrollbar-hide">
        <div className="space-y-6 select-text">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] flex gap-3.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className="shrink-0 mt-1">
                    {msg.sender === 'master' ? (
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border bg-black/50 ${
                        msg.state === 'DARK' ? 'border-rose-500/30 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.2)]' :
                        msg.state === 'META' ? 'border-emerald-500/30 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]' :
                        'border-indigo-500/30 text-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.15)]'
                      }`}>
                        <span className="text-[9px] font-black tracking-wider font-mono">AI</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-300">
                        <User size={14} />
                      </div>
                    )}
                  </div>

                  {/* Bubble */}
                  <div className="flex-1">
                    <div className={`text-[9px] mb-1 px-1 font-bold ${msg.sender === 'user' ? 'text-right text-gray-500' : 'text-left text-indigo-400/80'}`}>
                      {msg.sender === 'user' ? '나의 기록' : `명심 마스터${msg.state ? ` (${stateDetails[msg.state].label})` : ''}`}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl break-keep text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-br from-indigo-600/30 to-purple-600/20 text-indigo-100 border border-indigo-500/20 rounded-tr-sm'
                        : msg.state === 'DARK'
                          ? 'bg-[#1D1216]/90 border border-rose-500/20 text-rose-100 rounded-tl-sm shadow-lg shadow-rose-950/20'
                          : msg.state === 'META'
                            ? 'bg-[#0F1E16]/90 border border-emerald-500/20 text-emerald-100 rounded-tl-sm shadow-lg shadow-emerald-950/20'
                            : 'bg-[#0E1325]/90 border border-white/5 text-gray-100 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex gap-3.5">
                  <div className="w-8 h-8 rounded-xl border border-indigo-500/20 bg-black/50 flex items-center justify-center shrink-0">
                    <span className="text-[9px] text-indigo-400 font-bold font-mono">AI</span>
                  </div>
                  <div className="bg-[#0E1325]/80 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-11">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* --- Input Area --- */}
      <footer className="relative z-10 p-4 border-t border-white/5 bg-[#05070A]/90 backdrop-blur-md">
        <div className="w-full">
          {/* Quick Recommend Chips */}
          <div className="flex justify-center flex-wrap gap-2 mb-3.5">
            <button
              onClick={() => {
                setInputValue('너무 답답하고 마음에 여유가 없어요.');
                handleSend('너무 답답하고 마음에 여유가 없어요.');
              }}
              className="text-[10px] text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 px-3 py-1 rounded-full bg-rose-950/10 transition-colors font-medium"
            >
              💡 "너무 답답하고 마음에 여유가 없어요."
            </button>
            <button
              onClick={() => {
                setInputValue('제 기질이 가진 맹점과 해결 방향을 알고 싶어요.');
                handleSend('제 기질이 가진 맹점과 해결 방향을 알고 싶어요.');
              }}
              className="text-[10px] text-sky-400 hover:text-sky-300 border border-sky-500/20 hover:border-sky-500/40 px-3 py-1 rounded-full bg-sky-950/10 transition-colors font-medium"
            >
              💡 "제 기질의 맹점과 해결 방향이 뭘까요?"
            </button>
            <button
              onClick={() => {
                setInputValue('좋아요! 오늘부터 알려주신 행동 수련을 실천해 볼게요.');
                handleSend('좋아요! 오늘부터 알려주신 행동 수련을 실천해 볼게요.');
              }}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 px-3 py-1 rounded-full bg-emerald-950/10 transition-colors font-medium"
            >
              💡 "알려주신 행동 처방을 실천해 볼게요."
            </button>
          </div>

          {/* Chat Form */}
          <div className="flex items-end gap-2 bg-white/5 border border-white/10 focus-within:border-indigo-500/40 rounded-2xl p-2 transition-colors duration-200">
            <textarea 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="당신의 고민이나 마음 상태를 편안하게 들려주세요..."
              className="flex-1 bg-transparent text-sm text-gray-100 resize-none outline-none max-h-32 min-h-[44px] px-2 py-2.5 scrollbar-hide font-medium leading-relaxed"
              rows={1}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-white/20 text-white flex items-center justify-center transition-colors duration-200 mb-0.5"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
