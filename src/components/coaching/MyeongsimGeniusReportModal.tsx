'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, Info, Check, MessageSquare, Shield, Users, HelpCircle, Trophy } from 'lucide-react';
import { playTechBeep, playSuccessChime, playScanPulse } from '@/utils/sfx';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReportStore } from '@/store/useReportStore';
import { Cell, Pie, PieChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface MyeongsimGeniusReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: any;
}

// 눈금 가이드 데코레이션
const CropMarks = () => (
  <>
    <div className="absolute top-4 left-4 w-4 h-4 pointer-events-none opacity-20">
      <div className="absolute top-2 left-0 w-4 h-[1px] bg-purple-400" />
      <div className="absolute top-0 left-2 w-[1px] h-4 bg-purple-400" />
    </div>
    <div className="absolute top-4 right-4 w-4 h-4 pointer-events-none opacity-20">
      <div className="absolute top-2 right-0 w-4 h-[1px] bg-purple-400" />
      <div className="absolute top-0 right-2 w-[1px] h-4 bg-purple-400" />
    </div>
    <div className="absolute bottom-4 left-4 w-4 h-4 pointer-events-none opacity-20">
      <div className="absolute bottom-2 left-0 w-4 h-[1px] bg-purple-400" />
      <div className="absolute bottom-0 left-2 w-[1px] h-4 bg-purple-400" />
    </div>
    <div className="absolute bottom-4 right-4 w-4 h-4 pointer-events-none opacity-20">
      <div className="absolute bottom-2 right-0 w-4 h-[1px] bg-purple-400" />
      <div className="absolute bottom-0 right-2 w-[1px] h-4 bg-purple-400" />
    </div>
  </>
);

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950/95 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-white font-bold text-xs">{data.name}</p>
        <p className="text-emerald-400 font-mono text-xs mt-1">
          비율: {data.value}%
        </p>
      </div>
    );
  }
  return null;
};

export default function MyeongsimGeniusReportModal({ isOpen, onClose, userProfile }: MyeongsimGeniusReportModalProps) {
  const { t } = useLanguage();
  const { reportData } = useReportStore();
  const [activeTab, setActiveTab] = useState<'talents' | 'profile' | 'powerbase' | 'leadership'>('talents');
  const [isMounted, setIsMounted] = useState(false);
  const [loadingInterpret, setLoadingInterpret] = useState(false);
  const [interpretText, setInterpretText] = useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string | null>(null);

  // [보안] 로컬 캐시 맵 — 한 번 생성된 해설은 재호출 없이 즉시 재사용
  const interpretCacheRef = React.useRef<Record<string, string>>({});

  // 사용자 정보 병합
  const profile = useMemo(() => {
    return userProfile || reportData || {};
  }, [userProfile, reportData]);

  const userName = profile.userName || '경리(Kyung Lee)';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      playScanPulse();
      // 모달이 열릴 때 선택 초기화 (캐시는 유지)
      setInterpretText(null);
      setSelectedItemName(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. 특화 천부 재능 데이터 (경리 님 PDF 기반 + 명심 용어)
  const talentsData = [
    {
      id: 'cc_power',
      name: '상생적 협동 창조력',
      english: 'Cooperative Creative Power',
      desc: '공동체 내에서 조화롭게 소통하며 남다른 시너지를 이끌어내는 독창적인 상생 창조력입니다.',
      icon: '💡',
      color: 'from-violet-500 to-indigo-500',
      badge: '협동 뉴럴코드'
    },
    {
      id: 'novel_try',
      name: '새로운 도전의 용기',
      english: 'Courage to Try Out Novel Things',
      desc: '기존의 낡은 틀에 얽매이지 않고 미지의 영역으로 거침없이 퍼스트 무버로서 나아가는 추진 기질입니다.',
      icon: '🚀',
      color: 'from-amber-500 to-orange-500',
      badge: '혁신 뉴럴코드'
    },
    {
      id: 'rel_trust',
      name: '관계와 신뢰의 연대',
      english: 'Building Relationships & Trust',
      desc: '사람과 사람 사이의 보이지 않는 벽을 허물고 단단한 마음의 연대와 흔들리지 않는 신뢰를 직조해냅니다.',
      icon: '🤝',
      color: 'from-emerald-500 to-teal-500',
      badge: '유대 뉴럴코드'
    },
    {
      id: 'spont_improv',
      name: '즉흥적 돌파와 임기응변',
      english: 'Spontaneity and Improvisation Skill',
      desc: '예측 불가능한 위기와 혼란 속에서도 순간적인 메타인지 감각으로 명쾌한 돌파구를 찾아내는 즉흥 에너지입니다.',
      icon: '🎭',
      color: 'from-pink-500 to-rose-500',
      badge: '각성 메타코드'
    }
  ];

  // 2. 6대 천명 에너지 프로파일 (Talent Profile)
  const profileChartData = [
    { name: '행동 실현 (Realization)', value: 90, color: '#EF4444', desc: 'action-oriented // 눈앞에 실행하여 완성하는 추진 에너지' },
    { name: '보급 시장 (Dissemination)', value: 85, color: '#F59E0B', desc: 'market-oriented // 가치를 널리 알리고 전파하는 상업 에너지' },
    { name: '가치 변형 (Transformation)', value: 75, color: '#8B5CF6', desc: 'value-based // 본질의 격을 높여 진화시키는 정렬 에너지' },
    { name: '분석 자원 (Analysis)', value: 80, color: '#10B981', desc: 'resource-oriented // 맥락을 꿰어내고 자원을 조율하는 이성 에너지' },
    { name: '제품 개발 (Development)', value: 65, color: '#3B82F6', desc: 'product-oriented // 최상의 뼈대와 실체를 지어내는 빌더 에너지' },
    { name: '고객 접촉 (Contact)', value: 60, color: '#EC4899', desc: 'client-oriented // 사람과 긴밀히 교감하며 방향을 잡는 공감 에너지' }
  ];

  // 3. 무의식적 공동체 기여 파워베이스 (Powerbase)
  const powerbaseChartData = [
    { name: '소통 촉진 및 상호작용', value: 49, color: '#EC4899' },
    { name: '혁신 주도 및 변화 추진', value: 21, color: '#8B5CF6' },
    { name: '조직 경영 및 행정 안정', value: 10, color: '#10B981' },
    { name: '시장 우위 및 상업적 성공', value: 10, color: '#F59E0B' },
    { name: '목표 지향 기획 및 자원 조율', value: 8, color: '#3B82F6' },
    { name: '시스템 안정 및 지속 가능성', value: 2, color: '#9CA3AF' }
  ];

  // 4. 조율 및 리더십 기질
  const leadershipData = [
    {
      title: '공동체 내 상생 역할',
      value: '상생적 지원자 (Team Supporter)',
      desc: '공동체의 흐름을 지탱하며, 따뜻한 소통과 조율로 프로세스 자체를 조화롭게 연결해 주는 평화의 수호자입니다.',
      icon: '🛡️'
    },
    {
      title: '명심 리더십 스타일',
      value: '자신감 있는 주도형 (Confident / Determining)',
      desc: '내면의 확신과 기품을 바탕으로, 혼란한 상황에서도 명확하고 흔들림 없이 바른 나침반 역할을 수행하는 리더십입니다.',
      icon: '👑'
    },
    {
      title: '내면의 열정 동기',
      value: '지혜를 통한 안전과 신뢰 확보 (Safety with Intelligence)',
      desc: '지성적 탐구와 세심한 통찰을 발판 삼아 나 자신과 내 곁의 사람들의 삶을 가장 안전하고 충만하게 가꾸려는 성정입니다.',
      icon: '💡'
    },
    {
      title: '세상을 보는 명심 관점',
      value: '탐구자적 성공 식별 (Investigative - Successful Value)',
      desc: '현상의 이면을 끈질기게 탐구하여, 무엇이 진정으로 성공적이고 가치 있는 기틀인지를 명확하게 간파해 냅니다.',
      icon: '👁️'
    }
  ];

  const cooperationKeywords = [
    '상황에 따른 유연함 (situationally Flexible)',
    '네트워크망 기반 시너지 (in Networks)',
    '대규모 조직 내 조화 (in larger Organizations)',
    '서포트 공동체 지향 (in supportive Communities)',
    '1:1 소울 파트너십 (Partnership with a second person)',
    '자율적 독립 주권 (autonomous and Independent)'
  ];

  // AI 도슨트 해석 요청 (캐시 우선 + 로딩 중 중복 클릭 차단)
  const handleFetchGeniusInterpretation = async (name: string, value: string, desc: string, type: string) => {
    // [보안] 로딩 중이면 추가 호출 차단 — 토큰 폭탄 방지
    if (loadingInterpret) return;

    const cacheKey = `${type}::${name}`;

    // [보안] 캐시에 이미 있으면 API 호출 없이 즉시 반환
    if (interpretCacheRef.current[cacheKey]) {
      playTechBeep();
      setSelectedItemName(name);
      setInterpretText(interpretCacheRef.current[cacheKey]);
      return;
    }

    playTechBeep();
    setSelectedItemName(name);
    setLoadingInterpret(true);
    setInterpretText(null);

    // 사주 원국 정보 파싱
    const saju = profile.saju || {};
    const sajuText = saju.fourPillars
      ? `${saju.fourPillars.year || ''} ${saju.fourPillars.month || ''} ${saju.fourPillars.day || ''} ${saju.fourPillars.time || ''}`
      : '분석 진행 중';
    const gongWang = saju.gongWang || [];

    try {
      const response = await fetch('/api/coaching/myeongsim-genius/docent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          sajuText,
          gongWang,
          indicatorType: type,
          indicatorName: name,
          indicatorValue: value,
          indicatorDesc: desc
        }),
      });

      if (!response.ok) throw new Error('AI 도슨트 생성 오류');
      const data = await response.json();
      if (data.success && data.interpretation) {
        // [보안] 캐시에 저장 — 다음 클릭 시 API 재호출 0회
        interpretCacheRef.current[cacheKey] = data.interpretation;
        setInterpretText(data.interpretation);
        playSuccessChime();
      } else {
        throw new Error(data.error || '해설을 가져올 수 없습니다.');
      }
    } catch (err) {
      console.error(err);
      setInterpretText('천부 성정 기질 해독 중 일시적인 네트워크 지연이 발생했습니다. 다시 클릭해 주시면 AI 도슨트가 정성껏 해석을 안내해 드리겠습니다.');
    } finally {
      setLoadingInterpret(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="relative w-full max-w-4xl bg-slate-950/95 border border-indigo-500/30 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl flex flex-col max-h-[90vh]"
        >
          {/* 장식용 데코 */}
          <CropMarks />
          
          {/* 헤더 */}
          <div className="flex justify-between items-center p-6 border-b border-white/10 bg-slate-900/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                  명심 지니어스 천재성 리포트
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  수검자: <span className="text-indigo-300 font-bold">{userName}</span> 님 • 1:1 맞춤형 천명 설계도
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                playTechBeep();
                onClose();
              }}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* 탭 네비게이션 — [Fix] flex-shrink-0 + 가로 스크롤로 모바일 글씨 짤림 방지 */}
          <div className="flex bg-slate-900 border-b border-white/5 p-1 gap-1 overflow-x-auto scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
            <button
              disabled={loadingInterpret}
              onClick={() => { playTechBeep(); setActiveTab('talents'); }}
              className={`flex-shrink-0 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${loadingInterpret ? 'opacity-50 cursor-not-allowed' : ''} ${
                activeTab === 'talents'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>💡</span> 천부 특화 재능
            </button>
            <button
              disabled={loadingInterpret}
              onClick={() => { playTechBeep(); setActiveTab('profile'); }}
              className={`flex-shrink-0 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${loadingInterpret ? 'opacity-50 cursor-not-allowed' : ''} ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>📊</span> 6대 천명 에너지
            </button>
            <button
              disabled={loadingInterpret}
              onClick={() => { playTechBeep(); setActiveTab('powerbase'); }}
              className={`flex-shrink-0 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${loadingInterpret ? 'opacity-50 cursor-not-allowed' : ''} ${
                activeTab === 'powerbase'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🌌</span> 공동체 기여
            </button>
            <button
              disabled={loadingInterpret}
              onClick={() => { playTechBeep(); setActiveTab('leadership'); }}
              className={`flex-shrink-0 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${loadingInterpret ? 'opacity-50 cursor-not-allowed' : ''} ${
                activeTab === 'leadership'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>⚙️</span> 조율 & 리더십
            </button>
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* 1. 천부 특화 재능 탭 */}
            {activeTab === 'talents' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex gap-2.5 items-start">
                  <Info size={16} className="mt-0.5 shrink-0" />
                  <p className="leading-relaxed">
                    당신만을 위해 정렬된 <strong>4대 천부 특화 재능</strong>입니다. 각 천재성 카드를 터치하시면, 명심 AI 도슨트가 사주 주파수 맥락과 융합하여 당신만을 위한 상세 자각 해설(뉴럴/메타코드)을 일깨워 줍니다.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {talentsData.map((talent) => (
                    <motion.div
                      key={talent.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-5 rounded-2xl bg-slate-900 border border-white/10 hover:border-indigo-500/40 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                      onClick={() => handleFetchGeniusInterpretation(talent.name, '특화 천부', talent.desc, 'talent')}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-3xl">{talent.icon}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-indigo-300">
                            {talent.badge}
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                          {talent.name}
                        </h4>
                        <p className="text-[10px] font-mono text-gray-500 mt-0.5">{talent.english}</p>
                        <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">
                          {talent.desc}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-indigo-400 group-hover:text-indigo-300">
                        <span>AI 마스터 성찰 가이드 보기</span>
                        <span>➔</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. 6대 천명 에너지 프로파일 탭 */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex gap-2.5 items-start">
                  <Info size={16} className="mt-0.5 shrink-0" />
                  <p className="leading-relaxed">
                    당신이 일을 추진할 때 무의식적으로 지향하고 가치를 두는 <strong>6대 천명 에너지 분포도</strong>입니다. 각 그래프 항목을 클릭하여 세부 가이드를 AI 도슨트로부터 전해 들어 보세요.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* 차트 영역 */}
                  <div className="lg:col-span-7 bg-slate-900/60 border border-white/5 p-4 rounded-2xl h-[280px]">
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={profileChartData}
                          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                          <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fill: '#E5E7EB', fontSize: 11, fontWeight: 'bold' }}
                            width={110}
                          />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                          <Bar
                            dataKey="value"
                            radius={[0, 4, 4, 0]}
                            isAnimationActive={true}
                            animationDuration={1000}
                          >
                            {profileChartData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color} 
                                className="cursor-pointer"
                                onClick={() => handleFetchGeniusInterpretation(entry.name, `${entry.value}/100`, entry.desc, 'profile')}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500 text-xs">
                        차트를 로드 중입니다...
                      </div>
                    )}
                  </div>

                  {/* 정성 리스트 영역 */}
                  <div className="lg:col-span-5 space-y-2">
                    {profileChartData.map((item, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleFetchGeniusInterpretation(item.name, `${item.value}/100`, item.desc, 'profile')}
                        className="p-3 bg-slate-900 border border-white/5 hover:border-indigo-500/30 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <div>
                            <p className="text-xs font-extrabold text-white">{item.name}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{item.desc.split(' // ')[0]}</p>
                          </div>
                        </div>
                        <span className="font-mono text-sm font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg shrink-0">
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. 공동체 기여 파워베이스 탭 */}
            {activeTab === 'powerbase' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex gap-2.5 items-start">
                  <Info size={16} className="mt-0.5 shrink-0" />
                  <p className="leading-relaxed">
                    당신이 공동체나 조직 내에서 <strong>무의식적으로 기여하는 파워베이스(조직적 힘)의 비율</strong>입니다. 경리 님은 특히 <strong>소통 촉진 및 상호작용(49%)</strong>과 <strong>혁신 주도 및 변화(21%)</strong>가 가장 큰 축을 담당합니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* 도넛 그래프 */}
                  <div className="lg:col-span-5 flex justify-center items-center py-4">
                    {isMounted ? (
                      <div className="relative w-56 h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={powerbaseChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={85}
                              paddingAngle={3}
                              dataKey="value"
                              isAnimationActive={true}
                              animationDuration={1000}
                            >
                              {powerbaseChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                  className="cursor-pointer focus:outline-none"
                                  onClick={() => handleFetchGeniusInterpretation(entry.name, `${entry.value}%`, '조직 내 무의식적 기여 기질', 'powerbase')}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Communication</span>
                          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">49%</span>
                          <span className="text-[10px] text-gray-400 mt-0.5">상생 기여도</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-xs">도형을 생성 중입니다...</div>
                    )}
                  </div>

                  {/* 기여 비율 리스트 */}
                  <div className="lg:col-span-7 space-y-2.5">
                    {powerbaseChartData.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleFetchGeniusInterpretation(item.name, `${item.value}%`, '공동체 내 무의식적 기여도', 'powerbase')}
                        className="p-3 bg-slate-900 border border-white/5 hover:border-indigo-500/30 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3 w-full mr-4">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <div className="w-full">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-xs font-bold text-white leading-none">{item.name}</p>
                              <span className="font-mono text-xs font-black text-indigo-300">{item.value}%</span>
                            </div>
                            {/* 미니 게이지 바 */}
                            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ duration: 1.2, delay: idx * 0.1 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. 조율 및 리더십 기질 탭 */}
            {activeTab === 'leadership' && (
              <div className="space-y-6">
                
                {/* 4대 기질 카드 격자 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {leadershipData.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleFetchGeniusInterpretation(item.title, item.value, item.desc, 'leadership')}
                      className="p-5 bg-slate-900/60 border border-white/5 hover:border-indigo-500/30 rounded-2xl cursor-pointer transition-all duration-300 flex gap-4"
                    >
                      <span className="text-3xl shrink-0 p-2.5 bg-slate-950 rounded-xl h-fit border border-white/5">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-gray-500">{item.title}</p>
                        <p className="text-sm font-extrabold text-indigo-300 mt-1">{item.value}</p>
                        <p className="text-xs text-gray-400 mt-2 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 협동 키워드 카드 */}
                <div className="p-5 bg-slate-900 border border-white/10 rounded-2xl">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
                    🤝 명심 협동 조율 프로파일 키워드
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cooperationKeywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        onClick={() => handleFetchGeniusInterpretation('명심 협동 기질', keyword.split(' (')[0], keyword, 'cooperation')}
                        className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-950 border border-white/5 hover:border-indigo-500/40 text-gray-300 hover:text-white cursor-pointer transition-colors"
                      >
                        ✓ {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AI 마스터 도슨트 해석 실시간 피드백 박스 */}
            <AnimatePresence>
              {(loadingInterpret || interpretText) && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="mt-6 border border-indigo-500/30 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-950 p-5 shadow-inner"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-400" />
                      AI 천재성 도슨트 해설
                    </h3>
                    {selectedItemName && (
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded-full font-bold">
                        {selectedItemName}
                      </span>
                    )}
                  </div>

                  {loadingInterpret ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
                      <p className="text-xs text-gray-500">당신의 고유 사주 주파수와 지니어스 코드를 융합 해독하는 중...</p>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap max-h-[450px] overflow-y-auto pr-2 scrollbar-thin"
                    >
                      {interpretText}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 푸터 */}
          <div className="p-5 border-t border-white/5 bg-slate-950 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-[10px] text-gray-500 text-center sm:text-left leading-normal">
              이 리포트는 경리 님의 64Keys Genius Report Compact를 반영하여 명심코칭 명칭으로 해독되었습니다.
            </span>
            <button
              onClick={() => {
                playTechBeep();
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-all"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
