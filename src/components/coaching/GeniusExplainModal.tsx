'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles, BrainCircuit, Lightbulb, Compass } from 'lucide-react';
import { playSuccessChime, playTechBeep } from '@/utils/sfx';

interface GeniusExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  saju: any;
  indicatorName: string;
  score: number | string;
  locale: string;
}

interface ExplanationData {
  title: string;
  scientific_metaphor: string;
  deep_explanation: string;
  tuning_action: string;
}

export default function GeniusExplainModal({
  isOpen,
  onClose,
  userName,
  saju,
  indicatorName,
  score,
  locale
}: GeniusExplainModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExplanationData | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchExplanation = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await fetch('/api/coaching/genius-explain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName,
            saju,
            locale,
            indicatorName,
            score
          }),
        });

        if (!response.ok) {
          throw new Error('AI 도슨트 해설을 가져오는 데 실패했습니다.');
        }

        const resData = await response.json();
        if (resData.success && resData.data) {
          setData(resData.data);
          playSuccessChime();
        } else {
          throw new Error(resData.error || 'AI 해석 오류');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || '네트워크 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [isOpen, indicatorName, score, locale, userName, saju]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 22, stiffness: 250 }}
        className="relative w-full max-w-md bg-[#070B18]/90 border border-purple-500/30 rounded-3xl p-6 overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.3)] text-white"
      >
        {/* 네온 백그라운드 오라 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[50px] pointer-events-none" />

        {/* 닫기 버튼 */}
        <button
          onClick={() => {
            onClose();
            playTechBeep();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors duration-200 border border-white/5 z-10"
        >
          <X size={16} />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-ping scale-75"></div>
              <Loader2 size={32} className="text-purple-400 animate-spin relative" />
            </div>
            <p className="text-xs text-indigo-300 animate-pulse font-medium">
              기운의 주파수와 인지 뇌파를 연결하는 중...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="text-3xl mb-3">⚠️</span>
            <h3 className="text-sm font-bold text-red-400 mb-1">분석 에러</h3>
            <p className="text-xs text-gray-400 max-w-xs">{error}</p>
          </div>
        ) : data ? (
          <div className="space-y-5">
            {/* 상단 라벨 */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔮</span>
              <div>
                <span className="text-[9px] text-purple-400 font-black tracking-widest uppercase font-mono">My Genius Guideline</span>
                <h3 className="text-base font-extrabold text-white leading-tight mt-0.5">{data.title}</h3>
              </div>
            </div>

            {/* 수치 요약 배지 */}
            <div className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-2 border border-white/5">
              <span className="text-xs text-gray-400">지표 판독 강도 (Strength)</span>
              <span className="text-xs font-mono font-black text-purple-300">{score}</span>
            </div>

            {/* 뇌과학 비유 (Scientific Metaphor) */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex gap-3">
              <BrainCircuit className="text-purple-400 flex-shrink-0" size={20} />
              <p className="text-xs text-purple-200 font-extrabold leading-relaxed break-keep italic">
                "{data.scientific_metaphor}"
              </p>
            </div>

            {/* 메인 해설 (Deep Explanation) */}
            <div className="bg-[#101526]/80 rounded-xl p-4 border border-white/5">
              <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1.5">도슨트 상세 해설</h4>
              <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line break-keep font-medium">
                {data.deep_explanation}
              </p>
            </div>

            {/* 조율 미션 (Tuning Action) */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex gap-3">
              <Lightbulb className="text-emerald-400 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-xs font-bold text-emerald-400 mb-1">오늘의 마이크로 기운 리셋 패치</h4>
                <p className="text-[11px] text-gray-300 leading-relaxed break-keep">
                  {data.tuning_action}
                </p>
              </div>
            </div>

            {/* 하단 확인 버튼 */}
            <button
              onClick={() => {
                onClose();
                playTechBeep();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs font-black shadow-lg shadow-purple-500/20 transition-all duration-200 active:scale-95 text-center"
            >
              확인 및 리셋 완료
            </button>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
