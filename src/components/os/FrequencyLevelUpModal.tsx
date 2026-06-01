'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Rocket, ChevronRight, Zap, Eye, Target, Terminal, Edit3, Save, ShieldAlert, CheckCircle2, Navigation, Loader2, RefreshCw } from 'lucide-react';

interface FrequencyReport {
  targetOS: string;
  dailyKeyword: string;
  biorhythmAnalysis: string;
  level1_darkCode: {
    errorLog: string;
    projectedReality: string;
    currentFrequency: string;
    systemMessage: string;
  };
  level2_neuralCode: {
    debugging1_metaCognition: string;
    debugging2_radicalAcceptance: string;
    systemStabilization: string;
    currentFrequency: string;
    systemMessage: string;
  };
  level3_metaCode: {
    dimensionShift: string;
    zeroPointSolution: string;
    currentFrequency: string;
    systemMessage: string;
  };
  aiCoachNotice: string;
}

interface Props {
  userId?: string;
  dayMaster: string;
  yearPillar?: string;
  monthPillar?: string;
  dayPillar?: string;
  hourPillar?: string;
  gender?: string;
  targetDate?: string;
  onClose: () => void;
}

export default function FrequencyLevelUpModal({ userId, dayMaster, yearPillar, monthPillar, dayPillar, hourPillar, gender, targetDate, onClose }: Props) {
  const [report, setReport] = useState<FrequencyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('scan');
  const [worksheetText, setWorksheetText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadReport = async (force: boolean = false) => {
    if (force) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const res = await fetch('/api/os/frequency-shift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: userId || 'anonymous', 
          dayMaster, 
          yearPillar, 
          monthPillar, 
          dayPillar, 
          hourPillar, 
          gender, 
          targetDate,
          forceRefresh: force 
        })
      });
      if (!res.ok) throw new Error('API 호출 실패');
      const data = await res.json();
      if (data.success && data.data?.content) {
        setReport(data.data.content);
        
        if (userId && userId !== 'anonymous') {
          const dateToLoad = targetDate || new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
          const wsRes = await fetch(`/api/os/frequency-worksheet?userId=${userId}&dateString=${dateToLoad}`);
          if (wsRes.ok) {
            const wsData = await wsRes.json();
            if (wsData.success && wsData.text) setWorksheetText(wsData.text);
          }
        }
      } else {
        throw new Error(data.error || '데이터 파싱 실패');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [userId, dayMaster, targetDate]);

  const handleSaveWorksheet = async () => {
    if (!userId || userId === 'anonymous') {
      setSaveMessage('로그인이 필요합니다.');
      return;
    }
    setIsSaving(true);
    setSaveMessage('');
    try {
      const dateToSave = targetDate || new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
      const res = await fetch('/api/os/frequency-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, dateString: dateToSave, text: worksheetText })
      });
      if (res.ok) {
        setSaveMessage('성공적으로 저장되었습니다.');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        throw new Error('Save failed');
      }
    } catch (e) {
      setSaveMessage('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'scan', label: '상태 스캔', icon: Zap, color: 'text-amber-400' },
    { id: 'dark', label: 'Level 1: 다크 코드', icon: ShieldAlert, color: 'text-rose-500' },
    { id: 'neural', label: 'Level 2: 뉴럴 코드', icon: Eye, color: 'text-cyan-400' },
    { id: 'meta', label: 'Level 3: 메타 코드', icon: Target, color: 'text-fuchsia-400' },
    { id: 'worksheet', label: '셀프 코칭', icon: Edit3, color: 'text-blue-300' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/95 backdrop-blur-2xl"
      >
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="border-b border-slate-800 px-5 py-3 flex justify-between items-center bg-slate-900/90 shrink-0">
            <h2 className="text-sm font-bold flex items-center gap-2 font-mono">
              <Rocket className="w-4 h-4 text-fuchsia-400" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-rose-400">
                내면 주파수 레벨업 (3단계 부스트)
              </span>
            </h2>
            <div className="flex items-center gap-2">
              {/* 새 기질로 다시 생성 버튼 */}
              {dayMaster && userId && userId !== 'anonymous' && (
                <button
                  onClick={() => loadReport(true)}
                  disabled={isLoading || isRefreshing}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all duration-300 ${
                    isRefreshing 
                      ? 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300 cursor-not-allowed'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:text-fuchsia-300 hover:border-fuchsia-500/30 hover:bg-fuchsia-500/5 shadow-sm'
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-fuchsia-400' : ''}`} />
                  {isRefreshing ? '재생성 중...' : '새 기질로 다시 생성 (AI)'}
                </button>
              )}
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          {!isLoading && report && (
            <div className="border-b border-slate-800 px-3 py-2 flex gap-1 overflow-x-auto scrollbar-hide shrink-0">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeSection === s.id ? 'bg-slate-800 text-white border border-slate-600/50' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <s.icon className={`w-3 h-3 ${activeSection === s.id ? s.color : ''}`} />
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <Rocket className="w-10 h-10 text-fuchsia-400" />
                </motion.div>
                <div className="text-center">
                  <p className="text-sm text-fuchsia-400 font-mono mb-1">주파수 상승 프로세스 초기화 중...</p>
                  <p className="text-xs text-slate-500">에고의 다크 코드를 분석하고 차원 도약을 준비합니다.</p>
                </div>
              </div>
            )}

            {!isLoading && report && (
              <AnimatePresence mode="wait">
                {/* 1. 상태 스캔 */}
                {activeSection === 'scan' && (
                  <motion.div key="scan" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                    <div className="bg-slate-950 border border-amber-900/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Cpu className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-amber-400 font-mono">현재 상태 진단 (타깃 OS)</span>
                      </div>
                      <p className="text-sm text-amber-100/80 leading-relaxed">{report.targetOS}</p>
                    </div>
                    <div className="bg-gradient-to-r from-rose-950/30 to-amber-950/30 border border-rose-800/30 rounded-xl p-5 text-center">
                      <span className="text-xs font-bold text-rose-400 font-mono block mb-2">오늘의 데일리 키워드</span>
                      <p className="text-lg font-bold text-rose-200">{report.dailyKeyword}</p>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <p className="text-sm text-slate-300 leading-relaxed">{report.biorhythmAnalysis}</p>
                    </div>
                  </motion.div>
                )}

                {/* 2. 다크 코드 */}
                {activeSection === 'dark' && (
                  <motion.div key="dark" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                    <div className="text-center mb-4">
                      <span className="text-xs font-bold text-rose-500 font-mono px-3 py-1 bg-rose-950/50 rounded-full border border-rose-900/50">Level 1: 매트릭스의 환상</span>
                    </div>
                    <div className="bg-slate-950 border border-rose-900/30 rounded-xl p-4">
                      <h3 className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> 시스템 에러 로그</h3>
                      <p className="text-sm text-rose-100/80 leading-relaxed italic">"{report.level1_darkCode.errorLog}"</p>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <h3 className="text-xs font-bold text-slate-400 mb-2">체감되는 현실 (투사)</h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{report.level1_darkCode.projectedReality}</p>
                    </div>
                    <div className="bg-rose-950/20 border border-rose-900/20 rounded-xl p-4">
                      <p className="text-xs font-mono text-rose-300 mb-1">현재 주파수:</p>
                      <p className="text-sm font-bold text-rose-400">{report.level1_darkCode.currentFrequency}</p>
                    </div>
                    <div className="p-3 bg-red-950/40 border-l-4 border-red-500 rounded-r-lg">
                      <p className="text-xs text-red-200 font-mono flex items-center gap-2"><Terminal className="w-3 h-3" /> {report.level1_darkCode.systemMessage}</p>
                    </div>
                  </motion.div>
                )}

                {/* 3. 뉴럴 코드 */}
                {activeSection === 'neural' && (
                  <motion.div key="neural" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                    <div className="text-center mb-4">
                      <span className="text-xs font-bold text-cyan-400 font-mono px-3 py-1 bg-cyan-950/50 rounded-full border border-cyan-900/50">Level 2: 인지 구조화 및 수용</span>
                    </div>
                    <div className="bg-slate-950 border border-cyan-900/30 rounded-xl p-4">
                      <h3 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-2"><Eye className="w-4 h-4" /> 디버깅 프로세스</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-cyan-500 font-bold mb-1">1. 메타 인지 가동</p>
                          <p className="text-sm text-slate-300">{report.level2_neuralCode.debugging1_metaCognition}</p>
                        </div>
                        <div>
                          <p className="text-xs text-cyan-500 font-bold mb-1">2. 팩트 수용 (Radical Acceptance)</p>
                          <p className="text-sm text-slate-300">{report.level2_neuralCode.debugging2_radicalAcceptance}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-950 border border-blue-900/30 rounded-xl p-4">
                      <h3 className="text-xs font-bold text-blue-400 mb-2">시스템 안정화</h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{report.level2_neuralCode.systemStabilization}</p>
                    </div>
                    <div className="bg-cyan-950/20 border border-cyan-900/20 rounded-xl p-4">
                      <p className="text-xs font-mono text-cyan-300 mb-1">현재 주파수:</p>
                      <p className="text-sm font-bold text-cyan-400">{report.level2_neuralCode.currentFrequency}</p>
                    </div>
                    <div className="p-3 bg-blue-950/40 border-l-4 border-blue-500 rounded-r-lg">
                      <p className="text-xs text-blue-200 font-mono flex items-center gap-2"><Terminal className="w-3 h-3" /> {report.level2_neuralCode.systemMessage}</p>
                    </div>
                  </motion.div>
                )}

                {/* 4. 메타 코드 */}
                {activeSection === 'meta' && (
                  <motion.div key="meta" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                    <div className="text-center mb-4">
                      <span className="text-xs font-bold text-fuchsia-400 font-mono px-3 py-1 bg-fuchsia-950/50 rounded-full border border-fuchsia-900/50">Level 3: 순수 자각과 영점(Zero Point)</span>
                    </div>
                    <div className="bg-slate-950 border border-fuchsia-900/30 rounded-xl p-4">
                      <h3 className="text-xs font-bold text-fuchsia-400 mb-2 flex items-center gap-2"><Navigation className="w-4 h-4" /> 의식의 차원 상승</h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{report.level3_metaCode.dimensionShift}</p>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-900/30 rounded-xl p-4">
                      <h3 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-2"><Target className="w-4 h-4" /> Zero Point 솔루션</h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{report.level3_metaCode.zeroPointSolution}</p>
                    </div>
                    <div className="bg-fuchsia-950/20 border border-fuchsia-900/20 rounded-xl p-4">
                      <p className="text-xs font-mono text-fuchsia-300 mb-1">현재 주파수:</p>
                      <p className="text-sm font-bold text-fuchsia-400">{report.level3_metaCode.currentFrequency}</p>
                    </div>
                    <div className="p-3 bg-fuchsia-950/40 border-l-4 border-fuchsia-500 rounded-r-lg">
                      <p className="text-xs text-fuchsia-200 font-mono flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-fuchsia-400" /> {report.level3_metaCode.systemMessage}</p>
                    </div>
                    
                    {/* 명심 코칭 알림 */}
                    <div className="mt-6 pt-4 border-t border-slate-800">
                      <p className="text-xs text-slate-400 leading-relaxed italic whitespace-pre-wrap">{report.aiCoachNotice}</p>
                    </div>
                  </motion.div>
                )}

                {/* 5. 워크시트 */}
                {activeSection === 'worksheet' && (
                  <motion.div key="worksheet" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-4 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-5 h-5 text-blue-400" />
                        <span className="text-sm font-bold text-blue-300 font-mono">셀프 코칭 일기장</span>
                      </div>
                      {saveMessage && <span className={`text-xs ${saveMessage.includes('성공') ? 'text-emerald-400' : 'text-rose-400'}`}>{saveMessage}</span>}
                    </div>
                    <p className="text-xs text-slate-400">주파수 레벨업 3단계를 거치며 떠오른 통찰과 감각을 자유롭게 기록해보세요.</p>
                    <div className="flex-1 relative min-h-[250px]">
                      <textarea
                        value={worksheetText}
                        onChange={(e) => setWorksheetText(e.target.value)}
                        placeholder="이곳에 나의 마음을 적어주세요..."
                        className="absolute inset-0 w-full h-full bg-slate-950 border border-slate-700/50 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 resize-none transition-colors"
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <button onClick={handleSaveWorksheet} disabled={isSaving || !userId || userId === 'anonymous'} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 저장하기
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
          
          {/* Footer Navigation */}
          {!isLoading && report && (
            <div className="border-t border-slate-800 px-5 py-3 flex justify-between items-center shrink-0 bg-slate-900/90">
              <button
                onClick={() => {
                  const idx = sections.findIndex(s => s.id === activeSection);
                  if (idx > 0) setActiveSection(sections[idx - 1].id);
                }}
                disabled={activeSection === sections[0].id}
                className="text-xs text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← 이전
              </button>
              <span className="text-xs text-slate-600 font-mono">{sections.findIndex(s => s.id === activeSection) + 1} / {sections.length}</span>
              <button
                onClick={() => {
                  const idx = sections.findIndex(s => s.id === activeSection);
                  if (idx < sections.length - 1) setActiveSection(sections[idx + 1].id);
                }}
                disabled={activeSection === sections[sections.length - 1].id}
                className="text-xs text-fuchsia-400 hover:text-fuchsia-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                다음 <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
