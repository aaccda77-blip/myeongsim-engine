'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, HeartPulse, BrainCircuit, Send, Loader2, Zap, ShieldAlert, Cpu, Wind, Moon, Flame, Droplets } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ─── 가상 생체 데이터 (Mock Wearable Data) ────────
const MOCK_BIO_DATA = {
  heartRate: 92,
  stressLevel: 78,
  hrv: 35,
  spo2: 98,         // 혈중 산소 포화도
  sleepScore: 72,   // 수면 품질
  recovery: 61,     // 회복 점수
  calories: 420,    // 활동 칼로리
  bodyTemp: 36.7,   // 체온
};

const generateChartData = () => {
  const data = [];
  let currentHR = MOCK_BIO_DATA.heartRate;
  for (let i = 0; i < 20; i++) {
    currentHR += Math.floor(Math.random() * 7) - 3;
    data.push({ time: i, hr: Math.max(60, Math.min(130, currentHR)) });
  }
  return data;
};

interface Props {
  sajuData: any;
  harmony: any;
  biorhythm: any;
}

// ─── 소형 지표 카드 컴포넌트 ────────
function MiniMetricCard({
  icon, label, labelKor, value, unit, barPct, color, warn
}: {
  icon: React.ReactNode; label: string; labelKor: string;
  value: string | number; unit: string; barPct: number;
  color: string; warn?: boolean;
}) {
  return (
    <div className={`rounded-xl p-2.5 overflow-hidden border ${warn ? 'border-red-500/30 bg-red-950/20' : 'border-white/8 bg-white/4'}`}>
      <div className="flex items-center gap-1 mb-1.5">
        <span className={warn ? 'text-red-400' : color}>{icon}</span>
        <div>
          <p className="text-[7.5px] font-mono leading-tight opacity-80">{label}</p>
          <p className="text-[7.5px] leading-tight opacity-50">{labelKor}</p>
        </div>
      </div>
      <p className={`text-xl font-black leading-none ${warn ? 'text-red-300' : 'text-white'}`}>
        {value}<span className="text-[9px] font-normal text-slate-400 ml-0.5">{unit}</span>
      </p>
      <div className="mt-1.5 h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: warn ? '#ef4444' : color.replace('text-', '') }}
          initial={{ width: 0 }}
          animate={{ width: `${barPct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function LiveSyncSection({ sajuData, harmony, biorhythm }: Props) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const themeColor = harmony?.energyColor || '#10b981';

  // 레이더 차트 데이터 (바이오리듬 기반)
  const radarData = [
    { subject: '신체', value: Math.round(((biorhythm?.physical ?? 30) + 100) / 2) },
    { subject: '감정', value: Math.round(((biorhythm?.emotional ?? 20) + 100) / 2) },
    { subject: '지성', value: Math.round(((biorhythm?.intellectual ?? 50) + 100) / 2) },
    { subject: '수면', value: MOCK_BIO_DATA.sleepScore },
    { subject: '회복', value: MOCK_BIO_DATA.recovery },
  ];

  useEffect(() => {
    setChartData(generateChartData());
    const interval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev.slice(1)];
        const lastHR = newData[newData.length - 1]?.hr || MOCK_BIO_DATA.heartRate;
        newData.push({
          time: prev[prev.length - 1].time + 1,
          hr: Math.max(60, Math.min(130, lastHR + (Math.floor(Math.random() * 7) - 3)))
        });
        return newData;
      });
    }, 2000);
    setTimeout(() => setIsSyncing(false), 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
        body: JSON.stringify({ message: userMessage, sajuData, harmony, biorhythm, wearableData: MOCK_BIO_DATA })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ 신경망 연결에 실패했습니다.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderers = {
    strong: ({ node, ...props }: any) => <strong className="font-black text-white bg-white/10 px-1 py-0.5 rounded" {...props} />,
    p: ({ node, ...props }: any) => <p className="text-[13px] leading-relaxed break-keep mb-2" {...props} />,
  };

  return (
    <div className="space-y-3">
      {/* ─── 헤더 ─── */}
      <div className="bg-[#080b12] border border-white/10 rounded-2xl overflow-hidden relative shadow-lg">
        {isSyncing && (
          <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-3" />
            <p className="text-xs font-mono text-cyan-400 tracking-widest animate-pulse">SYNCING WEARABLE DATA...</p>
          </div>
        )}

        <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono tracking-widest text-slate-300">
              MYEONGSIM BIO-LINK <span className="text-cyan-400/80">[PRO]</span>{' '}
              <span className="text-slate-500 text-[9px] font-normal">(생체 연결망)</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400">CONNECTED <span className="text-emerald-300/70">(연결됨)</span></span>
          </div>
        </div>

        <div className="p-3 space-y-3">
          {/* ─── 1행: 주요 3개 대형 카드 ─── */}
          <div className="grid grid-cols-3 gap-2">
            {/* 심박수 */}
            <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3 overflow-hidden">
              <div className="flex items-center gap-1 mb-2">
                <HeartPulse className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <div>
                  <p className="text-[8px] font-mono text-red-400/90 leading-tight">HEART RATE</p>
                  <p className="text-[8px] text-red-300/60 leading-tight">심박수</p>
                </div>
              </div>
              <p className="text-2xl font-black text-white">{MOCK_BIO_DATA.heartRate} <span className="text-[10px] font-normal text-slate-400">BPM</span></p>
              <div className="mt-1.5 h-1 w-full bg-red-950 rounded-full overflow-hidden">
                <motion.div className="h-full bg-red-500 rounded-full" initial={{ width: 0 }} animate={{ width: '80%' }} transition={{ duration: 1 }} />
              </div>
            </div>

            {/* 스트레스 */}
            <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 overflow-hidden">
              <div className="flex items-center gap-1 mb-2">
                <BrainCircuit className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-[8px] font-mono text-amber-400/90 leading-tight">STRESS LOAD</p>
                  <p className="text-[8px] text-amber-300/60 leading-tight">스트레스 지수</p>
                </div>
              </div>
              <p className="text-2xl font-black text-white">{MOCK_BIO_DATA.stressLevel}<span className="text-[10px] font-normal text-slate-400">%</span></p>
              <div className="mt-1.5 h-1 w-full bg-amber-950 rounded-full overflow-hidden">
                <motion.div className="h-full bg-amber-500 rounded-full" initial={{ width: 0 }} animate={{ width: '78%' }} transition={{ duration: 1 }} />
              </div>
            </div>

            {/* 기질 적합도 */}
            <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-3 overflow-hidden">
              <div className="flex items-center gap-1 mb-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <div>
                  <p className="text-[8px] font-mono text-cyan-400/90 leading-tight">FATE SYNC</p>
                  <p className="text-[8px] text-cyan-300/60 leading-tight">기질 적합도</p>
                </div>
              </div>
              <p className="text-2xl font-black" style={{ color: themeColor }}>
                {biorhythm ? biorhythm.overallScore : 85}<span className="text-[10px] font-normal text-slate-400">점</span>
              </p>
              <div className="mt-1.5 h-1 w-full bg-cyan-950 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: themeColor }} initial={{ width: 0 }} animate={{ width: `${biorhythm?.overallScore || 85}%` }} transition={{ duration: 1 }} />
              </div>
            </div>
          </div>

          {/* ─── 2행: 소형 지표 5개 ─── */}
          <div className="grid grid-cols-5 gap-2">
            <MiniMetricCard
              icon={<Wind className="w-3 h-3" />} label="SpO2" labelKor="혈중 산소"
              value={MOCK_BIO_DATA.spo2} unit="%" barPct={98} color="text-sky-400"
              warn={MOCK_BIO_DATA.spo2 < 95}
            />
            <MiniMetricCard
              icon={<Activity className="w-3 h-3" />} label="HRV" labelKor="심박변이도"
              value={MOCK_BIO_DATA.hrv} unit="ms" barPct={35} color="text-violet-400"
              warn={MOCK_BIO_DATA.hrv < 40}
            />
            <MiniMetricCard
              icon={<Moon className="w-3 h-3" />} label="SLEEP" labelKor="수면 품질"
              value={MOCK_BIO_DATA.sleepScore} unit="점" barPct={72} color="text-indigo-400"
            />
            <MiniMetricCard
              icon={<Zap className="w-3 h-3" />} label="RECOVERY" labelKor="회복 점수"
              value={MOCK_BIO_DATA.recovery} unit="점" barPct={61} color="text-emerald-400"
              warn={MOCK_BIO_DATA.recovery < 65}
            />
            <MiniMetricCard
              icon={<Flame className="w-3 h-3" />} label="CALORIES" labelKor="활동 칼로리"
              value={MOCK_BIO_DATA.calories} unit="kcal" barPct={60} color="text-orange-400"
            />
          </div>

          {/* ─── 3행: ECG 차트 + 레이더 차트 나란히 ─── */}
          <div className="grid grid-cols-5 gap-2">
            {/* ECG 심박 차트 (3칸) */}
            <div className="col-span-3 h-28 bg-black/20 rounded-lg p-2 border border-white/5 relative">
              <p className="absolute top-2 left-2 text-[9px] font-mono text-slate-500 z-10">
                REAL-TIME ECG <span className="text-slate-600">(실시간 심전도)</span>
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorHr)" isAnimationActive={false} />
                  <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.4} />
                  <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 바이오리듬 레이더 차트 (2칸) */}
            <div className="col-span-2 h-28 bg-black/20 rounded-lg border border-white/5 relative flex items-center justify-center">
              <p className="absolute top-2 left-2 text-[9px] font-mono text-slate-500 z-10">
                BIORHYTHM <span className="text-slate-600">(생체 리듬)</span>
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="55%" outerRadius="45%" data={radarData}>
                  <PolarGrid stroke="#ffffff10" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 8 }} />
                  <Radar name="바이오" dataKey="value" stroke={themeColor} fill={themeColor} fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ─── 알림 배너 ─── */}
          <div className="p-2.5 bg-red-950/30 border border-red-500/30 rounded-lg flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-red-200 leading-relaxed break-keep">
              <span className="font-bold">System Alert:</span> 교감신경이 과항진(스트레스 78% / HRV 35ms)된 상태입니다. 오늘{' '}
              <strong>{harmony?.tenGod || '일진'}</strong> 에너지와 맞물려 충동적 결정 위험이 높습니다.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 챗봇 ─── */}
      <div className="bg-[#0b1018] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative" style={{ height: '500px' }}>
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="p-3 bg-white/5 border-b border-white/5 flex items-center gap-2 z-10">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-[12px] font-bold text-slate-200">명심 OS 코칭 연결망</span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 z-10 scrollbar-hide">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-2xl rounded-tl-none p-3 max-w-[85%]">
              <p className="text-[12px] text-cyan-100 leading-relaxed break-keep">
                사용자의 기질 데이터와 생체 에너지가 동기화되었습니다. 지금 무엇을 앞두고 계신가요? 상황을 말씀해주시면 <strong>즉각적인 행동 지침(Action Plan)</strong>을 도출하겠습니다.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['커피 마셔도 될까?', '운동 다녀올게', '중요한 미팅 전이야'].map((s, i) => (
                  <button key={i} onClick={() => setInputMessage(s)}
                    className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300 hover:bg-white/10 transition-colors">
                    "{s}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {messages.map((msg, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2`}>
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-1">
                  <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              )}
              <div className={`p-3 rounded-2xl max-w-[85%] ${
                msg.role === 'user'
                  ? 'bg-slate-700 text-white rounded-tr-none text-[13px]'
                  : 'bg-cyan-950/20 border border-cyan-500/20 text-cyan-50 rounded-tl-none text-[12.5px]'
              }`}>
                {msg.role === 'user' ? msg.content : (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>{msg.content}</ReactMarkdown>
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
              <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-2xl rounded-tl-none p-3 flex items-center gap-1">
                {[0, 0.1, 0.2].map((d, i) => (
                  <span key={i} className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-3 bg-white/5 border-t border-white/5 z-10">
          <div className="relative flex items-center">
            <input type="text" value={inputMessage} onChange={e => setInputMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="명심 OS에 질문 입력..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              disabled={isTyping} />
            <button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}
              className="absolute right-2 p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
