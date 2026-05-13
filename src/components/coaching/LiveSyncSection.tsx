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

// ─── 동적 생체 시뮬레이션 함수 ────────
function randomBetween(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}
function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}
function jitter(base: number, range: number, min: number, max: number) {
  return clamp(Math.round(base + (Math.random() * range * 2 - range)), min, max);
}

const INITIAL_BIO = {
  heartRate: 92, stressLevel: 78, hrv: 35, spo2: 98,
  sleepScore: 72, recovery: 61, calories: 420, bodyTemp: 36.7,
};

const generateChartData = (baseHR: number) => {
  const data = [];
  let currentHR = baseHR;
  for (let i = 0; i < 20; i++) {
    currentHR += Math.floor(Math.random() * 7) - 3;
    data.push({ time: i, hr: clamp(currentHR, 55, 135) });
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

  // ─── 동적 생체 데이터 (3초마다 자연스럽게 변동) ───
  const [bio, setBio] = useState(INITIAL_BIO);

  useEffect(() => {
    setChartData(generateChartData(bio.heartRate));

    const bioInterval = setInterval(() => {
      setBio(prev => ({
        heartRate:    jitter(prev.heartRate,   3,  62, 115),
        stressLevel:  jitter(prev.stressLevel, 4,  30, 95),
        hrv:          jitter(prev.hrv,         3,  18, 65),
        spo2:         jitter(prev.spo2,        1,  94, 100),
        sleepScore:   prev.sleepScore, // 수면 점수는 하루 단위 (변동 없음)
        recovery:     jitter(prev.recovery,    2,  35, 95),
        calories:     prev.calories + Math.round(Math.random() * 5), // 칼로리는 누적
        bodyTemp:     +(clamp(prev.bodyTemp + (Math.random() * 0.2 - 0.1), 36.1, 37.5)).toFixed(1),
      }));
    }, 3000);

    const chartInterval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastHR = newData[newData.length - 1]?.hr || 85;
        newData.push({
          time: prev[prev.length - 1].time + 1,
          hr: clamp(lastHR + (Math.floor(Math.random() * 7) - 3), 55, 135)
        });
        return newData;
      });
    }, 2000);

    setTimeout(() => setIsSyncing(false), 1500);
    return () => { clearInterval(bioInterval); clearInterval(chartInterval); };
  }, []);

  // 레이더 차트 데이터 (바이오리듬 + 동적 데이터)
  const radarData = [
    { subject: '신체', value: Math.round(((biorhythm?.physical ?? 30) + 100) / 2) },
    { subject: '감정', value: Math.round(((biorhythm?.emotional ?? 20) + 100) / 2) },
    { subject: '지성', value: Math.round(((biorhythm?.intellectual ?? 50) + 100) / 2) },
    { subject: '수면', value: bio.sleepScore },
    { subject: '회복', value: bio.recovery },
  ];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  // ─── 실시간 심리 프로파일링 상태 (빅파이브 + MBTI 누적) ───
  const [psychProfile, setPsychProfile] = useState<any>({
    openness: undefined, conscientiousness: undefined,
    extraversion: undefined, agreeableness: undefined,
    neuroticism: undefined, mbtiTendency: '',
    totalResponses: 0,
  });
  const [microQ, setMicroQ] = useState<any>(null);

  const handleMicroAnswer = (choice: any, dimension: string) => {
    // 빅파이브 점수 누적 (이동 평균)
    setPsychProfile((prev: any) => {
      const count = prev.totalResponses + 1;
      const oldVal = prev[dimension];
      const newVal = oldVal !== undefined
        ? Math.round((oldVal * (count - 1) + choice.score) / count)
        : choice.score;
      return { ...prev, [dimension]: newVal, totalResponses: count };
    });
    // 선택 내용을 채팅에 반영
    setMessages(prev => [...prev, {
      role: 'user',
      content: `🧠 [심리 프로파일링 응답] ${choice.text}`
    }]);
    setMicroQ(null);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;
    const userMessage = inputMessage;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputMessage('');
    setIsTyping(true);
    setMicroQ(null);
    try {
      const res = await fetch('/api/live-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage, sajuData, harmony, biorhythm,
          wearableData: bio, psychProfile,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      // 마이크로 질문이 있으면 세팅
      if (data.microQuestion) {
        setMicroQ(data.microQuestion);
      }
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
              <p className="text-2xl font-black text-white">{bio.heartRate} <span className="text-[10px] font-normal text-slate-400">BPM</span></p>
              <div className="mt-1.5 h-1 w-full bg-red-950 rounded-full overflow-hidden">
                <motion.div className="h-full bg-red-500 rounded-full" animate={{ width: `${Math.min(100, Math.round(bio.heartRate / 1.2))}%` }} transition={{ duration: 0.8 }} />
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
              <p className="text-2xl font-black text-white">{bio.stressLevel}<span className="text-[10px] font-normal text-slate-400">%</span></p>
              <div className="mt-1.5 h-1 w-full bg-amber-950 rounded-full overflow-hidden">
                <motion.div className="h-full bg-amber-500 rounded-full" animate={{ width: `${bio.stressLevel}%` }} transition={{ duration: 0.8 }} />
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
              value={bio.spo2} unit="%" barPct={bio.spo2} color="text-sky-400"
              warn={bio.spo2 < 95}
            />
            <MiniMetricCard
              icon={<Activity className="w-3 h-3" />} label="HRV" labelKor="심박변이도"
              value={bio.hrv} unit="ms" barPct={Math.round(bio.hrv * 1.5)} color="text-violet-400"
              warn={bio.hrv < 30}
            />
            <MiniMetricCard
              icon={<Moon className="w-3 h-3" />} label="SLEEP" labelKor="수면 품질"
              value={bio.sleepScore} unit="점" barPct={bio.sleepScore} color="text-indigo-400"
            />
            <MiniMetricCard
              icon={<Zap className="w-3 h-3" />} label="RECOVERY" labelKor="회복 점수"
              value={bio.recovery} unit="점" barPct={bio.recovery} color="text-emerald-400"
              warn={bio.recovery < 50}
            />
            <MiniMetricCard
              icon={<Flame className="w-3 h-3" />} label="CALORIES" labelKor="활동 칼로리"
              value={bio.calories} unit="kcal" barPct={Math.min(100, Math.round(bio.calories / 8))} color="text-orange-400"
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
          <div className={`p-2.5 rounded-lg flex items-start gap-2 ${
            bio.stressLevel >= 70 ? 'bg-red-950/30 border border-red-500/30' :
            bio.stressLevel >= 50 ? 'bg-amber-950/30 border border-amber-500/30' :
            'bg-emerald-950/30 border border-emerald-500/30'
          }`}>
            <ShieldAlert className={`w-4 h-4 shrink-0 mt-0.5 ${
              bio.stressLevel >= 70 ? 'text-red-400' : bio.stressLevel >= 50 ? 'text-amber-400' : 'text-emerald-400'
            }`} />
            <p className={`text-[11px] leading-relaxed break-keep ${
              bio.stressLevel >= 70 ? 'text-red-200' : bio.stressLevel >= 50 ? 'text-amber-200' : 'text-emerald-200'
            }`}>
              <span className="font-bold">{bio.stressLevel >= 70 ? '⚠️ 주의 알림:' : bio.stressLevel >= 50 ? '🔶 참고 알림:' : '✅ 양호 상태:'}</span>{' '}
              {bio.stressLevel >= 70
                ? `스트레스 ${bio.stressLevel}% / HRV ${bio.hrv}ms → 교감신경이 과항진 상태입니다. 오늘 ${harmony?.tenGod || '일진'} 에너지와 맞물려 충동적 결정에 주의하세요.`
                : bio.stressLevel >= 50
                ? `스트레스 ${bio.stressLevel}% → 약간 긴장 상태입니다. 호흡 조절로 부교감신경을 활성화해 보세요.`
                : `스트레스 ${bio.stressLevel}% / 회복 ${bio.recovery}점 → 안정적인 컨디션입니다. 적극적인 활동에 적합합니다!`
              }
            </p>
          </div>
        </div>
      </div>

      {/* ─── 챗봇 ─── */}
      <div className="bg-[#0b1018] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative" style={{ height: '500px' }}>
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="p-3 bg-white/5 border-b border-white/5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-[12px] font-bold text-slate-200">명심 OS 코칭 연결망</span>
          </div>
          {psychProfile.totalResponses > 0 && (
            <span className="text-[9px] px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-full font-mono border border-violet-500/20">
              🧬 프로필 {psychProfile.totalResponses}회 측정
            </span>
          )}
        </div>

        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 z-10 scrollbar-hide">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-2xl rounded-tl-none p-3 max-w-[85%]">
              <p className="text-[12px] text-cyan-100 leading-relaxed break-keep">
                🪞 기질 데이터와 생체 에너지가 동기화되었습니다. 기질 데이터는 <strong>반복되는 행동 패턴</strong>이지, 진짜 당신이 아닙니다. 지금 무엇을 앞두고 계신가요? 패턴을 알아차리고, <strong>관찰자인 '나'</strong>로서 선택할 수 있도록 코칭해 드리겠습니다.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['커피 마셔도 될까?', '짜증이 나는데 왜 그럴까?', '중요한 미팅 전이야', '나는 왜 이 패턴을 반복할까?'].map((s, i) => (
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

          {/* ─── 마이크로 심리 프로파일링 질문 카드 ─── */}
          {microQ && !isTyping ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-violet-950 border border-violet-500/30 flex items-center justify-center shrink-0 mt-1">
                <span className="text-[11px]">🧬</span>
              </div>
              <div className="bg-violet-950/20 border border-violet-500/25 rounded-2xl rounded-tl-none p-3 max-w-[90%]">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[9px] px-1.5 py-0.5 bg-violet-500/20 text-violet-300 rounded-full font-mono">
                    {microQ.type === 'big5' ? 'BIG FIVE' : 'MBTI'} · {microQ.dimension?.toUpperCase()}
                  </span>
                  <span className="text-[9px] text-violet-400/60">실시간 프로파일링</span>
                </div>
                <p className="text-[12px] text-violet-100 mb-3 leading-relaxed break-keep">{microQ.question}</p>
                <div className="space-y-1.5">
                  {microQ.choices?.map((c: any) => (
                    <button key={c.id}
                      onClick={() => handleMicroAnswer(c, microQ.dimension)}
                      className="w-full text-left px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-[11px] text-violet-100 hover:bg-violet-500/25 hover:border-violet-400/40 transition-all duration-200 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-300 shrink-0">{c.id}</span>
                      <span className="break-keep">{c.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}

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
