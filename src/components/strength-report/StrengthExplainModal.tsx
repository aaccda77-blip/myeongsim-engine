'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';

// ─── Types ─────────────────────────────────────────────
export interface StrengthExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'forceField' | 'talentProfile' | 'cooperation' | 'powerbase' | 'specificTalent';
  itemKey: string;
  itemLabel: string;
  itemValue: number;
}

// 섹션 이모지 프리픽스 상수
const SECTION_EMOJIS = ['🌟', '🌿', '🔍', '💡', '✨'] as const;

// 카테고리 한글 매핑
const CATEGORY_LABELS: Record<StrengthExplainModalProps['category'], string> = {
  forceField: '에너지 포스필드',
  talentProfile: '재능 프로필',
  cooperation: '협력 시너지',
  powerbase: '파워베이스',
  specificTalent: '특수 재능',
};

// ─── 이모지 그래디언트 색상 매핑 ──────────────────────
const EMOJI_GRADIENT_MAP: Record<string, string> = {
  '🌟': 'from-amber-400 to-orange-500',
  '🌿': 'from-emerald-400 to-teal-500',
  '🔍': 'from-blue-400 to-indigo-500',
  '💡': 'from-yellow-300 to-amber-500',
  '✨': 'from-purple-400 to-pink-500',
};

// ─── 텍스트 파싱 ─────────────────────────────────────
interface ParsedSection {
  emoji: string;
  title: string;
  lines: string[];
}

function parseExplanation(text: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;

  const rawLines = text.split('\n');

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // 이모지 섹션 헤더 감지
    const matchedEmoji = SECTION_EMOJIS.find((e) => trimmed.startsWith(e));

    if (matchedEmoji) {
      // 이전 섹션 저장
      if (currentSection) sections.push(currentSection);

      // 새 섹션 시작 — 이모지 제거 후 제목 추출
      const titleText = trimmed.slice(matchedEmoji.length).replace(/^[\s:：-]+/, '').trim();
      currentSection = {
        emoji: matchedEmoji,
        title: titleText,
        lines: [],
      };
    } else if (currentSection) {
      currentSection.lines.push(trimmed);
    } else {
      // 이모지 없는 첫 텍스트 → 기본 섹션으로 추가
      currentSection = { emoji: '✨', title: '', lines: [trimmed] };
    }
  }

  if (currentSection) sections.push(currentSection);

  return sections;
}

// ─── 사주 기둥 변환 ────────────────────────────────────
function extractSajuPillars(reportData: ReturnType<typeof useReportStore.getState>['reportData']): string {
  if (!reportData?.saju?.fourPillars) return '';

  const { year, month, day, time } = reportData.saju.fourPillars;
  const pillars = [year, month, day, time];

  return pillars
    .map((p) => `${p.gan}${p.ji}`)
    .join(' ');
}

// ─── 로딩 스피너 ──────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      {/* Orbital spinner */}
      <div className="relative w-16 h-16">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-white/20"
            style={{ borderTopColor: i === 0 ? '#F59E0B' : i === 1 ? '#8B5CF6' : '#3B82F6' }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5 + i * 0.4,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 backdrop-blur-sm" />
      </div>
      <motion.p
        className="text-sm text-gray-400"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        AI가 분석 중입니다...
      </motion.p>
    </div>
  );
}

// ─── 메인 모달 컴포넌트 ─────────────────────────────────
export default function StrengthExplainModal({
  isOpen,
  onClose,
  category,
  itemKey,
  itemLabel,
  itemValue,
}: StrengthExplainModalProps) {
  const { reportData } = useReportStore();

  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── API 호출 ─────────────────────────────────────
  const fetchExplanation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setExplanation('');

    const userName = reportData?.userName || '명심가';
    const sajuPillars = extractSajuPillars(reportData);

    try {
      const res = await fetch('/api/coaching/strength-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          itemKey,
          itemLabel,
          itemValue,
          userName,
          sajuPillars,
        }),
      });

      if (!res.ok) {
        throw new Error(`서버 오류 (${res.status})`);
      }

      const data = await res.json();
      setExplanation(data.explanation || data.message || '설명을 불러올 수 없습니다.');
    } catch (err: any) {
      setError(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [category, itemKey, itemLabel, itemValue, reportData]);

  // isOpen → fetch
  useEffect(() => {
    if (isOpen) {
      fetchExplanation();
    }
    return () => {
      // cleanup on close
      if (!isOpen) {
        setExplanation('');
        setError(null);
      }
    };
  }, [isOpen, fetchExplanation]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // 파싱된 섹션
  const sections = explanation ? parseExplanation(explanation) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ─── Backdrop ───────────────────────────── */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* ─── Modal Card ─────────────────────────── */}
          <motion.div
            className="relative w-full max-w-[420px] max-h-[85vh] overflow-y-auto bg-black/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl shadow-black/50"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            // 모달 내부 클릭 시 backdrop close 방지
            onClick={(e) => e.stopPropagation()}
          >
            {/* ─── 데코레이티브 글로우 ───────────────── */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-amber-500/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[150px] h-[150px] bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />

            {/* ─── Close Button ──────────────────────── */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="닫기"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>

            {/* ─── Header ──────────────────────────── */}
            <div className="px-7 pt-7 pb-4">
              {/* 카테고리 뱃지 */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-400 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {CATEGORY_LABELS[category]}
              </div>

              {/* 제목 */}
              <h2 className="text-xl font-bold text-white leading-tight mb-1">
                {itemLabel}
              </h2>

              {/* 수치 표시 */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  {itemValue}
                </span>
                <span className="text-sm text-gray-500">/100</span>
              </div>
            </div>

            {/* ─── Divider ──────────────────────────── */}
            <div className="mx-7 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* ─── Content ──────────────────────────── */}
            <div className="px-7 py-5">
              {/* 로딩 상태 */}
              {isLoading && <LoadingSpinner />}

              {/* 에러 상태 */}
              {error && !isLoading && (
                <div className="flex flex-col items-center py-10 gap-3">
                  <span className="text-3xl">😔</span>
                  <p className="text-sm text-red-400 text-center">{error}</p>
                  <button
                    onClick={fetchExplanation}
                    className="mt-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                  >
                    다시 시도
                  </button>
                </div>
              )}

              {/* 설명 콘텐츠 */}
              {!isLoading && !error && sections.length > 0 && (
                <div className="space-y-5">
                  {sections.map((section, idx) => {
                    const gradient = EMOJI_GRADIENT_MAP[section.emoji] || 'from-gray-300 to-gray-500';

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.4 }}
                      >
                        {/* 섹션 헤더 */}
                        {section.title && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{section.emoji}</span>
                            <h3
                              className={`text-sm font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                            >
                              {section.title}
                            </h3>
                          </div>
                        )}

                        {/* 섹션 본문 */}
                        <div className="space-y-1.5">
                          {section.lines.map((line, lineIdx) => (
                            <p
                              key={lineIdx}
                              className="text-[13px] leading-relaxed text-gray-300/90"
                            >
                              {line}
                            </p>
                          ))}
                        </div>

                        {/* 섹션 구분선 (마지막 제외) */}
                        {idx < sections.length - 1 && (
                          <div className="mt-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ─── Footer ──────────────────────────── */}
            <div className="px-7 pb-6 pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
