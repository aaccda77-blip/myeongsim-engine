'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarDays, Loader2, ArrowRight, Rocket } from 'lucide-react';

interface ArchiveItem {
  id: string;
  date_string: string;
  dailyKeyword: string;
  targetOS: string;
  created_at: string;
}

interface Props {
  userId?: string;
  onClose: () => void;
  onSelectDate: (dateString: string) => void;
}

export default function FrequencyArchiveModal({ userId, onClose, onSelectDate }: Props) {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArchive = async () => {
      if (!userId || userId === 'anonymous') {
        setError('로그인이 필요한 기능입니다.');
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/os/frequency-board?userId=${userId}&limit=50`);
        if (!res.ok) throw new Error('데이터를 불러오지 못했습니다.');
        
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        
        setItems(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArchive();
  }, [userId]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-slate-950/95 backdrop-blur-2xl"
      >
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="border-b border-slate-800 px-5 py-4 flex justify-between items-center bg-slate-900/90 shrink-0">
            <h2 className="text-sm font-bold flex items-center gap-2 font-mono">
              <Rocket className="w-4 h-4 text-fuchsia-400" />
              <span className="text-slate-200">주파수 레벨업 아카이브</span>
            </h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-fuchsia-400 animate-spin mb-4" />
                <p className="text-xs text-slate-500">과거 주파수 기록을 탐색 중...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-sm text-rose-400">{error}</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <CalendarDays className="w-10 h-10 text-slate-700 mb-3" />
                <p className="text-sm text-slate-400">저장된 기록이 없습니다.</p>
                <p className="text-xs text-slate-600 mt-1">오늘의 주파수 레벨업을 진행해 보세요.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectDate(item.date_string)}
                    className="w-full text-left bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-fuchsia-900/50 rounded-xl p-4 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-fuchsia-400 transition-colors">
                        {item.date_string}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-fuchsia-400 transition-colors" />
                    </div>
                    <p className="text-sm font-bold text-rose-300 mb-1 line-clamp-1">{item.dailyKeyword}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{item.targetOS}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
