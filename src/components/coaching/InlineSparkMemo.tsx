'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface InlineSparkMemoProps {
  onSaveComplete: (memo: {
    tag: string;
    text: string;
    createdAt: string;
  }) => void;
  onDismiss: () => void;
}

const QUICK_TAGS = [
  { id: 'idea', emoji: '💡', label: '아이디어' },
  { id: 'darkcode', emoji: '🛡️', label: '다크코드 포착' },
  { id: 'ignition', emoji: '🎯', label: '다음 시동' },
] as const;

type TagId = (typeof QUICK_TAGS)[number]['id'];

const MAX_LENGTH = 60;

/** 432Hz 차임을 Web Audio API로 재생 */
function playChime432Hz() {
  try {
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(432, ctx.currentTime);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.8);

    oscillator.onended = () => ctx.close();
  } catch {
    // Web Audio 미지원 환경에서는 무시
  }
}

export default function InlineSparkMemo({
  onSaveComplete,
  onDismiss,
}: InlineSparkMemoProps) {
  const [selectedTag, setSelectedTag] = useState<TagId>('idea');
  const [text, setText] = useState('');
  const [showCheck, setShowCheck] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 마운트 시 자동 포커스
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;

    playChime432Hz();
    setShowCheck(true);

    const tag = QUICK_TAGS.find((t) => t.id === selectedTag);
    const memo = {
      tag: tag ? `${tag.emoji} ${tag.label}` : selectedTag,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onSaveComplete(memo);
      setShowCheck(false);
      setText('');
    }, 900);
  }, [text, selectedTag, onSaveComplete]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        background: '#020617',
        border: '1px solid #1e293b',
        borderRadius: '1rem',
        padding: '1.25rem 1.5rem',
        maxWidth: '480px',
        width: '100%',
        fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 체크마크 오버레이 */}
      {showCheck && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(2, 6, 23, 0.92)',
            zIndex: 10,
            borderRadius: '1rem',
            animation: 'sparkFadeIn 0.25s ease-out',
          }}
        >
          <div
            style={{
              fontSize: '2.5rem',
              animation: 'sparkPop 0.5s ease-out',
            }}
          >
            ✅
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.875rem',
        }}
      >
        <span
          style={{
            color: '#94a3b8',
            fontSize: '0.8rem',
            letterSpacing: '0.04em',
          }}
        >
          ⚡ 스파크 메모
        </span>
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            fontSize: '1.1rem',
            padding: '0.25rem',
            lineHeight: 1,
          }}
          aria-label="닫기"
        >
          ✕
        </button>
      </div>

      {/* 퀵 태그 칩들 */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '0.875rem',
          flexWrap: 'wrap',
        }}
      >
        {QUICK_TAGS.map((tag) => {
          const isSelected = selectedTag === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                border: isSelected
                  ? '1.5px solid #2dd4bf'
                  : '1px solid #334155',
                background: isSelected
                  ? 'rgba(45, 212, 191, 0.1)'
                  : 'transparent',
                color: isSelected ? '#5eead4' : '#94a3b8',
                fontSize: '0.8rem',
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{tag.emoji}</span>
              {tag.label}
            </button>
          );
        })}
      </div>

      {/* 입력 필드 + 글자 수 카운터 */}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => {
            if (e.target.value.length <= MAX_LENGTH) {
              setText(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          maxLength={MAX_LENGTH}
          placeholder="10분 집중 후 떠오른 생각을 한 줄로..."
          style={{
            width: '100%',
            padding: '0.7rem 1rem',
            paddingRight: '4rem',
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '0.75rem',
            color: '#e2e8f0',
            fontSize: '0.875rem',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#2dd4bf';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#1e293b';
          }}
        />
        <span
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: text.length >= MAX_LENGTH ? '#f87171' : '#475569',
            fontSize: '0.7rem',
            fontVariantNumeric: 'tabular-nums',
            pointerEvents: 'none',
          }}
        >
          {text.length}/{MAX_LENGTH}
        </span>
      </div>

      {/* 하단 안내 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.625rem',
        }}
      >
        <span style={{ color: '#475569', fontSize: '0.7rem' }}>
          Enter로 저장
        </span>
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          style={{
            padding: '0.35rem 0.85rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: text.trim() ? '#0d9488' : '#1e293b',
            color: text.trim() ? '#f0fdfa' : '#475569',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: text.trim() ? 'pointer' : 'default',
            transition: 'all 0.2s',
          }}
        >
          저장
        </button>
      </div>

      {/* 애니메이션 키프레임 */}
      <style>{`
        @keyframes sparkFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sparkPop {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
