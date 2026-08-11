'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Mic, Square, Play, Pause, Volume2, Cloud, ShieldCheck, Coffee, RefreshCw, BookmarkCheck, CheckCircle2, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

// 432Hz Ambient Sound Generator using Web Audio API
class AmbientSoundGenerator {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;

  start() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.osc = this.ctx.createOscillator();
      this.gain = this.ctx.createGain();

      this.osc.type = 'sine';
      this.osc.frequency.setValueAtTime(432, this.ctx.currentTime); // 432Hz Healing Frequency

      this.gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.gain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 2);

      this.osc.connect(this.gain);
      this.gain.connect(this.ctx.destination);
      this.osc.start();
    } catch (e) {
      console.warn('AudioContext not supported or blocked:', e);
    }
  }

  stop() {
    try {
      if (this.gain && this.ctx) {
        this.gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
        setTimeout(() => {
          this.osc?.stop();
          this.ctx?.close();
          this.ctx = null;
        }, 1000);
      }
    } catch (e) {
      console.warn('Error stopping ambient sound:', e);
    }
  }
}

export default function DarkCodeCompassionTransformerModal({ isOpen, onClose, userName = '명심가' }: Props) {
  const [activeTab, setActiveTab] = useState<'tea' | 'cloud' | 'somatic'>('tea');

  // Quest 1 State (Tea Table)
  const [darkCodeInput, setDarkCodeInput] = useState('');
  const [isAnalyzingDarkCode, setIsAnalyzingDarkCode] = useState(false);
  const [transformedTeaResult, setTransformedTeaResult] = useState<{
    intent: string;
    compassionText: string;
  } | null>(null);
  const [savedTeaCards, setSavedTeaCards] = useState<Array<{ dark: string; compassion: string; date: string }>>([]);

  // Quest 2 State (Thought Cloud)
  const [cloudThoughtInput, setCloudThoughtInput] = useState('');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathCount, setBreathCount] = useState(3);
  const [cloudObservationText, setCloudObservationText] = useState<string | null>(null);
  const [isCloudFloating, setIsCloudFloating] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  // Quest 3 State (Somatic Care & Voice Record)
  const [selectedBodyZone, setSelectedBodyZone] = useState<'chest' | 'shoulder' | 'belly' | 'head'>('chest');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [isPlayingRecord, setIsPlayingRecord] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const ambientGenRef = useRef<AmbientSoundGenerator | null>(null);

  // Load saved cards from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('myeongsim_saved_compassion_cards');
        if (saved) setSavedTeaCards(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Quest 1: Analyze & Transform Dark Code
  const handleTransformDarkCode = () => {
    if (!darkCodeInput.trim()) return;
    setIsAnalyzingDarkCode(true);

    setTimeout(() => {
      let intentStr = '비난받고 상처 입기 전에 내가 먼저 조심하게 하려던 내 안의 오래된 파수꾼';
      let compassionStr = `남들에게 상처 입기 전에 나를 먼저 지키려고 했던 거였구나. 나를 지켜주느라 그동안 참 고생 많았어. 이제는 내가 나를 지킬 수 있으니 편히 쉬어도 된단다.`;

      if (darkCodeInput.includes('실수') || darkCodeInput.includes('망치')) {
        intentStr = '완벽하게 대처하여 안전을 확보하려 했던 충성스러운 파수꾼';
        compassionStr = `실수해서 상처받을까 봐 미리 걱정하며 애써준 거였구나. 고마워, 이제 무거운 짐을 내려놓고 가만히 숨을 쉬어도 괜찮아.`;
      } else if (darkCodeInput.includes('남들') || darkCodeInput.includes('인정')) {
        intentStr = '세상의 인정과 사랑을 얻어 공동체 안에서 안전하고 싶었던 파수꾼';
        compassionStr = `사랑받고 인정받고 싶어서 밤새 경계를 섰던 거였구나. 존재하는 그대로 이미 충분히 고귀하단다. 편안히 안식하렴.`;
      }

      setTransformedTeaResult({ intent: intentStr, compassionText: compassionStr });
      setIsAnalyzingDarkCode(false);
    }, 1200);
  };

  const handleSaveTeaCard = () => {
    if (!transformedTeaResult || !darkCodeInput) return;
    const newCard = {
      dark: darkCodeInput,
      compassion: transformedTeaResult.compassionText,
      date: new Date().toLocaleDateString('ko-KR')
    };
    const updated = [newCard, ...savedTeaCards];
    setSavedTeaCards(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('myeongsim_saved_compassion_cards', JSON.stringify(updated));
    }
    alert('✨ 다정한 자비의 문장이 기록함에 보관되었습니다!');
  };

  // Quest 2: 3-sec Breathing & Thought Cloud Release
  const handleStart3SecBreathing = () => {
    setIsBreathingActive(true);
    setBreathCount(3);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 100, 100]);
    }

    const timer = setInterval(() => {
      setBreathCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsBreathingActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleReleaseCloud = () => {
    if (!cloudThoughtInput.trim()) return;
    const observation = `지금 내 마음이라는 넓은 하늘 위에 '${cloudThoughtInput.trim()}'라는 슬픈 생각의 구름 한 조각이 스쳐 지나가고 있구나.`;
    setCloudObservationText(observation);
    setIsCloudFloating(true);

    setTimeout(() => {
      setIsCloudFloating(false);
    }, 4000);
  };

  // Quest 3: Somatic Recording & Ambient Sound
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert('마이크 접근 권한이 필요합니다. 브라우저 설정에서 마이크를 허용해 주세요.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const togglePlayRecord = () => {
    if (!audioPlayerRef.current || !audioBlobUrl) return;
    if (isPlayingRecord) {
      audioPlayerRef.current.pause();
      setIsPlayingRecord(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingRecord(true);
    }
  };

  const toggleAmbientSound = () => {
    if (isAmbientPlaying) {
      ambientGenRef.current?.stop();
      setIsAmbientPlaying(false);
    } else {
      if (!ambientGenRef.current) ambientGenRef.current = new AmbientSoundGenerator();
      ambientGenRef.current.start();
      setIsAmbientPlaying(true);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#0c1222] via-[#080d1a] to-[#040714] border border-amber-500/40 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden text-white my-auto max-h-[92vh] flex flex-col font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                  <span>🛡️ 다크코드 스캔 & 자비 변환기</span>
                </h3>
                <p className="text-[11px] text-amber-300/80 font-medium">
                  책 《명심 3장. 다정한 리팩토링》 연동 1:1 실습 퀘스트
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                ambientGenRef.current?.stop();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 bg-slate-900/80 border-b border-white/10 p-1.5 gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('tea')}
              className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'tea'
                  ? 'bg-gradient-to-r from-amber-500/30 to-yellow-500/20 text-amber-300 border border-amber-500/50 shadow-md font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Coffee size={14} />
              <span className="truncate">퀘스트 1. 다정한 찻상</span>
            </button>

            <button
              onClick={() => setActiveTab('cloud')}
              className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'cloud'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/20 text-cyan-300 border border-cyan-500/50 shadow-md font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cloud size={14} />
              <span className="truncate">퀘스트 2. 구름 이름표</span>
            </button>

            <button
              onClick={() => setActiveTab('somatic')}
              className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'somatic'
                  ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/20 text-emerald-300 border border-emerald-500/50 shadow-md font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart size={14} />
              <span className="truncate">퀘스트 3. 데일리 음성 안식</span>
            </button>
          </div>

          {/* Body Content Scrollable Area */}
          <div className="p-5 overflow-y-auto space-y-5 flex-1 text-left">
            {/* TAB 1: 다정한 찻상 */}
            {activeTab === 'tea' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck size={14} /> 퀘스트 1. 내 안의 오래된 파수꾼과 나누는 다정한 찻상
                  </span>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    불쑥 솟구치는 불안과 완벽주의(다크코드)를 무작정 지워버릴 결함으로 미워하지 않고, 나를 지키려 했던 내면의 피곤한 파수꾼으로 수용하고 다독입니다.
                  </p>
                </div>

                {/* Step 1 Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                    <span>1. 나를 비난하거나 조바심내게 만드는 문장 적기</span>
                    <span className="text-[10px] text-amber-400 font-normal">예: "실수하면 남들이 비웃을 거야"</span>
                  </label>
                  <textarea
                    rows={3}
                    value={darkCodeInput}
                    onChange={(e) => setDarkCodeInput(e.target.value)}
                    placeholder="일상에서 나를 괴롭히는 자책이나 불안의 문장을 그대로 적어보세요..."
                    className="w-full p-3.5 rounded-xl bg-slate-900/90 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-all"
                  />
                  {/* Quick Preset Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      '실수하면 남들이 다 나를 비웃을 거야',
                      '완벽하지 않으면 인정받지 못해',
                      '지금 쉬면 남들에게 뒤처질 것 같아'
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => setDarkCodeInput(chip)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 text-[10px] text-gray-300 hover:text-amber-300 border border-white/10 transition-all cursor-pointer"
                      >
                        + "{chip.slice(0, 15)}..."
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transform Button */}
                <button
                  onClick={handleTransformDarkCode}
                  disabled={isAnalyzingDarkCode || !darkCodeInput.trim()}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzingDarkCode ? (
                    <>
                      <RefreshCw size={16} className="animate-spin text-black" />
                      <span>AI 마인드 아키텍트가 파수꾼의 숨은 의도를 분석 중...</span>
                    </>
                  ) : (
                    <>
                      <Coffee size={16} />
                      <span>☕ 파수꾼과 다정한 찻상 나누기 (자비 변환)</span>
                    </>
                  )}
                </button>

                {/* Transformed Result Card */}
                {transformedTeaResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border border-amber-400/50 space-y-3 shadow-xl"
                  >
                    <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                      <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                        <CheckCircle2 size={15} /> 파수꾼의 숨은 의도와 자비의 변환 문장
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                        변환 완료
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="text-[11px] text-amber-400 font-bold block">💡 파수꾼 자아의 고마운 속마음:</span>
                      <p className="text-gray-300 leading-relaxed italic bg-black/40 p-2.5 rounded-lg border border-white/5">
                        "{transformedTeaResult.intent}"
                      </p>
                    </div>

                    <div className="space-y-1 text-xs pt-1">
                      <span className="text-[11px] text-emerald-400 font-bold block">💌 다정한 안식과 고쳐 쓰기 문장:</span>
                      <p className="text-white font-medium leading-relaxed bg-amber-500/10 p-3 rounded-xl border border-amber-500/30 text-amber-100">
                        "{transformedTeaResult.compassionText}"
                      </p>
                    </div>

                    <button
                      onClick={handleSaveTeaCard}
                      className="w-full py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BookmarkCheck size={15} />
                      <span>내 마음 기록함에 보관하기</span>
                    </button>
                  </motion.div>
                )}

                {/* Saved Cards List */}
                {savedTeaCards.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <span className="text-xs font-bold text-gray-400 flex items-center justify-between">
                      <span>내 마음 보관함 ({savedTeaCards.length}개)</span>
                      <button
                        onClick={() => {
                          setSavedTeaCards([]);
                          localStorage.removeItem('myeongsim_saved_compassion_cards');
                        }}
                        className="text-[10px] text-gray-500 hover:text-rose-400"
                      >
                        전체 삭제
                      </button>
                    </span>
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {savedTeaCards.map((card, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-xs space-y-1">
                          <div className="flex justify-between text-[10px] text-gray-400">
                            <span className="text-rose-300 line-through">"{card.dark}"</span>
                            <span>{card.date}</span>
                          </div>
                          <p className="text-emerald-300 font-medium">{card.compassion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: 생각 구름 이름표 */}
            {activeTab === 'cloud' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-1.5">
                  <span className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                    <Cloud size={14} /> 퀘스트 2. 생각이라는 구름에 다정한 이름표 붙여주기
                  </span>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    자극이 올 때 즉시 반응하지 않고 3초의 쉼표를 확보한 뒤, 생각을 내가 아닌 스쳐 지나가는 구름 한 조각으로 유연하게 관찰(인지 탈융합)합니다.
                  </p>
                </div>

                {/* 3-sec Breathing Widget */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1526] to-slate-950 border border-cyan-400/30 text-center space-y-3">
                  <span className="text-xs font-bold text-cyan-300 block">
                    🧘 1단계: 3초 거룩한 여백 (숨쉬기 쉼표)
                  </span>
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ scale: isBreathingActive ? [1, 1.25, 1] : 1 }}
                      transition={{ duration: 3, repeat: isBreathingActive ? Infinity : 0 }}
                      className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex flex-col items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                    >
                      <span className="text-2xl font-black font-mono">
                        {isBreathingActive ? breathCount : '3s'}
                      </span>
                      <span className="text-[9px] font-bold text-cyan-200">
                        {isBreathingActive ? '깊은 들숨' : '터치 시작'}
                      </span>
                    </motion.div>
                  </div>
                  <button
                    onClick={handleStart3SecBreathing}
                    disabled={isBreathingActive}
                    className="py-2 px-5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    {isBreathingActive ? '3초간 천천히 숨 내쉬는 중...' : '▶️ 3초 쉼표 숨쉬기 가동'}
                  </button>
                </div>

                {/* Step 2 Cloud Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300">
                    2단계: 마음을 사납게 맴도는 어두운 생각 구름 입력
                  </label>
                  <input
                    type="text"
                    value={cloudThoughtInput}
                    onChange={(e) => setCloudThoughtInput(e.target.value)}
                    placeholder="예: 나는 결국 실패할 거야..."
                    className="w-full p-3.5 rounded-xl bg-slate-900/90 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>

                <button
                  onClick={handleReleaseCloud}
                  disabled={!cloudThoughtInput.trim()}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Cloud size={16} />
                  <span>☁️ 생각 구름 하늘로 사르르 날려보내기</span>
                </button>

                {/* Floating Cloud Animation & Observation Output */}
                {cloudObservationText && (
                  <div className="relative p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 text-center space-y-3 overflow-hidden">
                    {isCloudFloating && (
                      <motion.div
                        initial={{ y: 20, opacity: 1, scale: 1 }}
                        animate={{ y: -80, opacity: 0, scale: 1.2 }}
                        transition={{ duration: 3.5, ease: 'easeOut' }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <div className="px-4 py-2 bg-cyan-500/30 border border-cyan-400 rounded-full text-cyan-200 text-xs font-bold flex items-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                          <Cloud size={16} />
                          <span>"{cloudThoughtInput}" (스쳐 날아가는 구름)</span>
                        </div>
                      </motion.div>
                    )}

                    <span className="text-xs font-bold text-cyan-300 block">
                      ☁️ 인지 탈융합 구름 관찰 문장
                    </span>
                    <p className="text-xs text-cyan-100 font-medium leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/10">
                      "{cloudObservationText}"
                    </p>

                    <div className="pt-2 text-left space-y-2">
                      <span className="text-[11px] font-bold text-gray-300 block">
                        🌱 3단계: 구름과 다투지 않고 오늘 실천할 가치 있는 아주 작은 행동 선택:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { title: '☕ 따뜻한 차 마시기', desc: '내 몸에 따스한 온기 전하기' },
                          { title: '🌿 10분 온화한 산책', desc: '바람 소리에 오감 맡기기' },
                          { title: '💌 온기 어린 안부', desc: '소중한 이에게 안부 전하기' }
                        ].map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedAction(act.title)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                              selectedAction === act.title
                                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 font-bold shadow-md'
                                : 'bg-slate-900/80 border-white/10 text-gray-300 hover:border-cyan-500/40'
                            }`}
                          >
                            <span className="block font-bold text-[11px]">{act.title}</span>
                            <span className="block text-[9px] text-gray-400">{act.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: 신체 자비 스캔 & 데일리 음성 안식 */}
            {activeTab === 'somatic' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                  <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                    <Heart size={14} /> 퀘스트 3. 신체 자비 스캔 & 데일리 음성 안식
                  </span>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    머릿속 시선을 정직한 몸의 감각으로 돌려 오목가슴 깊은 곳에 손을 얹고, 나의 다정한 목소리로 3문장을 직접 녹음해 잠들기 전 안식 케어를 완성합니다.
                  </p>
                </div>

                {/* Body Touch Interactive Map */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 text-center space-y-3">
                  <span className="text-xs font-bold text-emerald-300 block">
                    1. 오늘 긴장감이나 답답함이 느껴지는 신체 부위 선택
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'chest', label: '💖 오목가슴 / 가슴', desc: '답답함, 뻐근함' },
                      { id: 'shoulder', label: '💆 목 / 어깨', desc: '딱딱함, 중압감' },
                      { id: 'belly', label: '🧘 아랫배 / 뱃속', desc: '차가움, 불안' },
                      { id: 'head', label: '🧠 관자놀이 / 머리', desc: '생각 과열, 두통' }
                    ].map((zone) => (
                      <button
                        key={zone.id}
                        onClick={() => setSelectedBodyZone(zone.id as any)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedBodyZone === zone.id
                            ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105'
                            : 'bg-slate-950/80 border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-bold block">{zone.label}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{zone.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3 Compassion Sentences Cards */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-300 block">
                    2. 선택 부위에 따뜻한 손을 얹고 가만히 읊조리는 자기 자비 3문장
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-100">
                      <span className="text-[10px] text-emerald-400 font-bold block mb-0.5">[1. 정직한 인정]</span>
                      "지금 내 마음과 몸이 참 많이 아프고 힘들구나."
                    </div>
                    <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/30 text-teal-100">
                      <span className="text-[10px] text-teal-400 font-bold block mb-0.5">[2. 보편적 연결]</span>
                      "살아가며 흔들리고 아픈 것은 나 혼자만이 아니야. 인간이기에 누구나 지나가는 당연한 삶의 풍경이지."
                    </div>
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-100">
                      <span className="text-[10px] text-amber-400 font-bold block mb-0.5">[3. 다정한 위로]</span>
                      "이제는 내가 나에게 가장 다정한 친구가 되어줄게. 오늘만큼은 나 자신에게 깊은 위로와 평화를 선물하자."
                    </div>
                  </div>
                </div>

                {/* Voice Recorder & Ambient Sound Controls */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-[#071714] to-slate-950 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300">
                      🎙️ 3. 나의 다정한 목소리로 직접 녹음하여 데일리 안식 케어 완성
                    </span>
                    <button
                      onClick={toggleAmbientSound}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                        isAmbientPlaying
                          ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                          : 'bg-white/5 text-gray-400 border-white/10'
                      }`}
                    >
                      <Volume2 size={12} />
                      <span>{isAmbientPlaying} 432Hz 힐링음 ON</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-1">
                    {!isRecording ? (
                      <button
                        onClick={handleStartRecording}
                        className="py-2.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                      >
                        <Mic size={15} />
                        <span>내 목소리로 3문장 녹음 시작</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleStopRecording}
                        className="py-2.5 px-5 bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer animate-pulse"
                      >
                        <Square size={15} />
                        <span>녹음 중지하기 (완료)</span>
                      </button>
                    )}

                    {audioBlobUrl && (
                      <button
                        onClick={togglePlayRecord}
                        className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        {isPlayingRecord ? <Pause size={15} /> : <Play size={15} />}
                        <span>{isPlayingRecord ? '일시 정지' : '▶️ 내 목소리 청음'}</span>
                      </button>
                    )}
                  </div>

                  {audioBlobUrl && (
                    <audio
                      ref={audioPlayerRef}
                      src={audioBlobUrl}
                      onEnded={() => setIsPlayingRecord(false)}
                      className="hidden"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Close */}
          <div className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between text-xs text-gray-400">
            <span>📚 명심 3장 다정한 리팩토링 실습 완료</span>
            <button
              onClick={() => {
                ambientGenRef.current?.stop();
                onClose();
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all cursor-pointer"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
