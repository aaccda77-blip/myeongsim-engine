'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

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

export default function ZeroCapsulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<PillData | null>(null);
  const [history, setHistory] = useState<PillData[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [phase, setPhase] = useState<'intro' | 'scan' | 'sync' | 'shift'>('intro');

  // 데이터 무결성 및 로그인 세션 보호를 위한 API 호출
  useEffect(() => {
    async function checkAuthAndFetch() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        // 오늘의 알약 정보 획득
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
      } finally {
        setLoading(false);
      }
    }
    checkAuthAndFetch();
  }, [router]);

  // 과거 알약 데이터를 불러올 때 캐싱 이력 재조정 헬퍼
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

  // 데이터가 없을 경우를 대비한 가상 디폴트 셋 (현침살 베이스)
  const pill = data || {
    flavor: "현침 100mg (날카로운 자각의 맛)",
    keyword: "현침살(懸針煞) - 정밀한 안목",
    scan: "오늘 유독 주변 상황이 예민하게 쪼개져 보이고 나도 모르게 스스로나 타인을 꼬집어 비판하려는 데이터(다크코드)가 작동하나요? 가만히 스캔하세요. 그것은 당신의 성격 오류가 아니라 오늘 입력된 사주 일진의 기후일 뿐입니다.",
    sync: "그 날카로운 칼날을 나를 찌르는 데 쓰지 말고, 현상 뒤에 가려진 진짜 버그를 찾아내는 정밀한 통찰력(뉴럴코드)으로 주파수를 동기화하세요. 칼자루를 쥐는 순간 에너지가 플립됩니다.",
    shift: "칼날이 춤을 추든 무뎌지든, 그 모든 감각적 로그를 생생하게 비추며 켜져 있는 당신의 텅 빈 의식 스크린(제로포인트)으로 존재의 자리를 완벽히 이동하세요. 당신은 데이터가 아니라 스크린입니다.",
    log: "화면 속 아바타가 아무리 꼬집혀 울어도, 의식 스크린 자체는 상처 입지 않는다."
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 p-6 flex flex-col justify-between font-sans relative">
      {/* CSS 애니메이션 주입 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* 모듈 헤더 */}
      <div className="flex justify-between items-center border-b border-zinc-900 pb-4 text-xs font-mono text-zinc-500 z-10">
        <button onClick={() => router.push('/')} className="hover:text-zinc-300 transition-all">← BACK_TO_OS</button>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowHistory(true)} 
            className="text-blue-400 hover:text-blue-300 font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            📚 HISTORY
          </button>
          <div className="text-zinc-500 tracking-widest flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            CAPSULE_ACTIVE
          </div>
        </div>
      </div>

      {/* 메인 리추얼 캔버스 */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-8 z-10">
        {phase === 'intro' && (
          <div className="text-center space-y-8 animate-fadeIn">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-b from-blue-500/20 to-indigo-500/5 border border-blue-500/30 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(59,130,246,0.25)] animate-pulse">💊</div>
            <div className="space-y-2">
              <span className="px-3 py-1 bg-blue-950/50 border border-blue-900/50 rounded-full text-xs font-mono text-blue-400 tracking-wider inline-block">{pill.flavor}</span>
              {pill.target_date && <span className="text-[10px] text-zinc-600 block mt-1 font-mono">// DATE: {pill.target_date}</span>}
              <h1 className="text-2xl font-bold tracking-tight text-zinc-200 pt-3">오늘의 디지털 명심처방</h1>
              <p className="text-sm text-zinc-500 font-mono">코딩된 일진 알고리즘 디버깅</p>
            </div>
            <button onClick={() => setPhase('scan')} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm tracking-wide transition-all active:scale-[0.98] shadow-[0_4px_15px_rgba(59,130,246,0.3)]">
              알약 복용 및 스캔 시작
            </button>
          </div>
        )}

        {phase !== 'intro' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 스텝 탭 뷰 */}
            <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center text-zinc-600">
              <button 
                onClick={() => setPhase('scan')}
                className={`py-1.5 rounded-md border transition-all ${phase === 'scan' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5' : 'border-zinc-900 hover:text-zinc-400'}`}
              >
                01_SCAN
              </button>
              <button 
                onClick={() => setPhase('sync')}
                className={`py-1.5 rounded-md border transition-all ${phase === 'sync' ? 'border-purple-500/50 text-purple-500 bg-purple-500/5' : 'border-zinc-900 hover:text-zinc-400'}`}
              >
                02_SYNC
              </button>
              <button 
                onClick={() => setPhase('shift')}
                className={`py-1.5 rounded-md border transition-all ${phase === 'shift' ? 'border-blue-400/50 text-blue-400 bg-blue-400/5' : 'border-zinc-900 hover:text-zinc-400'}`}
              >
                03_SHIFT
              </button>
            </div>

            {/* 메인 에세이 카드 */}
            <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-2xl shadow-xl min-h-[280px] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-600 block mb-2">
                  TARGET_LOG // {phase.toUpperCase()} {pill.target_date ? `// ${pill.target_date}` : ''}
                </span>
                {phase === 'scan' && <span className="text-xs font-semibold text-yellow-500 mb-2 block font-mono">{pill.keyword}</span>}
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed tracking-tight whitespace-pre-line">
                  {phase === 'scan' && pill.scan}
                  {phase === 'sync' && pill.sync}
                  {phase === 'shift' && pill.shift}
                </p>
              </div>

              {phase === 'shift' && (
                <div className="mt-4 p-4 bg-zinc-900/50 border border-zinc-900 rounded-xl font-mono text-xs text-zinc-500 border-l-2 border-l-blue-400">
                  <div className="text-[10px] text-zinc-600">MIND_CORE_LOG:</div>
                  <div className="italic mt-0.5 text-zinc-400">"{pill.log}"</div>
                </div>
              )}
            </div>

            {/* 인터랙션 버튼 컨트롤러 */}
            <div className="pt-2">
              {phase === 'scan' && (
                <button onClick={() => setPhase('sync')} className="w-full py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-yellow-500 text-sm font-medium rounded-xl transition-all active:scale-[0.98]">
                  다크코드 스캔 완료 ➔ 싱크 단계로
                </button>
              )}
              {phase === 'sync' && (
                <button onClick={() => setPhase('shift')} className="w-full py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-purple-400 text-sm font-medium rounded-xl transition-all active:scale-[0.98]">
                  뉴럴코드 동기화 완료 ➔ 제로포인트 시프트
                </button>
              )}
              {phase === 'shift' && (
                <button onClick={() => router.push('/')} className="w-full py-4 bg-zinc-100 hover:bg-white text-black text-sm font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)] active:scale-[0.98]">
                  완전한 제로포인트(0)로 오늘 정산 끝
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 히스토리 리스트 모달 */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/80 backdrop-filter backdrop-blur-md flex items-center justify-center p-6 z-50 animate-fadeIn">
          <div className="bg-[#0b0e14] border border-zinc-900 rounded-2xl w-full max-w-md p-6 max-h-[80vh] flex flex-col justify-between shadow-2xl relative">
            <div>
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
                <h2 className="text-base font-bold text-zinc-200 font-mono flex items-center gap-2">
                  <span>💊</span> CAPSULE_ARCHIVE
                </h2>
                <button 
                  onClick={() => setShowHistory(false)} 
                  className="text-zinc-500 hover:text-zinc-300 font-mono text-xs cursor-pointer border border-zinc-800 px-2 py-1 rounded hover:bg-zinc-900"
                >
                  CLOSE [X]
                </button>
              </div>
              
              <div className="overflow-y-auto space-y-2.5 pr-1 max-h-[55vh]">
                {history.length === 0 ? (
                  <div className="text-center py-16 text-zinc-600 text-xs font-mono">
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
            
            <div className="pt-4 mt-4 border-t border-zinc-900 text-center text-[10px] font-mono text-zinc-600 tracking-wider">
              TOTAL_LOGGED_CAPSULES: {history.length}
            </div>
          </div>
        </div>
      )}

      {/* 푸터 시스템 로그 표시 */}
      <div className="text-center text-[10px] font-mono text-zinc-700 tracking-widest z-10">
        MYONGSIM COCHING OS V2.5 // BY LEE KYUNG-YOON
      </div>
    </div>
  );
}
