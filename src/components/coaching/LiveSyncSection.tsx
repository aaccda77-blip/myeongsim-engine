'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, HeartPulse, BrainCircuit, Send, Loader2, Zap, ShieldAlert, Cpu } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ─── 가상 생체 데이터 (Mock Wearable Data) ────────
const MOCK_BIO_DATA = {
  heartRate: 92, // 약간 높은 심박수 (긴장 상태)
  stressLevel: 78, // 스트레스 78%
  hrv: 35, // 심박변이도 낮음 (회복력 저하)
};

// ─── 가상 실시간 심박수 그래프 데이터 생성을 위한 함수 ────────
const generateChartData = () => {
  const data = [];
  let currentHR = MOCK_BIO_DATA.heartRate;
  for (let i = 0; i < 20; i++) {
    // -3 ~ +3 변동
    currentHR += Math.floor(Math.random() * 7) - 3;
    data.push({ time: i, hr: currentHR });
  }
  return data;
};

interface Props {
  sajuData: any;
  harmony: any;
  biorhythm: any;
}

export default function LiveSyncSection({ sajuData, harmony, biorhythm }: Props) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);

  // 채팅 상태
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const themeColor = harmony?.energyColor || '#10b981';

  // 실시간 차트 업데이트 시뮬레이션
  useEffect(() => {
    setChartData(generateChartData());
    const interval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev.slice(1)];
        const lastHR = newData[newData.length - 1]?.hr || MOCK_BIO_DATA.heartRate;
        newData.push({
          time: prev[prev.length - 1].time + 1,
          hr: lastHR + (Math.floor(Math.random() * 7) - 3)
        });
        return newData;
      });
    }, 2000);
    
    // 1초 후 싱크 완료 페이크 연출
    setTimeout(() => setIsSyncing(false), 1500);

    return () => clearInterval(interval);
  }, []);

  // 스크롤 자동 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/live-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sajuData,
          harmony,
          biorhythm,
          wearableData: MOCK_BIO_DATA
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ 실시간 신경망 연결에 실패했습니다. (서버 오류)' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Markdown 렌더러
  const renderers = {
    strong: ({ node, ...props }: any) => <strong className="font-black text-white bg-white/10 px-1 py-0.5 rounded" {...props} />,
    p: ({ node, ...props }: any) => <p className="text-[13px] leading-relaxed break-keep mb-2" {...props} />,
  };

  return (
    <div className="space-y-4">
      {/* ─── 1. 상단 인포그래픽 대시보드 ─── */}
      <div className="bg-[#080b12] border border-white/10 rounded-2xl overflow-hidden relative shadow-lg">
        {isSyncing && (
          <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-3" />
            <p className="text-xs font-mono text-cyan-400 tracking-widest animate-pulse">SYNCING WEARABLE DATA...</p>
          </div>
        )}

        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono tracking-widest text-slate-300">MYEONGSIM BIO-LINK [PRO]</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400">CONNECTED</span>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* 심박수 */}
            <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3 text-center relative overflow-hidden">
              <HeartPulse className="w-4 h-4 text-red-500 absolute top-2 right-2 opacity-50" />
              <p className="text-[9px] font-mono text-red-400/80 mb-1">HEART RATE</p>
              <p className="text-2xl font-black text-white">{MOCK_BIO_DATA.heartRate} <span className="text-[10px] font-normal text-slate-400">BPM</span></p>
              <div className="mt-1 h-1 w-full bg-red-950 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-[80%] rounded-full" />
              </div>
            </div>

            {/* 스트레스 지수 */}
            <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 text-center relative overflow-hidden">
              <BrainCircuit className="w-4 h-4 text-amber-500 absolute top-2 right-2 opacity-50" />
              <p className="text-[9px] font-mono text-amber-400/80 mb-1">STRESS LOAD</p>
              <p className="text-2xl font-black text-white">{MOCK_BIO_DATA.stressLevel}<span className="text-[10px] font-normal text-slate-400">%</span></p>
              <div className="mt-1 h-1 w-full bg-amber-950 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[78%] rounded-full" />
              </div>
            </div>

            {/* 운기 적합도 (사주 융합) */}
            <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-3 text-center relative overflow-hidden">
              <Cpu className="w-4 h-4 text-cyan-500 absolute top-2 right-2 opacity-50" />
              <p className="text-[9px] font-mono text-cyan-400/80 mb-1">FATE SYNC</p>
              <p className="text-2xl font-black text-white" style={{ color: themeColor }}>
                {biorhythm ? biorhythm.overallScore : 85}<span className="text-[10px] font-normal text-slate-400">점</span>
              </p>
              <div className="mt-1 h-1 w-full bg-cyan-950 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${biorhythm?.overallScore || 85}%`, backgroundColor: themeColor }} />
              </div>
            </div>
          </div>

          {/* 심박수 라이브 차트 */}
          <div className="h-24 w-full bg-black/20 rounded-lg p-2 border border-white/5 relative">
            <p className="absolute top-2 left-2 text-[9px] font-mono text-slate-500 z-10">REAL-TIME ECG SIMULATION</p>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorHr)" isAnimationActive={false} />
                <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-3 p-2.5 bg-red-950/30 border border-red-500/30 rounded-lg flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-red-200 leading-relaxed break-keep">
              <span className="font-bold">System Alert:</span> 교감신경이 과항진된 상태입니다. 오늘 <strong>{harmony?.tenGod || '일진'}</strong>의 에너지와 맞물려 충동적인 결정이나 뇌동매매의 위험이 매우 높습니다.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 2. 융합 코칭 챗봇 영역 ─── */}
      <div className="bg-[#0b1018] border border-white/10 rounded-2xl flex flex-col overflow-hidden h-[350px] shadow-2xl relative">
        {/* 장식 효과 */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* 채팅 헤더 */}
        <div className="p-3 bg-white/5 border-b border-white/5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-[12px] font-bold text-slate-200">명심 OS 코칭 연결망</span>
          </div>
          <span className="text-[9px] text-slate-500">Gemini 2.5 Flash</span>
        </div>

        {/* 메시지 영역 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 z-10 scrollbar-hide">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-2xl rounded-tl-none p-3 max-w-[85%]">
              <p className="text-[12px] text-cyan-100 leading-relaxed break-keep">
                운의 흐름과 생체 에너지가 동기화되었습니다. 지금 무엇을 앞두고 계신가요? 상황을 말씀해주시면 <strong>즉각적인 행동 지침(Action Plan)</strong>을 도출하겠습니다.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['커피 마셔도 될까?', '운동 다녀올게', '중요한 미팅 전이야'].map((suggestion, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setInputMessage(suggestion)}
                    className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300 hover:bg-white/10 transition-colors"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2`}
            >
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-1">
                  <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              )}
              <div 
                className={`p-3 rounded-2xl max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-slate-700 text-white rounded-tr-none text-[13px]' 
                    : 'bg-cyan-950/20 border border-cyan-500/20 text-cyan-50 rounded-tl-none text-[12.5px]'
                }`}
              >
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-2xl rounded-tl-none p-3 max-w-[85%] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </motion.div>
          )}
        </div>

        {/* 입력창 */}
        <div className="p-3 bg-white/5 border-t border-white/5 z-10">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="명심 OS에 질문 입력..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              disabled={isTyping}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="absolute right-2 p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50 disabled:hover:bg-cyan-500/20 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
