'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import CandyRitualCanvas from '@/components/coaching/CandyRitualCanvas';
import { useReportStore } from '@/store/useReportStore';

interface PillData {
  id?: string;
  flavor: string;
  keyword: string;
  scan: string;
  sync: string;
  shift: string;
  log: string;
  target_date?: string;
}

// 타이핑 애니메이션 효과를 주는 간단한 컴포넌트
function TypingText({ text, speed = 25 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    if (!text) return;
    
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className="whitespace-pre-line">{displayedText}</span>;
}

export default function ZeroCapsulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<PillData | null>(null);
  const [history, setHistory] = useState<PillData[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [phase, setPhase] = useState<'intro' | 'scan' | 'sync' | 'shift'>('intro');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // KST 오늘 날짜 헬퍼
  const getKstTodayStr = () => {
    const today = new Date();
    const kstDate = new Date(today.getTime() + 9 * 60 * 60 * 1000);
    return kstDate.toISOString().split('T')[0];
  };

  const todayStr = getKstTodayStr();
  const isTodayGenerated = history.some(item => item.target_date === todayStr);

  const fetchHistoryAndToday = async () => {
    try {
      // 오늘의 알약 정보 획득 (단순 조회, 자동 생성 없음)
      const res = await fetch('/api/zero-capsule/today');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }

      // 전체 과거 복용 이력 획득
      const histRes = await fetch('/api/zero-capsule/history');
      if (histRes.ok) {
        const histJson = await histRes.json();
        setHistory(histJson);
      }
    } catch (err) {
      console.error("알약 데이터 로딩 에러:", err);
    }
  };

  useEffect(() => {
    async function checkAuthAndFetch() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }
        await fetchHistoryAndToday();
      } catch (err) {
        console.error("인증 및 초기화 에러:", err);
      } finally {
        setLoading(false);
      }
    }
    checkAuthAndFetch();
  }, [router]);

  const reportData = useReportStore((s) => s.reportData);

  // AI 캡슐 생성 요청 핸들러
  const handleGenerateCapsule = async () => {
    if (isTodayGenerated) {
      alert("이미 오늘의 디지털 알약이 생성되었습니다. 다음날 새롭게 생성 가능합니다.");
      return;
    }

    setIsGenerating(true);
    try {
      // 로컬 스토리지 및 리포트 스토어에서 온보딩 사주 정보 추출
      let clientSajuInfo: any = {};
      if (typeof window !== 'undefined') {
        try {
          const rawOnboarding = localStorage.getItem('user_onboarding_data');
          if (rawOnboarding) {
            clientSajuInfo = JSON.parse(rawOnboarding);
          }
        } catch (e) {
          console.warn('Failed to parse onboarding data from localStorage');
        }
      }

      const payload = {
        userName: reportData?.userName || (reportData as any)?.name || clientSajuInfo?.userName || clientSajuInfo?.name || '',
        birthDate: reportData?.birthDate || (reportData as any)?.birth_date || clientSajuInfo?.birthDate || clientSajuInfo?.birth_date || '',
        birthTime: reportData?.birthTime || (reportData as any)?.birth_time || clientSajuInfo?.birthTime || clientSajuInfo?.birth_time || '12:00',
        calendarType: (reportData as any)?.calendarType || (reportData as any)?.calendar_type || clientSajuInfo?.calendarType || clientSajuInfo?.calendar_type || 'solar',
        gender: reportData?.gender || clientSajuInfo?.gender || 'female',
        mbti: clientSajuInfo?.mbti || (reportData as any)?.meta?.mbti || ''
      };

      const res = await fetch('/api/zero-capsule/today', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const generatedPill = await res.json();
        setData(generatedPill);
        
        // 이력 다시 불러오기
        const histRes = await fetch('/api/zero-capsule/history');
        if (histRes.ok) {
          setHistory(await histRes.json());
        }
        
        alert("오늘의 새로운 1:1 맞춤 사주 디지털 알약이 컴파일되어 포장되었습니다! 💊");
        setPhase('intro'); // 생성된 알약을 복용할 수 있도록 인트로 단계로 세팅
        setShowHistory(false); // 모달 닫기
      } else {
        throw new Error("알약 생성 실패");
      }
    } catch (err) {
      console.error("알약 생성 에러:", err);
      alert("알약을 생성하는 도중 에러가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadHistory = (historyItem: PillData) => {
    setData(historyItem);
    setPhase('scan');
    setShowHistory(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-zinc-500 text-xs gap-2">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div>MYONGSIM_OS_CAPSULE: COMPILING...</div>
      </div>
    );
  }

  // 데이터가 없을 경우를 대비한 가상 디폴트 셋 (오늘 자 알약 미생성 시 안내용)
  const pill = data || {
    flavor: "제로포인트 디지털 알사탕 (생성 대기 중)",
    keyword: "알사탕 생성 전 - 순수 의식 대기 상태",
    scan: "오늘 자 디지털 알사탕이 아직 컴파일되지 않았습니다. 우측 상단의 [📚 HISTORY] 버튼을 눌러 오늘의 디지털 알사탕을 발급받거나, 과거의 자각 기록을 불러와서 스캔을 진행하세요.",
    sync: "과거 이력의 알사탕을 다시 자각하거나 오늘 자 알사탕을 새로 생성하여 제로포인트 주파수와 동기화하세요.",
    shift: "당신은 항상 깨어있는 스크린 그 자체입니다. 새로운 명심 주파수를 받아 존재의 자리로 시프트할 준비를 하세요.",
    log: "스스로 알사탕을 컴파일하기 전에도, 당신이라는 의식 스크린은 언제나 완전합니다."
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 p-6 flex flex-col justify-between font-sans relative overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .text-glow-yellow {
          text-shadow: 0 0 8px rgba(234, 179, 8, 0.4);
        }
        .text-glow-purple {
          text-shadow: 0 0 8px rgba(168, 85, 247, 0.4);
        }
        .text-glow-blue {
          text-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
        }
      `}} />

      {/* 모듈 헤더 */}
      <div className="flex justify-between items-center border-b border-zinc-900 pb-4 text-xs font-mono text-zinc-500 z-10">
        <button onClick={() => router.push('/')} className="hover:text-zinc-300 transition-all cursor-pointer">← BACK_TO_OS</button>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowHistory(true)} 
            className="text-blue-400 hover:text-blue-300 font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            📚 HISTORY
          </button>
          <div className="text-zinc-500 tracking-widest flex items-center gap-1.5 select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            CAPSULE_ACTIVE
          </div>
        </div>
      </div>

      {/* 메인 리추얼 캔버스 */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-6 z-10 space-y-6">
        
        {/* 알사탕 애니메이션 캔버스 영역 배치 */}
        <CandyRitualCanvas phase={phase} flavor={pill.flavor} />

        {phase === 'intro' && (
          <div className="text-center space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-blue-950/50 border border-blue-900/50 rounded-full text-xs font-mono text-blue-400 tracking-wider inline-block">
                {pill.flavor}
              </span>
              {pill.target_date && (
                <span className="text-[10px] text-zinc-600 block mt-1 font-mono">// COMPILING_DATE: {pill.target_date}</span>
              )}
              <h1 className="text-2xl font-bold tracking-tight text-zinc-200 pt-2 font-serif">
                {data ? "디지털 알사탕 리추얼" : "디지털 알사탕 컴파일 대기"}
              </h1>
              <p className="text-xs text-zinc-500 font-mono">
                {data ? "마음의 과열된 하드웨어 시스템 디버그" : "우측 상단 HISTORY에서 새로운 알사탕을 받아보세요"}
              </p>
            </div>
            
            {data ? (
              <button 
                onClick={() => setPhase('scan')} 
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm tracking-wide transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(59,130,246,0.3)] cursor-pointer"
              >
                디지털 알사탕 녹여 먹기 (리추얼 시작)
              </button>
            ) : (
              <button 
                onClick={() => setShowHistory(true)} 
                className="w-full py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-blue-400 font-semibold rounded-xl text-sm tracking-wide transition-all active:scale-[0.98] cursor-pointer"
              >
                📚 과거 자각 이력 / 신규 솔루션 발급
              </button>
            )}
          </div>
        )}

        {phase !== 'intro' && (
          <div className="space-y-5 animate-fadeIn">
            {/* 상단 3단계 네비게이션 탭 */}
            <div className="grid grid-cols-3 gap-2 font-mono text-[9px] text-center text-zinc-600">
              <button 
                onClick={() => setPhase('scan')}
                className={`py-2 rounded-md border transition-all cursor-pointer ${phase === 'scan' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/5 font-bold text-glow-yellow' : 'border-zinc-900 hover:text-zinc-400'}`}
              >
                01_SCAN (스캔)
              </button>
              <button 
                onClick={() => setPhase('sync')}
                className={`py-2 rounded-md border transition-all cursor-pointer ${phase === 'sync' ? 'border-purple-500/50 text-purple-400 bg-purple-500/5 font-bold text-glow-purple' : 'border-zinc-900 hover:text-zinc-400'}`}
              >
                02_SYNC (동기화)
              </button>
              <button 
                onClick={() => setPhase('shift')}
                className={`py-2 rounded-md border transition-all cursor-pointer ${phase === 'shift' ? 'border-blue-400/50 text-blue-400 bg-blue-400/5 font-bold text-glow-blue' : 'border-zinc-900 hover:text-zinc-400'}`}
              >
                03_SHIFT (시프트)
              </button>
            </div>

            {/* 디버그 텍스트 터미널 콘솔 */}
            <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-2xl shadow-xl min-h-[220px] flex flex-col justify-between backdrop-blur-md">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-600 block mb-2 select-none">
                  MYONGSIM_OS_LOG // {phase.toUpperCase()} {pill.target_date ? `// DATE_${pill.target_date}` : ''}
                </span>
                
                {phase === 'scan' && (
                  <span className="text-xs font-semibold text-yellow-500 mb-2 block font-mono">
                    [!] KEYWORD // {pill.keyword}
                  </span>
                )}
                {phase === 'sync' && (
                  <span className="text-xs font-semibold text-purple-400 mb-2 block font-mono">
                    [*] SYNC_CONNECTED // 제로포인트 주파수 정렬
                  </span>
                )}
                {phase === 'shift' && (
                  <span className="text-xs font-semibold text-blue-400 mb-2 block font-mono">
                    [#] SHIFT_COMPLETE // 본질 스크린 각성
                  </span>
                )}

                {/* 텍스트 렌더링 시 성함 글자 누락 자동 복원 */}
                {(() => {
                  const currentUserName = reportData?.userName || (reportData as any)?.name || '이경윤';
                  const fixPillName = (text: string) => {
                    if (!text || typeof text !== 'string') return text;
                    let fixed = text;
                    if (currentUserName && currentUserName.length === 3) {
                      const c1 = currentUserName[0];
                      const c2 = currentUserName[1];
                      const c3 = currentUserName[2];
                      fixed = fixed.replace(new RegExp(`${c1}${c3}님`, 'g'), `${currentUserName}님`);
                      fixed = fixed.replace(new RegExp(`(?<![가-힣])${c2}${c3}님`, 'g'), `${currentUserName}님`);
                    }
                    return fixed;
                  };

                  return (
                    <p className="text-sm text-zinc-300 leading-relaxed tracking-tight">
                      {phase === 'scan' && <TypingText text={fixPillName(pill.scan)} speed={15} />}
                      {phase === 'sync' && <TypingText text={fixPillName(pill.sync)} speed={15} />}
                      {phase === 'shift' && <TypingText text={fixPillName(pill.shift)} speed={15} />}
                    </p>
                  );
                })()}
              </div>

              {phase === 'shift' && (
                <div className="mt-4 p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl font-mono text-[11px] text-zinc-500 border-l-2 border-l-blue-400 animate-fadeIn">
                  <div className="text-[9px] text-zinc-600 select-none">OPERATOR_FINAL_LOG:</div>
                  <div className="italic mt-1 text-zinc-400">"{pill.log}"</div>
                </div>
              )}
            </div>

            {/* 하단 진행 제어 버튼 */}
            <div className="pt-1">
              {phase === 'scan' && (
                <button 
                  onClick={() => setPhase('sync')} 
                  className="w-full py-4 bg-zinc-900/80 border border-yellow-500/20 hover:bg-zinc-800/80 text-yellow-500 text-sm font-medium rounded-xl transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(234,179,8,0.05)] cursor-pointer"
                >
                  하드웨어 스캔 완료 ➔ 싱크(Sync) 동기화
                </button>
              )}
              {phase === 'sync' && (
                <button 
                  onClick={() => setPhase('shift')} 
                  className="w-full py-4 bg-zinc-900/80 border border-purple-500/20 hover:bg-zinc-800/80 text-purple-400 text-sm font-medium rounded-xl transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(168,85,247,0.05)] cursor-pointer"
                >
                  제로포인트 동기화 완료 ➔ 스크린 시프트(Shift)
                </button>
              )}
              {phase === 'shift' && (
                <button 
                  onClick={() => router.push('/')} 
                  className="w-full py-4 bg-zinc-100 hover:bg-white text-black text-sm font-bold rounded-xl transition-all shadow-[0_4px_25px_rgba(255,255,255,0.15)] active:scale-[0.98] cursor-pointer"
                >
                  제로포인트 복귀 완료 (오늘의 리추얼 정산 끝)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 히스토리 리스트 모달 (생성 기능 통합) */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/80 backdrop-filter backdrop-blur-md flex items-center justify-center p-6 z-50 animate-fadeIn">
          <div className="bg-[#0b0e14]/95 border border-zinc-900 rounded-2xl w-full max-w-md p-6 max-h-[85vh] flex flex-col justify-between shadow-2xl relative">
            <div>
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
                <h2 className="text-sm font-bold text-zinc-200 font-mono flex items-center gap-2">
                  <span>🍬</span> CAPSULE_ARCHIVE
                </h2>
                <button 
                  onClick={() => setShowHistory(false)} 
                  className="text-zinc-500 hover:text-zinc-300 font-mono text-xs cursor-pointer border border-zinc-800 px-2 py-1 rounded hover:bg-zinc-900 transition-colors"
                >
                  CLOSE [X]
                </button>
              </div>

              {/* 알약 AI 생성 보드 */}
              <div className="mb-5 p-4 bg-zinc-950/80 border border-zinc-900 rounded-xl text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-blue-400">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                  <span>CAPSULE_COMPILER v2.5</span>
                </div>
                
                {isTodayGenerated ? (
                  <div className="py-2.5 px-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-[10px] text-zinc-400 leading-relaxed font-semibold">
                    ✅ 오늘의 디지털 알사탕이 이미 발급되었습니다.<br/>
                    <span className="text-zinc-600 font-normal">이미 생성된 거면 다음날 새롭게 생성 가능합니다.</span>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateCapsule}
                    disabled={isGenerating}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-bold rounded-xl text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-[0_2px_10px_rgba(59,130,246,0.2)] cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-300" />
                        <span>오늘의 알약 컴파일 중...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        <span>오늘의 디지털 알약 AI 생성하기</span>
                      </>
                    )}
                  </button>
                )}
                
                <p className="text-[9px] text-zinc-600 leading-relaxed select-none">
                  ※ 하루에 한 알의 자각 알사탕만 조제되어 기록됩니다. 중복 컴파일이 차단되어 토큰 폭탄을 예방합니다.
                </p>
              </div>
              
              <div className="overflow-y-auto space-y-2.5 pr-1 max-h-[40vh] scrollbar-hide">
                {history.length === 0 ? (
                  <div className="text-center py-10 text-zinc-600 text-xs font-mono">
                    NO_CAPSULE_LOGS_FOUND
                  </div>
                ) : (
                  history.map((item, index) => (
                    <button 
                      key={item.id || index}
                      onClick={() => handleLoadHistory(item)}
                      className="w-full text-left p-4 bg-zinc-950/60 hover:bg-zinc-900/60 border border-zinc-900 rounded-xl transition-all hover:border-zinc-800 flex justify-between items-center group cursor-pointer"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-zinc-600 block mb-0.5">{item.target_date}</span>
                        <span className="text-sm font-semibold text-zinc-300 group-hover:text-blue-400 transition-colors">{item.flavor}</span>
                      </div>
                      <span className="text-xs text-zinc-500 group-hover:text-zinc-300 font-mono">OPEN →</span>
                    </button>
                  ))
                )}
              </div>
            </div>
            
            <div className="pt-3 mt-3 border-t border-zinc-900 text-center text-[10px] font-mono text-zinc-600 tracking-wider">
              TOTAL_LOGGED_CAPSULES: {history.length}
            </div>
          </div>
        </div>
      )}

      {/* 푸터 시스템 로그 표시 */}
      <div className="text-center text-[9px] font-mono text-zinc-700 tracking-widest z-10 select-none">
        MYONGSIM COCHING OS V2.5 // BY LEE KYUNG-YOON
      </div>
    </div>
  );
}
