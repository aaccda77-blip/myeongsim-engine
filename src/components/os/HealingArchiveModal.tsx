'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ChevronRight, BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useReportStore } from '@/store/useReportStore';

interface ArchiveItem {
  id: string;
  date_string: string;
  theme: string;
  created_at: string;
}

interface Props {
  onClose: () => void;
  onSelectDate: (dateString: string) => void;
}

export default function HealingArchiveModal({ onClose, onSelectDate }: Props) {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // [초개인화 모듈] 로그인된 유저 ID 및 사주 일간 정보 획득
  const { id: userId } = useAuthUser();
  const { reportData } = useReportStore();

  const fetchArchives = async () => {
    try {
      const url = `/api/os/healing-board?limit=30${userId ? `&userId=${userId}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        setArchives(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch archives", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, [userId]);

  // KST 기준 오늘 날짜 구하기 (서버 시간과의 동기화 확보)
  const getKstTodayStr = () => {
    const today = new Date();
    const kstDate = new Date(today.getTime() + 9 * 60 * 60 * 1000);
    return kstDate.toISOString().split('T')[0];
  };

  const todayStr = getKstTodayStr();
  const isTodayGenerated = archives.some(item => item.date_string === todayStr);

  const handleGenerateDaily = async () => {
    if (isTodayGenerated) {
      alert("이미 오늘의 에세이가 생성되었습니다. 다음날 새롭게 생성 가능합니다.");
      return;
    }

    setIsGenerating(true);
    try {
      const rawDayMaster = reportData?.saju?.dayMaster;
      const storeDayMaster = typeof rawDayMaster === 'string' 
        ? rawDayMaster.charAt(0) 
        : (rawDayMaster as any)?.char || (rawDayMaster as any)?.label?.charAt(0) || undefined;

      if (userId && storeDayMaster) {
        const res = await fetch('/api/os/my-daily-healing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: userId, 
            dayMaster: storeDayMaster,
            forceRefresh: false // 중복 생성 원천 방지
          })
        });
        if (!res.ok) throw new Error("개인화 에세이 생성 실패");
      } else {
        const res = await fetch('/api/os/daily-healing');
        if (!res.ok) throw new Error("공용 에세이 생성 실패");
      }

      // 생성 완료 후 리스트 재조회
      await fetchArchives();
      alert("오늘의 새로운 에세이가 생성되어 치유의 숲에 추가되었습니다! 🌿");
    } catch (err) {
      console.error("에세이 생성 중 오류 발생:", err);
      alert("에세이를 생성하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
      >
        <div className="absolute inset-0 pointer-events-none" onClick={onClose} />
        
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-slate-900/80 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="border-b border-slate-800 p-6 flex justify-between items-center bg-slate-900/60 shrink-0">
            <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              치유의 숲 (아카이브)
            </h2>
            <button onClick={onClose} className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI 에세이 하루 1회 한정 생성 보드 */}
          <div className="p-5 bg-slate-950/40 border-b border-slate-800 shrink-0 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>MYONGSIM_AI_ENGINE v2.5</span>
            </div>
            
            {isTodayGenerated ? (
              <div className="py-2.5 px-4 bg-emerald-950/30 border border-emerald-900/50 rounded-2xl text-[11px] text-emerald-400 leading-relaxed font-semibold">
                ✅ 오늘의 에세이가 이미 생성되어 존재합니다.<br/>
                <span className="text-slate-500 font-normal">이미 생성된 거면 다음날 새롭게 생성 가능합니다.</span>
              </div>
            ) : (
              <button
                onClick={handleGenerateDaily}
                disabled={isGenerating}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold rounded-xl text-xs tracking-wider transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                    <span>오늘의 에세이 컴파일 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>오늘의 에세이 AI 생성하기</span>
                  </>
                )}
              </button>
            )}
            
            <p className="text-[10px] text-slate-500 leading-relaxed">
              ※ 하루에 단 하나의 명심 에세이만 생성되어 저장됩니다. 중복 생성이 차단되어 토큰 폭탄을 예방합니다.
            </p>
          </div>

          {/* List */}
          <div className="p-4 overflow-y-auto flex-1 space-y-2 scrollbar-hide">
            {loading ? (
              <div className="text-center py-10 text-slate-400 text-sm animate-pulse">기록을 불러오는 중...</div>
            ) : archives.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">아직 기록된 치유 콘텐츠가 없습니다.</div>
            ) : (
              archives.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectDate(item.date_string)}
                  className="w-full text-left bg-slate-800/40 hover:bg-slate-700/50 p-4 rounded-xl border border-slate-700/50 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-mono text-slate-400">{item.date_string}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {item.theme}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </button>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
