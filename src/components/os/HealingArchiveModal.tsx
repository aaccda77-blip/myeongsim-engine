'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ChevronRight, BookOpen } from 'lucide-react';
import { useAuthUser } from '@/hooks/useAuthUser';

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
  
  // [초개인화 모듈] 로그인된 유저 ID 획득하여 개인화 아카이브 융합
  const { id: userId } = useAuthUser();

  useEffect(() => {
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
          className="relative w-full max-w-lg bg-slate-900/80 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
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
