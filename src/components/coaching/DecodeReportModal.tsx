'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertCircle, HelpCircle, BookOpen, Fingerprint, Layers, Compass, Loader2 } from 'lucide-react';
import { calculateGongmang } from '@/modules/GongmangEngine';
import { useReportStore } from '@/store/useReportStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: any;
}

interface DecodeData {
  tab1_title: string;
  tab1_content: string;
  tab1_cards: { title: string; desc: string }[];
  tab2_title: string;
  tab2_content: string;
  tab2_bullet_points: { title: string; desc: string }[];
  tab3_title: string;
  tab3_content: string;
  tab3_highlight: {
    title: string;
    concept: string;
    realization: string;
  };
}

export default function DecodeReportModal({ isOpen, onClose, userProfile }: Props) {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'gongmang' | 'unconscious' | 'synthesis'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState<DecodeData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { reportData } = useReportStore();

  // 1. 사용자 사주 정보 파악 (안전한 폴백 및 경신년 계미월 신사일 을미시)
  const saju = userProfile?.saju || reportData?.saju || {};
  
  // [Fix] 한자 파싱 헬퍼 함수
  const getHanzi = (pillar: any, part: 'stem' | 'branch'): string => {
    if (!pillar) return '';
    if (typeof pillar === 'string') {
      if (part === 'stem') return pillar.charAt(0) || '';
      return pillar.charAt(1) || '';
    }
    
    // stem/branch 가 객체인 경우 처리
    if (part === 'stem') {
      const gan = pillar.gan || pillar.stem;
      if (!gan) return '';
      if (typeof gan === 'string') return gan;
      if (typeof gan === 'object') return gan.char || gan.kanji || gan.name || '';
    } else {
      const ji = pillar.ji || pillar.branch;
      if (!ji) return '';
      if (typeof ji === 'string') return ji;
      if (typeof ji === 'object') return ji.char || ji.kanji || ji.name || '';
    }
    return '';
  };

  // 일주 추출 
  const dayPillarGan = getHanzi(saju?.dayPillar || saju?.fourPillars?.day, 'stem') || '辛';
  const dayPillarJi = getHanzi(saju?.dayPillar || saju?.fourPillars?.day, 'branch') || '巳';
  const dayPillar = `${dayPillarGan}${dayPillarJi}`;

  // 년주 추출
  const yearPillarGan = getHanzi(saju?.yearPillar || saju?.fourPillars?.year, 'stem') || '庚';
  const yearPillarJi = getHanzi(saju?.yearPillar || saju?.fourPillars?.year, 'branch') || '申';
  const yearPillar = `${yearPillarGan}${yearPillarJi}`;

  // 월주 추출
  const monthPillarGan = getHanzi(saju?.monthPillar || saju?.fourPillars?.month, 'stem') || '癸';
  const monthPillarJi = getHanzi(saju?.monthPillar || saju?.fourPillars?.month, 'branch') || '未';
  const monthPillar = `${monthPillarGan}${monthPillarJi}`;

  // 시주 추출
  const hourPillarGan = getHanzi(saju?.hourPillar || saju?.fourPillars?.time, 'stem') || '乙';
  const hourPillarJi = getHanzi(saju?.hourPillar || saju?.fourPillars?.time, 'branch') || '未';
  const hourPillar = `${hourPillarGan}${hourPillarJi}`;

  // 공망 계산
  const gongmang = calculateGongmang(dayPillar);
  const isShinsaDay = dayPillarGan === '辛' && dayPillarJi === '巳';
  const isTargetSaju = isShinsaDay && yearPillarJi === '申';

  useEffect(() => {
    setMounted(true);
  }, []);

  // API로부터 동적 리포트 생성 요청
  useEffect(() => {
    if (isOpen && mounted) {
      const fetchDecodeReport = async () => {
        setIsLoading(true);
        setErrorMsg(null);
        try {
          const res = await fetch('/api/secure/decode-report', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              saju: {
                dayPillar: { stem: dayPillarGan, branch: dayPillarJi },
                yearPillar: { stem: yearPillarGan, branch: yearPillarJi },
                monthPillar: { stem: monthPillarGan, branch: monthPillarJi },
                hourPillar: { stem: hourPillarGan, branch: hourPillarJi },
              },
              gongmang,
            }),
          });

          if (!res.ok) throw new Error('API request failed');

          const result = await res.json();
          if (result.success && result.data) {
            setApiData(result.data);
          } else {
            throw new Error(result.error || 'Unknown error');
          }
        } catch (e) {
          console.error('Failed to load dynamic decode report:', e);
          setErrorMsg('사용자 분석을 컴파일하는 도중 오류가 발생했습니다. 폴백 리포트로 전환합니다.');
          
          // Fallback (원래 신사 일주 하드코딩 리포트 데이터)
          setApiData({
            tab1_title: "1. 공망이 지장간 임수(壬水) 상관에 미치는 영향",
            tab1_content: "사주에서 공망은 '글자의 형태는 존재하지만, 현실적인 알맹이가 비어 있다'는 개념입니다. 이는 물질적으로는 불리할지 몰라도, 정신적·비물질적 영역에서는 한계가 사라지는 '무한한 확장성'을 의미하기도 합니다.",
            tab1_cards: [
              {
                title: "상관의 기운이 '가상 공간'과 '정신 세계'로 변환",
                desc: "일반적인 상관이 현실에서의 즉각적인 말재주나 물질적 표출이라면, 공망을 맞은 신금 속 임수(壬水) 상관은 보이지 않는 영역, 추상적인 개념, 가상 공간(IT, AI, 디지털), 혹은 형이상학적인 분야(명리, 심리학, 철학)에서 강력한 천재성으로 발현됩니다."
              },
              {
                title: "블랙홀 같은 압축력",
                desc: "현실적인 소음이나 세상의 기준에 갇히지 않고, 우주의 알고리즘이나 인간 심리의 본질을 해킹하듯 깊게 파고드는 독창적인 기획력의 원천이 됩니다."
              }
            ],
            tab2_title: "2. 년지(年支) 공망의 현실적 특징",
            tab2_content: "년지는 내가 태어난 국가, 사회적 대환경, 조상, 혹은 가문의 전통적인 유산을 의미합니다.",
            tab2_bullet_points: [
              {
                title: "기존 패러다임과의 분리",
                desc: "전통적인 방식이나 기성 사회의 룰을 그대로 따르는 것에는 허무함을 느끼기 쉽습니다. \"기존의 틀은 비어 있으니, 내가 새로 채우겠다\"는 무의식이 작동하여, 세상에 없던 자신만의 독자적인 시스템이나 브랜드를 스스로 창조하는 길을 걷게 됩니다."
              },
              {
                title: "겁재(劫財)의 공망",
                desc: "년지의 본기인 경금/신금 겁재가 공망을 맞으면, 타인과의 세속적인 경쟁이나 비교에 쉽게 지치거나 무의미함을 느낍니다. 대신 '나 자신을 뛰어넘는 것'에 집중하는 내면의 뚝심으로 치환됩니다."
              }
            ],
            tab3_title: "3. 구조적 종합: 식신(癸)과 공망된 상관(壬)의 결합",
            tab3_content: "월간에 투출한 계수(癸水) 식신은 공망이 아닙니다. 따라서 현실 세계에서 정밀하게 글을 쓰고, 시스템을 설계하며, 전문 지식을 출력하는 기능은 매우 안정적이고 완벽하게 작동합니다.",
            tab3_highlight: {
              title: "💡 디코드 핵심 요약",
              concept: "현실적 출력 장치인 식신(癸水)은 멀쩡하게 작동하되, 그 식신에 깊은 영감과 아이디어를 공급하는 년지(申金)의 뿌리가 공망이라는 '보이지 않는 통로'로 연결되어 있는 형국입니다.",
              realization: "이 때문에 현실적이고 뻔한 콘텐츠가 아니라, 인간의 무의식, 가상 시스템, 깊은 정신 세계를 정밀한 논리로 현실화하는 독보적인 에너지로 쓰이게 됩니다. 공망이 오히려 세속적 한계를 깨뜨리는 강력한 치트키가 된 구조입니다."
            }
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchDecodeReport();
    }
  }, [isOpen, mounted, userProfile, reportData, dayPillarGan, dayPillarJi, yearPillarGan, yearPillarJi, monthPillarGan, monthPillarJi, hourPillarGan, hourPillarJi]);

  if (!isOpen || !mounted) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-black border border-purple-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col my-8 max-h-[90vh]"
      >
        {/* Decorative elements */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start relative z-10 bg-slate-900/50 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold tracking-widest uppercase mb-1">
              <Sparkles className="w-4 h-4 animate-pulse" />
              DECODE : 심층 무의식 분석
            </div>
            <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-indigo-200 tracking-tight">
              심층 무의식 보고서: 디코드
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              당신의 표면 의식 아래 숨겨진 심리 엔진과 치트키를 분석합니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Saju Matrix display */}
        <div className="px-6 py-4 bg-slate-950/40 border-b border-white/5 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block mb-1">분석 대상 명식</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {isTargetSaju ? '✨ 사용자 맞춤형 분석 명식 (이경윤 님)' : '✨ 사용자 맞춤형 분석 명식'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                  {dayPillar} 일주
                </span>
              </div>
            </div>
            {/* Saju 4-Pillar Grid */}
            <div className="grid grid-cols-4 gap-2 text-center text-sm max-w-xs w-full self-end">
              <div className="bg-white/5 border border-white/10 rounded-lg p-1.5 flex flex-col justify-between">
                <div className="text-slate-400 text-[10px] scale-90">시주</div>
                <div className="font-extrabold text-amber-400 text-base py-1 select-none font-serif">{hourPillar}</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-1.5 shadow-[0_0_10px_rgba(168,85,247,0.1)] flex flex-col justify-between">
                <div className="text-purple-300 text-[10px] scale-90 font-bold">일주</div>
                <div className="font-extrabold text-white text-base py-1 select-none font-serif">{dayPillar}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-1.5 flex flex-col justify-between">
                <div className="text-slate-400 text-[10px] scale-90">월주</div>
                <div className="font-extrabold text-emerald-400 text-base py-1 select-none font-serif">{monthPillar}</div>
              </div>
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-1.5 flex flex-col justify-between">
                <div className="text-slate-400 text-[10px] scale-90">년주</div>
                <div className="font-extrabold text-indigo-400 text-base py-1 select-none font-serif">{yearPillar}</div>
              </div>
            </div>
          </div>
          {errorMsg && (
            <div className="mt-3 flex items-start gap-1.5 p-2 rounded-lg bg-red-500/5 border border-red-500/20 text-[10px] text-red-300/80">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Tabs for sections */}
        <div className="px-6 py-2 border-b border-white/5 flex gap-2 overflow-x-auto relative z-10 bg-slate-900/20">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              activeSection === 'all'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            전체 보기
          </button>
          <button
            onClick={() => setActiveSection('gongmang')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              activeSection === 'gongmang'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {apiData?.tab1_title || '1. 지장간 & 공망'}
          </button>
          <button
            onClick={() => setActiveSection('unconscious')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              activeSection === 'unconscious'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {apiData?.tab2_title || '2. 공망의 현실 특징'}
          </button>
          <button
            onClick={() => setActiveSection('synthesis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              activeSection === 'synthesis'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {apiData?.tab3_title || '3. 구조적 종합'}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-thin flex flex-col justify-start">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <div className="text-sm font-bold text-slate-300">내면의 소스코드 디코딩 중...</div>
              <div className="text-xs text-slate-500">당신의 에고와 공망 지장간 주파수를 매핑하고 있습니다.</div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* 1. 공망이 지장간에 미치는 영향 */}
              {(activeSection === 'all' || activeSection === 'gongmang') && apiData && (
                <motion.div
                  key="gongmang"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 text-purple-300 font-extrabold text-sm md:text-base border-b border-purple-500/20 pb-2">
                    <Fingerprint className="w-5 h-5 text-purple-400" />
                    {apiData.tab1_title}
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {apiData.tab1_content}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {apiData.tab1_cards.map((card, i) => (
                      <div key={i} className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 hover:border-purple-500/20 transition-all duration-300">
                        <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5 mb-2">
                          <Layers className="w-4 h-4 text-purple-400" />
                          {card.title}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {card.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 2. 공망의 현실적 특징 */}
              {(activeSection === 'all' || activeSection === 'unconscious') && apiData && (
                <motion.div
                  key="unconscious"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-sm md:text-base border-b border-indigo-500/20 pb-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    {apiData.tab2_title}
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {apiData.tab2_content}
                  </p>
                  <div className="bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/20 rounded-2xl p-4 space-y-3">
                    {apiData.tab2_bullet_points.map((point, i) => (
                      <div key={i} className={`flex gap-2 ${i > 0 ? 'border-t border-white/5 pt-2' : ''}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-purple-400' : 'bg-indigo-400'} shrink-0 mt-2`} />
                        <div>
                          <h4 className="text-xs font-bold text-white">{point.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed mt-0.5 font-normal">
                            {point.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 3. 구조적 종합 */}
              {(activeSection === 'all' || activeSection === 'synthesis') && apiData && (
                <motion.div
                  key="synthesis"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-sm md:text-base border-b border-emerald-500/20 pb-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    {apiData.tab3_title}
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {apiData.tab3_content}
                  </p>
                  <div className="bg-slate-950/80 border border-emerald-500/20 rounded-2xl p-5 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5 mb-2">
                      {apiData.tab3_highlight.title}
                    </h4>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                      {apiData.tab3_highlight.concept}
                    </p>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed mt-3">
                      {apiData.tab3_highlight.realization}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-950/50 backdrop-blur-sm relative z-10">
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-purple-500" />
            <span>Myeongsim AI Decoder Protocol v2.0 (Dynamic)</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg active:scale-95 transition-all duration-150"
            >
              확인 완료
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
