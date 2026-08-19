'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Sparkles, Activity, Eye, Zap, Compass, Key, Rocket, 
    CheckCircle2, ArrowLeft, RefreshCw, AlertCircle, ShieldAlert,
    Cpu, Layers, Radio, Orbit, ChevronRight, Check
} from 'lucide-react';
import { calculateSaju } from '@/utils/SajuCalculator';

interface Sovereign3SProtocolModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile: any;
}

type MatrixSection = 'scan_full' | 'x_code' | 'y_freq' | 'z_vector' | 'code_64' | 'action_3s' | null;

export default function Sovereign3SProtocolModal({ isOpen, onClose, userProfile }: Sovereign3SProtocolModalProps) {
    const [activeSection, setActiveSection] = useState<MatrixSection>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [questCompleted, setQuestCompleted] = useState(false);

    // 사용자 개인화 생년월일 & 사주 데이터 상태
    const [birthDate, setBirthDate] = useState<string>('1980-07-07');
    const [userName, setUserName] = useState<string>('이경윤');
    const [isEditingBirth, setIsEditingBirth] = useState<boolean>(false);
    const [tempBirthInput, setTempBirthInput] = useState<string>('1980-07-07');
    const [tempNameInput, setTempNameInput] = useState<string>('이경윤');
    const [saveNotice, setSaveNotice] = useState<string | null>(null);

    // 초정밀 사주 4주 8자 & 일간(Day Master) 3D 코어 자동 계산 함수
    const computeSajuSpecs = (bDateStr: string) => {
        try {
            const parts = bDateStr.split('-');
            const year = parseInt(parts[0]) || 1980;
            const month = parseInt(parts[1]) || 7;
            const day = parseInt(parts[2]) || 7;

            // SajuCalculator를 사용해 음양력 변환 및 정확한 4주 8자 산출 (기본 미시 '14:00')
            const saju = calculateSaju(bDateStr, '14:00');

            // 4주 8자 텍스트 (예: 庚申년 癸未월 辛巳일 乙未시)
            const fourPillarsStr = `${saju.year.gan.hanja}${saju.year.ji.hanja}년 ${saju.month.gan.hanja}${saju.month.ji.hanja}월 ${saju.day.gan.hanja}${saju.day.ji.hanja}일 ${saju.time.gan.hanja}${saju.time.ji.hanja}시`;

            // 일간 (Day Master) = 나 자신 (Core Identity)
            const dayGanHanja = saju.day.gan.hanja; // 예: 辛

            const coreMap: Record<string, string> = {
                '甲': '甲木 (갑목) 창조적 성장 리더 코어',
                '乙': '乙木 (을목) 유연한 적응 네트워크 코어',
                '丙': '丙火 (병화) 뜨거운 열정 비전 코어',
                '丁': '丁火 (정화) 섬세한 등불 통찰 코어',
                '戊': '戊土 (무토) 포용적 수용 닻 코어',
                '己': '己土 (기토) 조용히 경작하는 결실 코어',
                '庚': '庚金 (경금) 용맹한 결단 무쇠 코어',
                '辛': '辛金 (신금) 초정밀 관찰자 다이아몬드 코어',
                '壬': '壬水 (임수) 무한 침잠 지혜 바다 코어',
                '癸': '癸水 (계수) 깊은 단비 감성 시뮬레이터 코어'
            };

            const core = coreMap[dayGanHanja] || `${dayGanHanja}金 초정밀 관찰자 코어`;

            // 일간에 따른 주력 엔진 (십성)
            let engine = '정관(巳火) 시스템 질서 & 식신(癸水) 자율 창조 엔진';
            if (dayGanHanja === '辛') {
                engine = '정관(巳火) 시스템 질서 & 식신(癸水) 창조 & 편재(乙木) 영토확장 엔진';
            } else if (dayGanHanja === '庚') {
                engine = '편재(偏財) 영토 확장 & 식신(食神) 자율 창조 엔진';
            } else if (dayGanHanja === '甲' || dayGanHanja === '乙') {
                engine = '식상(食傷) 자율 표현 & 편재(偏財) 사업적 실행 엔진';
            } else if (dayGanHanja === '丙' || dayGanHanja === '丁') {
                engine = '비겁(比劫) 강력 추진 & 편관(偏官) 카리스마 리더십 엔진';
            } else if (dayGanHanja === '壬' || dayGanHanja === '癸') {
                engine = '인성(印星) 깊은 수용 & 상관(傷官) 돌파구 창조 엔진';
            }

            // 64비트 뉴럴 코드
            const codeNum = ((year + month * 3 + day * 7) % 64) + 1;
            const formattedCodeNum = String(codeNum).padStart(2, '0');
            const hexagramNames: Record<number, string> = {
                28: 'Code 28. 택풍대과 (The Overload)',
                1: 'Code 01. 중건천 (The Creator)',
                30: 'Code 30. 이위화 (The Visionary)',
                14: 'Code 14. 화천대유 (The Abundance)',
                29: 'Code 29. 감위수 (The Deep Diver)',
                15: 'Code 15. 지산겸 (The Humility)'
            };
            const code = hexagramNames[codeNum] || `Code ${formattedCodeNum}. 64비트 뉴럴 코드 (Hexagram ${codeNum})`;

            return { core, engine, code, fourPillarsStr, dayMaster: dayGanHanja };
        } catch (e) {
            return {
                core: '辛金 (신금) 초정밀 관찰자 다이아몬드 코어',
                engine: '정관(巳火) 시스템 질서 & 식신(癸水) 자율 창조 엔진',
                code: 'Code 28. 택풍대과 (The Overload)',
                fourPillarsStr: '庚申년 癸未월 辛巳일 乙未시',
                dayMaster: '辛'
            };
        }
    };

    // 로컬스토리지 & Props 자동 동기화 로직
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const localProfileStr = localStorage.getItem('myeongsim_user_profile') || 
                                   localStorage.getItem('saju_input_data') || 
                                   localStorage.getItem('user_profile') ||
                                   localStorage.getItem('myeongsim_user_info');
            let parsed: any = {};
            if (localProfileStr) {
                try { parsed = JSON.parse(localProfileStr); } catch (e) {}
            }

            const resolvedBirth = userProfile?.birthDate || userProfile?.birth_date || userProfile?.birthInfo || 
                                 userProfile?.birthDay || userProfile?.birth_day ||
                                 parsed?.birthDate || parsed?.birth_date || parsed?.birthInfo || 
                                 parsed?.birthDay || parsed?.birth_day ||
                                 (parsed?.year ? `${parsed.year}-${String(parsed.month || 1).padStart(2, '0')}-${String(parsed.day || 1).padStart(2, '0')}` : '1990-05-15');

            const resolvedName = userProfile?.userName || userProfile?.name || userProfile?.user_name ||
                                parsed?.userName || parsed?.name || parsed?.user_name || '이경윤';

            setBirthDate(resolvedBirth);
            setUserName(resolvedName);
            setTempBirthInput(resolvedBirth);
            setTempNameInput(resolvedName);
        }
    }, [isOpen, userProfile]);

    const { core: sajuCore, engine: engineType, code: hexagramCode, fourPillarsStr } = computeSajuSpecs(birthDate);

    // 생년월일 사용자 저장 처리
    const handleSaveBirthDate = () => {
        if (!tempBirthInput) return;
        setBirthDate(tempBirthInput);
        setUserName(tempNameInput || '사용자');
        setIsEditingBirth(false);

        if (typeof window !== 'undefined') {
            const updated = {
                userName: tempNameInput || '사용자',
                name: tempNameInput || '사용자',
                birthDate: tempBirthInput,
                birth_date: tempBirthInput,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('myeongsim_user_profile', JSON.stringify(updated));
            localStorage.setItem('saju_input_data', JSON.stringify(updated));
        }

        setSaveNotice(`🟢 생년월일(${tempBirthInput}) 사주 1:1 동기화 완료!`);
        setTimeout(() => setSaveNotice(null), 4000);
    };

    useEffect(() => {
        if (activeSection) {
            setIsScanning(true);
            setScanProgress(0);
            const interval = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setIsScanning(false);
                        return 100;
                    }
                    return prev + 25;
                });
            }, 250);
            return () => clearInterval(interval);
        }
    }, [activeSection]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 font-sans text-left overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.96 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-[#0b0f19] border border-cyan-500/40 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-[0_0_80px_rgba(6,182,212,0.25)] relative custom-scrollbar text-white my-auto flex flex-col"
                >
                    {/* 상단 컨트롤 헤더 */}
                    <div className="sticky top-0 right-0 p-4 sm:p-5 flex justify-between items-center z-30 bg-[#0b0f19]/95 backdrop-blur-md border-b border-gray-800 gap-3">
                        {activeSection ? (
                            <button
                                onClick={() => setActiveSection(null)}
                                className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-cyan-300 text-xs font-bold rounded-xl border border-cyan-500/30 transition-all shrink-0"
                            >
                                <ArrowLeft size={16} />
                                <span>3D Matrix 디코더로 돌아가기</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[11px] sm:text-xs font-mono text-cyan-400 font-bold px-3 py-1 bg-cyan-950/80 border border-cyan-500/40 rounded-full tracking-wider truncate">
                                    🌌 AI 주역 : 3D MATRIX DECODER v2.5
                                </span>
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="bg-gray-800/80 p-2 rounded-full text-gray-400 hover:text-white border border-gray-700/60 backdrop-blur-sm transition-colors shrink-0 leading-none"
                            aria-label="닫기"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* 개인화 생년월일 & 하드웨어 바인딩 배너 (모달 최상단) */}
                    {!activeSection && (
                        <div className="mx-4 sm:mx-6 mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-950/50 via-purple-950/40 to-slate-900 border border-blue-500/40 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 shrink-0">
                                        <Cpu size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-black text-white truncate">{userName} 님의 하드웨어 사주</span>
                                            <span className="text-[11px] font-mono text-blue-300 font-bold px-2.5 py-0.5 rounded-lg bg-blue-900/50 border border-blue-400/40 shrink-0">
                                                🎂 {birthDate}
                                            </span>
                                            {fourPillarsStr && (
                                                <span className="text-[11px] font-serif text-amber-300 font-black px-2.5 py-0.5 rounded-lg bg-amber-950/60 border border-amber-500/40 shrink-0">
                                                    📜 {fourPillarsStr}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-300 mt-1 truncate">
                                            일간 코어(나): <strong className="text-cyan-300 font-black">{sajuCore}</strong> | 주력 엔진: <strong className="text-purple-300 font-bold">{engineType}</strong>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => setIsEditingBirth(!isEditingBirth)}
                                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-cyan-500/40 transition-all flex items-center gap-1"
                                    >
                                        ✏️ 생년월일 입력/변경
                                    </button>
                                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full shrink-0">
                                        🟢 1:1 실시간 연동
                                    </span>
                                </div>
                            </div>

                            {/* 저장 성공 메시지 */}
                            {saveNotice && (
                                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold animate-in fade-in flex items-center gap-2">
                                    <CheckCircle2 size={16} />
                                    <span>{saveNotice}</span>
                                </div>
                            )}

                            {/* 인라인 생년월일 수정 에디터 */}
                            {isEditingBirth && (
                                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-3 animate-in fade-in">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 block mb-1">이름</label>
                                            <input 
                                                type="text" 
                                                value={tempNameInput}
                                                onChange={(e) => setTempNameInput(e.target.value)}
                                                className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                                                placeholder="성함 입력"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 block mb-1">생년월일 (YYYY-MM-DD)</label>
                                            <input 
                                                type="date" 
                                                value={tempBirthInput}
                                                onChange={(e) => setTempBirthInput(e.target.value)}
                                                className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setIsEditingBirth(false)}
                                            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs hover:text-white"
                                        >
                                            취소
                                        </button>
                                        <button
                                            onClick={handleSaveBirthDate}
                                            className="px-4 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md"
                                        >
                                            💾 내 사주 하드웨어 동기화 저장
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* INTERACTIVE 3D SECTION VIEWS */}

                    {/* SECTION 1: 3D FULL SCAN */}
                    {activeSection === 'scan_full' && (
                        <div className="p-6 space-y-6 animate-in fade-in duration-300">
                            <div className="text-center space-y-2">
                                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-black border border-cyan-500/30 uppercase tracking-wider">
                                    🌐 Z·X·Y 3D 좌표 스캔 (Full Scan)
                                </span>
                                <h2 className="text-2xl font-black text-white font-serif">생년월일 기반 입체 분석 결과</h2>
                                <p className="text-xs text-slate-400 max-w-md mx-auto">
                                    {userName}님({birthDate})의 타고난 사주(Z) x 현재 관점(X) x 생체 파동(Y) 3D 입체 좌표입니다.
                                </p>
                            </div>

                            <div className="relative h-44 rounded-2xl bg-gradient-to-b from-cyan-950/40 via-slate-900 to-black border border-cyan-500/30 flex flex-col items-center justify-center p-6 overflow-hidden">
                                {isScanning ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-14 h-14 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin flex items-center justify-center">
                                            <Activity className="w-7 h-7 text-cyan-300 animate-pulse" />
                                        </div>
                                        <span className="text-xs font-mono text-cyan-300 font-bold tracking-widest">
                                            DECODING PERSONAL MATRIX... {scanProgress}%
                                        </span>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-2.5">
                                        <div className="inline-flex p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                            <Sparkles className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-lg font-black text-cyan-300 font-serif">3D 정밀 좌표 해독 완료!</h3>
                                        <p className="text-xs text-slate-200">
                                            {userName}님의 <strong>{sajuCore}</strong>가 <strong>{engineType}</strong> 모드로 가동되어 내부 과부하 신호(84Hz)가 감지되었습니다.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* 3축 스펙 요약 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-cyan-500/30 text-left">
                                    <span className="text-[10px] font-mono text-cyan-400 block font-bold">Z축: 타고난 사주 (Hardware)</span>
                                    <span className="text-xs font-bold text-white block mt-1">{sajuCore}</span>
                                    <span className="text-[10px] text-slate-400 mt-1 block">불변 초기 설정값 (Factory Default)</span>
                                </div>
                                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-purple-500/30 text-left">
                                    <span className="text-[10px] font-mono text-purple-400 block font-bold">X축: 현재 관점 (OS/Software)</span>
                                    <span className="text-xs font-bold text-white block mt-1">META Code (관찰자 50%)</span>
                                    <span className="text-[10px] text-slate-400 mt-1 block">자유의지 패치 가능 영역</span>
                                </div>
                                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-amber-500/30 text-left">
                                    <span className="text-[10px] font-mono text-amber-400 block font-bold">Y축: 뇌 파동 (Frequency)</span>
                                    <span className="text-xs font-bold text-white block mt-1">84Hz (생산적 자각 파동)</span>
                                    <span className="text-[10px] text-slate-400 mt-1 block">실시간 생체 텔레메트리</span>
                                </div>
                            </div>

                            {/* 그래서 내게 어떤 도움이 되는가? */}
                            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
                                <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                                    💡 [책 기반 실질적 도움] 그래서 이 스캔이 내게 어떤 유익을 주는가?
                                </h4>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    "우울과 불안은 못난 성격 때문이 아닙니다. {userName}님의 고성능 초정밀 다이아몬드 지성 코어({sajuCore})가 생각을 정제하는 편인 엔진을 돌리다 뇌에 과부하가 걸린 신호입니다. <strong>자책하지 말고 3S 프로토콜(SCAN-SYNC-SHIFT)을 눌러 오늘 1가지 실천으로 즉시 전환하세요.</strong>"
                                </p>
                            </div>
                        </div>
                    )}

                    {/* SECTION 2: X-AXIS CODE */}
                    {activeSection === 'x_code' && (
                        <div className="p-6 space-y-6 animate-in fade-in duration-300">
                            <div className="text-center space-y-2">
                                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-[10px] font-black border border-purple-500/30">
                                    👁️ X축: 의식 코드 스펙트럼 (Dark vs Neural vs Meta)
                                </span>
                                <h2 className="text-2xl font-black text-white font-serif">관찰자(Admin) 순수 의식 안목</h2>
                                <p className="text-xs text-slate-400 max-w-md mx-auto">
                                    책 제1부 3장 "다크-뉴럴-메타 3단계 연금술"에 따른 {userName}님의 관점 상태입니다.
                                </p>
                            </div>

                            <div className="space-y-4 bg-slate-900/90 p-5 rounded-2xl border border-purple-500/30">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-rose-400 flex items-center gap-1">🔻 Dark Code (버그에 걸린 무의식 & 동일시)</span>
                                        <span className="text-slate-400">15%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-rose-500 h-full w-[15%]" />
                                    </div>
                                    <p className="text-[11px] text-slate-400">"나는 편인이라서 완벽주의야"라는 한계 면죄부 (동일시의 감옥)</p>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-cyan-400 flex items-center gap-1">🔹 Neural Code (시냅스 재배선 & 디버깅)</span>
                                        <span className="text-slate-400">35%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-cyan-500 h-full w-[35%]" />
                                    </div>
                                    <p className="text-[11px] text-slate-400">"생각을 멈추고 3분 동안 단 하나만 실천하자"는 뇌신경 재배선</p>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-purple-300 flex items-center gap-1">🚀 Meta Code (관찰자 순수 주권 - Admin) ★</span>
                                        <span className="text-purple-300 font-extrabold">50% (주도 상태)</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full w-[50%]" />
                                    </div>
                                    <p className="text-[11px] text-slate-300">"나는 감정이 아니다. 내 시스템에 뜬 신호를 지켜보는 관리자다"</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2">
                                <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                                    💡 [X축 실질적 도움] 내 삶에서 의식 코드를 메타로 바꾸는 방법
                                </h4>
                                <p className="text-xs text-slate-200 leading-relaxed">
                                    "모든 사주 성격검사는 성적표가 아니라 **내 인생 아이템**일 뿐입니다. 완벽주의 강박(Dark)이 올 때 '나는 왜 이러지?' 하고 자책하지 말고, **'아, 내 안의 편인 센서가 예민하게 작동하고 있구나'하고 3인치 뒤에서 바라보는 관찰자(Meta)로 이동하세요.**"
                                </p>
                            </div>
                        </div>
                    )}

                    {/* SECTION 3: Y-AXIS FREQUENCY */}
                    {activeSection === 'y_freq' && (
                        <div className="p-6 space-y-6 animate-in fade-in duration-300">
                            <div className="text-center space-y-2">
                                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-black border border-amber-500/30">
                                    ⚡ Y축: 주파수 및 뇌 피로도 (Freq)
                                </span>
                                <h2 className="text-2xl font-black text-white font-serif">생체 파동 고주파 텔레메트리</h2>
                                <p className="text-xs text-slate-400 max-w-md mx-auto">
                                    책 제3부 13장 "주파수가 높아져야 자유의지가 작동한다"의 원리입니다.
                                </p>
                            </div>

                            <div className="bg-slate-900/90 p-6 rounded-2xl border border-amber-500/30 text-center space-y-4">
                                <div className="flex justify-center items-center gap-4">
                                    <div className="p-4 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/40 animate-pulse">
                                        <Zap size={36} />
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black text-amber-300">432Hz <span className="text-xs text-slate-400 font-normal">공명 최적화 상태</span></h3>
                                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                                    저주파(불안, 억압, 저항)에서 벗어나 <strong>수용과 허용의 고주파(432Hz)</strong>로 전압을 맞추고 있습니다.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-2">
                                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                    💡 [Y축 실질적 도움] 뇌 피로를 즉시 낮추는 쿨다운 법
                                </h4>
                                <p className="text-xs text-slate-200 leading-relaxed">
                                    "주파수가 낮으면 이성적 전두엽이 꺼지고 생존 본능(파충류의 뇌)이 발작하여 똑같은 번아웃을 반복합니다. **화가 나거나 피곤할 때 3초간 숨을 쉬고(S.T.O.P.) '내 몸이 휴식을 원하고 있구나' 인정할 때 자유의지가 100% 가동됩니다.**"
                                </p>
                            </div>
                        </div>
                    )}

                    {/* SECTION 4: Z-AXIS VECTOR */}
                    {activeSection === 'z_vector' && (
                        <div className="p-6 space-y-6 animate-in fade-in duration-300">
                            <div className="text-center space-y-2">
                                <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-[10px] font-black border border-rose-500/30">
                                    🧭 Z축: 에너지 방향성 벡터 (Vector)
                                </span>
                                <h2 className="text-2xl font-black text-white font-serif">수렴(In) vs 발산(Out) 에너지 흐름</h2>
                                <p className="text-xs text-slate-400 max-w-md mx-auto">
                                    책 부록 "십성과 벡터의 상관관계" 기반 {userName}님의 에너지 경로 분석입니다.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-900/90 rounded-2xl border border-cyan-500/30 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-cyan-300">📥 수렴형 (In / 응축) 70%</span>
                                        <span className="text-[10px] font-mono text-cyan-400">인성·관성</span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        생각, 공부, 준비, 통제. 생각이 너무 많아지면 에너지가 안으로 붕괴하여 <strong>[블랙홀 모드]</strong>에 빠지기 쉽습니다.
                                    </p>
                                </div>

                                <div className="p-4 bg-slate-900/90 rounded-2xl border border-rose-500/30 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-rose-300">📤 발산형 (Out / 창조) 30%</span>
                                        <span className="text-[10px] font-mono text-rose-400">식상·재성</span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        행동, 말하기, 실행, 무언가를 밖으로 내놓기. 수렴된 에너지를 밖으로 쏘아 올릴 때 <strong>[결실과 쾌감]</strong>이 완성됩니다.
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-2">
                                <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                                    💡 [Z축 실질적 도움] 갇힌 생각을 행동으로 뚫어주는 솔루션
                                </h4>
                                <p className="text-xs text-slate-200 leading-relaxed">
                                    "생각만 가득 차서 움직이지 못할 때는 **'완벽하지 않아도 일단 실행(Enter) 키를 누르는 것'**이 최고의 백신입니다. 머릿속의 수렴 에너지를 오늘 당장 작은 결과물 1개로 발산(Out)시키세요!"
                                </p>
                            </div>
                        </div>
                    )}

                    {/* SECTION 5: 64-BIT NEURAL CODE */}
                    {activeSection === 'code_64' && (
                        <div className="p-6 space-y-6 animate-in fade-in duration-300">
                            <div className="text-center space-y-2">
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                                    🗝️ 64가지 라이프 코드 실전 해독
                                </span>
                                <h2 className="text-2xl font-black text-white font-serif">{hexagramCode}</h2>
                                <p className="text-xs text-slate-400 max-w-md mx-auto">
                                    주역 64괘 중 {userName}님의 생년월일과 사주 성도에 매칭된 본질 코드입니다.
                                </p>
                            </div>

                            <div className="space-y-3 bg-slate-900/90 p-5 rounded-2xl border border-emerald-500/30">
                                <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 space-y-1">
                                    <span className="text-[10px] font-mono text-rose-400 font-bold block">● 다크 코드 (Dark Code: 시스템 버그)</span>
                                    <p className="text-xs text-slate-200">
                                        <strong>시스템 과부하 (System Overload)</strong>: 책임감 때문에 감당할 수 없는 짐을 혼자 다 짊어지고 버티다 하드웨어가 타버릴 위험.
                                    </p>
                                </div>

                                <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-500/30 space-y-1">
                                    <span className="text-[10px] font-mono text-cyan-400 font-bold block">⚡ 뉴럴 코드 (Neural Code: 디버깅 해킹 전략)</span>
                                    <p className="text-xs text-slate-200">
                                        <strong>피벗 & 위임 (Pivot)</strong>: 버티는 게 답이 아닙니다. 불필요한 일 1가지를 과감하게 포맷하고 외부 사람/AI에게 위임하십시오.
                                    </p>
                                </div>

                                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/30 space-y-1">
                                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">☀️ 메타 코드 (Meta Code: 최적화 마스터)</span>
                                    <p className="text-xs text-slate-200">
                                        <strong>독자 생존 (Standalone)</strong>: 누구에게도 의존하거나 번아웃되지 않고, 홀로 서도 단단한 최강의 시스템 리더.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECTION 6: 3S SOLUTION ACTION QUEST */}
                    {activeSection === 'action_3s' && (
                        <div className="p-6 space-y-6 animate-in fade-in duration-300">
                            <div className="text-center space-y-2">
                                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-black border border-amber-500/30">
                                    🚀 3S 프로토콜 실천 퀘스트 (Scan-Sync-Shift)
                                </span>
                                <h2 className="text-2xl font-black text-amber-300 font-serif">오늘 나를 구하는 3분 마이크로 퀘스트</h2>
                                <p className="text-xs text-slate-400 max-w-md mx-auto">
                                    책 제4부 "3S 프로토콜 매뉴얼"에 따라 즉시 실행 가능한 운명 수정 퀘스트입니다.
                                </p>
                            </div>

                            <div className="space-y-3 bg-slate-900/90 p-5 rounded-2xl border border-amber-500/40">
                                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-cyan-500/30 flex items-start gap-3">
                                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-black font-mono shrink-0 mt-0.5">1. SCAN</span>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">반응 멈추기 (STOP 3초)</h4>
                                        <p className="text-[11px] text-slate-300 mt-0.5">불안이나 자책이 올라올 때 즉시 3초간 멈추고 "아, 내 시스템에 신호가 왔구나" 인식하기.</p>
                                    </div>
                                </div>

                                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-purple-500/30 flex items-start gap-3">
                                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-black font-mono shrink-0 mt-0.5">2. SYNC</span>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">내 사주 스펙 수용하기 (OKAY)</h4>
                                        <p className="text-[11px] text-slate-300 mt-0.5">"나는 {sajuCore}를 가진 근사한 기계다. 내 예민함과 신중함은 단점이 아닌 최첨단 센서다." 조용히 3회 확언하기.</p>
                                    </div>
                                </div>

                                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-amber-500/30 flex items-start gap-3">
                                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black font-mono shrink-0 mt-0.5">3. SHIFT</span>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">3분 마이크로 액션 실행 (GO)</h4>
                                        <p className="text-[11px] text-slate-300 mt-0.5">80점짜리 완성도라도 미루지 말고 오늘 당장 1가지 미뤄둔 일을 정리하기 (예: 책상 정리 / 물 1잔 마시기 / 이메일 발송).</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setQuestCompleted(!questCompleted)}
                                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 transition-all ${
                                    questCompleted 
                                        ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                                        : 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-[1.02]'
                                }`}
                            >
                                {questCompleted ? (
                                    <>
                                        <CheckCircle2 size={18} />
                                        <span>오늘의 3S 마이크로 퀘스트 완료됨! (뇌신경 재배선 성공)</span>
                                    </>
                                ) : (
                                    <>
                                        <Rocket size={18} />
                                        <span>오늘의 3S 퀘스트 완료 서약하기</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* MAIN GRID: 6개 개별 카드 (책의 핵심 원리 구현) */}
                    {!activeSection && (
                        <div className="px-4 sm:px-6 pb-8 pt-2 text-left space-y-6">
                            <div className="text-center space-y-1.5">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-black rounded-full uppercase tracking-wider">
                                    🌌 AGI 시대 64가지 코드 해독 아키텍처
                                </span>
                                <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight font-serif">
                                    3D 정밀 디코딩 (3D Matrix)
                                </h1>
                                <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                                    사주(Z) x 관점(X) x 주파수(Y) 3차원 좌표를 스캔하여,<br />
                                    {userName}님의 무의식 버그를 1:1 실행 코드로 변환합니다.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                {/* CARD 1: 3D FULL SCAN */}
                                <motion.div 
                                  whileHover={{ scale: 1.015, y: -2 }}
                                  onClick={() => setActiveSection('scan_full')}
                                  className="bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-4 sm:p-5 shadow-[0_0_25px_rgba(6,182,212,0.12)] cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-lg text-cyan-400 shrink-0">
                                                🌐
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-xs sm:text-sm font-black text-slate-100 group-hover:text-cyan-300 transition-colors truncate break-keep">
                                                    3D 좌표 스캔 (Full Scan)
                                                </h3>
                                                <p className="text-[10px] font-mono text-cyan-400/90 truncate">Z(사주) x X(의식) x Y(주파수) 입체 스캔</p>
                                            </div>
                                        </div>
                                        <span className="shrink-0 whitespace-nowrap px-2.5 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-xs font-bold group-hover:bg-cyan-500 group-hover:text-black transition-all flex items-center gap-0.5">
                                            풀이 보기 <ChevronRight size={14} />
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                                        {userName}님의 생년월일 사주 하드웨어와 실시간 뇌 파동을 3차원으로 동기화하여 분석합니다.
                                    </p>
                                </motion.div>

                                {/* CARD 2: X-AXIS CODE */}
                                <motion.div 
                                  whileHover={{ scale: 1.015, y: -2 }}
                                  onClick={() => setActiveSection('x_code')}
                                  className="bg-slate-900/90 border border-purple-500/30 hover:border-purple-400 rounded-2xl p-4 sm:p-5 shadow-[0_0_25px_rgba(168,85,247,0.12)] cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-lg text-purple-400 shrink-0">
                                                👁️
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-xs sm:text-sm font-black text-slate-100 group-hover:text-purple-300 transition-colors truncate break-keep">
                                                    X축: 의식 코드 (Code)
                                                </h3>
                                                <p className="text-[10px] font-mono text-purple-400/90 truncate">Dark vs Neural vs Meta 관점</p>
                                            </div>
                                        </div>
                                        <span className="shrink-0 whitespace-nowrap px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-bold group-hover:bg-purple-500 group-hover:text-black transition-all flex items-center gap-0.5">
                                            풀이 보기 <ChevronRight size={14} />
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                                        무의식의 버그(Dark)에서 벗어나 관찰자 순수 의식 안목(Meta Code)을 회복하는 뇌신경 재배선.
                                    </p>
                                </motion.div>

                                {/* CARD 3: Y-AXIS FREQUENCY */}
                                <motion.div 
                                  whileHover={{ scale: 1.015, y: -2 }}
                                  onClick={() => setActiveSection('y_freq')}
                                  className="bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 rounded-2xl p-4 sm:p-5 shadow-[0_0_25px_rgba(245,158,11,0.12)] cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-lg text-amber-400 shrink-0">
                                                ⚡
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-xs sm:text-sm font-black text-slate-100 group-hover:text-amber-300 transition-colors truncate break-keep">
                                                    Y축: 주파수 측정 (Freq)
                                                </h3>
                                                <p className="text-[10px] font-mono text-amber-400/90 truncate">생체 파동 432Hz 고주파 텔레메트리</p>
                                            </div>
                                        </div>
                                        <span className="shrink-0 whitespace-nowrap px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold group-hover:bg-amber-500 group-hover:text-black transition-all flex items-center gap-0.5">
                                            풀이 보기 <ChevronRight size={14} />
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                                        나의 생체 파동이 스트레스 저항(저주파)인지, 몰입과 창조의 고주파(432Hz)인지 정밀 측정한 리포트.
                                    </p>
                                </motion.div>

                                {/* CARD 4: Z-AXIS VECTOR */}
                                <motion.div 
                                  whileHover={{ scale: 1.015, y: -2 }}
                                  onClick={() => setActiveSection('z_vector')}
                                  className="bg-slate-900/90 border border-rose-500/30 hover:border-rose-400 rounded-2xl p-4 sm:p-5 shadow-[0_0_25px_rgba(244,63,94,0.12)] cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-lg text-rose-400 shrink-0">
                                                🧭
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-xs sm:text-sm font-black text-slate-100 group-hover:text-rose-300 transition-colors truncate break-keep">
                                                    Z축: 에너지 벡터 (Vector)
                                                </h3>
                                                <p className="text-[10px] font-mono text-rose-400/90 truncate">수렴(In/블랙홀) vs 발산(Out/화산)</p>
                                            </div>
                                        </div>
                                        <span className="shrink-0 whitespace-nowrap px-2.5 py-1 bg-rose-500/20 text-rose-300 rounded-lg text-xs font-bold group-hover:bg-rose-500 group-hover:text-black transition-all flex items-center gap-0.5">
                                            풀이 보기 <ChevronRight size={14} />
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                                        생각에 갇힌 응축(In) 상태인지, 행동으로 터지는 확장(Out) 상태인지 에너지 방향을 디코딩합니다.
                                    </p>
                                </motion.div>

                                {/* CARD 5: 64-BIT NEURAL CODE */}
                                <motion.div 
                                  whileHover={{ scale: 1.015, y: -2 }}
                                  onClick={() => setActiveSection('code_64')}
                                  className="bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 rounded-2xl p-4 sm:p-5 shadow-[0_0_25px_rgba(16,185,129,0.12)] cursor-pointer transition-all group relative overflow-hidden md:col-span-2 flex flex-col justify-between"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-lg text-emerald-400 shrink-0">
                                                🗝️
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-xs sm:text-sm font-black text-slate-100 group-hover:text-emerald-300 transition-colors truncate break-keep">
                                                    64비트 뉴럴 코드 (Decoder)
                                                </h3>
                                                <p className="text-[10px] font-mono text-emerald-400/90 truncate">주역 64가지 본질 원형 1:1 매칭 해독</p>
                                            </div>
                                        </div>
                                        <span className="shrink-0 whitespace-nowrap px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold group-hover:bg-emerald-500 group-hover:text-black transition-all flex items-center gap-0.5">
                                            풀이 보기 <ChevronRight size={14} />
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                                        {userName}님의 생년월일과 사주 성도에 각인된 64가지 본질 괘상 중 <strong>[{hexagramCode}]</strong>의 버그 및 해킹 전략을 1:1 해독합니다.
                                    </p>
                                </motion.div>

                                {/* CARD 6: 3S SOLUTION ACTION QUEST */}
                                <motion.div 
                                  whileHover={{ scale: 1.015, y: -2 }}
                                  onClick={() => setActiveSection('action_3s')}
                                  className="bg-gradient-to-r from-amber-950/50 via-orange-950/40 to-slate-900 border-2 border-amber-500/50 hover:border-amber-400 rounded-2xl p-4 sm:p-5 shadow-[0_0_35px_rgba(245,158,11,0.2)] cursor-pointer transition-all group relative overflow-hidden md:col-span-2 flex flex-col justify-between"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            <div className="w-9.5 h-9.5 rounded-xl bg-amber-500/25 border border-amber-400/50 flex items-center justify-center text-xl shrink-0 animate-pulse">
                                                🚀
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-black text-amber-300 tracking-tight font-serif truncate break-keep">
                                                    3S 솔루션 실행 (Action Quest)
                                                </h3>
                                                <p className="text-[10px] font-mono text-amber-200/90 truncate">Scan-Sync-Shift 3분 마이크로 퀘스트 실행</p>
                                            </div>
                                        </div>
                                        <span className="shrink-0 whitespace-nowrap px-3 py-1.5 bg-amber-500 text-black font-black rounded-xl text-xs shadow-lg group-hover:scale-105 transition-all flex items-center gap-1">
                                            실행 코딩 개시 <Rocket size={14} />
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        디코딩 결과를 실행 코드로 변환(Scan-Sync-Shift)하여 3분 마이크로 퀘스트를 즉시 배포합니다.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
