'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface CoreFeature {
  name: string;
  description: string;
  derivedFrom: string;
}

interface MicroRoadmapStep {
  step: number;
  actionName: string;
  estimatedMinutes: number;
}

interface DarkCodeShield {
  riskPattern: string;
  defenseProtocol: string;
}

interface Blueprint {
  projectTitle: string;
  oneLineHypothesis: string;
  backgroundContext: string;
  coreFeatures: CoreFeature[];
  darkCodeShield: DarkCodeShield;
  microRoadmapNextWeek: MicroRoadmapStep[];
  aiArchitectFeedback: string;
}

export default function WeeklySparkBlueprint() {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlueprint = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/synthesize-spark-memos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success && data.blueprint) {
        setBlueprint(data.blueprint);
      } else {
        setError(data.error || '청사진 합성에 실패했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlueprint();
  }, [fetchBlueprint]);

  const cardStyle: React.CSSProperties = {
    background: 'rgba(15, 23, 42, 0.7)',
    border: '1px solid #1e293b',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    marginBottom: '1rem',
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: '#64748b',
    marginBottom: '0.75rem',
  };

  if (loading) {
    return (
      <div
        style={{
          background: '#090d16',
          borderRadius: '1.5rem',
          padding: '3rem 2rem',
          textAlign: 'center',
          fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
          maxWidth: '640px',
          width: '100%',
        }}
      >
        <div
          style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            animation: 'bpPulse 2s ease-in-out infinite',
          }}
        >
          🔮
        </div>
        <p
          style={{
            color: '#94a3b8',
            fontSize: '0.9rem',
            lineHeight: 1.6,
          }}
        >
          AI가 이번 주 메모를 프로젝트 기획서로
          <br />
          합성하고 있습니다...
        </p>
        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '0.35rem',
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#6366f1',
                animation: `bpDot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes bpPulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
          }
          @keyframes bpDot {
            0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: '#090d16',
          borderRadius: '1.5rem',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
          maxWidth: '640px',
          width: '100%',
        }}
      >
        <p style={{ color: '#f87171', fontSize: '0.9rem' }}>⚠️ {error}</p>
        <button
          onClick={fetchBlueprint}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '0.75rem',
            border: '1px solid #334155',
            background: '#1e293b',
            color: '#e2e8f0',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!blueprint) return null;

  return (
    <div
      style={{
        background: '#090d16',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
        maxWidth: '640px',
        width: '100%',
        color: '#e2e8f0',
      }}
    >
      {/* 프로젝트 타이틀 배너 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #312e81 0%, #0f766e 100%)',
          borderRadius: '1.25rem',
          padding: '1.5rem 1.75rem',
          marginBottom: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '120px',
            height: '120px',
            background:
              'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(30%, -30%)',
          }}
        />
        <span
          style={{
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.1em',
            fontWeight: 500,
          }}
        >
          📐 이번 주 프로젝트 청사진
        </span>
        <h2
          style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            marginTop: '0.5rem',
            marginBottom: '0.5rem',
            color: '#fff',
            lineHeight: 1.3,
          }}
        >
          {blueprint.projectTitle}
        </h2>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.5,
          }}
        >
          {blueprint.oneLineHypothesis}
        </p>
      </div>

      {/* 배경 컨텍스트 */}
      {blueprint.backgroundContext && (
        <div style={cardStyle}>
          <div style={sectionTitle}>🧬 배경 컨텍스트</div>
          <p
            style={{
              color: '#cbd5e1',
              fontSize: '0.825rem',
              lineHeight: 1.65,
            }}
          >
            {blueprint.backgroundContext}
          </p>
        </div>
      )}

      {/* 핵심 기능 리스트 */}
      <div style={cardStyle}>
        <div style={sectionTitle}>🔧 핵심 기능</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {blueprint.coreFeatures.map((feature, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '0.75rem',
                padding: '0.875rem 1rem',
                borderLeft: '3px solid #6366f1',
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: '#e2e8f0',
                  marginBottom: '0.25rem',
                }}
              >
                {feature.name}
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                }}
              >
                {feature.description}
              </div>
              {feature.derivedFrom && (
                <div
                  style={{
                    marginTop: '0.375rem',
                    fontSize: '0.7rem',
                    color: '#6366f1',
                    fontStyle: 'italic',
                  }}
                >
                  📌 메모 출처: {feature.derivedFrom}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 다크코드 쉴드 (amber 경고 카드) */}
      <div
        style={{
          ...cardStyle,
          background: 'rgba(120, 53, 15, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        }}
      >
        <div style={{ ...sectionTitle, color: '#f59e0b' }}>
          🛡️ 다크코드 쉴드
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <span
            style={{
              fontSize: '0.7rem',
              color: '#fbbf24',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            위험 패턴
          </span>
          <p
            style={{
              color: '#fcd34d',
              fontSize: '0.825rem',
              lineHeight: 1.55,
              marginTop: '0.25rem',
            }}
          >
            {blueprint.darkCodeShield.riskPattern}
          </p>
        </div>
        <div>
          <span
            style={{
              fontSize: '0.7rem',
              color: '#34d399',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            방어 프로토콜
          </span>
          <p
            style={{
              color: '#a7f3d0',
              fontSize: '0.825rem',
              lineHeight: 1.55,
              marginTop: '0.25rem',
            }}
          >
            {blueprint.darkCodeShield.defenseProtocol}
          </p>
        </div>
      </div>

      {/* 3-Step 마이크로 로드맵 */}
      <div style={cardStyle}>
        <div style={sectionTitle}>🗺️ 마이크로 로드맵 (3단계)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {blueprint.microRoadmapNextWeek.map((step) => (
            <div
              key={step.step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
              }}
            >
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #0d9488)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {step.step}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '0.825rem',
                    color: '#e2e8f0',
                  }}
                >
                  {step.actionName}
                </div>
              </div>
              <span
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: '#a5b4fc',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {step.estimatedMinutes}분
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI 아키텍트 피드백 */}
      <div
        style={{
          ...cardStyle,
          background:
            'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(13,148,136,0.08) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.2)',
        }}
      >
        <div style={sectionTitle}>🤖 AI 아키텍트 피드백</div>
        <blockquote
          style={{
            margin: 0,
            padding: '0.75rem 1rem',
            borderLeft: '3px solid #6366f1',
            color: '#cbd5e1',
            fontSize: '0.85rem',
            lineHeight: 1.65,
            fontStyle: 'italic',
          }}
        >
          &ldquo;{blueprint.aiArchitectFeedback}&rdquo;
        </blockquote>
      </div>

      {/* 재합성 버튼 */}
      <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
        <button
          onClick={fetchBlueprint}
          style={{
            padding: '0.625rem 1.75rem',
            borderRadius: '0.75rem',
            border: '1px solid #4f46e5',
            background: 'rgba(79, 70, 229, 0.12)',
            color: '#a5b4fc',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(79, 70, 229, 0.25)';
            e.currentTarget.style.color = '#c7d2fe';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(79, 70, 229, 0.12)';
            e.currentTarget.style.color = '#a5b4fc';
          }}
        >
          🔮 청사진 재합성
        </button>
      </div>
    </div>
  );
}
