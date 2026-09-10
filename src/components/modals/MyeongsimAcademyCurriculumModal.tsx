'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Award, BookOpen, Layers, Sparkles, CheckCircle2, 
    Lock, Unlock, ChevronRight, ChevronDown, Compass, ExternalLink, ShieldCheck, Zap
} from 'lucide-react';
import { 
    ACADEMY_COURSES, 
    ACADEMY_TEXTBOOKS, 
    STANDARD_THEORY_STEPS, 
    AcademyCourseLevel,
    AcademyTextbook 
} from '@/data/MyeongsimAcademyDB';
import { 
    getAcademyState, 
    saveAcademyState, 
    toggleAcademyCheatMode, 
    ACADEMY_UPDATE_EVENT 
} from '@/lib/questUnlockManager';
import { useLanguage } from '@/contexts/LanguageContext';

interface MyeongsimAcademyCurriculumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenExam?: (quizId: string) => void;
}

export default function MyeongsimAcademyCurriculumModal({
    isOpen,
    onClose,
    onOpenExam
}: MyeongsimAcademyCurriculumModalProps) {
    const { language } = useLanguage();
    const lang = (language === 'en' || language === 'jp' || language === 'cn') ? language : 'kr';

    const [activeTab, setActiveTab] = useState<'ladder' | 'books' | 'theory' | 'loop'>('ladder');
    const [selectedLevel, setSelectedLevel] = useState<number>(1);
    const [expandedBookId, setExpandedBookId] = useState<string | null>('book_01');
    const [academyState, setAcademyState] = useState(getAcademyState());

    // 상태 실시간 동기화
    useEffect(() => {
        const update = () => setAcademyState(getAcademyState());
        window.addEventListener(ACADEMY_UPDATE_EVENT, update);
        return () => window.removeEventListener(ACADEMY_UPDATE_EVENT, update);
    }, []);

    if (!isOpen) return null;

    const currentCourse = ACADEMY_COURSES.find(c => c.levelNumber === academyState.currentLevel) || ACADEMY_COURSES[0];

    return (
        <div className="fixed inset-0 z-[2600] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="w-full max-w-5xl h-[92vh] max-h-[900px] bg-slate-950/95 border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white relative">
                
                {/* 배경 오로라 이펙트 */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* 헤더 */}
                <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between relative z-10 bg-slate-900/60">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30 text-2xl">
                            🏛️
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                                    {lang === 'en' ? 'Official Academy Curriculum' : lang === 'jp' ? '平生教育院公認カリキュラム' : lang === 'cn' ? '平生教育院官方教学体系' : '명심코칭 평생교육원 공인 커리큘럼'}
                                </span>
                                <span className="text-[11px] font-bold text-gray-400">
                                    STANDARD THEORY 1.0
                                </span>
                            </div>
                            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-1">
                                {lang === 'en' ? 'Myeongsim Lifelong Education Center' : lang === 'jp' ? '明心平生教育院 資格体系' : lang === 'cn' ? '明心教练平生教育院 资质通途' : '명심코칭 평생교육원 5단계 자격 사다리'}
                            </h2>
                            <p className="text-[11px] sm:text-xs text-amber-200/80 font-medium">
                                “{lang === 'en' ? 'Not predicting destiny, but taking back the steering wheel of destiny.' : lang === 'jp' ? '運命を言い当てる教育ではなく、運命のハンドルを取り戻す教育' : lang === 'cn' ? '非卜算既定宿命，唯重掌命运之舵' : '운명을 맞히는 교육이 아니라, 운명의 운전대를 되찾는 교육'}”
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* 관리자 전체 해금 치트키 */}
                        <button
                            type="button"
                            onClick={() => {
                                const next = toggleAcademyCheatMode();
                                alert(next ? '⚡ [관리자 모드 활성화] 모든 자격 및 스킬이 즉시 전면 해금되었습니다!' : '🔒 [일반 모드 복구] 정상적인 자격 취득 모드로 전환되었습니다.');
                            }}
                            className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                academyState.isCheatUnlocked 
                                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/40' 
                                    : 'bg-white/5 hover:bg-white/10 text-gray-400 border-white/10'
                            }`}
                            title="대표님 및 관리자 검토를 위한 전체 자격 즉시 해금 프리패스"
                        >
                            <Zap size={14} />
                            <span>{academyState.isCheatUnlocked ? '전체 해금 ON' : '프리패스'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* 현재 나의 자격 현황 바 */}
                <div className="px-5 py-2.5 bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-transparent border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-medium">현재 나의 공인 자격:</span>
                        <span className="font-black px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                            <Award size={14} className="text-amber-400" />
                            {currentCourse.title[lang]} ({currentCourse.badge})
                        </span>
                        <span className="text-gray-400 hidden sm:inline">|</span>
                        <span className="text-purple-300 font-bold hidden sm:inline">
                            역할: {currentCourse.targetRole[lang]}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[11px] text-gray-400">
                            합격 시험: <strong className="text-amber-300">{academyState.passedExams.length}</strong> / 5
                        </span>
                        <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-amber-400 to-purple-500 transition-all duration-500"
                                style={{ width: `${(academyState.currentLevel / 5) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* 상단 4대 탭 */}
                <div className="flex border-b border-white/10 bg-slate-950/80 px-4 sm:px-6 gap-2 overflow-x-auto">
                    {[
                        { id: 'ladder', label: lang === 'en' ? '🏆 5-Stage Ladder' : lang === 'jp' ? '🏆 5段階資格梯子' : lang === 'cn' ? '🏆 五阶资质阶梯' : '🏆 5단계 자격 사다리', icon: Award },
                        { id: 'books', label: lang === 'en' ? '📚 8 Textbooks' : lang === 'jp' ? '📚 公認教材8巻' : lang === 'cn' ? '📚 官方教材8卷' : '📚 8권 교재 로드맵', icon: BookOpen },
                        { id: 'theory', label: lang === 'en' ? '🧬 Standard Theory 1.0' : lang === 'jp' ? '🧬 標準理論9段階' : lang === 'cn' ? '🧬 标准理论9阶' : '🧬 표준이론 9단계', icon: Layers },
                        { id: 'loop', label: lang === 'en' ? '🔄 30-Day AI Loop' : lang === 'jp' ? '🔄 30日OSループ' : lang === 'cn' ? '🔄 30天系统闭环' : '🔄 교육원 30일 실습 루프', icon: Compass }
                    ].map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                                    isActive
                                        ? 'border-amber-400 text-amber-300 bg-white/5'
                                        : 'border-transparent text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* 메인 컨텐츠 영역 */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

                    {/* TAB 1: 5단계 자격 사다리 */}
                    {activeTab === 'ladder' && (
                        <div className="space-y-6">
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs sm:text-sm text-amber-200/90 leading-relaxed flex items-start gap-3">
                                <span className="text-xl">💡</span>
                                <div>
                                    <strong className="text-amber-300 font-bold block mb-1">
                                        “L1은 나를 코칭하고, L2는 도구를 다루며, L3은 타인을 코칭하고, L4는 통합 사례를 해결하며, L5는 코치를 양성합니다.”
                                    </strong>
                                    평생교육원의 모든 자격 과정은 단계별 승급 시험(Exam Scenario Quiz)을 통과할 때마다 드릴메뉴의 코칭 스킬이 잠금 해제되어 즉시 현업과 일상에서 활용할 수 있습니다.
                                </div>
                            </div>

                            {/* 5단계 카드 리스트 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {ACADEMY_COURSES.map((course) => {
                                    const isCurrent = academyState.currentLevel === course.levelNumber;
                                    const isPassed = academyState.currentLevel >= course.levelNumber;
                                    const isNextTarget = academyState.currentLevel + 1 === course.levelNumber;

                                    return (
                                        <div
                                            key={course.code}
                                            className={`rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between relative overflow-hidden ${
                                                isCurrent 
                                                    ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-400 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/40'
                                                    : isPassed
                                                    ? 'bg-slate-900/90 border-purple-500/40'
                                                    : 'bg-slate-900/40 border-white/10 opacity-75'
                                            }`}
                                        >
                                            {/* 상단 뱃지 & 가격 */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${
                                                        isCurrent 
                                                            ? 'bg-amber-400 text-slate-950 font-black'
                                                            : isPassed
                                                            ? 'bg-purple-500/30 text-purple-300 border border-purple-400/40'
                                                            : 'bg-white/10 text-gray-400'
                                                    }`}>
                                                        {course.badge} {isPassed && '✓ 취득완료'}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-amber-300">
                                                        {course.recommendedPrice[lang]}
                                                    </span>
                                                </div>

                                                <h3 className="text-base font-black text-white">
                                                    {course.title[lang]}
                                                </h3>
                                                <p className="text-xs text-amber-200/70 font-medium mt-0.5">
                                                    {course.subtitle[lang]}
                                                </p>

                                                {/* 핵심 역할 & 권장 시간 */}
                                                <div className="my-3 p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
                                                    <div className="flex items-center justify-between text-gray-300">
                                                        <span className="text-gray-400">핵심 역할:</span>
                                                        <strong className="text-purple-300">{course.targetRole[lang]}</strong>
                                                    </div>
                                                    <div className="flex items-center justify-between text-gray-300">
                                                        <span className="text-gray-400">권장 이수:</span>
                                                        <span className="text-gray-200">{course.recommendedHours[lang]}</span>
                                                    </div>
                                                </div>

                                                {/* 해금 스킬 목록 */}
                                                <div className="space-y-1.5 my-3">
                                                    <div className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                                                        <span>✨ 해금되는 코칭 도구:</span>
                                                    </div>
                                                    {course.skillsDescription.map((sk, idx) => (
                                                        <div key={idx} className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                                                            <span className="text-amber-400">▸</span>
                                                            <span>{sk[lang]}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 하단 액션 버튼 */}
                                            <div className="pt-3 border-t border-white/10">
                                                {isPassed ? (
                                                    <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5">
                                                        <CheckCircle2 size={16} />
                                                        <span>자격 취득 완료 (도구 사용 가능)</span>
                                                    </div>
                                                ) : isNextTarget ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            onClose();
                                                            if (onOpenExam) onOpenExam(course.examQuizId);
                                                        }}
                                                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-400/25 flex items-center justify-center gap-1.5 cursor-pointer"
                                                    >
                                                        <span>🎓 승급 시험 응시하기</span>
                                                        <ChevronRight size={16} />
                                                    </button>
                                                ) : (
                                                    <div className="w-full py-2.5 rounded-xl bg-white/5 text-gray-500 font-bold text-xs flex items-center justify-center gap-1">
                                                        <Lock size={14} />
                                                        <span>이전 단계(Level {course.levelNumber - 1}) 수료 필요</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: 공인 교재 8권 체계 */}
                    {activeTab === 'books' && (
                        <div className="space-y-4">
                            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4 text-xs sm:text-sm text-purple-200/90 leading-relaxed flex items-start gap-3">
                                <span className="text-xl">📚</span>
                                <div>
                                    <strong className="text-purple-300 font-bold block mb-1">
                                        “평생교육원용 교재와 대중용 단행본은 엄격히 분리되어 8권의 체계로 표준화됩니다.”
                                    </strong>
                                    입문부터 워크북, 64 Life Code, 100대 사례집, 윤리 매뉴얼까지 완벽하게 구조화되어 강사마다 설명이 달라지는 문제를 방지하고 브랜드 신뢰도를 지킵니다.
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ACADEMY_TEXTBOOKS.map((book) => {
                                    const isExpanded = expandedBookId === book.id;

                                    return (
                                        <div 
                                            key={book.id}
                                            className="rounded-2xl bg-slate-900/70 border border-white/10 hover:border-amber-400/40 p-5 transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-md">
                                                        #{book.number}
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-amber-300">
                                                            {book.subtitle[lang]}
                                                        </span>
                                                        <h4 className="text-base font-black text-white mt-1 leading-snug">
                                                            {book.title[lang]}
                                                        </h4>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {book.role[lang]}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 세부 목차 아코디언 */}
                                            <div className="mt-4 pt-3 border-t border-white/10">
                                                <button
                                                    type="button"
                                                    onClick={() => setExpandedBookId(isExpanded ? null : book.id)}
                                                    className="w-full flex items-center justify-between text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
                                                >
                                                    <span>📖 상세 목차 ({book.tableOfContents.length}개 부)</span>
                                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                </button>

                                                {isExpanded && (
                                                    <div className="mt-3 space-y-2 bg-black/40 rounded-xl p-3 text-xs animate-in fade-in duration-150">
                                                        {book.tableOfContents.map((toc, pIdx) => (
                                                            <div key={pIdx} className="space-y-1">
                                                                <strong className="text-purple-300 font-bold block text-[11px]">
                                                                    {toc.part[lang]}
                                                                </strong>
                                                                <ul className="pl-3 space-y-0.5 text-gray-300 text-[11px]">
                                                                    {toc.chapters.map((ch, cIdx) => (
                                                                        <li key={cIdx} className="list-disc">
                                                                            {ch[lang]}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: 표준이론 9단계 파이프라인 */}
                    {activeTab === 'theory' && (
                        <div className="space-y-4">
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-xs sm:text-sm text-emerald-200/90 leading-relaxed flex items-start gap-3">
                                <span className="text-xl">🧬</span>
                                <div>
                                    <strong className="text-emerald-300 font-bold block mb-1">
                                        “명심코칭 표준 이론 1.0 (Standard Theory 1.0 Pipeline)”
                                    </strong>
                                    교재, 강의, 앱, 자격과정이 하나의 표준 언어로 일체화되어, 사주결정론이나 신비주의를 배제하고 실천적 인지신경 코칭 프레임워크를 제공합니다.
                                </div>
                            </div>

                            <div className="space-y-3">
                                {STANDARD_THEORY_STEPS.map((step) => (
                                    <div
                                        key={step.code}
                                        className="rounded-2xl bg-slate-900/80 border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-amber-400/50 transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                                            {step.icon}
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                                    {step.actionVerb[lang]}
                                                </span>
                                                <h4 className="text-base font-black text-white">
                                                    {step.name[lang]}
                                                </h4>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                                                {step.description[lang]}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 4: 교육원 30일 루프 및 사업체계 */}
                    {activeTab === 'loop' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4">
                                <h3 className="text-lg font-black text-white flex items-center gap-2">
                                    <span>🔄</span>
                                    <span>AI 코칭 결합형 30일 Mind OS 리셋 루프</span>
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                                    명심코칭 평생교육원의 수강생은 단순히 강의를 듣는 것에 그치지 않고, <strong>사전 AI 분석 ➔ 주간 수업 ➔ 일상 5분 AI Self Coaching ➔ 기록 ➔ 슈퍼비전</strong>의 선순환 루프를 통해 30일 만에 신경망 재배선을 완성합니다.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                                    <div className="rounded-xl bg-black/40 border border-white/10 p-3.5 space-y-1.5">
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                                            🌅 Morning (아침 3분)
                                        </span>
                                        <h5 className="text-xs font-bold text-white">오늘의 Dark Code 예측</h5>
                                        <p className="text-[11px] text-gray-400">
                                            “오늘 내 하드웨어에서 과출력될 수 있는 취약 상황은 어디인가?”
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-black/40 border border-white/10 p-3.5 space-y-1.5">
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-400/20 text-red-300">
                                            ⚡ Trigger (돌발 충돌)
                                        </span>
                                        <h5 className="text-xs font-bold text-white">1초 SCAN 실행</h5>
                                        <p className="text-[11px] text-gray-400">
                                            “Fact(객관 사실)와 머릿속 Story(소설)를 즉시 분리하라.”
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-black/40 border border-white/10 p-3.5 space-y-1.5">
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-400/20 text-purple-300">
                                            🌙 Evening (저녁 3분)
                                        </span>
                                        <h5 className="text-xs font-bold text-white">SYNC & SHIFT 기록</h5>
                                        <p className="text-[11px] text-gray-400">
                                            “오늘 나를 지켜준 Legacy Driver를 안아주고 새로운 작은 행동을 선택한다.”
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-black/40 border border-white/10 p-3.5 space-y-1.5">
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300">
                                            📊 Weekend (주말 정리)
                                        </span>
                                        <h5 className="text-xs font-bold text-white">3대 반복 패턴 요약</h5>
                                        <p className="text-[11px] text-gray-400">
                                            “AI 코치가 한 주의 반복패턴을 분석하고 다음 주 승급 과제를 제시합니다.”
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 교육 사다리 매출 및 사업 모델 요약 */}
                            <div className="rounded-2xl bg-slate-900 border border-white/10 p-5 space-y-3">
                                <h4 className="text-sm font-black text-white flex items-center gap-2">
                                    <span>📈</span>
                                    <span>지속가능한 교육 사다리 (Education Ladder) 구조</span>
                                </h4>
                                <div className="text-xs text-gray-300 leading-relaxed space-y-1.5 font-medium">
                                    <p>• <strong>오픈클래스 (무료~5만원)</strong>: 일반 대중의 기질 자각 및 문제 인식</p>
                                    <p>• <strong>Level 1 셀프코치 (22~29만원)</strong>: 나 자신의 반복되는 불행 각본 리셋</p>
                                    <p>• <strong>Level 2 프랙티셔너 (59~69만원)</strong>: 명심코칭 도구 및 64 Life Code 숙련</p>
                                    <p>• <strong>Level 3 전문코치 (110~139만원)</strong>: 타인을 코칭하는 공인 자격 취득</p>
                                    <p>• <strong>Level 4 프로코치 (190~240만원)</strong>: 복합 난제 사례 및 기업 임원 코칭</p>
                                    <p>• <strong>Level 5 마스터·강사 (220~290만원)</strong>: 평생교육원 지부 설립 및 코치 양성</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* 푸터 */}
                <div className="p-4 border-t border-white/10 bg-slate-900/60 flex items-center justify-between text-xs text-gray-400">
                    <div>
                        명심코칭 평생교육원 공인 자격관리본부 · Lifelong Education Accreditation
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
                        >
                            닫기
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
