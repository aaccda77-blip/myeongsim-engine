'use client';

import React, { useState } from 'react';

/* ── 주역 64괘 데이터 ── */
const STAGES = [
  {
    title: '1단계 · 본질 각성',
    emoji: '🔮',
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    tagColor: 'bg-emerald-500/20 text-emerald-300',
    cards: [
      { code: '53.1', name: '풍산점(風山漸)', meaning: '점진적 성장의 지혜 — 급하지 않게, 뿌리부터 단단히', keywords: ['점진', '인내', '기초'] },
      { code: '54.1', name: '뇌택귀매(雷澤歸妹)', meaning: '관계 속 진짜 역할을 찾는 여정', keywords: ['관계', '역할', '전환'] },
      { code: '51.3', name: '중뢰진(重雷震)', meaning: '충격 속에서 깨어나는 각성의 번개', keywords: ['각성', '충격', '재탄생'] },
      { code: '57.3', name: '손위풍(巽爲風)', meaning: '바람처럼 스며드는 부드러운 영향력', keywords: ['침투', '부드러움', '영향력'] },
    ],
  },
  {
    title: '2단계 · 심신 공명',
    emoji: '💎',
    color: 'from-violet-500/20 to-purple-500/20',
    borderColor: 'border-violet-500/30',
    tagColor: 'bg-violet-500/20 text-violet-300',
    cards: [
      { code: '11.6', name: '지천태(地天泰)', meaning: '하늘과 땅이 소통하는 최고의 평화', keywords: ['태평', '소통', '조화'] },
      { code: '35.6', name: '화지진(火地晉)', meaning: '태양이 대지 위로 떠오르는 약진', keywords: ['전진', '승진', '밝음'] },
      { code: '6.6', name: '천수송(天水訟)', meaning: '갈등을 지혜로 풀어내는 해결의 기술', keywords: ['해결', '지혜', '중재'] },
      { code: '40.2', name: '뇌수해(雷水解)', meaning: '얽힌 매듭이 풀리는 해방의 순간', keywords: ['해방', '이완', '자유'] },
    ],
  },
  {
    title: '3단계 · 천명 번영',
    emoji: '👑',
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/30',
    tagColor: 'bg-amber-500/20 text-amber-300',
    cards: [
      { code: '29.2', name: '중수감(重水坎)', meaning: '깊은 물을 두 번 건너는 담대한 용기', keywords: ['용기', '위험', '돌파'] },
      { code: '59.1', name: '풍수환(風水渙)', meaning: '막힌 기운을 흩어 새 흐름을 여는 힘', keywords: ['분산', '해소', '새흐름'] },
      { code: '53.1', name: '풍산점(風山漸)', meaning: '다시 한번, 점진적 완성의 순환', keywords: ['순환', '완성', '재시작'] },
      { code: '40.2', name: '뇌수해(雷水解)', meaning: '최종 해방 — 모든 속박으로부터의 자유', keywords: ['최종해방', '완결', '자유'] },
    ],
  },
];

const TABS = ['당신의 본질', '천명 연금술 경로', '명심 64 뉴럴코드', '십성 · 12운성'];

/* ── AI Deep Reading 팝업 ── */
function AlchemicalModal({ card, stage, onClose }: { card: typeof STAGES[0]['cards'][0]; stage: typeof STAGES[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div className="relative w-full max-w-lg bg-[#0a0f1e] border border-emerald-500/30 rounded-3xl p-6 space-y-5 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white text-xl">✕</button>
        <div className="text-center space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs tracking-widest">AI DEEP ALCHEMICAL READING</div>
          <h2 className="text-2xl font-bold text-white">{card.code} {card.name}</h2>
          <div className="text-sm text-white/50">{stage.title}</div>
        </div>
        <div className="space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="text-xs text-emerald-400 tracking-wider mb-2">괘의 본질</div>
            <p className="text-white/80 text-sm leading-relaxed">{card.meaning}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="text-xs text-violet-400 tracking-wider mb-2">사주 원국 1:1 맞춤 정합성</div>
            <p className="text-white/80 text-sm leading-relaxed">신금(辛金) 일간이 미월(未月)에 태어난 당신의 원국과 이 괘의 에너지는 깊이 공명합니다. 금(金)의 예리한 판단력과 {card.name}의 지혜가 결합하여 당신만의 고유한 생존 전략을 형성합니다.</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-amber-500/20">
            <div className="text-xs text-amber-400 tracking-wider mb-2">다크코드 · 뉴럴 · 메타코드</div>
            <p className="text-white/80 text-sm leading-relaxed">이 괘가 역위치(逆位置)로 나타날 때의 그림자 패턴을 인식하세요. 과도한 완벽주의나 타인의 시선에 대한 과민반응이 {card.keywords[0]}의 에너지를 차단할 수 있습니다.</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {card.keywords.map(kw => (
              <div key={kw} className="text-center py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/60">#{kw}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 메인 페이지 ── */
export default function SoulArchivePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCard, setSelectedCard] = useState<{ card: typeof STAGES[0]['cards'][0]; stage: typeof STAGES[0] } | null>(null);

  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      {selectedCard && (
        <AlchemicalModal card={selectedCard.card} stage={selectedCard.stage} onClose={() => setSelectedCard(null)} />
      )}

      {/* ── 헤더 ── */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-transparent to-transparent" />
        <div className="relative max-w-2xl mx-auto px-6 pt-12 pb-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] text-emerald-300 font-medium">MYEONGSIM SOUL VAULT · 2026 OFFICIAL ARCHIVE</span>
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] tracking-widest border border-amber-500/30">
            80P VIP REPORT
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
            소울 아카이브
          </h1>
          <div className="space-y-1">
            <p className="text-lg text-white/90 font-medium">강미숙 님</p>
            <p className="text-sm text-white/50">신 (금) · 신사(辛巳)일주 · 未月 | 1972-06-20</p>
          </div>
        </div>
      </header>

      {/* ── 탭 네비게이션 ── */}
      <nav className="max-w-2xl mx-auto px-4">
        <div className="flex gap-1 p-1 bg-white/5 rounded-2xl overflow-x-auto">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex-1 min-w-fit px-3 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === i
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* ── 콘텐츠 영역 ── */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {activeTab === 0 && (
          <>
            {STAGES.map((stage) => (
              <section key={stage.title} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stage.emoji}</span>
                  <h2 className="text-lg font-bold text-white/90">{stage.title}</h2>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {stage.cards.map((card) => (
                    <button
                      key={`${stage.title}-${card.code}`}
                      onClick={() => setSelectedCard({ card, stage })}
                      className={`w-full text-left p-4 rounded-2xl bg-gradient-to-br ${stage.color} border ${stage.borderColor} hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${stage.tagColor}`}>{card.code}</span>
                            <span className="text-sm font-bold text-white/90">{card.name}</span>
                          </div>
                          <p className="text-xs text-white/60 leading-relaxed">{card.meaning}</p>
                          <div className="flex gap-1.5 flex-wrap">
                            {card.keywords.map(kw => (
                              <span key={kw} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-white/40">#{kw}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-white/20 text-lg ml-2">→</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}

        {activeTab === 1 && (
          <div className="space-y-6">
            <div className="text-center py-12 space-y-4">
              <div className="text-5xl">🧬</div>
              <h3 className="text-xl font-bold text-white/90">천명 연금술 경로</h3>
              <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">당신의 사주 원국에 새겨진 천명(天命)의 연금술 지도입니다. 금(金)의 기운이 어떻게 변환되어 당신만의 고유한 성공 경로를 형성하는지 보여줍니다.</p>
              <div className="flex justify-center gap-3 pt-4">
                {['기(氣) 순환', '운(運) 흐름', '명(命) 설계'].map(item => (
                  <div key={item} className="px-4 py-3 rounded-2xl bg-white/5 border border-violet-500/20 text-sm text-violet-300">{item}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="text-center py-12 space-y-4">
              <div className="text-5xl">🔮</div>
              <h3 className="text-xl font-bold text-white/90">명심 64 뉴럴코드</h3>
              <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">주역 64괘 중 당신의 의식 구조와 공명하는 핵심 뉴럴코드입니다. 각 코드는 당신의 무의식 패턴과 잠재력의 열쇠를 담고 있습니다.</p>
            </div>
          </div>
        )}

        {activeTab === 3 && (
          <div className="space-y-6">
            <div className="text-center py-12 space-y-4">
              <div className="text-5xl">⭐</div>
              <h3 className="text-xl font-bold text-white/90">십성 · 12운성</h3>
              <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">십성(十星)과 12운성이 밝히는 당신의 관계 역학, 재물 흐름, 직업 적성, 그리고 생명 에너지의 순환 주기입니다.</p>
            </div>
          </div>
        )}
      </main>

      {/* ── 푸터 ── */}
      <footer className="max-w-2xl mx-auto px-6 py-8 text-center border-t border-white/5">
        <p className="text-[10px] text-white/20 tracking-widest">MYEONGSIM COACHING · SOUL VAULT · 2026</p>
      </footer>
    </div>
  );
}
