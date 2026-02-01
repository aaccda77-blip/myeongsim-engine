/**
 * /bio-care/body-log/page.tsx
 * 신체 알아차림 로그 - 이상 반응 기록 + AI 패턴 분석
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SYMPTOM_CHECKLIST } from '@/data/BioCareData';
import SymptomInsightModal from '@/components/bio-care/SymptomInsightModal';

interface LogEntry {
    date: string;
    symptoms: Record<string, string>;
    note: string;
    mealTime?: string;
    medicationTaken?: boolean;
}

export default function BodyLogPage() {
    const router = useRouter();
    const [symptoms, setSymptoms] = useState<Record<string, string>>({});
    const [note, setNote] = useState('');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showInsightModal, setShowInsightModal] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    // 로컬 스토리지에서 로그 불러오기
    useEffect(() => {
        const savedLogs = localStorage.getItem('bodyLogs');
        if (savedLogs) {
            setLogs(JSON.parse(savedLogs));
        }
    }, []);

    const handleSave = () => {
        const newLog: LogEntry = {
            date: new Date().toISOString(),
            symptoms: { ...symptoms },
            note: note,
            medicationTaken: true // 추후 사용자 입력으로 변경 가능
        };
        const updatedLogs = [newLog, ...logs];
        setLogs(updatedLogs);
        localStorage.setItem('bodyLogs', JSON.stringify(updatedLogs));
        setSymptoms({});
        setNote('');
        alert('✅ 기록이 저장되었습니다.');
    };

    const handleAnalyze = async () => {
        if (logs.length < 3) {
            alert('최소 3일 이상의 기록이 필요합니다.');
            return;
        }

        setIsAnalyzing(true);

        try {
            // 로그 데이터 변환
            const formattedLogs = logs.slice(0, 14).map(log => ({
                date: new Date(log.date).toLocaleDateString('ko-KR'),
                symptoms: {
                    nausea: log.symptoms.nausea || 'none',
                    vomit: log.symptoms.vomit || 'none',
                    dizziness: log.symptoms.dizziness || 'none',
                    fatigue: log.symptoms.fatigue || 'none',
                    irritability: log.symptoms.irritability || 'none',
                    abdominal_pain: log.symptoms.abdominal_pain || 'none'
                },
                notes: log.note,
                mealTime: log.mealTime,
                medicationTaken: log.medicationTaken
            }));

            const response = await fetch('/api/bio-care/analyze-symptoms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    logs: formattedLogs,
                    medication: 'saxenda', // 추후 사용자 약물 정보로 변경
                    analysisType: logs.length >= 14 ? 'monthly' : 'weekly'
                }),
            });

            const data = await response.json();

            if (data.success) {
                setAnalysisResult(data);
                setShowInsightModal(true);
            } else {
                alert('분석 중 오류가 발생했습니다: ' + data.error);
            }
        } catch (error) {
            console.error('AI 분석 오류:', error);
            alert('분석 중 오류가 발생했습니다.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#1f2937] max-w-md mx-auto shadow-xl overflow-hidden font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center bg-[#1f2937]/90 backdrop-blur-md p-4 border-b border-gray-800">
                <button
                    onClick={() => router.back()}
                    className="text-[#658c42] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h2 className="text-white text-lg font-bold leading-tight flex-1 text-center pr-10 font-serif">
                    신체 알아차림 로그
                </h2>
            </header>

            {/* Intro */}
            <div className="p-6 text-center border-b border-gray-800">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
                    <span className="material-symbols-outlined text-orange-400 text-3xl">monitor_heart</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-2 font-serif">
                    오늘의 몸 상태 기록
                </h3>
                <p className="text-gray-400 text-sm">
                    증상을 기록하여 패턴을 파악하고<br />의료진 상담 시 활용하세요.
                </p>
            </div>

            <main className="flex-1 p-6 space-y-6 pb-8 overflow-y-auto">
                {/* AI 분석 버튼 (3일 이상 기록 시 활성화) */}
                {logs.length >= 3 && (
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="w-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-5 hover:from-purple-500/30 hover:to-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left flex-1">
                                <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-purple-400">psychology</span>
                                    {isAnalyzing ? 'AI 분석 중...' : 'AI 패턴 분석'}
                                </h4>
                                <p className="text-gray-400 text-sm">
                                    {logs.length}일 기록에서 패턴 찾기
                                </p>
                            </div>
                            {!isAnalyzing && (
                                <span className="material-symbols-outlined text-purple-400">arrow_forward</span>
                            )}
                            {isAnalyzing && (
                                <div className="animate-spin">
                                    <span className="material-symbols-outlined text-purple-400">progress_activity</span>
                                </div>
                            )}
                        </div>
                    </button>
                )}

                {/* 증상 체크리스트 */}
                <div className="space-y-3">
                    <h4 className="text-white font-bold mb-3">증상 체크</h4>
                    {SYMPTOM_CHECKLIST.map((symptom) => (
                        <div key={symptom.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-white text-sm mb-2">{symptom.label}</p>
                            <div className="flex gap-2">
                                {symptom.severity.map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setSymptoms({ ...symptoms, [symptom.id]: level })}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${symptoms[symptom.id] === level
                                            ? 'bg-[#658c42] text-white'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 메모 */}
                <div>
                    <h4 className="text-white font-bold mb-3">추가 메모</h4>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="예: 아침 식사 후 30분 뒤 증상 발생"
                        className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#658c42] focus:ring-1 focus:ring-[#658c42] resize-none"
                    />
                </div>

                {/* 저장 버튼 */}
                <button
                    onClick={handleSave}
                    className="w-full h-12 bg-[#658c42] text-white rounded-xl font-bold hover:bg-[#537337] active:scale-[0.98] transition-all"
                >
                    기록 저장
                </button>

                {/* 기록 목록 */}
                {logs.length > 0 && (
                    <div className="space-y-3 mt-6">
                        <h4 className="text-white font-bold">최근 기록</h4>
                        {logs.slice(0, 5).map((log, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <p className="text-gray-400 text-xs mb-2">
                                    {new Date(log.date).toLocaleDateString('ko-KR')}
                                </p>
                                <div className="space-y-1">
                                    {Object.entries(log.symptoms).map(([key, value]) => {
                                        const symptom = SYMPTOM_CHECKLIST.find(s => s.id === key);
                                        return (
                                            <p key={key} className="text-gray-300 text-sm">
                                                {symptom?.label}: <span className="text-white font-bold">{value}</span>
                                            </p>
                                        );
                                    })}
                                </div>
                                {log.note && (
                                    <p className="text-gray-400 text-xs mt-2 italic">"{log.note}"</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* 의료법 준수 안내 */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-6">
                    <p className="text-red-200 text-xs leading-relaxed">
                        ⚠️ <strong>중요 안내</strong><br />
                        본 기록은 자가 모니터링 도구이며, 의학적 진단을 대신할 수 없습니다.
                        심한 증상이나 지속적인 불편감이 있다면 즉시 의료기관을 방문하세요.
                        응급 상황 시 119에 연락하세요.
                    </p>
                </div>
            </main>

            {/* AI 인사이트 모달 */}
            <SymptomInsightModal
                isOpen={showInsightModal}
                onClose={() => setShowInsightModal(false)}
                analysis={analysisResult?.analysis}
                metadata={analysisResult?.metadata}
            />
        </div>
    );
}
