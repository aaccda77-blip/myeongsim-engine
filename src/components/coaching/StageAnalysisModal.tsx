'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BookOpen, Compass, ShieldAlert, Award, HelpCircle, Activity } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';

interface StageAnalysisModalProps {
    isOpen: boolean;
    stageId: number;
    stageTitle: string;
    userCurrentStage: number;
    onClose: () => void;
    onConfirmMove: (targetStageId: number) => void;
}

export default function StageAnalysisModal({ isOpen, stageId, stageTitle, userCurrentStage, onClose, onConfirmMove }: StageAnalysisModalProps) {

    const { reportData } = useReportStore();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [analysisData, setAnalysisData] = useState<any>(null);

    // [1] 사주 천간/지지 정보 안전 추출 및 파싱
    const parsedFourPillars = useMemo(() => {
        const defaultPillars = {
            year: { gan: '경', ganHanja: '庚', ganLabel: '금', ganColor: '#9CA3AF', ji: '신', jiHanja: '申', jiLabel: '금', jiColor: '#9CA3AF' },
            month: { gan: '무', ganHanja: '戊', ganLabel: '토', ganColor: '#F59E0B', ji: '자', jiHanja: '子', jiLabel: '수', jiColor: '#3B82F6' },
            day: { gan: '병', ganHanja: '丙', ganLabel: '화', ganColor: '#EF4444', ji: '오', jiHanja: '午', jiLabel: '화', jiColor: '#EF4444' },
            time: { gan: '기', ganHanja: '己', ganLabel: '토', ganColor: '#F59E0B', ji: '축', jiHanja: '丑', jiLabel: '토', jiColor: '#F59E0B' }
        };

        if (!reportData?.saju?.fourPillars) return defaultPillars;
        const fp = reportData.saju.fourPillars;

        const getPillarData = (pillar: any) => {
            if (!pillar) return { gan: '', ganHanja: '', ganLabel: '', ganColor: '', ji: '', jiHanja: '', jiLabel: '', jiColor: '' };
            const gan = pillar.gan;
            const ji = pillar.ji;

            return {
                gan: typeof gan === 'string' ? gan : (gan?.char || ''),
                ganHanja: typeof gan === 'string' ? '' : (gan?.hanja || ''),
                ganLabel: typeof gan === 'string' ? '' : (gan?.label || ''),
                ganColor: typeof gan === 'string' ? '#9CA3AF' : (gan?.color || '#9CA3AF'),
                ji: typeof ji === 'string' ? ji : (ji?.char || ''),
                jiHanja: typeof ji === 'string' ? '' : (ji?.hanja || ''),
                jiLabel: typeof ji === 'string' ? '' : (ji?.label || ''),
                jiColor: typeof ji === 'string' ? '#3B82F6' : (ji?.color || '#3B82F6')
            };
        };

        return {
            year: getPillarData(fp.year),
            month: getPillarData(fp.month),
            day: getPillarData(fp.day),
            time: getPillarData(fp.time)
        };
    }, [reportData]);

    const dayGan = parsedFourPillars.day.gan || '병';
    const dayJi = parsedFourPillars.day.ji || '오';
    const yearGan = parsedFourPillars.year.gan || '경';
    const yearJi = parsedFourPillars.year.ji || '신';
    const monthGan = parsedFourPillars.month.gan || '무';
    const monthJi = parsedFourPillars.month.ji || '자';
    const timeGan = parsedFourPillars.time.gan || '기';
    const timeJi = parsedFourPillars.time.ji || '축';

    // 일간별 본질적 기질 사전
    const DAY_MASTER_TRAIT_DICT: Record<string, string> = {
        '갑': '주체적이고 진취적인 큰 나무',
        '을': '유연하고 친화력 있는 넝쿨풀',
        '병': '열정적이고 세상을 밝히는 태양',
        '정': '섬세하고 따뜻한 온기의 등불',
        '무': '신뢰감 있고 포용력 넓은 태산',
        '기': '포근하고 부드러운 전원의 대지',
        '경': '강인하고 결단력 있는 무쇠',
        '신': '섬세하고 예리하게 빛나는 보석',
        '임': '통찰력 있고 깊은 바닷물',
        '계': '총명하고 지혜로운 맑은 시냇물'
    };
    const dayMasterTrait = DAY_MASTER_TRAIT_DICT[dayGan] || reportData?.saju?.dayMasterTrait || '알 수 없음';



    // [2] 지장간 계산 맵
    const JIJANGGAN_MAP: Record<string, string[]> = {
        '자': ['임(편강)', '계(정강)'],
        '축': ['계(편재)', '신(식신)', '기(상관)'],
        '인': ['무(식신)', '병(비견)', '갑(편인)'],
        '묘': ['갑(편인)', '을(정인)'],
        '진': ['을(정인)', '계(정관)', '무(겁재)'],
        '사': ['무(겁재)', '경(편재)', '병(비견)'],
        '오': ['병(비견)', '기(상관)', '정(겁재)'],
        '미': ['정(겁재)', '을(정인)', '기(상관)'],
        '신': ['무(상관)', '임(편재)', '경(비견)'],
        '유': ['경(비견)', '신(겁재)'],
        '술': ['신(겁재)', '정(정관)', '무(식신)'],
        '해': ['무(식신)', '갑(편인)', '임(편재)']
    };

    // [3] 공망 계산
    const gongmangInfo = useMemo(() => {
        const gans = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
        const jis = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
        const gIdx = gans.indexOf(dayGan);
        const jIdx = jis.indexOf(dayJi);
        if (gIdx === -1 || jIdx === -1) return { chars: [] as string[], name: '' };
        const diff = (jIdx - gIdx + 12) % 12;
        let idx1 = 0, idx2 = 0;
        if (diff === 0) { idx1 = 10; idx2 = 11; }
        else if (diff === 10) { idx1 = 8; idx2 = 9; }
        else if (diff === 8) { idx1 = 6; idx2 = 7; }
        else if (diff === 6) { idx1 = 4; idx2 = 5; }
        else if (diff === 4) { idx1 = 2; idx2 = 3; }
        else if (diff === 2) { idx1 = 0; idx2 = 1; }
        return {
            chars: [jis[idx1], jis[idx2]],
            name: `${jis[idx1]}${jis[idx2]}`
        };
    }, [dayGan, dayJi]);

    // 각 지지의 공망 여부 체크
    const gongmangStatus = useMemo(() => {
        const status = { year: false, month: false, day: false, time: false };
        if (!gongmangInfo.name) return status;
        if (gongmangInfo.chars.includes(yearJi)) status.year = true;
        if (gongmangInfo.chars.includes(monthJi)) status.month = true;
        if (gongmangInfo.chars.includes(dayJi)) status.day = true;
        if (gongmangInfo.chars.includes(timeJi)) status.time = true;
        return status;
    }, [gongmangInfo, yearJi, monthJi, dayJi, timeJi]);

    // 격국 도출
    const getTenGod = (dGan: string, tGan: string): string => {
        const GAN_INFO: Record<string, { element: string; polarity: string }> = {
            '갑': { element: 'wood', polarity: '+' }, '을': { element: 'wood', polarity: '-' },
            '병': { element: 'fire', polarity: '+' }, '정': { element: 'fire', polarity: '-' },
            '무': { element: 'earth', polarity: '+' }, '기': { element: 'earth', polarity: '-' },
            '경': { element: 'metal', polarity: '+' }, '신': { element: 'metal', polarity: '-' },
            '임': { element: 'water', polarity: '+' }, '계': { element: 'water', polarity: '-' }
        };
        const d = GAN_INFO[dGan];
        const t = GAN_INFO[tGan];
        if (!d || !t) return '비견';
        const samePolarity = d.polarity === t.polarity;
        if (d.element === t.element) return samePolarity ? '비견' : '겁재';
        const saeng: Record<string, string> = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
        if (saeng[d.element] === t.element) return samePolarity ? '식신' : '상관';
        const geuk: Record<string, string> = { wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire' };
        if (geuk[d.element] === t.element) return samePolarity ? '편재' : '정재';
        if (saeng[t.element] === d.element) return samePolarity ? '편인' : '정인';
        if (geuk[t.element] === d.element) return samePolarity ? '편관' : '정관';
        return '비견';
    };

    const gyeokguk = useMemo(() => {
        const getGyeok = (dGan: string, mJi: string, yGan: string, mGan: string, tGan: string): string => {
            const jijanggan: Record<string, { main: string; middle?: string; initial: string }> = {
                '자': { main: '계', initial: '임' },
                '축': { main: '기', middle: '신', initial: '계' },
                '인': { main: '갑', middle: '병', initial: '무' },
                '묘': { main: '을', initial: '갑' },
                '진': { main: '무', middle: '계', initial: '을' },
                '사': { main: '병', middle: '경', initial: '무' },
                '오': { main: '정', middle: '기', initial: '병' },
                '미': { main: '기', middle: '을', initial: '정' },
                '신': { main: '경', middle: '임', initial: '무' },
                '유': { main: '신', initial: '경' },
                '술': { main: '무', middle: '신', initial: '정' },
                '해': { main: '임', middle: '갑', initial: '무' }
            };
            const jj = jijanggan[mJi];
            if (!jj) return '비견격';
            const candidates = [jj.main, jj.middle, jj.initial].filter(Boolean) as string[];
            const heavenGans = [yGan, mGan, tGan];
            for (const cand of candidates) {
                if (heavenGans.includes(cand)) {
                    return `${getTenGod(dGan, cand)}격`;
                }
            }
            return `${getTenGod(dGan, jj.main)}격`;
        };
        return getGyeok(dayGan, monthJi, yearGan, monthGan, timeGan);
    }, [dayGan, monthJi, yearGan, monthGan, timeGan]);

    // 활성 공망 리스트
    const activeGongmangs = useMemo(() => {
        const list: string[] = [];
        if (gongmangStatus.year) list.push('년지공망');
        if (gongmangStatus.month) list.push('월지공망');
        if (gongmangStatus.day) list.push('일지공망');
        if (gongmangStatus.time) list.push('시지공망');
        return list;
    }, [gongmangStatus]);

    // [4] API 호출하여 AI 분석 로드
    useEffect(() => {
        if (!isOpen) return;
        
        const fetchStageAnalysis = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/coaching/stage-analysis', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userName: reportData?.userName || '익명',
                        stageId,
                        stageTitle,
                        sajuPillars: parsedFourPillars,
                        birthOhaeng: reportData?.saju?.ohaeng || reportData?.saju?.elements,
                        gongmangName: gongmangInfo.name ? `${gongmangInfo.name}공망` : '없음',
                        activeGongmangs,
                        dayMaster: `${dayGan}(${reportData?.saju?.dayMasterTrait || '알 수 없음'})`,
                        dayMasterTrait: reportData?.saju?.dayMasterTrait || '',
                        gyeokguk
                    })
                });

                const data = await res.json();
                if (data.success) {
                    setAnalysisData(data.data);
                } else {
                    throw new Error('API response failed');
                }
            } catch (err) {
                console.error('Failed to load stage analysis:', err);
                // 오류 시 임시 클라이언트 폴백 세팅
                setAnalysisData({
                    stageName: stageTitle,
                    sajuCore: '기질적 조화와 성찰 분석',
                    mainAnalysis: '사용자님의 사주 원국 정보와 현재 단계를 연동하는 데 문제가 발생했습니다. 깊은 호흡을 들이마시며 본연의 우주적 평화를 찾아보세요. 이 성장 단계는 당신이 스스로를 한층 더 자각하도록 기획된 아름다운 지도입니다.',
                    dailyPractice: '가슴에 손을 얹고 내면의 호흡 소리를 가만히 경청해 보기.'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchStageAnalysis();
    }, [isOpen, stageId, stageTitle]);

    const getOhaengColor = (label: string) => {
        switch (label) {
            case '목': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case '화': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case '토': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case '금': return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
            case '수': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
            default: return 'bg-slate-800 text-slate-400 border-slate-700';
        }
    };

    const stageTitles: Record<number, string> = {
        1: '발견 (Discovery)',
        2: '융합 (Fusion)',
        3: '치유 (Healing)',
        4: '행동 (Action)',
        5: '유지 (Maintenance)',
        6: '확장 (Expansion)',
        7: '초월 (Transcendence)'
    };

    const isUserAtThisStage = stageId === userCurrentStage;
    
    const buttonInfo = useMemo(() => {
        if (isUserAtThisStage && stageId < 7) {
            const nextId = stageId + 1;
            return {
                text: `다음 단계인 ${stageTitles[nextId]}로 이동`,
                targetId: nextId
            };
        }
        return {
            text: `${stageTitle} 단계로 이동`,
            targetId: stageId
        };
    }, [stageId, stageTitle, userCurrentStage, isUserAtThisStage]);

    if (!isOpen) return null;


    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex justify-center items-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* Main Glassmorphism Content Container */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    className="relative w-full max-w-[390px] max-h-[85vh] overflow-y-auto bg-slate-950/90 border border-white/10 rounded-[2.5rem] shadow-2xl z-10 flex flex-col no-scrollbar"
                >
                    {/* Header */}
                    <div className="p-6 pb-2 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-md z-20">
                        <div className="flex items-center gap-2">
                            <div className="p-2.5 rounded-2xl bg-primary-olive/10 text-primary-olive">
                                <Compass className="w-5 h-5 animate-spin-slow" />
                            </div>
                            <div>
                                <h3 className="text-xs uppercase text-primary-olive font-bold tracking-widest">Saju & Growth Sync</h3>
                                <h2 className="text-base font-serif font-bold text-white leading-tight">
                                    {stageId}단계: {stageTitle}
                                </h2>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content Body */}
                    <div className="px-6 pb-6 flex-1 flex flex-col gap-5">
                        
                        {/* [UI 1] 미니 사주 원국 카드 */}
                        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-4.5">
                            <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <Activity className="w-3.5 h-3.5 text-primary-olive" />
                                <span>선천 사주 원국 (四柱八字)</span>
                            </h4>

                            {/* 4주 대시보드 */}
                            <div className="grid grid-cols-4 gap-2.5 mb-3">
                                {[
                                    { label: '시주', k: 'time', gan: parsedFourPillars.time.gan, ji: parsedFourPillars.time.ji, isGongmang: gongmangStatus.time },
                                    { label: '일주', k: 'day', gan: parsedFourPillars.day.gan, ji: parsedFourPillars.day.ji, isGongmang: gongmangStatus.day },
                                    { label: '월주', k: 'month', gan: parsedFourPillars.month.gan, ji: parsedFourPillars.month.ji, isGongmang: gongmangStatus.month },
                                    { label: '년주', k: 'year', gan: parsedFourPillars.year.gan, ji: parsedFourPillars.year.ji, isGongmang: gongmangStatus.year }
                                ].map((p) => (
                                    <div key={p.k} className="flex flex-col items-center gap-1.5 relative">
                                        <span className="text-[9px] text-gray-500 font-medium">{p.label}</span>
                                        
                                        {/* 천간 카드 */}
                                        <div className={`w-11 h-11 rounded-xl border flex flex-col items-center justify-center font-bold text-sm ${getOhaengColor(parsedFourPillars[p.k as 'year' | 'month' | 'day' | 'time'].ganLabel || '금')}`}>
                                            <span>{p.gan}</span>
                                        </div>


                                        {/* 지지 카드 */}
                                        <div className={`w-11 h-11 rounded-xl border flex flex-col items-center justify-center font-bold text-sm relative ${getOhaengColor(parsedFourPillars[p.k as 'year' | 'month' | 'day' | 'time'].jiLabel || '수')}`}>
                                            <span>{p.ji}</span>
                                            {p.isGongmang && (
                                                <span className="absolute -bottom-1 -right-1 bg-rose-500 text-white font-bold text-[7px] px-1 rounded-full border border-slate-950 scale-90">
                                                    공망
                                                </span>
                                            )}
                                        </div>


                                        {/* 지장간 표시 */}
                                        <div className="flex flex-col items-center gap-0.5 mt-1">
                                            <span className="text-[8px] text-gray-500 font-semibold">지장간</span>
                                            <div className="flex flex-col gap-0.5 items-center">
                                                {(JIJANGGAN_MAP[p.ji] || []).map((j, idx) => (
                                                    <span key={idx} className="text-[7px] text-gray-400 scale-90 bg-slate-900 border border-white/5 px-0.5 rounded-sm">
                                                        {j.slice(0, 1)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 부가 정보 배지 랙 */}
                            <div className="flex flex-wrap gap-1.5 mt-2 border-t border-white/5 pt-2.5">
                                <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-primary-olive/15 text-primary-olive border border-primary-olive/20">
                                    일간: {dayGan} ({dayMasterTrait})
                                </span>
                                <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20">
                                    격국: {gyeokguk}
                                </span>
                                {gongmangInfo.name && (
                                    <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/20 flex items-center gap-0.5">
                                        공망: {gongmangInfo.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* [UI 2] 분석 내용 영역 */}
                        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 relative overflow-hidden flex-1 flex flex-col justify-center min-h-[180px]">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center gap-3.5 py-6">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full border border-primary-olive/30 border-t-primary-olive animate-spin" />
                                        <Sparkles className="w-4 h-4 text-primary-olive absolute inset-0 m-auto animate-pulse" />
                                    </div>
                                    <div className="flex flex-col items-center gap-1 text-center">
                                        <p className="text-xs text-gray-300 font-medium animate-pulse">
                                            나의 기운과 {stageTitle} 테마 융합 중...
                                        </p>
                                        <p className="text-[9px] text-gray-500 leading-normal">
                                            동양의 만세력 에너지와 정신심리 궤적을 연결하고 있습니다
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col gap-4"
                                >
                                    {/* 요약 태그라인 */}
                                    <div className="flex items-start gap-2.5">
                                        <div className="mt-0.5 p-1 rounded bg-teal-500/10 text-teal-400">
                                            <Award size={14} />
                                        </div>
                                        <div>
                                            <h5 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sync Key Point</h5>
                                            <p className="text-xs font-semibold text-teal-400 leading-relaxed break-keep">
                                                {analysisData?.sajuCore}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 메인 AI 해설 */}
                                    <div className="text-slate-300 text-[11px] leading-relaxed break-keep font-normal border-t border-white/5 pt-3 whitespace-pre-line">
                                        {analysisData?.mainAnalysis}
                                    </div>

                                    {/* 일상 실천 가이드 */}
                                    <div className="bg-primary-olive/5 border border-primary-olive/10 rounded-2xl p-3.5 flex items-start gap-2.5 mt-2">
                                        <div className="mt-0.5 p-1 rounded bg-primary-olive/10 text-primary-olive">
                                            <BookOpen size={12} />
                                        </div>
                                        <div>
                                            <h6 className="text-[9px] text-primary-olive font-bold uppercase tracking-wider">명심 일일 행동 가이드</h6>
                                            <p className="text-[10px] text-gray-300 font-medium leading-normal mt-0.5 break-keep">
                                                {analysisData?.dailyPractice}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2.5 mt-2 sticky bottom-0 bg-slate-950 pb-2 z-10 pt-1.5">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 px-4 rounded-2xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all text-[11px] font-bold"
                            >
                                돌아가기
                            </button>
                            <button
                                onClick={() => onConfirmMove(buttonInfo.targetId)}
                                disabled={isLoading}
                                className="flex-[2] py-3 px-4 rounded-2xl bg-primary-olive hover:bg-primary-olive/90 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(101,140,66,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Compass size={13} className="animate-spin-slow" />
                                <span>{buttonInfo.text}</span>
                            </button>
                        </div>

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
