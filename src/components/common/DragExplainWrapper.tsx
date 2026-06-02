'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

interface DragExplainWrapperProps {
  children: React.ReactNode;
}

export default function DragExplainWrapper({ children }: DragExplainWrapperProps) {
  const [selectedText, setSelectedText] = useState('');
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeExplanation, setActiveExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [showExplainModal, setShowExplainModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 전역 마우스 클릭 시 툴팁을 닫는 처리
  useEffect(() => {
    const clearSelection = () => {
      setShowTooltip(false);
    };
    document.addEventListener('mousedown', clearSelection);
    return () => document.removeEventListener('mousedown', clearSelection);
  }, []);

  const handleTextSelection = (e: React.MouseEvent | React.TouchEvent) => {
    const selection = window.getSelection();
    if (!selection) return;
    const text = selection.toString().trim();

    // 너무 짧거나 길지 않은 실용적인 텍스트 범위만 AI 해설 감지
    if (text.length > 3 && text.length < 200) {
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        if (containerRef.current) {
          const parentElement = containerRef.current.getBoundingClientRect();
          
          // 툴팁이 텍스트 선택 영역 중앙 바로 위(45px 위)에 영롱하게 뜨도록 좌표 계산
          setTooltipPos({
            x: rect.left - parentElement.left + (rect.width / 2),
            y: rect.top - parentElement.top - 45
          });
          setSelectedText(text);
          setShowTooltip(true);
        }
      } catch (err) {
        // Range 에러 방어
        console.error('Selection range error:', err);
      }
    } else {
      setShowTooltip(false);
    }
  };

  const requestSentenceExplanation = async () => {
    if (!selectedText) return;
    setShowTooltip(false);
    setIsLoadingExplanation(true);
    setShowExplainModal(true);
    setActiveExplanation(null);

    try {
      const res = await fetch('/api/coaching/explain-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: selectedText })
      });
      const result = await res.json();
      if (result.success && result.explanation) {
        setActiveExplanation(result.explanation);
      } else {
        setActiveExplanation("마음의 주파수가 잠시 엇갈렸나 봐요. 문장을 조금만 다르게 드래그하여 다시 물어봐 주시면 정성껏 해설해 드릴게요. ✨");
      }
    } catch (error) {
      console.error('[Drag Explain Error]:', error);
      setActiveExplanation("지혜의 통로가 잠시 먹통이 되었어요. 다시 한번 편안하게 시도해 주세요. 🌌");
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full"
      onMouseUp={handleTextSelection}
      onTouchEnd={handleTextSelection}
    >
      {/* 실제 컴포넌트 내용물 렌더링 */}
      {children}

      {/* 💡 드래그 영역 위에 뜰 영롱한 툴팁 */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onMouseDown={(e) => e.stopPropagation()} // 툴팁 영역 클릭 시 전역 mousedown에 의해 지워지는 버그 방어
            style={{ 
              position: 'absolute',
              top: tooltipPos.y, 
              left: tooltipPos.x, 
              transform: 'translateX(-50%)',
              zIndex: 50
            }}
            className="cursor-pointer"
          >
            <button
              onClick={requestSentenceExplanation}
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 border border-cyan-400/50 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
              이 문장 쉽게 해설받기 💡
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌌 AI 드래그 문장 해설 오버레이 글래스모피즘 모달 */}
      <AnimatePresence>
        {showExplainModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 60 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowExplainModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="bg-slate-900/95 border border-cyan-500/20 rounded-[2rem] p-6 w-full max-w-md shadow-2xl relative overflow-hidden text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-cyan-900/20 blur-[80px] rounded-full animate-pulse" />
              </div>

              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3 relative z-10">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-cyan-400 font-mono tracking-wider uppercase">Myeongsim AI Text Interpreter</span>
                </div>
                <button
                  onClick={() => setShowExplainModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5 bg-white/5 backdrop-blur-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mb-5 relative z-10">
                <p className="text-[10px] text-slate-500 font-bold mb-1.5">내가 선택한 문장</p>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 text-xs text-slate-300 italic leading-relaxed break-keep">
                  "{selectedText}"
                </div>
              </div>

              <div className="relative z-10 min-h-[140px] flex flex-col justify-center">
                {isLoadingExplanation ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-cyan-400 text-xs font-mono animate-pulse">인공지능이 문장에 숨겨진 우주적 사랑을 해석하고 있어요...</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] text-cyan-400 font-bold mb-2">🌿 다정한 명심 해설 풀이</p>
                    <p className="text-[13px] text-slate-200 leading-relaxed font-medium break-keep whitespace-pre-wrap">
                      {activeExplanation}
                    </p>
                  </div>
                )}
              </div>

              {!isLoadingExplanation && (
                <button
                  onClick={() => setShowExplainModal(false)}
                  className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs py-4 rounded-xl shadow-lg transition-all relative z-10"
                >
                  네, 따뜻한 위로와 지혜를 안고 갑니다 ✨
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
