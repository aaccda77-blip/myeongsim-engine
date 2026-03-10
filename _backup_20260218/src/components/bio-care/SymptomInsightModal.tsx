/**
 * /components/bio-care/SymptomInsightModal.tsx
 * AI 증상 패턴 분석 결과 모달
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Pattern {
    title: string;
    finding: string;
    severity: 'low' | 'medium' | 'high';
}

interface Recommendation {
    title: string;
    suggestion: string;
}

interface AnalysisResult {
    timePatterns: Pattern[];
    frequencyAnalysis: Pattern[];
    correlations: Pattern[];
    warnings: Pattern[];
    recommendations: Recommendation[];
    medicalAdvice: string;
}

interface SymptomInsightModalProps {
    isOpen: boolean;
    onClose: () => void;
    analysis: AnalysisResult | null;
    metadata?: {
        medication: string;
        period: string;
        logCount: number;
        analyzedAt: string;
    };
}

export default function SymptomInsightModal({
    isOpen,
    onClose,
    analysis,
    metadata
}: SymptomInsightModalProps) {
    if (!isOpen || !analysis) return null;

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'bg-red-500/10 border-red-500/30 text-red-700';
            case 'medium':
                return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700';
            case 'low':
                return 'bg-green-500/10 border-green-500/30 text-green-700';
            default:
                return 'bg-gray-500/10 border-gray-500/30 text-gray-700';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'high':
                return '🚨';
            case 'medium':
                return '⚠️';
            case 'low':
                return '✓';
            default:
                return '📊';
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="relative w-full max-w-md bg-[#1f2937] rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-gradient-to-br from-blue-900/40 to-slate-900 border-b border-white/10 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-white text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-400">psychology</span>
                                AI 증상 패턴 분석
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        {metadata && (
                            <p className="text-gray-400 text-sm">
                                {metadata.medication} • {metadata.logCount}일 기록 분석
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        {/* 시간대별 패턴 */}
                        {analysis.timePatterns && analysis.timePatterns.length > 0 && (
                            <section>
                                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-cyan-400">schedule</span>
                                    시간대별 패턴
                                </h3>
                                <div className="space-y-3">
                                    {analysis.timePatterns.map((pattern, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-4 rounded-xl border ${getSeverityColor(pattern.severity)}`}
                                        >
                                            <h4 className="font-bold mb-2 flex items-center gap-2">
                                                <span>{getSeverityIcon(pattern.severity)}</span>
                                                {pattern.title}
                                            </h4>
                                            <p className="text-sm opacity-90">{pattern.finding}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 빈도 분석 */}
                        {analysis.frequencyAnalysis && analysis.frequencyAnalysis.length > 0 && (
                            <section>
                                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-purple-400">trending_up</span>
                                    증상 빈도 분석
                                </h3>
                                <div className="space-y-3">
                                    {analysis.frequencyAnalysis.map((pattern, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-4 rounded-xl border ${getSeverityColor(pattern.severity)}`}
                                        >
                                            <h4 className="font-bold mb-2 flex items-center gap-2">
                                                <span>{getSeverityIcon(pattern.severity)}</span>
                                                {pattern.title}
                                            </h4>
                                            <p className="text-sm opacity-90">{pattern.finding}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 상관관계 */}
                        {analysis.correlations && analysis.correlations.length > 0 && (
                            <section>
                                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-400">link</span>
                                    약물-증상 상관관계
                                </h3>
                                <div className="space-y-3">
                                    {analysis.correlations.map((pattern, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-4 rounded-xl border ${getSeverityColor(pattern.severity)}`}
                                        >
                                            <h4 className="font-bold mb-2 flex items-center gap-2">
                                                <span>{getSeverityIcon(pattern.severity)}</span>
                                                {pattern.title}
                                            </h4>
                                            <p className="text-sm opacity-90">{pattern.finding}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 주의 사항 */}
                        {analysis.warnings && analysis.warnings.length > 0 && (
                            <section>
                                <h3 className="text-red-400 font-bold text-lg mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined">warning</span>
                                    주의가 필요한 조합
                                </h3>
                                <div className="space-y-3">
                                    {analysis.warnings.map((warning, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 rounded-xl border-2 bg-red-500/10 border-red-500/50"
                                        >
                                            <h4 className="text-red-300 font-bold mb-2 flex items-center gap-2">
                                                <span>🚨</span>
                                                {warning.title}
                                            </h4>
                                            <p className="text-red-200 text-sm">{warning.finding}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 생활 습관 제안 */}
                        {analysis.recommendations && analysis.recommendations.length > 0 && (
                            <section>
                                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-400">tips_and_updates</span>
                                    생활 습관 제안
                                </h3>
                                <div className="space-y-3">
                                    {analysis.recommendations.map((rec, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 rounded-xl bg-green-500/10 border border-green-500/30"
                                        >
                                            <h4 className="text-green-300 font-bold mb-2 flex items-center gap-2">
                                                <span>💡</span>
                                                {rec.title}
                                            </h4>
                                            <p className="text-green-200 text-sm">{rec.suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 의료진 상담 안내 */}
                        {analysis.medicalAdvice && (
                            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                                <h4 className="text-purple-300 font-bold mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined">medical_services</span>
                                    의료진 상담 권장
                                </h4>
                                <p className="text-purple-200 text-sm leading-relaxed">
                                    {analysis.medicalAdvice}
                                </p>
                            </div>
                        )}

                        {/* 의료법 준수 안내 */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-gray-400 text-xs leading-relaxed">
                                📚 <strong>보건교육 목적 콘텐츠</strong><br />
                                본 분석은 일반적인 건강 증진 정보 제공을 목적으로 하며,
                                개인별 의학적 진단이나 치료 계획을 대신할 수 없습니다.
                                구체적인 건강 문제는 반드시 의사, 약사 등 의료 전문가와 상담하세요.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-[#1f2937]/90 backdrop-blur-md border-t border-white/10 p-4">
                        <button
                            onClick={onClose}
                            className="w-full bg-[#658c42] hover:bg-[#7aa350] text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            확인
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
