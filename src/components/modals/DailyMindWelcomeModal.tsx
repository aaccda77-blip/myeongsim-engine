'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Brain, CheckCircle2, Shield, Eye, RefreshCw, Zap, Award, Compass, ArrowDown } from 'lucide-react';

interface DailyMindWelcomeModalProps {
  onClose?: () => void;
}

export default function DailyMindWelcomeModal({ onClose }: DailyMindWelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. 하루에 1번만 띄우는 로컬 스토리지 검사
    const todayStr = new Date().toISOString().slice(0, 10);
    const hideDate = localStorage.getItem('myeongsim_daily_welcome_popup_hide_date');

    if (hideDate !== todayStr) {
      // 0.4초 후 감성적으로 팝업 렌더링
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  // 2. 상단 버튼 등에서 언제든 다시 열 수 있는 이벤트 리스너
  useEffect(() => {
    const handleOpenCustom = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-3code-manifesto', handleOpenCustom);
    return () => window.removeEventListener('open-3code-manifesto', handleOpenCustom);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleHideToday = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    localStorage.setItem('myeongsim_daily_welcome_popup_hide_date', todayStr);
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-xl bg-[#090d16] border-2 border-amber-500/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.25)] flex flex-col max-h-[90vh] select-none text-white font-sans"
        >
          {/* 오로라 광원 배경 효과 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
          </div>

          {/* 상단 특허 및 브랜딩 헤더 */}
          <div className="relative z-10 p-5 sm:p-6 pb-4 border-b border-white/10 bg-slate-900/80 backdrop-blur-md flex justify-between items-start shrink-0">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow">
                  ⚡
                </span>
                <span className="text-[11px] font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                  <span>🏛️ 특허출원 제10-2025-0166877호</span>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-200 pt-1">
                명심코칭 3-Code × 3S Protocol 선언문
              </h3>
              <p className="text-[11px] text-gray-400 font-medium">
                사주명리학을 자기성찰의 거울이자 브릿지로 활용하는 마스터 가이드
              </p>
            </div>
            
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10 cursor-pointer shrink-0"
              title="닫기"
            >
              <X size={18} />
            </button>
          </div>

          {/* 스크롤 가능한 본문 영역 */}
          <div className="relative z-10 p-5 sm:p-6 space-y-6 text-left text-gray-200 leading-relaxed font-sans overflow-y-auto flex-1 custom-scrollbar">
            
            {/* 서두 카드 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-purple-950/30 to-slate-950 border border-amber-500/30 space-y-3 shadow-inner">
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium break-keep">
                명심코칭이 말하는 변화는 <strong className="text-amber-300 font-black">지금의 나를 없애고 새로운 사람이 되는 과정이 아닙니다.</strong>
              </p>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal break-keep">
                내 안에 이미 존재하는 기질과 오래된 반응패턴을 발견하고, 그것을 ‘나 자신’과 동일시하던 상태에서 한 걸음 떨어져 바라보고, 있는 그대로 수용하면서 더 자유롭고 균형 있게 사용할 수 있게 되는 과정입니다.
              </p>
              <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30 text-amber-200 text-xs sm:text-[13px] font-bold leading-relaxed break-keep">
                사주명리학은 여기에서 사람의 운명을 결정하는 답이 아니라, <br />
                <span className="text-amber-300 font-black underline decoration-amber-400/50 underline-offset-4">
                  내가 오랫동안 ‘나’라고 믿어온 기질과 반복패턴을 볼 수 있게 해주는 하나의 거울이자 브릿지
                </span>
                입니다.
              </div>
            </div>

            {/* 1. DARK CODE × SCAN */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                  <Eye className="w-4 h-4 text-gray-300" />
                </div>
                <h4 className="text-sm sm:text-base font-black text-white">
                  1. DARK CODE × SCAN
                </h4>
              </div>

              <h5 className="text-xs sm:text-sm font-bold text-amber-300">
                “나는 원래 이런 사람이야”에서 패턴을 발견하다
              </h5>

              <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed">
                다크코드(Dark Code)는 나쁜 코드나 제거해야 할 결함을 뜻하지 않습니다. 오랜 시간 반복되어 너무 익숙해진 나머지 어느 순간부터 그것을 ‘나 자체’라고 믿게 된 사고·감정·행동의 자동패턴을 뜻합니다.
              </p>

              <div className="grid grid-cols-2 gap-2 my-2 text-[11.5px] italic text-gray-300">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">“나는 원래 예민해.”</div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">“나는 원래 사람을 못 믿어.”</div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">“나는 원래 인정받아야 해.”</div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">“나는 원래 화가 나면 참지 못해.”</div>
              </div>

              <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed">
                이때 우리는 하나의 반응패턴을 경험하는 것이 아니라 그 패턴과 자신을 동일시하고 있습니다. 생각이 떠오른 것이 아니라 <strong className="text-white">‘그 생각이 곧 나’</strong>가 되고, 감정이 일어난 것이 아니라 <strong className="text-white">‘그 감정이 곧 나’</strong>가 됩니다.
              </p>

              <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed">
                명심코칭에서 사주명리는 이러한 오래된 기질과 자동반응을 발견하기 위한 하나의 관찰 프레임으로 사용됩니다. 사주가 “당신은 이런 사람이다”라고 결론내리는 것이 아니라, <strong className="text-amber-200">“혹시 이런 패턴이 내 삶에서 반복되고 있지는 않은가?”</strong>라고 스스로 관찰할 수 있도록 돕는 것입니다.
              </p>

              <div className="p-3 rounded-xl bg-slate-900 border-l-4 border-slate-500 text-xs sm:text-[13px] space-y-1">
                <span className="font-bold text-white">이것이 <span className="text-amber-300">SCAN</span>입니다.</span>
                <p className="text-gray-300">다크코드를 없애기 전에 먼저 봅니다. 판단하지 않고, 고치려고 서두르지 않고, <strong className="text-amber-200">“아, 내 안에서 지금 이 패턴이 자동으로 작동하고 있구나.”</strong> 하고 알아차립니다.</p>
              </div>
            </div>

            {/* 2. NEURAL CODE × SYNC */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-900/50 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                  <RefreshCw className="w-4 h-4 text-indigo-400" />
                </div>
                <h4 className="text-sm sm:text-base font-black text-white">
                  2. NEURAL CODE × SYNC
                </h4>
              </div>

              <h5 className="text-xs sm:text-sm font-bold text-indigo-300">
                패턴은 나의 전부가 아니다
              </h5>

              <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed">
                뉴럴코드(Neural Code)는 다크코드를 제거하는 과정이 아닙니다. 오히려 <strong className="text-indigo-200">“이런 패턴이 내 안에 있다는 것을 인정하면서도, 이것이 나의 전부는 아니다.”</strong>라고 바라볼 수 있는 힘을 기르는 과정입니다.
              </p>

              <div className="space-y-1.5 text-xs text-indigo-100 bg-black/40 p-3 rounded-xl border border-white/5">
                <p className="line-through text-gray-500">“나는 불안한 사람이다”</p>
                <p className="font-bold">👉 “지금 내 안에 불안이라는 경험이 일어나고 있다.”</p>
                <p className="line-through text-gray-500 pt-1">“나는 실패자다”</p>
                <p className="font-bold">👉 “지금 내 마음이 나에게 실패자라는 이야기를 하고 있다.” (탈동일시)</p>
              </div>

              <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed">
                그러나 명심코칭은 그 오래된 패턴을 적으로 만들지 않습니다. DBT의 수용과 변화, ACT의 수용과 심리적 유연성, MBCT의 탈중심화와 알아차림, MSC의 자기연민과 자기친절과 같은 원리들을 활용하여 오랫동안 나를 지켜왔던 패턴까지도 <strong className="text-white">“그럴 수밖에 없었던 나의 한 부분”</strong>으로 이해하고 품습니다.
              </p>

              <div className="p-3 rounded-xl bg-indigo-950/60 border-l-4 border-indigo-500 text-xs sm:text-[13px] space-y-1">
                <span className="font-bold text-white">이것이 <span className="text-indigo-300">SYNC</span>입니다.</span>
                <p className="text-gray-300">내 기질과 싸우는 것이 아니라 현재의 나와 다시 관계를 맺고 조율하는 것입니다. 그 과정에서 자동적인 반응 대신 새로운 선택을 반복하면서 기존의 습관적 반응에서 벗어나 보다 유연한 사고와 행동방식을 학습해 갑니다. 명심코칭에서 이를 Neural Code라고 부릅니다.</p>
              </div>

              <p className="text-[11px] text-gray-400">
                ※ 여기서 ‘Neural’은 코칭만으로 특정 신경망이 의학적으로 변경되었다고 진단한다는 의미가 아닙니다. 반복적인 경험과 학습을 통해 새로운 사고·행동 습관을 형성해 나가는 과정을 설명하기 위한 명심코칭의 자체적인 코칭 개념입니다.
              </p>
            </div>

            {/* 3. META CODE × SHIFT */}
            <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="text-sm sm:text-base font-black text-white">
                  3. META CODE × SHIFT
                </h4>
              </div>

              <h5 className="text-xs sm:text-sm font-bold text-amber-300">
                알아차림을 알아차리다
              </h5>

              <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed">
                메타코드(Meta Code)는 더 좋은 성격을 만드는 마지막 단계가 아닙니다. 다크코드를 완전히 지워버린 상태도 아닙니다. 생각도 여전히 일어납니다. 감정도 올라옵니다. 오래된 기질도 존재합니다. 때로는 다크코드도 다시 작동합니다.
              </p>

              <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-xs sm:text-[13px] text-center font-bold text-purple-200">
                그것이 일어나고 있다는 사실을 알아차릴 수 있습니다. 그리고 한 단계 더 깊어지면, ‘내가 지금 알아차리고 있다는 것’까지 알아차립니다.
              </div>

              <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed">
                명심코칭에서는 이것을 <strong className="text-amber-300 font-bold">알아차림의 알아차림 · Meta Code · Zero Point</strong>라고 부릅니다. 책 《제로포인트》가 말하는 것처럼 이것은 다크코드와 메타인지를 넘어, 자신의 내면에서 일어나는 현상을 바라볼 수 있는 보다 근원적인 관찰의 자리로 돌아가는 것을 의미합니다.
              </p>

              <div className="p-3 rounded-xl bg-black/50 border-l-4 border-amber-400 text-xs sm:text-[13px] space-y-1">
                <span className="font-bold text-white">그 순간 비로소 <span className="text-amber-300">SHIFT</span>가 가능합니다.</span>
                <p className="text-gray-300 leading-relaxed">
                  생각이 있어도 생각에 갇히지 않고, 감정이 있어도 감정에 휩쓸리지 않으며, 사주에 나타난 패턴이 있어도 한계가 되지 않습니다. SHIFT란 다른 사람이 되는 것이 아니라, <strong className="text-amber-200">같은 나, 같은 기질, 같은 에너지를 더 자유롭고 지혜롭게 사용하는 능력</strong>입니다.
                </p>
              </div>
            </div>

            {/* 사주를 버리는 것이 아니라 자유롭게 사용하는 것 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-amber-400/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-black text-xs sm:text-sm">
                <Compass size={16} />
                <span>사주를 버리는 것이 아니라 자유롭게 사용하는 것</span>
              </div>
              <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed">
                그래서 명심코칭은 사주에서 벗어나라고 말하지 않습니다. 사주를 믿으라고도 말하지 않습니다. 사주에 나타난 기질과 패턴을 <strong className="text-amber-200">보고, 인정하고, 품고, 필요할 때 잘 사용하는 것.</strong> 이것이 목적입니다.
              </p>
              <ul className="space-y-1.5 text-xs text-gray-300 pl-1">
                <li>• <strong>강한 추진력:</strong> 폭주가 아닌 실행력으로 사용</li>
                <li>• <strong>예민함:</strong> 과민반응이 아닌 섬세함과 통찰로 사용</li>
                <li>• <strong>경계심:</strong> 관계파괴가 아닌 자신을 지키는 건강한 경계로 사용</li>
              </ul>
              <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 text-xs sm:text-[13px] text-center font-bold text-amber-300">
                “그 기질에 끌려가느냐, 그 기질을 알아차리고 사용할 수 있느냐입니다.”
              </div>
            </div>

            {/* 명심코칭의 변화 공식 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-center">
              <span className="text-[11px] font-bold text-amber-400 font-mono tracking-wider">명심코칭의 변화 공식</span>
              <div className="space-y-1.5 text-xs text-left">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-bold text-gray-300 block">사주 · 기질</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-3.5 h-3.5 text-gray-500" /></div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-bold text-gray-300 block">DARK CODE — SCAN</span>
                  <span className="text-[11px] text-gray-400">“내가 나라고 믿어온 자동패턴을 발견한다.”</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-3.5 h-3.5 text-indigo-400" /></div>
                <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30">
                  <span className="font-bold text-indigo-200 block">NEURAL CODE — SYNC</span>
                  <span className="text-[11px] text-indigo-300/90">“패턴과 나를 분리해 바라보고, 거부하지 않고 수용하며 새로운 선택을 학습한다.”</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-3.5 h-3.5 text-purple-400" /></div>
                <div className="p-2.5 rounded-lg bg-purple-950/60 border border-purple-500/30">
                  <span className="font-bold text-purple-200 block">META CODE — SHIFT</span>
                  <span className="text-[11px] text-purple-300/90">“생각과 감정뿐 아니라 그것을 알아차리고 있는 나까지 알아차림을 통해 자유롭게 선택한다.”</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-3.5 h-3.5 text-amber-400" /></div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-indigo-600/20 border border-amber-400/50">
                  <span className="font-black text-amber-300 block">ZERO POINT</span>
                  <span className="text-xs text-white font-bold">“삶을 통제하는 사람이 아니라, 삶 속에서 무엇에도 맹목적으로 끌려가지 않는 사람.”</span>
                </div>
              </div>
            </div>

            {/* 결국 명심코칭이 말하는 자유 */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-purple-950/30 to-slate-950 border-2 border-amber-400/50 space-y-3 text-center shadow-xl">
              <Award className="w-6 h-6 text-amber-400 mx-auto" />
              <h4 className="text-sm sm:text-base font-black text-white">
                결국 명심코칭이 말하는 자유
              </h4>
              <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed font-normal">
                명심코칭이 추구하는 것은 ‘더 완벽한 나’를 만드는 것이 아닙니다. 사주를 바꾸는 것도 아니고, 기질을 제거하는 것도 아니며, 다크코드를 박멸하는 것도 아닙니다.
              </p>
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1.5">
                <p className="text-xs sm:text-[13px] text-amber-100 font-bold leading-relaxed">
                  있는 그대로의 나를 온전히 보고, 있는 그대로 받아들이면서도, 그 어떤 패턴도 나의 전부라고 착각하지 않는 것.
                </p>
                <p className="text-xs sm:text-[13px] text-amber-200 font-bold leading-relaxed">
                  그리고 매 순간, 내가 가진 것을 어떻게 사용할 것인지를 선택할 수 있는 것.
                </p>
              </div>
              <div className="pt-1">
                <span className="text-[11px] text-gray-400 block">그것이 명심코칭이 말하는</span>
                <h5 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                  어떠한 것에도 걸림없는 자유인의 삶
                </h5>
                <span className="text-[11px] text-gray-400">입니다.</span>
              </div>
            </div>

            {/* 특허 및 법률 면책 고지 */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 text-[11px] text-gray-400 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-gray-300">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>특허출원 및 비의료 가이드라인 준수 고지</span>
              </div>
              <p>• 특허출원 제10-2025-0166877호: 심리 및 생체데이터 기반 스트레스 관리 솔루션 제공 장치 및 방법</p>
              <p>• 본 서비스는 보건복지부 비의료 건강관리서비스 가이드라인을 준수하며, 의학적 진단이나 치료를 대체하지 않습니다.</p>
            </div>
          </div>

          {/* 하단 CTA 및 푸터 */}
          <div className="relative z-10 p-4 sm:p-5 pt-3 border-t border-white/10 bg-slate-950 flex flex-col gap-2.5 shrink-0">
            <button
              onClick={handleClose}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              <Brain size={16} className="text-amber-300" />
              <span>✨ 3-Code × 3S 철학 확인하고 코칭 시작하기 ➔</span>
            </button>

            <div className="flex justify-between items-center px-2 pt-1 text-[11px] text-gray-400 font-medium">
              <button
                onClick={handleHideToday}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 size={13} className="text-amber-400" />
                <span>오늘 하루 이 창 보지 않기</span>
              </button>
              <button
                onClick={handleClose}
                className="hover:text-white transition-colors cursor-pointer text-gray-500"
              >
                닫기
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
