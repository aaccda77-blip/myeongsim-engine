'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ChevronRight, Terminal, Zap } from 'lucide-react';

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

export default function DebuggingArchiveModal({ userId, onClose, onSelectDate }: Props) {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchives = async () => {
      if (!userId || userId === 'anonymous') {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/os/debugging-board?userId=${userId}&limit=30`);
        if (res.ok) {
          const data = await res.json();
          setArchives(data);
        }
      } catch (err) {
        console.error("Failed to fetch debugging archives", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArchives();
  }, [userId]);

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
          className="relative w-full max-w-lg bg-slate-900/90 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col font-mono"
        >
          {/* Header */}
          <div className="border-b border-slate-800 p-6 flex justify-between items-center bg-slate-900/60 shrink-0">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Terminal className="w-5 h-5 text-rose-400" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-violet-400">
                매트릭스 디버깅 아카이브
              </span>
            </h2>
            <button onClick={onClose} className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3 scrollbar-hide">
            {loading ? (
              <div className="text-center py-10 text-slate-400 text-sm animate-pulse">시스템 로그를 불러오는 중...</div>
            ) : archives.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">아직 기록된 디버깅 리포트가 없습니다.</div>
            ) : (
              archives.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectDate(item.date_string)}
                  className="w-full text-left bg-slate-800/40 hover:bg-slate-700/50 p-4 rounded-xl border border-slate-700/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-400">{item.date_string}</span>
                    </div>
                    <p className="text-sm font-bold text-rose-300 group-hover:text-rose-200 transition-colors mb-1 truncate">
                      {item.dailyKeyword}
                    </p>
                    <div className="flex items-center gap-1.5 opacity-60">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <p className="text-xs text-cyan-300 truncate">{item.targetOS}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-rose-400 transition-colors shrink-0" />
                </button>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
