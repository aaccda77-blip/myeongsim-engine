'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, ShieldAlert, ArrowRight, CheckCircle2, RefreshCw, Zap } from 'lucide-react';
import Link from 'next/link';

// === [PLACEHOLDER DATA] ===
// TODO: Replace with real AI result fetch logic from API / DB when available
const SAMPLE_MOCK_DATA = {
  id: 'sample-demo-01',
  userName: '이경윤 대표님',
  birthDate: '1988년 07월 24일',
  sajuPillars: {
    year: '戊辰 (무진년)',
    month: '己未 (기미월)',
    day: '辛巳 (신사일)',
    time: '乙未 (을미시)'
  },
  // 1. 무료 공개 데이터 (PLAN: 무료 샘플에서 보여줄 데이터)
  freeContent: {
    title: '타고난 본질 자아 기질 분석',
    summary: '정교하고 섬세한 신금(辛金) 일주로서, 겉으로는 정갈하고 보석처럼 빛나지만 내면에는 무서운 집념과 시스템 설계 능력을 품고 계십니다.',
    traits: [
      { tag: '핵심 기질', desc: '불필요한 군더더기를 덜어내고 본질을 꿰뚫어 보는 정교함' },
      { tag: '내면의 뼈대', desc: '외부 시련에 쉽게 무너지지 않는 외유내강의 강력한 돌파력' },
      { tag: '조직 메커니즘', desc: '단순 노동이 아닌 자신만의 공식 규범과 브랜딩 시스템 구축' }
    ]
  },
  // 2. 유료 잠금 데이터 (PLAN: 유료에서만 주는 데이터 - Blur/자물쇠/일부 가림 처리)
  lockedContent: {
    darkCodeCount: 3,
    darkCodes: [
      {
        codeName: '완벽주의 관리자 트랩 (辛+巳)',
        description: '작은 실수도 용납하지 못해 스스로의 신경망 베이스라인에 과부하를 거는 다크 패턴',
        remedy: 'IFS 자비중심 수용 치료 프로토콜로 내면 관리자 파트 설득하기'
      },
      {
        codeName: '과반추(Over-rumination) 피드백 루프 (未土 편인)',
        description: '지나간 결정이나 타인의 말을 꼬리에 꼬리를 물고 반추하며 에너지를 고갈시키는 습관',
        remedy: 'MBCT 탈중심화(Defusion) 마음챙김으로 생각 관조하기'
      },
      {
        codeName: '2026년 丙午년 운명 파동 핀포인트',
        description: '올해 巳午未 화국이 형성되며 다크 코드가 재발할 수 있는 결정적 시점 및 해독 일자',
        remedy: '마인드플로우 64키 정밀 해독서 참조'
      }
    ]
  }
};

export default function SampleResultPage() {
  const params = useParams();
  const router = useRouter();
  const sampleId = params?.id || 'demo';

  // 3. completed / pending 상태 관리 (PLAN 요구사항 반영)
  const [status, setStatus] = useState<'pending' | 'completed'>('pending');
  const [data, setData] = useState<typeof SAMPLE_MOCK_DATA | null>(null);

  useEffect(() => {
    // Simulate AI loading scan step for demo
    const timer = setTimeout(() => {
      setData(SAMPLE_MOCK_DATA);
      setStatus('completed');
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-900/20 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-amber-900/10 blur-[150px] pointer-events-none rounded-full" />

      <main className="w-full max-w-2xl mx-auto z-10 space-y-6">
        {/* Top Branding Header */}
        <div className="text-center space-y-2 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Sparkles size={14} />
            <span>MYEONGSIM MASTER CORE — 무료 맛보기 리포트</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            내면 심리 & 사주 진단 맛보기
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {data?.userName || '수검자 님'}을 위해 준비된 1차 무료 분석 데이터입니다.
          </p>
        </div>

        {/* Status: PENDING State UI */}
        <AnimatePresence mode="wait">
          {status === 'pending' ? (
            <motion.div
              key="pending"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center space-y-4 backdrop-blur-xl shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400 animate-spin">
                <RefreshCw size={28} />
              </div>
              <h3 className="text-lg font-bold text-white">
                수검자님의 타고난 명식 & 심리 패턴 스캔 중...
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                3세대 인지행동 프로토콜과 만세력 천문 데이터를 대조하여 맞춤형 무료 샘플을 생성하고 있습니다.
              </p>
            </motion.div>
          ) : (
            /* Status: COMPLETED State UI */
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* SECTION 1: FREE DATA (PLAN: 무료 샘플에서 보여줄 데이터만 노출) */}
              <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Zap size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">1. 무료 진단 브리핑</h2>
                      <p className="text-[11px] text-emerald-400 font-medium">무료 공개 영역</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2.5 py-1 rounded-full border border-slate-700">
                    {data?.sajuPillars.day}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-amber-300">
                    ✨ {data?.freeContent.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                    {data?.freeContent.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {data?.freeContent.traits.map((t, idx) => (
                    <div key={idx} className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
                      <span className="text-[10px] text-indigo-400 font-bold tracking-wider uppercase block">
                        [{t.tag}]
                      </span>
                      <p className="text-xs text-slate-300 leading-snug">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 2: LOCKED PREMIUM DATA (PLAN: 유료에서만 주는 데이터 - Blur/자물쇠/일부 가림 처리) */}
              <section className="relative rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl">
                {/* 🔒 Blurred Background Content */}
                <div className="filter blur-md opacity-25 select-none pointer-events-none p-6 sm:p-7 bg-slate-900/90 space-y-6">
                  <div className="flex items-center gap-2 text-amber-400">
                    <ShieldAlert size={20} />
                    <h2 className="text-base font-bold">2. 3대 다크코드 핀포인트 해독서 (잠김)</h2>
                  </div>

                  <div className="space-y-4">
                    {data?.lockedContent.darkCodes.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <h4 className="text-sm font-bold text-amber-300">🔒 {item.codeName}</h4>
                        <p className="text-xs text-slate-400">{item.description}</p>
                        <div className="text-xs text-emerald-400 bg-slate-900 p-2 rounded-xl">
                          처방: {item.remedy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 🔒 Paywall Lock Overlay Container (design.md 스타일 적용) */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-slate-950 via-slate-950/95 to-slate-900/90 text-center backdrop-blur-md">
                  <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 mb-3 shadow-[0_0_30px_rgba(245,158,11,0.35)] animate-pulse">
                    <Lock size={26} />
                  </div>

                  {/* BRIEF 여정 3) 궁금증 유발 문구 */}
                  <h3 className="text-base sm:text-lg font-black text-amber-300 mb-2">
                    🔒 당신의 사주에 숨겨진 3대 다크코드 해독서가 잠겨 있습니다.
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md leading-relaxed mb-6">
                    현재 겪고 계신 완벽주의 자책감과 과부하의 <strong>진짜 근본 원인 3가지와 년도별 운명 파동 해독 처방전</strong>은 프리미엄 리포트에서 즉시 확인하실 수 있습니다.
                  </p>

                  {/* BRIEF 여정 3) 유료 전환 CTA (로그인/결제 흐름 다음 STEP 연동 TODO) */}
                  <div className="w-full max-w-md space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        // TODO: Connect to real Login / Checkout Payment flow (다음 STEP)
                        alert('🔒 결제 및 승인 요청 모듈로 연결됩니다. (TODO: 결제 로직 연동)');
                      }}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-2xl text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 transition-all transform active:scale-98"
                    >
                      <span>🔒 890원으로 전체 내면 해독서 즉시 잠금 해제하기</span>
                      <ArrowRight size={18} />
                    </button>

                    <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-amber-400" /> 관리자 1:1 승인 지원
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-amber-400" /> 영구 평생 보관 가능
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bottom Nav Link */}
              <div className="text-center pt-2">
                <Link
                  href="/master-core"
                  className="text-xs text-slate-400 hover:text-amber-300 underline underline-offset-4 transition-colors"
                >
                  ← 명심 마스터 코어 메인으로 돌아가기
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
