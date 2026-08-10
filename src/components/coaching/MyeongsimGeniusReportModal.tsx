'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, Info, Check, MessageSquare, Shield, Users, HelpCircle, Trophy, Zap } from 'lucide-react';
import { playTechBeep, playSuccessChime, playScanPulse } from '@/utils/sfx';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReportStore } from '@/store/useReportStore';
import { Cell, Pie, PieChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import PaymentCard from '@/components/chat/PaymentCard';

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

// 커스텀 툴팁 — [Fix] 사용자별 동적 1위/2위 지표의 비율 수치를 🔒 블러 890원 해독 처리
const CustomTooltip = ({ active, payload, topNames }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isTopTalent = topNames?.includes(data.name);

    return (
      <div className="bg-slate-950/95 border border-amber-500/30 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-white font-bold text-xs">{data.name}</p>
        {isTopTalent ? (
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-amber-300 font-mono text-xs font-black">비율:</span>
            <span className="filter blur-[4px] text-amber-300 text-xs font-mono font-bold select-none">{data.value}%</span>
            <span className="text-[9px] bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black px-1.5 py-0.5 rounded">
              🔒 890원 해독 ➔
            </span>
          </div>
        ) : (
          <p className="text-indigo-300 font-mono text-xs mt-1 font-bold">
            비율: {data.value}%
          </p>
        )}
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
  const [interpretRemaining, setInterpretRemaining] = useState<number>(10);
  const [interpretCooldown, setInterpretCooldown] = useState<number>(0);
  const lastInterpretCallRef = React.useRef<number>(0);
  const [selectedItemName, setSelectedItemName] = useState<string | null>(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState<{name: string, value: string, desc: string, type: string} | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [pendingItemToInterpret, setPendingItemToInterpret] = useState<any>(null);

  // [보안] 로컬 캐시 맵 — 한 번 생성된 해설은 재호출 없이 즉시 재사용
  const interpretCacheRef = React.useRef<Record<string, string>>({});

  // 사용자 정보 병합 & 생년월일 기반 동적 천명 알고리즘 연동
  const profile = useMemo(() => {
    return userProfile || reportData || {};
  }, [userProfile, reportData]);

  const userName = profile.userName || profile.name || '이경윤';

  // 사용자 생년월일/프로필 기반 동적 사주/천명 에너지 계산 알고리즘
  const dynamicScores = useMemo(() => {
    const rawName = profile.userName || profile.name || '이경윤';
    const rawDate = profile.birthDate || (profile.birthYear ? `${profile.birthYear}.${String(profile.birthMonth).padStart(2, '0')}.${String(profile.birthDay).padStart(2, '0')}` : '1976.09.09');
    const rawTime = profile.birthTime || '오시';
    const rawGender = profile.gender || 'female';

    // 해시 시드 생성 (생년월일 + 이름 + 생시 + 성별)
    let hash = 0;
    const str = `${rawName}_${rawDate}_${rawTime}_${rawGender}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    // 6대 천명 기본 기질 항목 정의
    const baseEnergies = [
      { name: '행동 실현', color: '#EF4444', desc: '생각에만 머물지 않고 눈앞의 결실과 돈으로 완성해 내는 불꽃의 추진 파워' },
      { name: '보급 시장', color: '#F59E0B', desc: '내 가치와 상품을 세상에 널리 알려 사람과 자금을 끌어모으는 전파 파워' },
      { name: '가치 변형', color: '#8B5CF6', desc: '평범한 아이디어나 사업의 격을 10배 이상 끌어올리는 연금술적 혁신 파워' },
      { name: '분석 자원', color: '#10B981', desc: '복잡한 위기 속에서도 자원과 흐름을 한눈에 꿰어내는 천재적 이성 전략' },
      { name: '제품 개발', color: '#3B82F6', desc: '세상에 없던 단단한 뼈대와 실체를 완성해 내는 장인형 실체화 파워' },
      { name: '고객 접촉', color: '#EC4899', desc: '사람의 마음을 깊이 읽고 흔들리지 않는 신뢰와 연대를 직조하는 공감 파워' }
    ];

    // 유저 생년월일 시드(seed)에 따른 1위~6위 기질 순서 다이나믹 셔플 결정
    const primaryIdx = seed % 6;
    const secondaryIdx = (seed * 5 + 1) % 6 === primaryIdx ? (primaryIdx + 1) % 6 : (seed * 5 + 1) % 6;

    // 생년월일에 따른 항목별 가중치 점수 산출
    const rawScores = baseEnergies.map((item, idx) => {
      let weight = 20 + ((seed * (idx + 1) * 7) % 40);
      if (idx === primaryIdx) weight += 150; // 생년월일 사주 1위 마스터 기질 (솟구침)
      if (idx === secondaryIdx) weight += 90; // 생년월일 사주 2위 기질
      return { ...item, rawValue: weight };
    });

    const sumV = rawScores.reduce((acc, curr) => acc + curr.rawValue, 0);

    // 전체 100% 파이 상대 비율로 환산 및 내림차순 정렬
    const profileChartDataSorted = rawScores.map((item) => ({
      name: item.name,
      value: Math.round((item.rawValue / sumV) * 100),
      color: item.color,
      desc: item.desc
    })).sort((a, b) => b.value - a.value);

    // 100% 합계 보정
    const totalCalc = profileChartDataSorted.reduce((acc, curr) => acc + curr.value, 0);
    if (totalCalc !== 100 && profileChartDataSorted.length > 0) {
      profileChartDataSorted[0].value += (100 - totalCalc);
    }

    // 파워베이스 기질 동적 비율 계산 (총합 100%)
    const p1 = 35 + (seed % 20); // 소통 촉진 및 상호작용
    const p2 = 15 + ((seed * 2) % 15); // 혁신 주도 및 변화 추진
    const p3 = 10 + ((seed * 5) % 10); // 조직 경영 및 행정 안정
    const p4 = 10 + ((seed * 7) % 10); // 시장 우위 및 상업적 성공
    const p5 = 8 + ((seed * 11) % 8); // 목표 지향 기획 및 자원 조율
    const p6 = Math.max(1, 100 - (p1 + p2 + p3 + p4 + p5)); // 시스템 안정

    return {
      name: rawName,
      dateStr: rawDate,
      profileChartDataSorted,
      p1, p2, p3, p4, p5, p6
    };
  }, [profile]);

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

  // 2. 6대 천명 에너지 프로파일 (생년월일 사주 알고리즘 동적 연동 & 100% 파이 상대 비율 내림차순 정렬)
  const profileChartData = useMemo(() => {
    return dynamicScores.profileChartDataSorted;
  }, [dynamicScores]);

  // 3. 무의식적 공동체 기여 파워베이스 (생년월일 동적 연동)
  const powerbaseChartData = [
    { name: '소통 촉진 및 상호작용', value: dynamicScores.p1, color: '#EC4899' },
    { name: '혁신 주도 및 변화 추진', value: dynamicScores.p2, color: '#8B5CF6' },
    { name: '조직 경영 및 행정 안정', value: dynamicScores.p3, color: '#10B981' },
    { name: '시장 우위 및 상업적 성공', value: dynamicScores.p4, color: '#F59E0B' },
    { name: '목표 지향 기획 및 자원 조율', value: dynamicScores.p5, color: '#3B82F6' },
    { name: '시스템 안정 및 지속 가능성', value: dynamicScores.p6, color: '#9CA3AF' }
  ];

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
      desc: '예측 불가능한 위기와 혼란 속에서도 순간적인 메타인지 감각으로 명쾌한 돌파구가 되는 즉흥 에너지입니다.',
      icon: '🎭',
      color: 'from-pink-500 to-rose-500',
      badge: '각성 메타코드'
    }
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

  // 2. AI 도슨트 해설 호출 (하루 10회 캐시 + 쿨다운 보안 + 중복 요청 방지)
  const INTERPRET_COOLDOWN_SEC = 30; // 30초 쿨다운

  // localStorage 기반 하루 10회 캐시 헬퍼
  const getTodayKey = () => new Date().toISOString().slice(0, 10); // "2026-06-29"

  const getDailyCacheObj = (cacheKey: string) => {
    try {
      const stored = localStorage.getItem(`genius::${cacheKey}`);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (parsed.date === getTodayKey()) {
        return {
          contents: parsed.contents || [parsed.content].filter(Boolean),
          count: parsed.count || 1
        };
      }
      // 날짜가 다르면 만료된 캐시 삭제
      localStorage.removeItem(`genius::${cacheKey}`);
      return null;
    } catch { return null; }
  };

  const setDailyCacheObj = (cacheKey: string, content: string, currentCache: any) => {
    try {
      const contents = currentCache ? [...currentCache.contents, content] : [content];
      const count = currentCache ? currentCache.count + 1 : 1;
      localStorage.setItem(`genius::${cacheKey}`, JSON.stringify({
        date: getTodayKey(),
        contents,
        count
      }));
      setInterpretRemaining(10 - count);
    } catch { /* localStorage 용량 초과 시 무시 */ }
  };

  // AI 도슨트 해석 요청 (캐시 우선 + 로딩 중 중복 클릭 차단)
  const handleFetchGeniusInterpretation = async (name: string, value: string, desc: string, type: string, forceRegenerate = false, isPaid = false) => {
    // [보안] 결제가 완료되지 않았거나 로딩 중이면 API 호출 원천 차단 — 토큰 폭탄 100% 방지
    if (loadingInterpret) return;

    if (!isPaid && !interpretCacheRef.current[`${type}::${name}`]) {
      // 결제가 안 된 항목이면 무조건 토스 결제 팝업창 오픈
      setPendingItemToInterpret({ name, value, desc, type });
      setShowPaymentModal(true);
      return;
    }

    const cacheKey = `${type}::${name}`;

    // 상태 기억
    setSelectedItemDetails({ name, value, desc, type });

    // 1) 메모리 캐시 확인 (강제 재생성이 아닐 때만)
    if (!forceRegenerate && interpretCacheRef.current[cacheKey]) {
      playTechBeep();
      setSelectedItemName(name);
      setInterpretText(interpretCacheRef.current[cacheKey]);
      const dailyCached = getDailyCacheObj(cacheKey);
      setInterpretRemaining(dailyCached ? 10 - dailyCached.count : 10);
      return;
    }

    // 2) localStorage 하루 캐시 확인 (같은 날이고 강제 재생성이 아니면 API 호출 안 함)
    const dailyCached = getDailyCacheObj(cacheKey);
    if (!forceRegenerate && dailyCached && dailyCached.contents.length > 0) {
      playTechBeep();
      const lastContent = dailyCached.contents[dailyCached.contents.length - 1];
      interpretCacheRef.current[cacheKey] = lastContent; // 메모리에도 올림
      setSelectedItemName(name);
      setInterpretText(lastContent);
      setInterpretRemaining(10 - dailyCached.count);
      return;
    }

    // 3) 오늘 자 생성 횟수가 10회 이상이면 차단
    if (dailyCached && dailyCached.count >= 10) {
      playTechBeep();
      setSelectedItemName(name);
      setInterpretText(`${dailyCached.contents[dailyCached.contents.length - 1]}\n\n⚠️ 오늘의 명심 AI 코치 해설 재생성 한도(하루 10회)를 모두 소진하셨습니다. 내일 새로운 해설을 들으실 수 있습니다. ✨`);
      setInterpretRemaining(0);
      return;
    }

    // 4) 30초 쿨다운 — 새 API 호출 간 최소 간격 강제
    const now = Date.now();
    const elapsed = (now - lastInterpretCallRef.current) / 1000;
    if (lastInterpretCallRef.current > 0 && elapsed < INTERPRET_COOLDOWN_SEC) {
      const remaining = Math.ceil(INTERPRET_COOLDOWN_SEC - elapsed);
      setInterpretCooldown(remaining);
      playTechBeep();
      setSelectedItemName(name);
      setInterpretText(`🛡️ 명심 AI 코치 보호 모드\n\n에너지 과부하를 방지하기 위해 ${remaining}초 후에 다시 해설을 요청해 주세요.\n\n잠시 호흡을 가다듬으며, 방금 읽은 해설을 마음속에서 되새겨 보는 시간을 가져보세요. ✨`);
      // 카운트다운 타이머
      const timer = setInterval(() => {
        setInterpretCooldown(prev => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
      return;
    }
    lastInterpretCallRef.current = now;

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

      if (!response.ok) throw new Error('명심 AI 코치 생성 오류');
      const data = await response.json();
      if (data.success && data.interpretation) {
        interpretCacheRef.current[cacheKey] = data.interpretation;
        setDailyCacheObj(cacheKey, data.interpretation, dailyCached);
        setInterpretText(data.interpretation);
        setInterpretRemaining(9 - (dailyCached ? dailyCached.count : 0));
        playSuccessChime();

        // 📚 [개인 영혼 보관함] 생성된 해설 콘텐츠 자동 축적 저장 (훗날 나만의 책 제작용)
        try {
          const archiveKey = 'myeongsim_soul_archive';
          const existingArchive = JSON.parse(localStorage.getItem(archiveKey) || '[]');
          const newEntry = {
            id: Date.now().toString(),
            title: `${name} (${value})`,
            content: data.interpretation,
            createdAt: new Date().toISOString().slice(0, 10),
            category: '본재 자각 해설'
          };
          // 중복 방지 저장
          const updatedArchive = [newEntry, ...existingArchive.filter((item: any) => item.title !== newEntry.title)];
          localStorage.setItem(archiveKey, JSON.stringify(updatedArchive));
        } catch (e) {
          console.error("Soul Archive Save Error:", e);
        }
      } else {
        throw new Error(data.error || '해설을 가져올 수 없습니다.');
      }
    } catch (err) {
      console.error(err);
      setInterpretText('천부 성정 기질 해독 중 일시적인 네트워크 지연이 발생했습니다. 다시 클릭해 주시면 명심 AI 코치가 정성껏 해석을 안내해 드리겠습니다.');
    } finally {
      setLoadingInterpret(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="relative w-full max-w-4xl bg-slate-950/95 border border-indigo-500/30 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl flex flex-col h-[94dvh] sm:h-[88vh] max-h-[96dvh] sm:max-h-[900px]"
        >
          {/* 장식용 데코 */}
          <CropMarks />
          
          {/* 헤더 */}
          <div className="flex justify-between items-center p-4 sm:p-5 border-b border-white/10 bg-slate-900/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xl sm:text-2xl shrink-0 p-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">💡</span>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 truncate">
                  명심 천부성정 심리분석 보고서
                </h2>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>수검자: <strong className="text-indigo-300 font-bold">{userName}</strong> 님</span>
                  <span className="text-[9.5px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30 font-bold">
                    🎂 {dynamicScores.dateStr}
                  </span>
                  <span className="text-[9.5px] font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/30 font-bold">
                    🧬 사주 오행 융합
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  playTechBeep();
                  setShowPaymentModal(true);
                }}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-[10px] sm:text-xs shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-all active:scale-95 flex items-center gap-1 cursor-pointer border border-amber-400/40"
              >
                <Zap size={11} className="text-amber-300 animate-pulse fill-amber-300" />
                <span>⚡ 890원 솔루션 ➔</span>
              </button>
              <button
                onClick={() => {
                  playTechBeep();
                  onClose();
                }}
                className="p-1.5 sm:p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* 탭 네비게이션 — [Fix] 모바일 & 데스크톱 글자 짤림 100% 제거 반응형 그리드 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-900 border-b border-white/5 p-1.5 gap-1.5">
            <button
              disabled={loadingInterpret}
              onClick={() => { playTechBeep(); setActiveTab('talents'); }}
              className={`w-full py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1 text-center truncate ${loadingInterpret ? 'opacity-50 cursor-not-allowed' : ''} ${
                activeTab === 'talents'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg font-black ring-1 ring-violet-400/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 bg-slate-950/50 border border-white/5'
              }`}
            >
              <span>💡</span> <span className="truncate">천부 특화 재능</span>
            </button>
            <button
              disabled={loadingInterpret}
              onClick={() => { playTechBeep(); setActiveTab('profile'); }}
              className={`w-full py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1 text-center truncate ${loadingInterpret ? 'opacity-50 cursor-not-allowed' : ''} ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg font-black ring-1 ring-violet-400/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 bg-slate-950/50 border border-white/5'
              }`}
            >
              <span>📊</span> <span className="truncate">6대 천명 에너지</span>
            </button>
            <button
              disabled={loadingInterpret}
              onClick={() => { playTechBeep(); setActiveTab('powerbase'); }}
              className={`w-full py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1 text-center truncate ${loadingInterpret ? 'opacity-50 cursor-not-allowed' : ''} ${
                activeTab === 'powerbase'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg font-black ring-1 ring-violet-400/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 bg-slate-950/50 border border-white/5'
              }`}
            >
              <span>🌌</span> <span className="truncate">공동체 기여</span>
            </button>
            <button
              disabled={loadingInterpret}
              onClick={() => { playTechBeep(); setActiveTab('leadership'); }}
              className={`w-full py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1 text-center truncate ${loadingInterpret ? 'opacity-50 cursor-not-allowed' : ''} ${
                activeTab === 'leadership'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg font-black ring-1 ring-violet-400/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 bg-slate-950/50 border border-white/5'
              }`}
            >
              <span>⚙️</span> <span className="truncate">조율 & 리더십</span>
            </button>
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div 
            className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >

            {/* 🏛️ [대한민국 특허출원중 공식 증빙 뱃지 카드] */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🏛️</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-300">대한민국 특허출원중</span>
                    <span className="text-[10px] font-mono text-amber-400/90 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      제10-2025-0166877호
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-200/90 mt-0.5 font-bold leading-tight">
                    발명 명칭: 심리 및 생체데이터 기반 스트레스 관리 솔루션 제공장치 및 이를 이용한 스트레스 관리솔루션 제공방법
                  </p>
                  <p className="text-[9.5px] text-gray-400 mt-0.5 font-medium">
                    출원인: 이경윤 | 3세대 CBT/ACT 심리학 & 뇌신경가소성(Neuroplasticity) 교정 알고리즘
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  playTechBeep();
                  if (navigator.share) {
                    navigator.share({
                      title: '명심 AI 코치 본빛 기질 리포트',
                      text: `${userName || '명심가'} 님의 특허출원중(제10-2025-0166877호) 천명 기질 리포트를 확인해 보세요!`,
                      url: window.location.href,
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('리포트 링크가 복사되었습니다! 친구들에게 공유해 보세요. ✨');
                  }
                }}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <span>📲 공유하기</span>
              </button>
            </div>
            
            {/* 1. 천부 특화 재능 탭 */}
            {activeTab === 'talents' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex gap-2.5 items-start">
                  <Info size={16} className="mt-0.5 shrink-0 text-amber-300" />
                  <p className="leading-relaxed">
                    <strong>{userName}</strong> 님의 생년월일 사주 원국 오행 생극 파동과 100% 결합 연동된 <strong>4대 천부 특화 재능</strong>입니다. 각 천부 기질 카드를 터치하시면, 명심 AI 코치가 동양학과 서양심리학의 융합 주파수 맥락으로 당신만을 위한 1:1 심층 자각 해설을 일깨워 줍니다.
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
                      <div 
                        className="mt-4 flex items-center justify-between text-[11px] font-bold text-indigo-400 group-hover:text-indigo-300 border-t border-indigo-500/20 pt-2.5 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          playTechBeep();
                          setPendingItemToInterpret({ name: talent.name, value: '특화 천부', desc: talent.desc, type: 'talent' });
                          setShowPaymentModal(true);
                        }}
                      >
                        <span className="flex items-center gap-1 text-amber-300">
                          🔒 AI 마스터 성찰 가이드 해독
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-500 line-through">19,000원</span>
                          <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-[10px] px-2 py-0.5 rounded-full shadow">
                            특허출원중 한시적 1,900원 ➔
                          </span>
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. 6대 천명 에너지 프로파일 탭 (스위스 미니멀 & 6각 방사형 아우라 UI/UX 리디자인) */}
            {activeTab === 'profile' && (
              <div className="space-y-5">
                {/* 👑 마스터 에너지 칭호 뱃지 */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-indigo-500/15 border border-amber-500/30 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">👑</span>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">1위 천명 핵심 에너지</span>
                      <h4 className="text-sm font-black text-white mt-0.5">
                        {userName || '이경윤'} 님은 <span className="text-amber-300 font-serif">[{profileChartData[0]?.name}]</span> 에너지가 가장 강렬한 창조자입니다.
                      </h4>
                    </div>
                  </div>
                  <div 
                    onClick={() => {
                      playTechBeep();
                      setPendingItemToInterpret({ name: profileChartData[0]?.name, value: `${profileChartData[0]?.value}%`, desc: profileChartData[0]?.desc, type: 'profile' });
                      setShowPaymentModal(true);
                    }}
                    className="cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-xs px-3 py-1.5 rounded-xl shadow-lg hover:scale-105 transition-all shrink-0 flex items-center gap-1"
                  >
                    <span>🔒 1위 수치 해독</span>
                    <span className="text-[10px] bg-black/20 text-black px-1.5 rounded">890원</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* 6각 방사형 차트 영역 — [Fix] 대표님 지침: 그래프는 시원하게 전면 노출, 오른쪽에 위치한 1위/2위 숫자 수치만 블러 처리 */}
                  <div className="lg:col-span-5 bg-slate-900/80 border border-indigo-500/20 p-3 rounded-2xl h-[290px] flex flex-col justify-between relative overflow-hidden">
                    <div className="text-[11px] font-bold text-gray-300 flex justify-between items-center px-1 pt-1 border-b border-white/5 pb-1">
                      <span>🔷 6대 천명 에너지 밸런스</span>
                      <span className="text-indigo-400 font-extrabold text-[10px]">6각 기질 밸런스</span>
                    </div>

                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="88%">
                        <RadarChart cx="50%" cy="50%" outerRadius="82%" data={profileChartData}>
                          <PolarGrid stroke="#475569" strokeDasharray="3 3" />
                          <PolarAngleAxis dataKey="name" tick={{ fill: '#F3F4F6', fontSize: 10, fontWeight: '900' }} />
                          {/* 🚀 [수술] 동적 스케일링: 최고 수치(maxVal)에 맞게 domain을 자동 조절하여 1위 기질이 웅장하게 차트 끝까지 확 솟구침 */}
                          <PolarRadiusAxis 
                            angle={30} 
                            domain={[0, Math.ceil(Math.max(...profileChartData.map(d => d.value)) * 1.12)]} 
                            tick={false} 
                            axisLine={false} 
                          />
                          <Radar name="에너지 밸런스" dataKey="value" stroke="#A855F7" fill="#8B5CF6" fillOpacity={0.55} strokeWidth={2} />
                          <Tooltip content={<CustomTooltip topNames={[...profileChartData].sort((a, b) => b.value - a.value).slice(0, 2).map(x => x.name)} />} />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500 text-xs">
                        차트를 로드 중입니다...
                      </div>
                    )}
                  </div>

                  {/* 통합형 네온 프로그레스 바 카드 리스트 영역 */}
                  <div className="lg:col-span-7 space-y-2.5">
                    {profileChartData.map((item, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleFetchGeniusInterpretation(item.name, `${item.value}/100`, item.desc, 'profile')}
                        className={`p-3 rounded-xl border transition-all duration-300 flex flex-col gap-2.5 cursor-pointer group ${
                          idx < 2 
                            ? 'bg-slate-900/90 border-amber-500/40 hover:border-amber-400 shadow-md' 
                            : 'bg-slate-900/60 border-white/5 hover:border-indigo-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color }} />
                            <div>
                              <span className="text-xs font-black text-white group-hover:text-indigo-300 transition-colors">{item.name}</span>
                              <p className="text-[10px] text-gray-400 mt-0.5 font-medium leading-tight">{item.desc}</p>
                            </div>
                          </div>
                          <div 
                            className="flex items-center gap-1.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              playTechBeep();
                              setPendingItemToInterpret({ name: item.name, value: `${item.value}%`, desc: item.desc, type: 'profile' });
                              setShowPaymentModal(true);
                            }}
                          >
                            {idx < 2 ? (
                              <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1.5 shadow">
                                <span className="filter blur-[4px] select-none">{item.value}%</span>
                                <span className="text-[9px] bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black px-1.5 py-0.5 rounded">
                                  🔒 890원 해독 ➔
                                </span>
                              </span>
                            ) : (
                              <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                                {item.value}%
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 내장 네온 프로그레스 바 */}
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>

                        {/* 💡 대표님 대박 UX 아이디어: 명심 AI 코치의 나의 알고리즘 상세 해설 듣기 CTA 서브 바 */}
                        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[9.5px]">
                          <span className="text-indigo-300 font-bold flex items-center gap-1 group-hover:text-amber-300 transition-colors">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>✨ 명심 AI 코치의 나의 알고리즘(뉴럴코드) 상세 해설 듣기</span>
                          </span>
                          <span className="text-gray-400 group-hover:translate-x-0.5 transition-transform">➔</span>
                        </div>
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
                    당신이 공동체나 조직 내에서 <strong>무의식적으로 기여하는 파워베이스(조직적 힘)의 비율</strong>입니다. <strong className="text-amber-300 font-bold">{userName}</strong> 님은 특히 <strong>{powerbaseChartData[0]?.name}({powerbaseChartData[0]?.value}%)</strong>와 <strong>{powerbaseChartData[1]?.name}({powerbaseChartData[1]?.value}%)</strong>가 가장 큰 축을 담당합니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* 도넛 그래프 — [Fix] 모바일 & 데스크톱 짤림 방지 수술 */}
                  <div className="md:col-span-5 flex flex-col justify-center items-center py-4 bg-slate-900/60 rounded-2xl border border-white/5 p-4 shadow-inner">
                    {isMounted ? (
                      <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={powerbaseChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={78}
                              paddingAngle={3}
                              dataKey="value"
                              isAnimationActive={true}
                              animationDuration={1000}
                            >
                              {powerbaseChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                  className="cursor-pointer focus:outline-none hover:opacity-80 transition-opacity"
                                  onClick={() => handleFetchGeniusInterpretation(entry.name, `${entry.value}%`, '조직 내 무의식적 기여 기질', 'powerbase')}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip topNames={[...powerbaseChartData].sort((a, b) => b.value - a.value).slice(0, 2).map(x => x.name)} />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center p-2">
                          <span className="text-[10px] text-amber-300 font-black tracking-tight leading-none px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 max-w-[130px] truncate">
                            {powerbaseChartData[0]?.name || '상생 기여도'}
                          </span>
                          <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-indigo-400 mt-1">
                            {powerbaseChartData[0]?.value}%
                          </span>
                          <span className="text-[9px] text-gray-400 font-bold mt-0.5">핵심 기여 축</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-xs">도형을 생성 중입니다...</div>
                    )}
                  </div>

                  {/* 기여 비율 리스트 */}
                  <div className="md:col-span-7 space-y-2.5">
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
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleFetchGeniusInterpretation(item.title, item.value, item.desc, 'leadership')}
                      className="p-5 bg-slate-900 border border-white/10 hover:border-indigo-500/40 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                    >
                      <div className="flex gap-4 items-start">
                        <span className="text-3xl shrink-0 p-2.5 bg-slate-950 rounded-xl h-fit border border-white/10 shadow">{item.icon}</span>
                        <div>
                          <div className="flex justify-between items-start">
                            <p className="text-xs font-extrabold text-amber-400">{item.title}</p>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-indigo-300">
                              리더십 뉴럴코드
                            </span>
                          </div>
                          <p className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors mt-0.5">{item.value}</p>
                          <p className="text-xs text-gray-400 mt-2 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>

                      {/* 🔒 4번 탭 AI 해독 결제 트리 장착 */}
                      <div 
                        className="mt-4 flex items-center justify-between text-[11px] font-bold text-indigo-400 group-hover:text-indigo-300 border-t border-white/10 pt-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          playTechBeep();
                          setPendingItemToInterpret({ name: item.title, value: item.value, desc: item.desc, type: 'leadership' });
                          setShowPaymentModal(true);
                        }}
                      >
                        <span className="flex items-center gap-1 text-amber-300 font-extrabold">
                          🔒 AI 마스터 리더십/열정 해독
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-500 line-through">19,000원</span>
                          <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-[10px] px-2 py-0.5 rounded-full shadow">
                            890원 해독 ➔
                          </span>
                        </span>
                      </div>
                    </motion.div>
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

            {/* 명심 AI 코치 해석 실시간 피드백 박스 */}
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
                      명심 AI 코치 해설
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
                      <p className="text-xs text-gray-500">당신의 동서양 융합 기질 주파수와 본재 코드를 해독하는 중...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap max-h-[450px] overflow-y-auto pr-2 scrollbar-thin"
                      >
                        {interpretText}
                      </motion.div>
                      {selectedItemDetails && (
                        <div className="pt-3 border-t border-white/10 space-y-2.5">
                          {/* 🔮 [다음 결제 예고편 블러 티저 카드] */}
                          <div 
                            onClick={() => {
                              playTechBeep();
                              setPendingItemToInterpret({
                                name: selectedItemDetails.name,
                                value: selectedItemDetails.value,
                                desc: selectedItemDetails.desc,
                                type: selectedItemDetails.type
                              });
                              setShowPaymentModal(true);
                            }}
                            className="bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-3.5 shadow-xl cursor-pointer group hover:border-amber-400 transition-all relative overflow-hidden"
                          >
                            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                              <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                <span>🔮 다음 차원 다각도 심층 코칭 예고편</span>
                              </div>
                              <span className="text-[9.5px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                                🔒 890원 해독 대기
                              </span>
                            </div>

                            <p className="text-[11px] font-bold text-gray-300">
                              {userName || '이경윤'} 님의 [{selectedItemDetails.name}] 에너지가 다음 결제 시 조명할 [재정적 부의 전파 & 인간관계 신뢰 주파수]:
                            </p>

                            {/* 🔒 블러 미끼 예고 텍스트 */}
                            <div className="mt-1.5 p-2 rounded-xl bg-black/40 border border-white/5 relative">
                              <p className="text-[10.5px] text-amber-200/90 filter blur-[4px] select-none leading-relaxed">
                                {selectedItemDetails.name}의 숨겨진 무의식 주파수가 부의 기회와 결합할 때 나타나는 3D 직관 파동 및 뇌신경 뉴럴코드의 최적화 가이드...
                              </p>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-black text-amber-300 bg-slate-950/80 px-2.5 py-1 rounded-full border border-amber-400/40 shadow-lg">
                                  🔒 다음 차원 렌즈 잠금해제 ➔
                                </span>
                              </div>
                            </div>

                            <button className="w-full mt-2.5 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 group-hover:scale-[1.01] transition-transform">
                              <span>🔒 890원으로 다음 차원 심층 코칭 열기 ➔</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 푸터 */}
          <div className="p-5 border-t border-white/5 bg-slate-950 flex justify-end items-center gap-3">
            <button
              onClick={() => {
                playTechBeep();
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>

      {/* 💳 Toss Payment Modal for AI Master Reflection Guide */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-950 border border-amber-500/40 rounded-3xl p-4 shadow-2xl space-y-3 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>📜 [특허출원중 한시적 90% OFF] <span className="line-through text-gray-400">19,000원</span> ➔ 1,900원</span>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <PaymentCard
              onDetailedReport={() => {
                setShowPaymentModal(false);
                if (pendingItemToInterpret) {
                  handleFetchGeniusInterpretation(
                    pendingItemToInterpret.name,
                    pendingItemToInterpret.value,
                    pendingItemToInterpret.desc,
                    pendingItemToInterpret.type,
                    true,
                    true // isPaid = true 승인
                  );
                  setPendingItemToInterpret(null);
                }
              }}
            />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
