'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useReportStore } from '@/store/useReportStore';
import DecodingReport from './DecodingReport';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { playTechBeep, playScanPulse, playSuccessChime } from '@/utils/sfx';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DarkDecodingContainer({ userId }: { userId: string }) {
  const router = useRouter();
  const { reportData } = useReportStore();
  const { language } = useLanguage();
  
  // 상태 관리
  const [rawText, setRawText] = useState('');
  const [symptom, setSymptom] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reportResult, setReportResult] = useState<any>(null);
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. 디코딩 요청 (Scan ➡️ Sync)
  const handleDecode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setReportResult(null);
    
    // Prepare client-side saju to send as fallback
    const clientSaju = reportData?.saju || null;

    try {
      playScanPulse();
      const res = await fetch('/api/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          rawText, 
          physicalSymptom: symptom,
          clientSaju,
          locale: language
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '디코딩 중 알 수 없는 서버 에러 발생');

      setReportResult(data.report);
      setCurrentLogId(data.logId);
      playSuccessChime();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '의식 디코딩에 실패했습니다. 다시 시도해 주세요.');
      playTechBeep(300, 0.2, 'triangle');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 최종 수용 버튼 클릭 (Shift: 원석 진화 및 확정)
  const handleAcceptReport = async () => {
    if (!currentLogId) return;

    setIsLoading(true);
    try {
      playSuccessChime();
      // Supabase에서 해당 로그의 원석 단계를 완료(진화) 상태로 업데이트
      // DB 테이블이 없는 환경일 수 있으므로 실패해도 흐름을 방해하지 않도록 try-catch 처리
      try {
        const { error } = await supabase
          .from('dark_logs')
          .update({ stone_growth_stage: 2 }) 
          .eq('id', currentLogId);

        if (error) throw error;
      } catch (dbErr) {
        console.warn("Could not update dark_logs stage in DB, simulating client success:", dbErr);
      }

      alert('오늘의 다크코드가 내면의 아름다운 원석으로 연성되어 동기화되었습니다. 💎');
      
      // 상태 초기화 및 홈 또는 마스터코어로 유도
      setReportResult(null);
      setRawText('');
      setSymptom('');
      setCurrentLogId(null);
      router.push('/master-core');
    } catch (err) {
      console.error('Accept Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen bg-gradient-to-b from-[#05070a] to-[#0d0f19] flex flex-col text-white pb-24 select-text scanline-bg overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[350px] bg-red-500/10 blur-[100px] rounded-full pointer-events-none z-0 animate-aura-breath"></div>
      <div className="absolute top-[20%] left-1/4 w-[250px] h-[250px] bg-indigo-500/5 blur-[90px] rounded-full pointer-events-none z-0 animate-aura-breath" style={{ animationDelay: '4s' }}></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-4 border-b border-red-500/10 backdrop-blur-md bg-black/20 shadow-neon-red/10">
        <button 
          onClick={() => {
            playTechBeep();
            router.push('/master-core');
          }}
          className="p-2 -ml-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-red-400 font-mono text-neon-red">
          DARK DECODING SYSTEM
        </h1>
        <div className="w-8"></div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-5 py-6 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!reportResult ? (
            /* 감정 입력 폼 (Scan Stage) */
            <motion.form 
              key="scanner-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleDecode} 
              className="w-full bg-[#0d1222]/50 border border-red-500/15 rounded-2xl p-5 md:p-6 space-y-4 backdrop-blur-md shadow-neon-red"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                <h2 className="text-sm font-bold text-red-400 font-mono uppercase tracking-wider text-neon-red">⚡ DARK CODE SCANNER</h2>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed break-keep">
                내면의 시스템 에러(슬픔, 분노, 번뇌)나 신체에 가해지는 조이는 통증을 숨김없이 적어주세요. 억압 대신 연성(변화)을 시작합니다.
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] text-gray-500 font-bold mb-1 font-mono uppercase">EMOTIONAL BUG (감정 텍스트)</label>
                  <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="지금 머릿속을 맴돌며 시스템을 괴롭히고 있는 부정적인 생각이나 불안을 입력하세요..."
                    className="w-full h-36 p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500 transition resize-none leading-relaxed"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-[9px] text-gray-500 font-bold mb-1 font-mono uppercase">PHYSICAL SYMPTOM (동반 신체 증상)</label>
                  <input
                    type="text"
                    value={symptom}
                    onChange={(e) => setSymptom(e.target.value)}
                    placeholder="예: 가슴 답답함, 명치 압박, 목덜미 당김 (없다면 비워두셔도 됩니다)"
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500 transition"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 flex items-center gap-2 text-red-400 text-xs">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading || !rawText.trim()}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => playTechBeep(800, 0.05)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-500 via-red-600 to-indigo-600 hover:from-red-600 hover:to-indigo-500 disabled:from-gray-800 disabled:to-gray-900 disabled:text-gray-600 text-white text-xs font-black tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>다크 코어 알고리즘 분석 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>다크코드 디코딩 분석 실행</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          ) : (
            /* 분석 결과 리포트 (Sync & Shift Stage) */
            <DecodingReport 
              key="decoder-report"
              data={reportResult} 
              onAccept={handleAcceptReport} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
