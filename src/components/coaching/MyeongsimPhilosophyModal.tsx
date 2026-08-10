'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Cpu, PiggyBank, RefreshCw, Brain, HeartPulse, ShieldCheck, Star } from 'lucide-react';

interface MyeongsimPhilosophyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export default function MyeongsimPhilosophyModal({ isOpen, onClose, userName = '이경윤' }: MyeongsimPhilosophyModalProps) {
  if (!isOpen) return null;

  const coreStrengths = [
    {
      id: 1,
      icon: Cpu,
      color: 'from-amber-400 to-yellow-500',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-950/30',
      iconBg: 'bg-amber-500/20 text-amber-300',
      tag: '01 // 정밀 만세력 엔진',
      title: 'AI 한계를 뛰어넘은 100% 정밀 만세력 계산',
      desc: '일반 인공지능이 계산하지 못하는 정밀 만세력 8자 성도(星圖) 및 절기 시각을 100% 정확하게 산출하도록 특수 아키텍처로 전면 시스템화하였습니다.',
    },
    {
      id: 2,
      icon: PiggyBank,
      color: 'from-emerald-400 to-teal-500',
      borderColor: 'border-emerald-500/40',
      bgColor: 'bg-emerald-950/30',
      iconBg: 'bg-emerald-500/20 text-emerald-300',
      tag: '02 // 1/10 비용 혁신',
      title: '시중 상담 대비 10분의 1 가격의 대중화',
      desc: '시중 상담 비용의 10분의 1 가격으로 문턱을 낮추어, 경제적 부담 없이 누구나 이미 완벽한 본래의 자아(Self)를 발견할 수 있도록 설계하였습니다.',
    },
    {
      id: 3,
      icon: RefreshCw,
      color: 'from-cyan-400 to-blue-500',
      borderColor: 'border-cyan-500/40',
      bgColor: 'bg-cyan-950/30',
      iconBg: 'bg-cyan-500/20 text-cyan-300',
      tag: '03 // 매일 새로워지는 콘텐츠',
      title: '고정된 틀을 깬 매일매일 다이내믹 콘텐츠',
      desc: '늘 똑같은 상투적 운세 문구가 아닌, 사주일진과 일일 바이오리듬에 맞추어 매일매일 새로운 자각 퀘스트와 영감을 추구합니다.',
    },
    {
      id: 4,
      icon: Brain,
      color: 'from-purple-400 to-indigo-500',
      borderColor: 'border-purple-500/40',
      bgColor: 'bg-purple-950/30',
      iconBg: 'bg-purple-500/20 text-purple-300',
      tag: '04 // 제3세대 과학 심리학',
      title: '미신 탈피! 제3세대 최신 심리학 과학 융합',
      desc: '단순 미신이나 막연한 운세가 아닌, ACT(수용전념코칭)·CBT(인지행동코칭) 등 제3세대 최신 과학 심리학 도구와 정밀 융합하여 실생활에 즉각 도움이 되도록 하였습니다.',
    },
    {
      id: 5,
      icon: HeartPulse,
      color: 'from-rose-400 to-pink-500',
      borderColor: 'border-rose-500/40',
      bgColor: 'bg-rose-950/30',
      iconBg: 'bg-rose-500/20 text-rose-300',
      tag: '05 // 긍정 뉴럴 재배선',
      title: '무의식 심리 치유 & 새로운 긍정 뉴럴 신경계 형성',
      desc: '매일매일 들어와 1분 질문에 답하는 인터랙션만으로도 무의식적 마음 치유가 일어나며, 뇌에 긍정적인 새로운 뇌 신경망(Neural Circuit)을 재배선해 나갑니다.',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[50000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-hidden font-sans text-left">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl bg-slate-950/95 border-2 border-amber-500/40 rounded-[32px] p-6 sm:p-8 shadow-[0_0_80px_rgba(245,158,11,0.25)] relative overflow-hidden text-white max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Background Ambient Neon Radial Glows */}
          <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-amber-500/15 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-500/15 rounded-full blur-[90px] pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-all z-30"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="text-center space-y-3 mb-8 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-pulse">
              <Sparkles size={14} className="text-amber-400" />
              명심코칭(明心) 5대 핵심 가치 & 혁신 비전
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 font-serif">
              왜 명심코칭인가?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              오직 <strong className="text-amber-300 font-bold">{userName}님</strong>의 완벽한 본래의 빛을 일깨우기 위해 설계된 5가지 독보적 시스템과 가치를 소개합니다.
            </p>
          </div>

          {/* 5대 강점 럭셔리 카드 리스트 */}
          <div className="space-y-4 relative z-10">
            {coreStrengths.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.015, x: 4 }}
                  className={`p-4 sm:p-5 rounded-2xl ${item.bgColor} border ${item.borderColor} transition-all duration-300 shadow-lg relative overflow-hidden group`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${item.iconBg} border border-white/10 shrink-0 group-hover:scale-110 transition-transform shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400">
                          {item.tag}
                        </span>
                        <span className="text-xs font-black text-amber-400/80 font-mono">
                          VALUE #{item.id}
                        </span>
                      </div>
                      <h3 className={`text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r ${item.color} font-serif`}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed break-keep">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 하단 감동 감사 메시지 */}
          <div className="mt-8 pt-6 border-t border-amber-500/20 text-center relative z-10 space-y-3">
            <p className="text-xs sm:text-sm text-amber-200 font-serif leading-relaxed italic">
              "이미 완벽한 당신의 본래 빛을 발견하고, 매일 긍정적인 삶의 주권을 회복하세요."
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-bold text-slate-400 font-mono">명심코칭 마스터 아키텍트 올림</span>
              <span className="text-amber-400 font-bold">감사합니다. 🙏</span>
            </div>
            <button
              onClick={onClose}
              className="mt-4 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              ✨ 명심코칭과 함께 완벽한 나 발견하기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
